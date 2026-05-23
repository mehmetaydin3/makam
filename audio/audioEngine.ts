import Sound from 'react-native-sound';

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'stopped';

Sound.setCategory('Playback');

let currentSound: Sound | null = null;
let isPlaying = false;

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

const AVAILABLE_CENTS = [-900, -810, -765, -749, -700, -696, -650, -610, -606, -565, -550, -549, -514, -496, -492, -480, -470, -450, -406, -402, -400, -350, -334, -314, -310, -292, -280, -270, -265, -249, -202, -200, -198, -196, -150, -134, -110, -108, -106, -65, -50, -49, -47, -16, -14, 2, 4, 6, 8, 20, 30, 41, 50, 86, 92, 94, 96, 98, 100, 102, 150, 151, 153, 155, 166, 184, 186, 188, 201, 206, 208, 210, 220, 230, 245, 296, 298, 300, 301, 302, 337, 359, 366, 371, 381, 388, 392, 410, 449, 451, 453, 484, 500, 502, 506, 517, 592, 596, 600, 651, 653, 684, 688, 706, 710, 743, 796, 800, 802, 804, 835, 857, 888, 910, 947, 951, 1000, 1039, 1061, 1151];

function findClosest(target: number): number {
  return AVAILABLE_CENTS.reduce((prev, curr) =>
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
  );
}

async function loadSound(filename: string): Promise<Sound> {
  return new Promise((resolve, reject) => {
    const sound = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
      if (error) { reject(error); } else { resolve(sound); }
    });
  });
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const audioEngine = {
  get playing() { return isPlaying; },

  async playScale(
    makamId: string,
    cents: number[],
    callback: (state: PlaybackState, degreeIndex?: number) => void
  ) {
    if (isPlaying) return;
    isPlaying = true;
    callback('playing', 0);
    const rootOffset = ROOT_OFFSETS[makamId.toLowerCase()] ?? 0;
    console.log('makamId:', makamId, 'rootOffset:', rootOffset);
    try {
      for (let i = 0; i < cents.length; i++) {
        if (!isPlaying) break;
        const absoluteCents = rootOffset + cents[i];
        const closest = findClosest(absoluteCents);
        console.log('degree', i, 'cents:', cents[i], 'absolute:', absoluteCents, 'file:', closest);
        const filename = `ney_c${closest}.wav`;
        const sound = await loadSound(filename);
        currentSound = sound;
        sound.setVolume(1.0);
        callback('playing', i);
        await new Promise<void>((resolve) => {
          sound.play(() => { sound.release(); resolve(); });
        });
        if (i < cents.length - 1) await delay(80);
      }
    } catch (error) { console.error('Audio error:', error); }
    isPlaying = false;
    currentSound = null;
    callback('stopped');
  },

  async stop() {
    isPlaying = false;
    if (currentSound) { currentSound.stop(); currentSound.release(); currentSound = null; }
  },
};
