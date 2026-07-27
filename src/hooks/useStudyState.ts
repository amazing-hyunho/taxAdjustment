import { useEffect, useMemo, useState } from "react";
import type { QuestionProgress, StudyState } from "../types";
import {
  calculateStreak,
  emptyProgress,
  initialState,
  localDateKey,
  parseStudyState,
  STORAGE_KEY,
} from "../lib/storage";

const readState = () => {
  if (typeof window === "undefined") return initialState;
  return parseStudyState(window.localStorage.getItem(STORAGE_KEY));
};

export function useStudyState() {
  const [state, setState] = useState<StudyState>(readState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const resolved = state.theme === "system" ? (media.matches ? "dark" : "light") : state.theme;
      document.documentElement.dataset.theme = resolved;
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [state.theme]);

  const updateQuestion = (id: string, update: Partial<QuestionProgress>, countAttempt = false) => {
    const today = localDateKey();
    setState((current) => {
      const previous = current.questions[id] ?? emptyProgress();
      const nextProgress = {
        ...previous,
        ...update,
        ...(countAttempt ? { attempts: previous.attempts + 1, lastAttemptAt: new Date().toISOString() } : {}),
      };
      if (typeof update.confidence === "number") {
        nextProgress.weak = update.confidence <= 2 || update.weak === true;
      }
      return {
        ...current,
        questions: { ...current.questions, [id]: nextProgress },
        lastStudyDate: today,
        studyDates: current.studyDates.includes(today) ? current.studyDates : [...current.studyDates, today],
      };
    });
  };

  const stats = useMemo(() => {
    const values = Object.values(state.questions);
    return {
      completed: values.filter((item) => item.completed).length,
      weak: values.filter((item) => item.weak).length,
      bookmarked: values.filter((item) => item.bookmarked).length,
      attempts: values.reduce((sum, item) => sum + item.attempts, 0),
      streak: calculateStreak(state.studyDates),
    };
  }, [state]);

  return {
    state,
    stats,
    updateQuestion,
    setTheme: (theme: StudyState["theme"]) => setState((current) => ({ ...current, theme })),
  };
}
