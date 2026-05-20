import { Audio } from 'expo-av';

const A4_FREQ = 440;
const A4_MIDI = 69;

function centsToHz(baseHz: number, cents: number): number {
  return baseHz * Math.pow(2, cents / 1200);
}

function noteNameToHz(noteName: string): number {
  const noteMap: Record<string, number> = {
    'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'Eb': -6,
    'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'G#': -1,
    'Ab': -1, 'A': 0, 'A#': 1, 'Bb': 1, 'B': 2,
  };
  const match = noteName.match(/^([A-G][b#]?)(\d)?$/);
  if (!match) return A4_FREQ;
  const note = match[1];
  const octave = match[2] ? parseInt(match[2]) : 4;
  const semitones = noteMap[note] ?? 0;
  const midiNote = (octave + 1) * 12 + semitones;
  return A4_FREQ * Math.pow(2, (midiNote - A4_MIDI) / 12);
}

const DURAK_TO_HZ: Record<string, number> = {
  'Sol (G)': noteNameToHz('G4'),
  'La (A)': noteNameToHz('A4'),
  'Re (D)': noteNameToHz('D4'),
  'Do (C)': noteNameToHz('C4'),
  'Mi Koma♭ (E♭+)': noteNameToHz('Eb4'),
};

// Oud-like plucked string synthesis using additive harmonics + Karplus-Strong inspired envelope
function generateOudTone(frequency: number, durationMs: number, sampleRate = 22050): ArrayBuffer {
  const numSamples = Math.floor(sampleRate * (durationMs / 1000));
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  // WAV header
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Harmonic series — oud has strong odd and even harmonics
  // [harmonic multiplier, relative amplitude, decay rate]
  const harmonics = [
    [1.0,  0.55, 1.0],   // fundamental — strong
    [2.0,  0.25, 1.4],   // 2nd harmonic — decays faster
    [3.0,  0.12, 1.8],   // 3rd harmonic
    [4.0,  0.05, 2.2],   // 4th harmonic
    [5.0,  0.02, 2.8],   // 5th harmonic — very soft
    [6.0,  0.01, 3.5],   // subtle shimmer
  ];

  // Pluck envelope: very fast attack, long exponential decay (oud character)
  const attackSamples = Math.floor(sampleRate * 0.003); // 3ms attack
  const decayRate = 3.5 / numSamples; // controls overall brightness falloff

  for (let i = 0; i < numSamples; i++) {
    let sample = 0;

    // Attack envelope
    const attackEnv = i < attackSamples ? i / attackSamples : 1.0;

    // Overall exponential decay — the oud rings and fades
    const overallDecay = Math.exp(-decayRate * i * 4);

    for (const [mult, amp, decay] of harmonics) {
      // Each harmonic decays at its own rate — higher harmonics fade faster
      const harmonicDecay = Math.exp(-decayRate * i * decay * 3);
      sample += Math.sin(2 * Math.PI * frequency * mult * i / sampleRate) * amp * harmonicDecay;
    }

    // Add subtle tremolo — oud players naturally have slight bow/finger vibration
    const tremolo = 1 + 0.015 * Math.sin(2 * Math.PI * 5.5 * i / sampleRate);

    sample *= attackEnv * overallDecay * tremolo * 0.85;

    const int16 = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    view.setInt16(44 + i * 2, int16, true);
  }

  return buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export type PlaybackState = 'idle' | 'playing' | 'stopped';

export class MakamAudioEngine {
  private sounds: Audio.Sound[] = [];
  private isPlaying = false;

  async playScale(
    durak: string,
    scaleDegreeCents: number[],
    onStateChange?: (state: PlaybackState, degreeIndex?: number) => void
  ): Promise<void> {
    if (this.isPlaying) { await this.stop(); return; }
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
      });
      this.isPlaying = true;
      onStateChange?.('playing', 0);
      const baseHz = DURAK_TO_HZ[durak] ?? A4_FREQ;
      const noteDuration = 700;
      const pauseDuration = 30;
      for (let i = 0; i < scaleDegreeCents.length; i++) {
        if (!this.isPlaying) break;
        const hz = centsToHz(baseHz, scaleDegreeCents[i]);
        onStateChange?.('playing', i);
        const wavBuffer = generateOudTone(hz, noteDuration);
        const base64 = arrayBufferToBase64(wavBuffer);
        const uri = `data:audio/wav;base64,${base64}`;
        const { sound } = await Audio.Sound.createAsync({ uri });
        this.sounds.push(sound);
        await sound.playAsync();
        await new Promise(resolve => setTimeout(resolve, noteDuration + pauseDuration));
        await sound.unloadAsync();
      }
      this.isPlaying = false;
      onStateChange?.('stopped');
    } catch (error) {
      console.error('Audio error:', error);
      this.isPlaying = false;
      onStateChange?.('stopped');
    }
  }

  async stop(): Promise<void> {
    this.isPlaying = false;
    for (const sound of this.sounds) {
      try { await sound.stopAsync(); await sound.unloadAsync(); } catch {}
    }
    this.sounds = [];
  }

  get playing(): boolean { return this.isPlaying; }
}

export const audioEngine = new MakamAudioEngine();
