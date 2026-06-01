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
  UnlockableLesson,
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

  const markLessonComplete = useCallback(async (traditionId: string, lessonId: string) => {
    await _markLessonComplete(traditionId, lessonId);
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
  };
}
