import type { QuestionProgress, StudyState } from "../types";

export const STORAGE_KEY = "naver-cfo-drill-state-v1";
export const STORIES_KEY = "naver-cfo-drill-stories-v1";
export const CORE_NOTES_KEY = "naver-cfo-drill-core-notes-v1";
export const HIDDEN_CORE_QUESTIONS_KEY = "naver-cfo-drill-hidden-core-questions-v1";

export const emptyProgress = (): QuestionProgress => ({
  completed: false,
  weak: false,
  bookmarked: false,
  note: "",
  attempts: 0,
});

export const initialState: StudyState = {
  questions: {},
  studyDates: [],
  theme: "system",
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const parseCoreQuestionNotes = (raw: string | null): Record<string, string> => {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([id, note]) => /^\d+$/.test(id) && typeof note === "string")
        .slice(0, 100)
        .map(([id, note]) => [id, (note as string).slice(0, 5000)]),
    );
  } catch {
    return {};
  }
};

export const parseHiddenCoreQuestionIds = (raw: string | null): string[] => {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(
      parsed
        .filter((id): id is string | number => typeof id === "string" || typeof id === "number")
        .map(String)
        .filter((id) => /^\d+$/.test(id)),
    )].slice(0, 100);
  } catch {
    return [];
  }
};

export const sanitizeProgress = (value: unknown): QuestionProgress => {
  if (!isRecord(value)) return emptyProgress();
  const confidence =
    typeof value.confidence === "number" && value.confidence >= 1 && value.confidence <= 5
      ? Math.round(value.confidence)
      : undefined;
  return {
    completed: value.completed === true,
    weak: value.weak === true || (confidence !== undefined && confidence <= 2),
    bookmarked: value.bookmarked === true,
    note: typeof value.note === "string" ? value.note.slice(0, 5000) : "",
    attempts: typeof value.attempts === "number" && value.attempts >= 0 ? Math.floor(value.attempts) : 0,
    ...(confidence ? { confidence } : {}),
    ...(typeof value.lastAttemptAt === "string" ? { lastAttemptAt: value.lastAttemptAt } : {}),
  };
};

export const parseStudyState = (raw: string | null): StudyState => {
  if (!raw) return initialState;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return initialState;
    const questions = isRecord(parsed.questions)
      ? Object.fromEntries(
          Object.entries(parsed.questions).map(([id, progress]) => [id, sanitizeProgress(progress)]),
        )
      : {};
    const studyDates = Array.isArray(parsed.studyDates)
      ? [...new Set(parsed.studyDates.filter((date): date is string => typeof date === "string"))].slice(-366)
      : [];
    const theme = parsed.theme === "light" || parsed.theme === "dark" ? parsed.theme : "system";
    return {
      questions,
      studyDates,
      theme,
      ...(typeof parsed.lastStudyDate === "string" ? { lastStudyDate: parsed.lastStudyDate } : {}),
    };
  } catch {
    return initialState;
  }
};

export const localDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const calculateStreak = (dates: string[], today = new Date()) => {
  const unique = new Set(dates);
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!unique.has(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (unique.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};
