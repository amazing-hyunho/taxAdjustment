import { useEffect, useState } from "react";
import { candidateStories } from "../content/candidate-stories";
import { STORIES_KEY } from "../lib/storage";
import type { CandidateStory } from "../types";

const readStories = (): CandidateStory[] => {
  try {
    const raw = window.localStorage.getItem(STORIES_KEY);
    if (!raw) return candidateStories;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return candidateStories;
    return candidateStories.map((template) => {
      const saved = parsed.find(
        (item): item is CandidateStory =>
          typeof item === "object" && item !== null && "id" in item && item.id === template.id,
      );
      return saved ? { ...template, fields: { ...template.fields, ...saved.fields } } : template;
    });
  } catch {
    return candidateStories;
  }
};

export function useStories() {
  const [stories, setStories] = useState<CandidateStory[]>(readStories);

  useEffect(() => {
    window.localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
  }, [stories]);

  const updateField = (storyId: string, field: keyof CandidateStory["fields"], value: string) => {
    setStories((current) =>
      current.map((story) =>
        story.id === storyId ? { ...story, fields: { ...story.fields, [field]: value.slice(0, 5000) } } : story,
      ),
    );
  };

  return { stories, updateField };
}
