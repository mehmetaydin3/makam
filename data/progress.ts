import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * progress.ts — tradition-scoped progress tracking.
 *
 * Designed against The Modality IA spec §3: progress is a MAP of where
 * you've been, not a SCOREBOARD. Deliberately omits streaks, quiz scores,
 * and any "X of Y" display counts — those are gamification the spec rejects.
 *
 * Borrows the storage skeleton from Modality's progress.ts (load/save/reset,
 * fail-silent, single key, atomic mutate-then-save) but the schema is
 * tradition-aware and state-based, not Modality's flat single-tradition model.
 *
 * Pure storage + selectors. No React here — screens consume via a hook
 * (built separately) so this layer stays testable and isolated.
 */

// ── Types ──────────────────────────────────────────────────────────────────

export interface TraditionProgress {
  traditionId: string;
  modesExplored: string[];     // mode/makam ids whose detail screen was opened
  lessonsCompleted: string[];  // lesson ids the user deliberately completed
  startedAt?: string;          // ISO — first time this tradition was entered
  // Mastery: per-mode "understanding points". Monotonic (only rises).
  // Sources: explore (+1), correct quiz answer (+2), lesson teaching it (+3, jazz).
  // Points are deduplicated per source where appropriate (see mutations).
  masteryPoints?: Record<string, number>;   // modeId -> points
  // Tracks which (mode, source) contributions have already been counted so a
  // one-time source (explore, a given lesson) can't be double-credited.
  masterySources?: Record<string, string[]>; // modeId -> source keys e.g. ['explore','lesson:l2']
}

export interface UserProgress {
  traditions: Record<string, TraditionProgress>;
  createdAt: string;
  updatedAt: string;
}

// Minimal shape a lesson must expose for unlock logic. Both traditions'
// lesson types satisfy this (Makam adds category/number; jazz has unlockedBy).
export interface UnlockableLesson {
  id: string;
  category?: string;
  unlockedBy?: string;
}

// ── Mastery model ────────────────────────────────────────────────────────────
//
// Per-mode "understanding points" climb a 5-level ladder. Points only ever
// rise (monotonic) — there is no decay, no streak, no punishment. Sources of
// points reflect each tradition's real content: exploring a mode, completing a
// lesson that teaches it (jazz lessons carry modeId; makam lessons are thematic
// so contribute at the tradition level only), and answering its quiz questions.

export const MASTERY_POINTS = {
  explore: 1,        // opened the mode's detail screen (one-time)
  lesson: 3,         // completed a lesson that teaches this mode (one-time per lesson)
  correctAnswer: 2,  // each correct quiz answer tagged to this mode (repeatable)
} as const;

export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5;

// Cumulative point thresholds for each level.
export const MASTERY_THRESHOLDS: number[] = [0, 1, 4, 7, 12, 18];

export const MASTERY_LABELS: Record<MasteryLevel, string> = {
  0: 'Unfamiliar',
  1: 'Discovered',
  2: 'Learning',
  3: 'Familiar',
  4: 'Proficient',
  5: 'Mastered',
};

export function levelForPoints(points: number): MasteryLevel {
  let level: MasteryLevel = 0;
  for (let i = MASTERY_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= MASTERY_THRESHOLDS[i]) { level = i as MasteryLevel; break; }
  }
  return level;
}

// Points needed to reach the next level (for progress bars). Returns null at max.
export function pointsToNextLevel(points: number): { current: number; next: number } | null {
  const lvl = levelForPoints(points);
  if (lvl >= 5) return null;
  const floor = MASTERY_THRESHOLDS[lvl];
  const ceil = MASTERY_THRESHOLDS[lvl + 1];
  return { current: points - floor, next: ceil - floor };
}

// ── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = '@modality/progress';

export function defaultProgress(): UserProgress {
  const now = new Date().toISOString();
  return { traditions: {}, createdAt: now, updatedAt: now };
}

export async function loadProgress(): Promise<UserProgress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return JSON.parse(raw) as UserProgress;
  } catch {
    return defaultProgress();
  }
}

export async function saveProgress(progress: UserProgress): Promise<void> {
  try {
    progress.updatedAt = new Date().toISOString();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // fail silently — progress is a nice-to-have, never crash the app
  }
}

export async function resetProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // fail silently
  }
}

/**
 * Reset a single tradition's progress, leaving other traditions intact.
 * Used by the scoped "Reset progress" control in Settings.
 */
export async function resetTraditionProgress(traditionId: string): Promise<void> {
  try {
    const progress = await loadProgress();
    if (progress.traditions[traditionId]) {
      delete progress.traditions[traditionId];
      await saveProgress(progress);
    }
  } catch {
    // fail silently
  }
}

// ── Internal helper: get-or-create a tradition bucket ────────────────────────

function ensureTradition(p: UserProgress, traditionId: string): TraditionProgress {
  if (!p.traditions[traditionId]) {
    p.traditions[traditionId] = {
      traditionId,
      modesExplored: [],
      lessonsCompleted: [],
      startedAt: new Date().toISOString(),
      masteryPoints: {},
      masterySources: {},
    };
  }
  const t = p.traditions[traditionId];
  if (!t.masteryPoints) t.masteryPoints = {};
  if (!t.masterySources) t.masterySources = {};
  return t;
}

// ── Internal: award mastery points to a mode, honoring one-time sources ──────
function awardMastery(
  t: TraditionProgress,
  modeId: string,
  points: number,
  sourceKey?: string,
): void {
  if (sourceKey) {
    const used = t.masterySources![modeId] ?? [];
    if (used.includes(sourceKey)) return; // one-time source already counted
    t.masterySources![modeId] = [...used, sourceKey];
  }
  t.masteryPoints![modeId] = (t.masteryPoints![modeId] ?? 0) + points;
}

// ── Mutations ────────────────────────────────────────────────────────────────

export async function markTraditionStarted(traditionId: string): Promise<void> {
  const p = await loadProgress();
  ensureTradition(p, traditionId); // creates with startedAt if absent
  await saveProgress(p);
}

export async function markModeExplored(traditionId: string, modeId: string): Promise<void> {
  const prog = await loadProgress();
  const t = ensureTradition(prog, traditionId);
  if (!t.modesExplored.includes(modeId)) {
    t.modesExplored.push(modeId);
  }
  // Exploring contributes a one-time mastery point (even if re-opened later).
  awardMastery(t, modeId, MASTERY_POINTS.explore, 'explore');
  await saveProgress(prog);
}

export async function markLessonComplete(
  traditionId: string,
  lessonId: string,
  modeIds: string[] = [],   // modes this lesson teaches (jazz); empty for thematic makam lessons
): Promise<void> {
  const prog = await loadProgress();
  const t = ensureTradition(prog, traditionId);
  if (!t.lessonsCompleted.includes(lessonId)) {
    t.lessonsCompleted.push(lessonId);
  }
  // A completed lesson awards one-time mastery points to each mode it teaches.
  for (const modeId of modeIds) {
    awardMastery(t, modeId, MASTERY_POINTS.lesson, 'lesson:' + lessonId);
  }
  await saveProgress(prog);
}

/**
 * Record a quiz answer for a mode. Correct answers award repeatable mastery
 * points; wrong answers record nothing (no punishment, only ever rises).
 * This is the quiz -> mastery feedback loop's write side.
 */
export async function recordQuizAnswer(
  traditionId: string,
  modeId: string | undefined,
  correct: boolean,
): Promise<void> {
  if (!modeId || !correct) return; // only correct, mode-tagged answers move mastery
  const prog = await loadProgress();
  const t = ensureTradition(prog, traditionId);
  awardMastery(t, modeId, MASTERY_POINTS.correctAnswer); // repeatable, no sourceKey
  await saveProgress(prog);
}

// ── Selectors (operate on an already-loaded UserProgress) ────────────────────

export function getTradition(p: UserProgress, traditionId: string): TraditionProgress | undefined {
  return p.traditions[traditionId];
}

export function isModeExplored(p: UserProgress, traditionId: string, modeId: string): boolean {
  return p.traditions[traditionId]?.modesExplored.includes(modeId) ?? false;
}

export function isLessonComplete(p: UserProgress, traditionId: string, lessonId: string): boolean {
  return p.traditions[traditionId]?.lessonsCompleted.includes(lessonId) ?? false;
}

/**
 * A lesson is unlocked if it has no prerequisite, or its prerequisite is
 * complete. This is the per-lesson linear chain within a category.
 */
export function isLessonUnlocked(
  p: UserProgress,
  traditionId: string,
  lesson: UnlockableLesson
): boolean {
  if (!lesson.unlockedBy) return true;
  return isLessonComplete(p, traditionId, lesson.unlockedBy);
}

/**
 * A category is unlocked if every lesson in the PRIOR category is complete.
 * The first category (index 0) is always unlocked. categoryOrder is the
 * ordered list of category names; allLessons is the tradition's full lesson set.
 */
export function isCategoryUnlocked(
  p: UserProgress,
  traditionId: string,
  category: string,
  categoryOrder: string[],
  allLessons: UnlockableLesson[]
): boolean {
  const idx = categoryOrder.indexOf(category);
  if (idx <= 0) return true; // first category (or unknown) always open
  const priorCategory = categoryOrder[idx - 1];
  const priorLessons = allLessons.filter((l) => l.category === priorCategory);
  if (priorLessons.length === 0) return true;
  return priorLessons.every((l) => isLessonComplete(p, traditionId, l.id));
}

// ── Internal counts (used to DECIDE states — never displayed as "X of Y") ─────

export function countModesExplored(p: UserProgress, traditionId: string): number {
  return p.traditions[traditionId]?.modesExplored.length ?? 0;
}

export function countLessonsCompleted(p: UserProgress, traditionId: string): number {
  return p.traditions[traditionId]?.lessonsCompleted.length ?? 0;
}

// ── Mastery selectors ────────────────────────────────────────────────────────

export function modeMasteryPoints(p: UserProgress, traditionId: string, modeId: string): number {
  return p.traditions[traditionId]?.masteryPoints?.[modeId] ?? 0;
}

export function modeMasteryLevel(p: UserProgress, traditionId: string, modeId: string): MasteryLevel {
  return levelForPoints(modeMasteryPoints(p, traditionId, modeId));
}

// True once the user has touched a mode at all (explored, or earned any points).
export function isModeCovered(p: UserProgress, traditionId: string, modeId: string): boolean {
  return isModeExplored(p, traditionId, modeId) || modeMasteryPoints(p, traditionId, modeId) > 0;
}

/**
 * Tradition coverage — how many of the tradition's modes have been touched,
 * as a fraction 0..1. Breadth.
 */
export function traditionCoverage(p: UserProgress, traditionId: string, allModeIds: string[]): number {
  if (allModeIds.length === 0) return 0;
  const touched = allModeIds.filter((id) => isModeCovered(p, traditionId, id)).length;
  return touched / allModeIds.length;
}

/**
 * Tradition mastery — average mastery level across all modes, as a fraction
 * 0..1 (mean level / 5). Depth.
 */
export function traditionMastery(p: UserProgress, traditionId: string, allModeIds: string[]): number {
  if (allModeIds.length === 0) return 0;
  const total = allModeIds.reduce((sum, id) => sum + modeMasteryLevel(p, traditionId, id), 0);
  return total / (allModeIds.length * 5);
}

// Count of modes at or above a given mastery level (for milestones/summaries).
export function countModesAtLevel(
  p: UserProgress, traditionId: string, allModeIds: string[], minLevel: MasteryLevel,
): number {
  return allModeIds.filter((id) => modeMasteryLevel(p, traditionId, id) >= minLevel).length;
}

/**
 * Narrative state for a tradition — drives the Journey screen's pill/wording.
 * Returns a STATE, never a number, per spec §3.
 */
export type TraditionNarrativeState = 'available' | 'started' | 'exploring' | 'completed';

export function traditionState(
  p: UserProgress,
  traditionId: string,
  totalModes: number,
  totalLessons: number
): TraditionNarrativeState {
  const t = p.traditions[traditionId];
  if (!t || (t.modesExplored.length === 0 && t.lessonsCompleted.length === 0)) {
    return t?.startedAt ? 'started' : 'available';
  }
  const modesAll = totalModes > 0 && t.modesExplored.length >= totalModes;
  const lessonsAll = totalLessons > 0 && t.lessonsCompleted.length >= totalLessons;
  if (modesAll && lessonsAll) return 'completed';
  return 'exploring';
}
