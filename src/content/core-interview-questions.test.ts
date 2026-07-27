import { describe, expect, it } from "vitest";
import { coreInterviewQuestions } from "./core-interview-questions";

describe("핵심 면접 질문 16개", () => {
  it("순서와 상태를 유지한다", () => {
    expect(coreInterviewQuestions).toHaveLength(16);
    expect(coreInterviewQuestions.map((item) => item.id)).toEqual(
      Array.from({ length: 16 }, (_, index) => index + 1),
    );
    expect(coreInterviewQuestions.slice(0, 4).every((item) => item.status === "답변 OK")).toBe(true);
  });

  it("각 질문에 지하철 학습용 단서와 꼬리질문이 있다", () => {
    for (const item of coreInterviewQuestions) {
      expect(item.thesis.length).toBeGreaterThan(40);
      expect(item.cues).toHaveLength(3);
      expect(item.framework.length).toBeGreaterThanOrEqual(3);
      expect(item.followUps.length).toBeGreaterThanOrEqual(2);
    }
  });
});
