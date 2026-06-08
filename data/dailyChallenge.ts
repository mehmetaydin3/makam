import { localDateKey } from './progress';
import { QUIZ_QUESTIONS as MAKAM_QUESTIONS } from './traditions/turkish-makam/quiz';
import { QUIZ_QUESTIONS as JAZZ_QUESTIONS } from './traditions/modal-jazz/quiz';

/**
 * dailyChallenge.ts - one fresh, deterministic quiz set per day per tradition.
 *
 * The set is seeded from the local date key so it is identical for the whole
 * day (re-openable) but rotates at midnight. It mixes difficulties for a quick,
 * varied check-in (default 5 questions). Options are shuffled with the same
 * seed so the screen stays stable across re-renders.
 *
 * Reuses each tradition's existing QUIZ_QUESTIONS - no new content - so it stays
 * in sync with the quiz banks and the mastery-tagging (makamId / modeId) flows
 * straight through recordQuizAnswer().
 */

export interface DailyQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  targetId?: string; // mode/makam this question is tagged to (drives mastery)
}

export const DAILY_CHALLENGE_SIZE = 5;

export type DailyTradition = 'turkish-makam' | 'modal-jazz';

function hashSeed(s: string): number {
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], rnd: () => number): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildDailyChallenge(
  tradition: DailyTradition,
  dateKey: string = localDateKey(),
  size: number = DAILY_CHALLENGE_SIZE,
): DailyQuestion[] {
  const bank: any[] = tradition === 'turkish-makam' ? MAKAM_QUESTIONS : JAZZ_QUESTIONS;
  const rnd = mulberry32(hashSeed(tradition + '|' + dateKey));
  const picked = seededShuffle(bank, rnd).slice(0, size);
  return picked.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    options: seededShuffle(q.options, rnd),
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    targetId: tradition === 'turkish-makam' ? q.makamId : q.modeId,
  }));
}

export function dailyChallengeTitle(dateKey: string = localDateKey()): string {
  const d = new Date(dateKey + 'T00:00:00');
  const month = d.toLocaleString('en-US', { month: 'long' });
  return `${month} ${d.getDate()} challenge`;
}
