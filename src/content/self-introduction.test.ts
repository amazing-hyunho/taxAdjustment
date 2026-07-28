import { describe, expect, it } from "vitest";
import { selfIntroduction } from "./self-introduction";

describe("자기소개 학습 콘텐츠", () => {
  it("사용자가 작성한 자기소개 흐름을 원문 순서대로 제공한다", () => {
    expect(selfIntroduction.fullAnswer.join(" ")).toContain("삼일회계법인");
    expect(selfIntroduction.fullAnswer.join(" ")).toContain("NAVER");
    expect(selfIntroduction.fullAnswer.join(" ")).toContain("현대엘리베이터");
    expect(selfIntroduction.fullAnswer.join(" ")).toContain("풀무원 프로세스 용역");
    expect(selfIntroduction.fullAnswer.join(" ")).toContain("1박 2일 워크숍");
    expect(selfIntroduction.fullAnswer.at(-1)).toContain("이 자리가 너무 떨리는데");
  });

  it("시간 순서의 암기 청크와 꼬리질문을 제공한다", () => {
    expect(selfIntroduction.chunks).toHaveLength(6);
    expect(selfIntroduction.chunks.map((item) => item.cue).join(" ")).toContain("매니저 대표");
    expect(selfIntroduction.chunks.map((item) => item.cue).join(" ")).toContain("외부 자문 한계");
    expect(selfIntroduction.chunks.map((item) => item.cue).join(" ")).toContain("첫 이직");
    expect(selfIntroduction.chunks.map((item) => item.cue).join(" ")).not.toContain("680→110");
    expect(selfIntroduction.followUps.length).toBeGreaterThanOrEqual(4);
    expect(selfIntroduction.followUps.every((item) => item.answer.length > 80)).toBe(true);
  });
});
