import { useState, useEffect, useCallback } from 'react';
import {
  UserProgress,
  defaultProgress,
  loadProgress,
  markModeExplored as _markModeExplored,
  markLessonComplete as _markLessonComplete,
  markTraditionStarted as _markTraditionStarted,
  isLessonComplete as _isLessonComplete,
  isLessonUnlocked as _isLessonUnlocked,
  isCategoryUnlocked as _isCategoryUnlocked,
  isModeExplored as _isModeExplored,
  traditionState as _traditionState,
  recordQuizAnswer as _recordQuizAnswer,
  modeMasteryPoints as _modeMasteryPoints,
  modeMasteryLevel as _modeMasteryLevel,
  isModeCovered as _isModeCovered,
  traditionCoverage as _traditionCoverage,
  traditionMastery as _traditionMastery,
  countModesAtLevel as _countModesAtLevel,
  UnlockableLesson,
  MasteryLevel,
} from '../data/progress';

/**
 * useProgress — React bridge to the progress.ts storage layer.
 *
 * Loads progress on mount, exposes selectors bound to the current state,
 * and re-renders consumers when a mutation completes. Mutations write to
 * storage then refresh the in-memory copy so the UI reflects changes
 * immediately (e.g. a lesson unlocks the moment the prior one completes).
 *
 * Selectors are curried with the loaded progress so screens call them
 * simply: isLessonUnlocked(traditionId, lesson) — no progress arg needed.
 */
export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress());
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const p = await loadProgress();
    setProgress(p);
    setLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ── Mutations: write, then refresh in-memory state ──
  const markModeExplored = useCallback(async (traditionId: string, modeId: string) => {
    await _markModeExplored(traditionId, modeId);
    await refresh();
  }, [refresh]);

  const markLessonComplete = useCallback(async (traditionId: string, lessonId: string, modeIds: string[] = []) => {
    await _markLessonComplete(traditionId, lessonId, modeIds);
    await refresh();
  }, [refresh]);

  const recordQuizAnswer = useCallback(async (traditionId: string, modeId: string | undefined, correct: boolean) => {
    await _recordQuizAnswer(traditionId, modeId, correct);
    await refresh();
  }, [refresh]);

  const markTraditionStarted = useCallback(async (traditionId: string) => {
    await _markTraditionStarted(traditionId);
    await refresh();
  }, [refresh]);

  // ── Selectors bound to current progress ──
  const isLessonComplete = useCallback(
    (traditionId: string, lessonId: string) => _isLessonComplete(progress, traditionId, lessonId),
    [progress]
  );
  const isLessonUnlocked = useCallback(
    (traditionId: string, lesson: UnlockableLesson) => _isLessonUnlocked(progress, traditionId, lesson),
    [progress]
  );
  const isCategoryUnlocked = useCallback(
    (traditionId: string, category: string, categoryOrder: string[], allLessons: UnlockableLesson[]) =>
      _isCategoryUnlocked(progress, traditionId, category, categoryOrder, allLessons),
    [progress]
  );
  const isModeExplored = useCallback(
    (traditionId: string, modeId: string) => _isModeExplored(progress, traditionId, modeId),
    [progress]
  );
  const traditionState = useCallback(
    (traditionId: string, totalModes: number, totalLessons: number) =>
      _traditionState(progress, traditionId, totalModes, totalLessons),
    [progress]
  );
  const modeMasteryPoints = useCallback(
    (traditionId: string, modeId: string) => _modeMasteryPoints(progress, traditionId, modeId),
    [progress]
  );
  const modeMasteryLevel = useCallback(
    (traditionId: string, modeId: string) => _modeMasteryLevel(progress, traditionId, modeId),
    [progress]
  );
  const isModeCovered = useCallback(
    (traditionId: string, modeId: string) => _isModeCovered(progress, traditionId, modeId),
    [progress]
  );
  const traditionCoverage = useCallback(
    (traditionId: string, allModeIds: string[]) => _traditionCoverage(progress, traditionId, allModeIds),
    [progress]
  );
  const traditionMastery = useCallback(
    (traditionId: string, allModeIds: string[]) => _traditionMastery(progress, traditionId, allModeIds),
    [progress]
  );
  const countModesAtLevel = useCallback(
    (traditionId: string, allModeIds: string[], minLevel: MasteryLevel) =>
      _countModesAtLevel(progress, traditionId, allModeIds, minLevel),
    [progress]
  );

  return {
    progress,
    loaded,
    refresh,
    markModeExplored,
    markLessonComplete,
    markTraditionStarted,
    isLessonComplete,
    isLessonUnlocked,
    isCategoryUnlocked,
    isModeExplored,
    traditionState,
    recordQuizAnswer,
    modeMasteryPoints,
    modeMasteryLevel,
    isModeCovered,
    traditionCoverage,
    traditionMastery,
    countModesAtLevel,
  };
}
