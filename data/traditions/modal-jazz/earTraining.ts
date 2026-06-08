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


// ── Musical phrases (replaces the plain ascending scale) ─────────────────────
// Index of each mode's COLOR note within its 8-note `intervals` array (incl. the
// octave), so phrases can land on / hammer the note that defines the mode.
const COLOR_INDEX: Record<string, number> = {
  ionian: 6, dorian: 5, phrygian: 1, lydian: 3, mixolydian: 6, aeolian: 5, locrian: 4,
};

type Phrase = (c: number) => number[];

// Simpler, clearer shapes for beginners.
const PHRASES_EASY: Phrase[] = [
  () => [0, 1, 2, 3, 4, 5, 6, 7],          // ascending run
  () => [0, 2, 4, 6, 7],                   // arpeggio up
  (c) => [0, c, 0, c, 7, c, 0],            // pivot: root <-> color note, resolve
];

// Add trickier, more melodic shapes once past beginner.
const PHRASES_HARD: Phrase[] = [
  ...PHRASES_EASY,
  () => [7, 6, 5, 4, 3, 2, 1, 0],          // descending run
  () => [0, 2, 4, 6, 7, 6, 4, 2, 0],       // arpeggio up & down
  (c) => {                                  // run up to the color note and resolve
    const up: number[] = [];
    for (let i = 0; i <= c; i++) up.push(i);
    const down = [...up].reverse().slice(1);
    return [...up, c, ...down];
  },
  (c) => [0, 2, 1, 3, c, 2, 0],            // weaving thirds landing on the color note
];

// Build the MIDI for a short, randomly-chosen phrase (not just the scale), so
// every question sounds different and the color note is foregrounded.
function phraseMidiFor(mode: Mode, rootSemitone: number, level: EarLevel): number[] {
  const rootMidi = ROOT_MIDI[rootSemitone] ?? 60;
  const c = COLOR_INDEX[mode.id] ?? 4;
  const pool = level === 'beginner' ? PHRASES_EASY : PHRASES_HARD;
  const seq = pool[Math.floor(Math.random() * pool.length)](c);
  return seq.map((i) => rootMidi + mode.intervals[i]);
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
    midiNotes: phraseMidiFor(target, rootSemitone, level),
    options: buildOptions(target, level),
    correctAnswer: target.name,
  };
}

export function buildEarSession(level: EarLevel, count = 8): EarQuestion[] {
  // Never play the same mode twice in a row, so a session feels varied.
  const out: EarQuestion[] = [];
  let last: string | null = null;
  for (let i = 0; i < count; i++) {
    let q = buildEarQuestion(level);
    for (let tries = 0; q.modeId === last && tries < 6; tries++) q = buildEarQuestion(level);
    last = q.modeId;
    out.push(q);
  }
  return out;
}
