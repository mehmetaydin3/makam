import { MODES, Mode } from './modes';

// ─────────────────────────────────────────────────────────────────────────────
// Ear-training question generation for "Name that mode by ear".
//
// We reuse the existing `intervals` (semitone offsets from the root) on each
// Mode and the same MIDI-root convention used by ScaleDiagram (middle C = 60).
// A question plays one mode's scale at a randomly chosen root; the learner
// picks the mode from a small set of options. Nothing here touches audio —
// the screen feeds `midiNotes` to the RhodesEngine. Per the tradition rule,
// jazz ear training is always Rhodes.
// ─────────────────────────────────────────────────────────────────────────────

export type EarLevel = 'beginner' | 'intermediate' | 'advanced';

export interface EarQuestion {
  id: string;
  modeId: string;
  modeName: string;
  rootSemitone: number;   // 0–11, C..B — for display ("C Dorian")
  rootLabel: string;      // e.g. "C", "Eb"
  midiNotes: number[];    // absolute MIDI notes to hand to RhodesEngine.playScale
  options: string[];      // mode names; one is correct
  correctAnswer: string;  // == modeName
}

// Same root→MIDI mapping ScaleDiagram uses, so a given root sounds identical
// across the app.
const ROOT_MIDI: Record<number, number> = {
  0: 60, 1: 61, 2: 62, 3: 63, 4: 64, 5: 65,
  6: 66, 7: 67, 8: 68, 9: 69, 10: 70, 11: 71,
};
const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const NOTE_NAMES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_KEYS = new Set([1, 3, 5, 8, 10]);

// Comfortable singing/listening roots (avoid the extreme high/low edges).
const CANDIDATE_ROOTS = [0, 2, 3, 5, 7, 9, 10];

function rootLabel(semitone: number): string {
  const names = FLAT_KEYS.has(semitone) ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP;
  return names[semitone];
}

function midiNotesFor(mode: Mode, rootSemitone: number): number[] {
  const rootMidi = ROOT_MIDI[rootSemitone] ?? 60;
  return mode.intervals.map(interval => rootMidi + interval);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Difficulty shapes the option set:
//  - beginner: 3 options, distractors drawn from "easier" modes (clearer color)
//  - intermediate: 4 options
//  - advanced: 4 options, distractors biased toward the same brightness family
//    (e.g. another dark mode) so the ear must work harder.
function optionCountFor(level: EarLevel): number {
  return level === 'beginner' ? 3 : 4;
}

// Modes eligible as the *target* at each level. Beginner sticks to the modes
// learners meet first; advanced opens up the whole set.
function targetPoolFor(level: EarLevel): Mode[] {
  if (level === 'beginner') {
    return MODES.filter(m => m.difficulty === 'beginner');
  }
  if (level === 'intermediate') {
    return MODES.filter(m => m.difficulty !== 'advanced');
  }
  return MODES;
}

function buildOptions(target: Mode, level: EarLevel): string[] {
  const count = optionCountFor(level);
  let distractorPool = MODES.filter(m => m.id !== target.id);

  // Advanced: prefer distractors of the same brightness for a tougher ear test.
  if (level === 'advanced') {
    const sameBrightness = distractorPool.filter(m => m.brightness === target.brightness);
    if (sameBrightness.length >= count - 1) {
      distractorPool = sameBrightness;
    }
  }

  const distractors = shuffle(distractorPool).slice(0, count - 1).map(m => m.name);
  return shuffle([target.name, ...distractors]);
}

let counter = 0;

export function buildEarQuestion(level: EarLevel): EarQuestion {
  const target = pick(targetPoolFor(level));
  const rootSemitone = pick(CANDIDATE_ROOTS);
  counter += 1;
  return {
    id: `ear-${target.id}-${counter}`,
    modeId: target.id,
    modeName: target.name,
    rootSemitone,
    rootLabel: rootLabel(rootSemitone),
    midiNotes: midiNotesFor(target, rootSemitone),
    options: buildOptions(target, level),
    correctAnswer: target.name,
  };
}

export function buildEarSession(level: EarLevel, count = 8): EarQuestion[] {
  return Array.from({ length: count }, () => buildEarQuestion(level));
}
