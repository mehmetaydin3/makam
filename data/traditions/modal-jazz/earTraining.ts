import { MODES, Mode } from './modes';

// ─────────────────────────────────────────────────────────────────────────────
// Ear-training generation for "Hear the color of a mode" — V2.
//
// The redesign makes ear training EASY, SCAFFOLDED, and CHARACTERFUL:
//
//  • Tonal anchor. Every item first sounds "home" (root → 5th → root) so the
//    learner hears the mode's color AGAINST a center, never abstractly. The
//    Rhodes engine can't hold a sustained drone, so we anchor by clearly
//    sounding the tonic reference before the phrase (and the screen lands the
//    phrase back on the tonic too). `anchorNotes` and `phraseNotes` are kept
//    separate so the screen can play them with a breath of silence between.
//
//  • Scaffolded levels, from a 2-way feel-judgement up to full mode ID:
//      beginner      → "Brighter or Darker?"  (binary, derived from brightness)
//      intermediate  → 3 options inside one brightness family
//      advanced      → full mode ID (the old task), anchor still played
//
//  • A/B compare. Each question carries the candidate phrases so the screen can
//    play them back-to-back for comparison before the learner commits.
//
// Per the tradition rule, jazz ear training is always Rhodes. Nothing here
// touches audio directly — the screen feeds these MIDI arrays to RhodesEngine.
// ─────────────────────────────────────────────────────────────────────────────

export type EarLevel = 'beginner' | 'intermediate' | 'advanced';

// What the learner is being asked to do. `brightness` is the easy on-ramp; the
// other two are mode-name choices.
export type EarMode = 'brightness' | 'family' | 'fullId';

export interface EarOption {
  label: string;           // what the button shows ("Brighter", "Lydian", …)
  value: string;           // canonical answer value (matches correctAnswer)
  phraseNotes: number[];   // this candidate's phrase, for A/B compare
  isCorrect: boolean;
}

export interface EarQuestion {
  id: string;
  mode: EarMode;
  modeId: string;          // the target mode (for mastery tagging + reveal)
  modeName: string;
  oneWord: string;         // mode's one-word character, for the reveal
  colorNote: string;       // plain-language color note, for the reveal
  brightness: Mode['brightness'];
  rootSemitone: number;    // 0–11, C..B
  rootLabel: string;       // "C", "Eb"
  anchorNotes: number[];   // root → 5th → root, the "home" reference
  phraseNotes: number[];   // the target mode's phrase (lands on the tonic)
  prompt: string;          // the question text for this item
  options: EarOption[];    // 2–4 buttons; one is correct
  correctAnswer: string;   // == the correct option's value
}

// Same root→MIDI mapping ScaleDiagram uses, so a root sounds identical app-wide.
const ROOT_MIDI: Record<number, number> = {
  0: 60, 1: 61, 2: 62, 3: 63, 4: 64, 5: 65,
  6: 66, 7: 67, 8: 68, 9: 69, 10: 70, 11: 71,
};
const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const NOTE_NAMES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_KEYS = new Set([1, 3, 5, 8, 10]);

// Comfortable listening roots (avoid the extreme high/low edges).
const CANDIDATE_ROOTS = [0, 2, 3, 5, 7, 9, 10];

function rootLabel(semitone: number): string {
  const names = FLAT_KEYS.has(semitone) ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP;
  return names[semitone];
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

// ── The tonal anchor ─────────────────────────────────────────────────────────
// Root → perfect 5th → root, an octave below the phrase's register. This is the
// "home" the learner measures the mode's color against. The screen plays it
// first, then (after a short silence) the mode phrase.
function anchorFor(rootSemitone: number): number[] {
  const rootMidi = (ROOT_MIDI[rootSemitone] ?? 60) - 12;
  return [rootMidi, rootMidi + 7, rootMidi];
}

// ── Musical phrases ──────────────────────────────────────────────────────────
// Index of each mode's COLOR note within its 8-note `intervals` array (incl. the
// octave), so phrases can foreground the note that defines the mode.
const COLOR_INDEX: Record<string, number> = {
  ionian: 6, dorian: 5, phrygian: 1, lydian: 3, mixolydian: 6, aeolian: 5, locrian: 4,
};

type Phrase = (c: number) => number[];

// Clean, anchored shapes that sound the color note and RESOLVE HOME (end on 0),
// so every phrase confirms the tonal center the anchor established.
const PHRASES_CLEAN: Phrase[] = [
  () => [0, 2, 4, 6, 7, 0],            // arpeggio up, drop home
  (c) => [0, c, 0, 4, c, 0],           // pivot on the color note, resolve
  (c) => [0, 2, c, 4, 2, 0],           // weave through the color note, resolve
];

// A few livelier shapes once the learner is past the beginner stage.
const PHRASES_RICH: Phrase[] = [
  ...PHRASES_CLEAN,
  () => [0, 2, 4, 6, 7, 6, 4, 0],      // arpeggio up & back home
  (c) => {                              // run up to the color note and resolve
    const up: number[] = [];
    for (let i = 0; i <= c; i++) up.push(i);
    const down = [...up].reverse().slice(1);
    return [...up, ...down];
  },
  (c) => [0, 4, 2, c, 2, 0],           // leap, land on color, resolve
];

function phraseNotesFor(mode: Mode, rootSemitone: number, clean: boolean): number[] {
  const rootMidi = ROOT_MIDI[rootSemitone] ?? 60;
  const c = COLOR_INDEX[mode.id] ?? 4;
  const pool = clean ? PHRASES_CLEAN : PHRASES_RICH;
  const seq = pool[Math.floor(Math.random() * pool.length)](c);
  return seq.map((i) => rootMidi + mode.intervals[i]);
}

// ── Mode pools ───────────────────────────────────────────────────────────────
// The clearest, most strongly-colored modes lead the beginner experience.
const BEGINNER_BRIGHT = ['ionian', 'lydian'];          // unmistakably bright
const BEGINNER_DARK = ['aeolian', 'phrygian'];         // unmistakably dark

function modeById(id: string): Mode {
  return MODES.find((m) => m.id === id)!;
}

let counter = 0;
function nextId(modeId: string): string {
  counter += 1;
  return `ear-${modeId}-${counter}`;
}

function baseFields(target: Mode, rootSemitone: number, clean: boolean) {
  return {
    modeId: target.id,
    modeName: target.name,
    oneWord: target.oneWord,
    colorNote: target.colorNote,
    brightness: target.brightness,
    rootSemitone,
    rootLabel: rootLabel(rootSemitone),
    anchorNotes: anchorFor(rootSemitone),
    phraseNotes: phraseNotesFor(target, rootSemitone, clean),
  };
}

// ── Beginner: "Brighter or Darker?" ──────────────────────────────────────────
// One strongly-colored mode against the anchor; pick Brighter / Darker. The
// answer is read straight off `brightness`, so it's a pure feel judgement — the
// easy on-ramp. Both option phrases are provided so the learner can A/B a clear
// bright vs dark reference before answering.
function buildBrightnessQuestion(): EarQuestion {
  const rootSemitone = pick(CANDIDATE_ROOTS);
  const targetIsBright = Math.random() < 0.5;
  const target = modeById(pick(targetIsBright ? BEGINNER_BRIGHT : BEGINNER_DARK));
  const contrast = modeById(pick(targetIsBright ? BEGINNER_DARK : BEGINNER_BRIGHT));
  const base = baseFields(target, rootSemitone, true);

  const brightPhrase = targetIsBright
    ? base.phraseNotes
    : phraseNotesFor(contrast, rootSemitone, true);
  const darkPhrase = targetIsBright
    ? phraseNotesFor(contrast, rootSemitone, true)
    : base.phraseNotes;

  const options: EarOption[] = [
    { label: 'Brighter', value: 'Brighter', phraseNotes: brightPhrase, isCorrect: targetIsBright },
    { label: 'Darker', value: 'Darker', phraseNotes: darkPhrase, isCorrect: !targetIsBright },
  ];

  return {
    id: nextId(target.id),
    mode: 'brightness',
    ...base,
    prompt: 'Does this sound brighter or darker?',
    options,
    correctAnswer: targetIsBright ? 'Brighter' : 'Darker',
  };
}

// ── Intermediate: 3 options inside one brightness family ─────────────────────
function buildFamilyQuestion(): EarQuestion {
  const families: Mode['brightness'][] = ['bright', 'neutral', 'dark'];
  // Pick a family with at least 3 modes so we always have 3 distinct options.
  const family = pick(families.filter((b) => MODES.filter((m) => m.brightness === b).length >= 3))
    ?? 'dark';
  const familyModes = shuffle(MODES.filter((m) => m.brightness === family));
  const chosen = familyModes.slice(0, 3);
  const target = chosen[0];
  const rootSemitone = pick(CANDIDATE_ROOTS);
  const base = baseFields(target, rootSemitone, false);

  const options: EarOption[] = shuffle(
    chosen.map((m) => ({
      label: m.name,
      value: m.name,
      phraseNotes: m.id === target.id ? base.phraseNotes : phraseNotesFor(m, rootSemitone, false),
      isCorrect: m.id === target.id,
    })),
  );

  return {
    id: nextId(target.id),
    mode: 'family',
    ...base,
    prompt: 'Three modes share this color. Which did you hear?',
    options,
    correctAnswer: target.name,
  };
}

// ── Advanced: full mode ID (4 options), anchor still played ──────────────────
function buildFullIdQuestion(): EarQuestion {
  const target = pick(MODES);
  const rootSemitone = pick(CANDIDATE_ROOTS);
  const base = baseFields(target, rootSemitone, false);

  // Bias distractors toward the same brightness for a real ear test.
  const sameBrightness = MODES.filter((m) => m.id !== target.id && m.brightness === target.brightness);
  const others = MODES.filter((m) => m.id !== target.id && m.brightness !== target.brightness);
  const distractors = shuffle([...shuffle(sameBrightness), ...shuffle(others)]).slice(0, 3);

  const options: EarOption[] = shuffle(
    [target, ...distractors].map((m) => ({
      label: m.name,
      value: m.name,
      phraseNotes: m.id === target.id ? base.phraseNotes : phraseNotesFor(m, rootSemitone, false),
      isCorrect: m.id === target.id,
    })),
  );

  return {
    id: nextId(target.id),
    mode: 'fullId',
    ...base,
    prompt: 'Name the mode you heard.',
    options,
    correctAnswer: target.name,
  };
}

export function buildEarQuestion(level: EarLevel): EarQuestion {
  if (level === 'beginner') return buildBrightnessQuestion();
  if (level === 'intermediate') return buildFamilyQuestion();
  return buildFullIdQuestion();
}

export function buildEarSession(level: EarLevel, count = 8): EarQuestion[] {
  // Avoid repeating the same target mode back-to-back so a session feels varied.
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
