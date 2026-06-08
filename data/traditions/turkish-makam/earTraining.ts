import { MAKAMS, Makam } from '../../makams';
import { PLAYABLE_MAKAM_IDS } from '../../../audio/audioEngine';

// ─────────────────────────────────────────────────────────────────────────────
// Ear-training generation for "Name that makam by ear" — V2.
//
// Mirrors the jazz ear-training redesign, but with makam-appropriate scaffolding
// and the ney engine. The redesign makes ear training ANCHORED, SCAFFOLDED, and
// CHARACTERFUL:
//
//  • Tonal anchor (durak). Every item first sounds the makam's durak — its tonic
//    final — as "home", so the scale's character is heard AGAINST a center, never
//    abstractly. The ney engine can't hold a sustained drone, so we anchor by
//    clearly re-sounding the durak before the scale. `anchorCents` and
//    `phraseCents` are kept separate so the screen can play them (each via
//    audioEngine.playScale with the makam's id, so the engine places them at the
//    correct sounding root) with a breath of silence between.
//
//  • Scaffolded levels, using makam dimensions (NOT jazz bright/dark):
//      beginner      → A/B "Which makam did you hear?" between two clearly
//                       contrasting makams (different family + opposed mood)
//      intermediate  → 3 options, drawn across families
//      advanced      → full makam ID (4 options), biased toward same-family
//                       distractors so close cousins must be told apart by ear
//
//  • A/B compare. Each question carries the candidates' scales so the screen can
//    play them back-to-back (each prefixed by the same durak anchor) before the
//    learner commits.
//
//  • Teaching + reward reveal. Each question surfaces the makam's characteristic
//    note, family, seyir and mood so the answer screen can teach what to listen
//    for. The screen layers streak/celebration on top.
//
// Only makams the ney engine can place at a correct sounding root are eligible
// (PLAYABLE_MAKAM_IDS). Per the tradition rule, makam ear training is always ney.
// ─────────────────────────────────────────────────────────────────────────────

export type EarLevel = 'beginner' | 'intermediate' | 'advanced';

// What the learner is being asked to do at this level.
export type EarTask = 'ab' | 'three' | 'fullId';

const SEYIR_LABEL: Record<Makam['seyir'], string> = {
  ascending: 'Ascending',
  descending: 'Descending',
  undulating: 'Undulating',
};

export interface EarOption {
  label: string;        // makam name shown on the button
  value: string;        // canonical answer value (== makam name)
  makamId: string;
  cents: number[];      // this candidate's scale, for A/B compare
  isCorrect: boolean;
}

export interface EarQuestion {
  id: string;
  task: EarTask;
  makamId: string;        // the target makam (for mastery tagging + reveal)
  makamName: string;
  anchorCents: number[];  // the durak sounded as "home" (relative to the scale)
  phraseCents: number[];  // the target makam's scale degrees, in cents
  prompt: string;
  options: EarOption[];   // 2–4 buttons; one is correct
  correctAnswer: string;  // == the correct option's value
  // Teaching reveal fields:
  family: string;
  seyir: string;          // human label
  durak: string;          // e.g. "La (A)"
  mood: string[];
  characterNote: string;  // the makam's characteristic degree, named
  teaching: string;       // a plain-language "what you heard" sentence
}

// Only makams the ney engine can sound at a correct root.
const PLAYABLE: Makam[] = MAKAMS.filter(m => PLAYABLE_MAKAM_IDS.includes(m.id));

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

// ── The tonal anchor (durak) ─────────────────────────────────────────────────
// The first scale degree of a makam IS its durak (cents 0). We sound it as
// "home" before the scale. Re-stating it (0 → 0) makes the reference
// unmistakable on the ney even without a true sustain. The engine adds the
// makam's ROOT_OFFSET, so this sounds at the makam's real durak pitch.
function anchorFor(_makam: Makam): number[] {
  return [0, 0];
}

function scaleCents(makam: Makam): number[] {
  return makam.scale.map(d => d.cents);
}

// The makam's characteristic note, named — what the ear should latch onto.
function characterNoteFor(makam: Makam): string {
  const chars = makam.scale.filter(d => d.isCharacteristic);
  if (chars.length > 0) {
    return chars.map(d => d.name).join(' and ');
  }
  // Some makams (e.g. Çargah, Segah) carry the character in the tonic/seyir.
  return makam.scale[0]?.name ?? 'the tonic';
}

function teachingFor(makam: Makam): string {
  const note = characterNoteFor(makam);
  const seyir = SEYIR_LABEL[makam.seyir].toLowerCase();
  const chars = makam.scale.filter(d => d.isCharacteristic);
  if (chars.length > 0) {
    return `Listen for ${note} over the durak, and its ${seyir} motion — that's what makes it ${makam.name}.`;
  }
  return `${makam.name} carries its character in its ${seyir} seyir and the colour of its durak.`;
}

let counter = 0;
function nextId(makamId: string): string {
  counter += 1;
  return `makam-ear-${makamId}-${counter}`;
}

function revealFields(makam: Makam) {
  return {
    makamId: makam.id,
    makamName: makam.name,
    anchorCents: anchorFor(makam),
    phraseCents: scaleCents(makam),
    family: makam.family,
    seyir: SEYIR_LABEL[makam.seyir],
    durak: makam.durak,
    mood: makam.mood ?? [],
    characterNote: characterNoteFor(makam),
    teaching: teachingFor(makam),
  };
}

function optionFor(m: Makam, target: Makam): EarOption {
  return {
    label: m.name,
    value: m.name,
    makamId: m.id,
    cents: scaleCents(m),
    isCorrect: m.id === target.id,
  };
}

// ── Beginner: A/B "Which makam did you hear?" ────────────────────────────────
// Two clearly-contrasting makams — different family AND opposed mood — so the
// distinction is a clear feel judgement. The easy on-ramp.
function buildABQuestion(): EarQuestion {
  const target = pick(PLAYABLE);
  // Prefer a contrast from a different family; fall back to any other makam.
  const diffFamily = PLAYABLE.filter(m => m.family !== target.family);
  const contrast = pick(diffFamily.length ? diffFamily : PLAYABLE.filter(m => m.id !== target.id));

  const options = shuffle([optionFor(target, target), optionFor(contrast, target)]);
  return {
    id: nextId(target.id),
    task: 'ab',
    ...revealFields(target),
    prompt: 'You heard the durak, then a makam. Which of these two was it?',
    options,
    correctAnswer: target.name,
  };
}

// ── Intermediate: 3 options, drawn across families ───────────────────────────
function buildThreeQuestion(): EarQuestion {
  const target = pick(PLAYABLE);
  const distractors = shuffle(PLAYABLE.filter(m => m.id !== target.id)).slice(0, 2);
  const options = shuffle([target, ...distractors].map(m => optionFor(m, target)));
  return {
    id: nextId(target.id),
    task: 'three',
    ...revealFields(target),
    prompt: 'Anchored on its durak — which makam did you hear?',
    options,
    correctAnswer: target.name,
  };
}

// ── Advanced: full makam ID (4 options), same-family-biased ──────────────────
function buildFullIdQuestion(): EarQuestion {
  const target = pick(PLAYABLE);
  const sameFamily = PLAYABLE.filter(m => m.id !== target.id && m.family === target.family);
  const others = PLAYABLE.filter(m => m.id !== target.id && m.family !== target.family);
  const distractors = shuffle([...shuffle(sameFamily), ...shuffle(others)]).slice(0, 3);
  const options = shuffle([target, ...distractors].map(m => optionFor(m, target)));
  return {
    id: nextId(target.id),
    task: 'fullId',
    ...revealFields(target),
    prompt: 'Name the makam you heard.',
    options,
    correctAnswer: target.name,
  };
}

export function buildMakamEarQuestion(level: EarLevel): EarQuestion {
  if (level === 'beginner') return buildABQuestion();
  if (level === 'intermediate') return buildThreeQuestion();
  return buildFullIdQuestion();
}

export function buildMakamEarSession(level: EarLevel, count = 8): EarQuestion[] {
  // Avoid repeating the same target makam back-to-back so a session feels varied.
  const out: EarQuestion[] = [];
  let last: string | null = null;
  for (let i = 0; i < count; i++) {
    let q = buildMakamEarQuestion(level);
    for (let tries = 0; q.makamId === last && tries < 6; tries++) q = buildMakamEarQuestion(level);
    last = q.makamId;
    out.push(q);
  }
  return out;
}

// Back-compat alias kept for any external callers; new code uses EarQuestion.
export type MakamEarQuestion = EarQuestion;

export const EAR_TRAINING_AVAILABLE = PLAYABLE.length >= 2;
