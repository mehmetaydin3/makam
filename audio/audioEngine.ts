import { Audio } from 'expo-av';

export type PlaybackState = 'idle' | 'playing' | 'stopped';

const NEY_SAMPLE = require('../assets/audio/ney_single.wav');

function centsToRate(cents: number): number {
  return Math.pow(2, cents / 1200);
}

export class MakamAudioEngine {
  private sound: Audio.Sound | null = null;
  private _playing = false;
  private stopRequested = false;

  async playScale(
    durak: string,
    scaleDegreeCents: number[],
    onStateChange?: (state: PlaybackState, degreeIndex?: number) => void
  ): Promise<void> {
    await this.stop();
    this.stopRequested = false;
    this._playing = true;
    onStateChange?.('playing', 0);

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
      });

      for (let i = 0; i < scaleDegreeCents.length; i++) {
        if (this.stopRequested) break;

        const rate = centsToRate(scaleDegreeCents[i]);
        const { sound } = await Audio.Sound.createAsync(
          NEY_SAMPLE,
          { shouldPlay: true, rate, volume: 1.0 }
        );
        this.sound = sound;
        onStateChange?.('playing', i);

        await new Promise<void>((resolve) => setTimeout(resolve, 600));
        await sound.unloadAsync();
        this.sound = null;
      }
    } catch (e) {
      console.error('Audio playback error:', e);
    }

    this._playing = false;
    onStateChange?.('stopped');
  }

  async stop(): Promise<void> {
    this.stopRequested = true;
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
      } catch (_) {}
      this.sound = null;
    }
    this._playing = false;
  }

  get playing(): boolean {
    return this._playing;
  }
}

export const audioEngine = new MakamAudioEngine();
