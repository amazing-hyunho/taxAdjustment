import { useEffect, useState } from "react";
import type { CoreInterviewQuestion } from "../content/core-interview-questions";
import { CORE_QUESTION_KEYWORDS_KEY, parseCoreQuestionKeywordOverrides } from "../lib/storage";

const readKeywordOverrides = () => {
  if (typeof window === "undefined") return {};
  return parseCoreQuestionKeywordOverrides(window.localStorage.getItem(CORE_QUESTION_KEYWORDS_KEY));
};

export const splitQuestionKeywords = (value: string) =>
  [...new Set(
    value
      .split(/[,\n;|·]+/)
      .map((keyword) => keyword.trim())
      .filter(Boolean),
  )].slice(0, 8);

export function useCoreQuestionKeywords() {
  const [keywordOverrides, setKeywordOverrides] = useState<Record<string, string>>(readKeywordOverrides);

  useEffect(() => {
    window.localStorage.setItem(CORE_QUESTION_KEYWORDS_KEY, JSON.stringify(keywordOverrides));
  }, [keywordOverrides]);

  const getKeywordText = (question: CoreInterviewQuestion) =>
    keywordOverrides[String(question.id)] ?? question.cues.join(" · ");

  const getKeywords = (question: CoreInterviewQuestion) =>
    splitQuestionKeywords(getKeywordText(question));

  const updateKeywordText = (questionId: number, value: string) => {
    setKeywordOverrides((current) => ({
      ...current,
      [String(questionId)]: value.slice(0, 500),
    }));
  };

  return {
    getKeywordText,
    getKeywords,
    updateKeywordText,
  };
}
