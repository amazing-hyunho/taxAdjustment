import { describe, expect, it } from "vitest";
import { selfIntroduction } from "./self-introduction";

describe("자기소개 학습 콘텐츠", () => {
  it("60초 답변과 30초 압축본을 제공한다", () => {
    expect(selfIntroduction.fullAnswer.join(" ")).toContain("삼일회계법인");
    expect(selfIntroduction.fullAnswer.join(" ")).toContain("NAVER");
    expect(selfIntroduction.shortAnswer.length).toBeGreaterThan(100);
    expect(selfIntroduction.extendedAnswer.join(" ")).toContain("현대엘리베이터");
    expect(selfIntroduction.extendedAnswer.join(" ").length).toBeGreaterThan(selfIntroduction.fullAnswer.join(" ").length);
  });

  it("시간 순서의 암기 청크와 꼬리질문을 제공한다", () => {
    expect(selfIntroduction.chunks).toHaveLength(5);
    expect(selfIntroduction.followUps.length).toBeGreaterThanOrEqual(4);
    expect(selfIntroduction.followUps.every((item) => item.answer.length > 80)).toBe(true);
  });
});
