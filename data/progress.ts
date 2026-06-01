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
    };
  }
  return p.traditions[traditionId];
}

// ── Mutations ────────────────────────────────────────────────────────────────

export async function markTraditionStarted(traditionId: string): Promise<void> {
  const p = await loadProgress();
  ensureTradition(p, traditionId); // creates with startedAt if absent
  await saveProgress(p);
}

export async function markModeExplored(traditionId: string, modeId: string): Promise<void> {
  const p = await loadProgress();
  const t = ensureTradition(p, traditionId);
  if (t.modesExplored.includes(modeId)) return; // already explored, no-op
  t.modesExplored.push(modeId);
  await saveProgress(p);
}

export async function markLessonComplete(traditionId: string, lessonId: string): Promise<void> {
  const p = await loadProgress();
  const t = ensureTradition(p, traditionId);
  if (t.lessonsCompleted.includes(lessonId)) return; // already complete, no-op
  t.lessonsCompleted.push(lessonId);
  await saveProgress(p);
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
