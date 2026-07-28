import { useEffect, useState } from "react";
import { CORE_NOTES_KEY, parseCoreQuestionNotes } from "../lib/storage";

const readNotes = () => {
  if (typeof window === "undefined") return {};
  return parseCoreQuestionNotes(window.localStorage.getItem(CORE_NOTES_KEY));
};

export function useCoreQuestionNotes() {
  const [notes, setNotes] = useState<Record<string, string>>(readNotes);

  useEffect(() => {
    window.localStorage.setItem(CORE_NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  const updateNote = (questionId: number, value: string) => {
    setNotes((current) => ({
      ...current,
      [String(questionId)]: value.slice(0, 5000),
    }));
  };

  return { notes, updateNote };
}
