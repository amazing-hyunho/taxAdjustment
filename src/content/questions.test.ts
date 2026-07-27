import { describe, expect, it } from "vitest";
import { getRandomQuestion, questions } from "./questions";

describe("면접 질문 콘텐츠", () => {
  it("필수 질문 40개 이상과 고유 ID를 제공한다", () => {
    expect(questions.length).toBeGreaterThanOrEqual(40);
    expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length);
  });

  it("모든 질문이 답변·반론·꼬리질문·검증일을 갖는다", () => {
    for (const question of questions) {
      expect(question.keyAnswer).toHaveLength(3);
      expect(question.modelAnswer.length).toBeGreaterThan(80);
      expect(question.followUps.length).toBeGreaterThanOrEqual(2);
      expect(question.redFlags.length).toBeGreaterThanOrEqual(2);
      expect(question.metrics.length).toBeGreaterThanOrEqual(3);
      expect(question.lastVerifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("랜덤 질문은 가능하면 직전 질문을 피하고 빈 배열을 안전하게 처리한다", () => {
    const pool = questions.slice(0, 3);
    expect(getRandomQuestion(pool, pool[0]?.id, () => 0)?.id).toBe(pool[1]?.id);
    expect(getRandomQuestion([])).toBeUndefined();
  });
});
