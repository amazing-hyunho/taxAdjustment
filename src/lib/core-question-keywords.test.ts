import { describe, expect, it } from "vitest";
import { splitQuestionKeywords } from "../hooks/useCoreQuestionKeywords";
import { parseCoreQuestionKeywordOverrides } from "./storage";

describe("핵심 질문 사용자 키워드", () => {
  it("쉼표와 가운데점을 기준으로 중복 없이 분리한다", () => {
    expect(splitQuestionKeywords("의사결정 · 실행, 사후 통제 · 실행")).toEqual([
      "의사결정",
      "실행",
      "사후 통제",
    ]);
  });

  it("저장된 키워드 수정값을 안전하게 복원한다", () => {
    expect(parseCoreQuestionKeywordOverrides(JSON.stringify({
      1: "인하우스 · 의사결정",
      bad: 123,
    }))).toEqual({
      1: "인하우스 · 의사결정",
    });
    expect(parseCoreQuestionKeywordOverrides("{broken")).toEqual({});
  });
});
