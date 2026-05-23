import Sound from 'react-native-sound';

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'stopped';

Sound.setCategory('Playback');

let currentSound: Sound | null = null;
let isPlaying = false;

function centsToRate(cents: number): number {
  return Math.pow(2, cents / 1200);
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
    _root: string,
    cents: number[],
    callback: (state: PlaybackState, degreeIndex?: number) => void
  ) {
    if (isPlaying) return;
    isPlaying = true;
    callback('playing', 0);
    try {
      for (let i = 0; i < cents.length; i++) {
        if (!isPlaying) break;
        const sound = await loadSound('ney_single.wav');
        currentSound = sound;
        sound.setSpeed(Math.pow(2, cents[i] / 1200));
        sound.setVolume(1.0);
        callback('playing', i);
        await new Promise<void>((resolve) => {
          sound.play(() => { sound.release(); resolve(); });
        });
        if (i < cents.length - 1) await delay(100);
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
