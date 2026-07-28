import { useEffect, useState } from "react";
import { HIDDEN_CORE_QUESTIONS_KEY, parseHiddenCoreQuestionIds } from "../lib/storage";

const readHiddenQuestionIds = () => {
  if (typeof window === "undefined") return [];
  return parseHiddenCoreQuestionIds(window.localStorage.getItem(HIDDEN_CORE_QUESTIONS_KEY));
};

export function useHiddenCoreQuestions() {
  const [hiddenQuestionIds, setHiddenQuestionIds] = useState<string[]>(readHiddenQuestionIds);

  useEffect(() => {
    window.localStorage.setItem(HIDDEN_CORE_QUESTIONS_KEY, JSON.stringify(hiddenQuestionIds));
  }, [hiddenQuestionIds]);

  const setQuestionHidden = (questionId: number, hidden: boolean) => {
    const id = String(questionId);
    setHiddenQuestionIds((current) => {
      if (hidden) return current.includes(id) ? current : [...current, id];
      return current.filter((currentId) => currentId !== id);
    });
  };

  return {
    hiddenQuestionIds,
    setQuestionHidden,
  };
}
