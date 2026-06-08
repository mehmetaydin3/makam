import { MAKAMS, Makam } from '../../makams';
import { PLAYABLE_MAKAM_IDS } from '../../../audio/audioEngine';

// ─────────────────────────────────────────────────────────────────────────────
// Ear-training question generation for "Name that makam by ear".
//
// Mirrors the jazz ear-training generator, but for makam the audio is the ney
// engine (audio/audioEngine.ts). That engine knows how to anchor a makam at its
// proper sounding root via ROOT_OFFSETS, so we only draw from makams it can
// place (PLAYABLE_MAKAM_IDS). The screen hands `makamId` + `cents` straight to
// audioEngine.playScale — exactly the call the makam detail screen already uses.
// Per the tradition rule, makam ear training is always ney.
// ─────────────────────────────────────────────────────────────────────────────

export type EarLevel = 'beginner' | 'intermediate' | 'advanced';

export interface MakamEarQuestion {
  id: string;
  makamId: string;
  makamName: string;
  cents: number[];        // scale degrees in cents, for audioEngine.playScale
  options: string[];      // makam names; one is correct
  correctAnswer: string;  // == makamName
}

// Only makams the ney engine can sound at a correct root.
const PLAYABLE = MAKAMS.filter(m => PLAYABLE_MAKAM_IDS.includes(m.id));

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

function optionCountFor(level: EarLevel): number {
  return level === 'beginner' ? 3 : 4;
}

function buildOptions(target: Makam, level: EarLevel): string[] {
  const count = optionCountFor(level);
  let distractorPool = PLAYABLE.filter(m => m.id !== target.id);

  // Advanced: prefer same-family distractors so closely related makams must be
  // told apart by ear (e.g. Uşşak vs Hüseyni).
  if (level === 'advanced') {
    const sameFamily = distractorPool.filter(m => m.family === target.family);
    if (sameFamily.length >= count - 1) {
      distractorPool = sameFamily;
    }
  }

  const distractors = shuffle(distractorPool).slice(0, count - 1).map(m => m.name);
  return shuffle([target.name, ...distractors]);
}

let counter = 0;

export function buildMakamEarQuestion(level: EarLevel): MakamEarQuestion {
  const target = pick(PLAYABLE);
  counter += 1;
  return {
    id: `makam-ear-${target.id}-${counter}`,
    makamId: target.id,
    makamName: target.name,
    cents: target.scale.map(d => d.cents),
    options: buildOptions(target, level),
    correctAnswer: target.name,
  };
}

export function buildMakamEarSession(level: EarLevel, count = 8): MakamEarQuestion[] {
  return Array.from({ length: count }, () => buildMakamEarQuestion(level));
}

export const EAR_TRAINING_AVAILABLE = PLAYABLE.length >= 3;
