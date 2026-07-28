import { describe, expect, it } from "vitest";
import { getRandomQuestion, questions } from "./questions";

describe("면접 질문 콘텐츠", () => {
  it("필수 질문 40개 이상과 고유 ID를 제공한다", () => {
    expect(questions.length).toBeGreaterThanOrEqual(40);
    expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length);
  });

  it("회계 전용 질문을 포함하지 않는다", () => {
    expect(questions.some((question) => String(question.category) === "회계")).toBe(false);
  });

  it("주요 행동면접과 장기계획 질문을 포함한다", () => {
    const prompts = questions.map((question) => question.question).join(" ");
    expect(prompts).toContain("새로운 도전");
    expect(prompts).toContain("실패한 경험");
    expect(prompts).toContain("조직 내 갈등");
    expect(prompts).toContain("단점");
    expect(prompts).toContain("5년과 10년");
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
