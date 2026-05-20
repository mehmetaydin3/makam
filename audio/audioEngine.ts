// Audio stubbed — expo-av not available in Expo Go
// Will be replaced with WebView audio or EAS build

export type PlaybackState = 'idle' | 'playing' | 'stopped';

export class MakamAudioEngine {
  async playScale(
    durak: string,
    scaleDegreeCents: number[],
    onStateChange?: (state: PlaybackState, degreeIndex?: number) => void
  ): Promise<void> {
    console.log('Audio stubbed — native build needed');
    onStateChange?.('stopped');
  }

  async stop(): Promise<void> {}
  get playing(): boolean { return false; }
}

export const audioEngine = new MakamAudioEngine();
