import { describe, expect, it } from "vitest";
import { extractKeywords } from "./keywords";

describe("답변 메모 키워드 추출", () => {
  it("한글 핵심어와 금액을 입력 순서대로 추출한다", () => {
    const keywords = extractKeywords(
      "세무조사 대응에서 예상 고지세액 680억 원을 110억 원으로 낮추고 재발 방지 통제를 만들었습니다.",
      8,
    );

    expect(keywords).toContain("세무조사");
    expect(keywords).toContain("고지세액");
    expect(keywords).toContain("680억");
    expect(keywords).toContain("110억");
  });

  it("반복 핵심어를 우선하고 상투어를 제외한다", () => {
    const keywords = extractKeywords(
      "저는 프로세스 개선을 통해 세무 프로세스를 표준화했고, 프로세스 통제로 재발을 방지했습니다.",
      3,
    );

    expect(keywords[0]).toBe("프로세스");
    expect(keywords).not.toContain("저는");
    expect(keywords).not.toContain("통해");
    expect(keywords).toHaveLength(3);
  });

  it("빈 메모에서는 키워드를 만들지 않는다", () => {
    expect(extractKeywords("   ")).toEqual([]);
  });
});
