// Audio engine stubbed — expo-av removed, will be replaced with compatible package
export type PlaybackState = 'idle' | 'loading' | 'playing' | 'stopped';

export const audioEngine = {
  playing: false,
  async playScale(
    _root: string,
    _cents: number[],
    _callback: (state: PlaybackState, degreeIndex?: number) => void
  ) {},
  async stop() {},
};
