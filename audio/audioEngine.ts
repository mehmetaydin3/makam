import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { AUDIO_SAMPLES } from './neySamples';

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'stopped';

// Configure the audio session once: play in silent mode, don't stay active in bg.
setAudioModeAsync({
  playsInSilentMode: true,
  shouldPlayInBackground: false,
}).catch(() => {});

let currentPlayer: AudioPlayer | null = null;
let isPlaying = false;
let generation = 0;  // bumped on every stop/new-play so stale loops self-cancel

// Independent drone channel: a real drone must SUSTAIN — including underneath
// phrase playback — so it gets its own player + generation, untouched by stop().
let dronePlayer: AudioPlayer | null = null;
let droneGen = 0;

const ROOT_OFFSETS: Record<string, number> = {
  rast:     -900,
  ussak:    -700,
  hicaz:    -200,
  huseyni:  -700,
  saba:     -200,
  segah:    -49,
  nihavend: -200,
  neva:     -700,
  buselik:  -700,
  cargah:   -400,
  kurd:     -200,
};

// Makams the ney engine can place at a correct sounding root. Ear training
// draws only from these so a played scale is always anchored properly.
export const PLAYABLE_MAKAM_IDS = Object.keys(ROOT_OFFSETS);

const AVAILABLE_CENTS = [-900, -810, -765, -749, -700, -696, -650, -610, -606, -565, -550, -549, -514, -496, -492, -480, -470, -450, -406, -402, -400, -350, -334, -314, -310, -292, -280, -270, -265, -249, -202, -200, -198, -196, -150, -134, -110, -108, -106, -65, -50, -49, -47, -16, -14, 2, 4, 6, 8, 20, 30, 41, 50, 86, 92, 94, 96, 98, 100, 102, 150, 151, 153, 155, 166, 184, 186, 188, 201, 206, 208, 210, 220, 230, 245, 296, 298, 300, 301, 302, 337, 359, 366, 371, 381, 388, 392, 410, 449, 451, 453, 484, 500, 502, 506, 517, 592, 596, 600, 651, 653, 684, 688, 706, 710, 743, 796, 800, 802, 804, 835, 857, 888, 910, 947, 951, 1000, 1039, 1061, 1151];

// Each ney sample is roughly this long; used as a timeout fallback in case
// the didJustFinish event doesn't arrive (a known expo-audio edge case when
// many players are created in sequence).
const NOTE_MAX_MS = 2200;
const NOTE_DURATION_MS = 750;  // each scale degree sounds this long, then is cut

function findClosest(target: number): number {
  return AVAILABLE_CENTS.reduce((prev, curr) =>
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
  );
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Play a single bundled sample to completion, then release the player.
function playOne(filename: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const moduleId = AUDIO_SAMPLES[filename];
    if (moduleId == null) {
      console.warn('Audio sample not found:', filename);
      resolve();
      return;
    }
    let finished = false;
    let sub: { remove: () => void } | null = null;
    const player = createAudioPlayer(moduleId);
    currentPlayer = player;

    const done = () => {
      if (finished) return;
      finished = true;
      try { sub?.remove(); } catch {}
      try { player.remove(); } catch {}
      if (currentPlayer === player) currentPlayer = null;
      resolve();
    };

    sub = player.addListener('playbackStatusUpdate', (status: any) => {
      if (status?.didJustFinish) done();
    });

    try { player.play(); } catch { done(); return; }

    // Fallback so a missed didJustFinish never hangs the scale.
    setTimeout(done, NOTE_MAX_MS);
  });
}

export const audioEngine = {
  get playing() { return isPlaying; },

  async playScale(
    makamId: string,
    cents: number[],
    callback: (state: PlaybackState, degreeIndex?: number) => void
  ) {
    await this.stop();
    const myGen = ++generation;
    isPlaying = true;
    const rootOffset = ROOT_OFFSETS[makamId.toLowerCase()] ?? 0;
    callback('playing', 0);
    try {
      for (let i = 0; i < cents.length; i++) {
        if (myGen !== generation) return; // superseded
        const absoluteCents = rootOffset + cents[i];
        const closest = findClosest(absoluteCents);
        const filename = `ney_c${closest}.wav`;
        const moduleId = AUDIO_SAMPLES[filename];
        callback('playing', i);

        if (moduleId != null) {
          // Stop any lingering note first, then play this one.
          if (currentPlayer) {
            try { currentPlayer.pause(); } catch {}
            try { currentPlayer.remove(); } catch {}
            currentPlayer = null;
          }
          const player = createAudioPlayer(moduleId);
          currentPlayer = player;
          try { player.play(); } catch {}
          // Hold this note for a fixed duration, then it gets cut by the next
          // iteration (or by the final cleanup). This guarantees no overlap.
          await delay(NOTE_DURATION_MS);
          if (myGen !== generation) { try { player.pause(); player.remove(); } catch {} return; }
        }
      }
    } catch (error) {
      console.error('Audio error:', error);
    }
    // Final note: let it ring briefly, then stop cleanly.
    if (myGen === generation) {
      await delay(150);
      if (currentPlayer) {
        try { currentPlayer.pause(); } catch {}
        try { currentPlayer.remove(); } catch {}
        currentPlayer = null;
      }
      isPlaying = false;
      callback('stopped');
    }
  },

  // Play a single usul (rhythm) sample, e.g. 'usul_duyek.wav'. Unlike the ney
  // notes, a usul is a long file — so it plays to natural completion (no short
  // timeout) and is fully interruptible by stop(). onDone fires on finish or stop.
  async playUsul(filename: string, onDone?: () => void) {
    await this.stop();
    const myGen = ++generation;
    const moduleId = AUDIO_SAMPLES[filename];
    if (moduleId == null) {
      console.warn('Usul sample not found:', filename);
      onDone?.();
      return;
    }
    isPlaying = true;
    let finished = false;
    let sub: { remove: () => void } | null = null;
    const player = createAudioPlayer(moduleId);
    currentPlayer = player;

    const finish = () => {
      if (finished) return;
      finished = true;
      try { sub?.remove(); } catch {}
      try { player.pause(); } catch {}
      try { player.remove(); } catch {}
      if (currentPlayer === player) currentPlayer = null;
      if (myGen === generation) isPlaying = false;
      onDone?.();
    };

    sub = player.addListener('playbackStatusUpdate', (status: any) => {
      // finish on natural end, or if a newer playback/stop superseded us
      if (status?.didJustFinish || myGen !== generation) finish();
    });

    try { player.play(); } catch { finish(); }
  },

  // Hold a makam's durak as a sustained drone the user can sing/play over.
  // The ney samples are short, so we loop the single durak note (cents 0, placed
  // at the makam's real root via ROOT_OFFSETS) until stop() is called. A small
  // overlap between successive notes hides the seam so it reads as a held tone.
  // `callback('playing')` fires on start; `callback('stopped')` when it ends.
  async playDrone(
    makamId: string,
    callback: (state: PlaybackState) => void,
  ) {
    await this.stop();
    const myGen = ++generation;
    isPlaying = true;
    const rootOffset = ROOT_OFFSETS[makamId.toLowerCase()] ?? 0;
    const closest = findClosest(rootOffset); // the durak is cents 0 + offset
    const filename = `ney_c${closest}.wav`;
    const moduleId = AUDIO_SAMPLES[filename];
    if (moduleId == null) {
      console.warn('Drone sample not found:', filename);
      isPlaying = false;
      callback('stopped');
      return;
    }
    callback('playing');
    // Re-trigger the durak note slightly before the previous one would end, so
    // the drone sounds continuous. The loop self-cancels when generation moves.
    // True overlap: the next durak note starts while the previous still rings,
    // and each player is cleaned up only after its natural decay. (Previously
    // the old player was killed before the new one started — an audible gap.)
    const RETRIGGER_MS = 1500;
    const CLEANUP_MS = 3600;
    while (myGen === generation) {
      const player = createAudioPlayer(moduleId);
      currentPlayer = player;
      try { player.play(); } catch {}
      setTimeout(() => {
        try { player.pause(); } catch {}
        try { player.remove(); } catch {}
      }, CLEANUP_MS);
      await delay(RETRIGGER_MS);
    }
    // Superseded by stop()/another playback; leave cleanup to whoever bumped gen.
  },

  // ── Drone channel (sustains independently of phrase playback) ──────────────
  // Starts a continuous durak drone on its own channel. Unlike playDrone above,
  // this is NOT killed by stop()/playScale — it keeps sounding under phrases
  // (at reduced volume) until stopDrone() is called. Returns false if the root
  // sample is unavailable.
  async startDrone(makamId: string): Promise<boolean> {
    await this.stopDrone();
    const myGen = ++droneGen;
    const rootOffset = ROOT_OFFSETS[makamId.toLowerCase()] ?? 0;
    const closest = findClosest(rootOffset);
    const moduleId = AUDIO_SAMPLES[`ney_c${closest}.wav`];
    if (moduleId == null) {
      console.warn('Drone sample not found for', makamId);
      return false;
    }
    // True overlap: start the next note while the previous is still sounding,
    // and let the old one decay naturally before cleanup. Killing the previous
    // player first (the old approach) guaranteed an audible gap.
    const RETRIGGER_MS = 1500;   // start next note well inside the current one
    const CLEANUP_MS = 3600;     // remove a player only after it has decayed
    (async () => {
      while (myGen === droneGen) {
        const player = createAudioPlayer(moduleId);
        dronePlayer = player;
        try { player.volume = 0.5; } catch {} // sit under the phrase, not on it
        try { player.play(); } catch {}
        setTimeout(() => {
          try { player.pause(); } catch {}
          try { player.remove(); } catch {}
        }, CLEANUP_MS);
        await delay(RETRIGGER_MS);
      }
    })();
    return true;
  },

  async stopDrone() {
    droneGen++;
    if (dronePlayer) {
      try { dronePlayer.pause(); } catch {}
      try { dronePlayer.remove(); } catch {}
      dronePlayer = null;
    }
  },

  async stop() {
    generation++;        // invalidate any in-flight playScale loop / usul
    isPlaying = false;
    if (currentPlayer) {
      try { currentPlayer.pause(); } catch {}
      try { currentPlayer.seekTo(0); } catch {}
      try { currentPlayer.remove(); } catch {}
      currentPlayer = null;
    }
  },
};
