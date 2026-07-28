import { describe, expect, it } from "vitest";
import { candidateStories } from "./candidate-stories";

describe("지원자 경험 카드", () => {
  it("정량 성과와 행동면접 경험을 함께 제공한다", () => {
    const content = JSON.stringify(candidateStories);

    expect(content).toContain("680억");
    expect(content).toContain("281억");
    expect(content).toContain("자발적 도전");
    expect(content).toContain("70명 워크숍");
    expect(content).toContain("프로젝트 실패");
    expect(content).toContain("조직 내 갈등");
  });

  it("모든 코칭 카드에 답변 순서와 주의점이 있다", () => {
    const coachedStories = candidateStories.filter((story) => story.coaching);

    expect(coachedStories.length).toBeGreaterThanOrEqual(8);
    expect(coachedStories.every((story) => story.coaching?.answerOrder.length === 3)).toBe(true);
    expect(coachedStories.every((story) => Boolean(story.coaching?.caution))).toBe(true);
  });
});
