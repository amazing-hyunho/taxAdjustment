import { describe, expect, it } from "vitest";
import { parseHiddenCoreQuestionIds } from "./storage";

describe("숨긴 핵심 질문 저장값", () => {
  it("숫자 ID만 중복 없이 복원한다", () => {
    expect(parseHiddenCoreQuestionIds(JSON.stringify(["1", 2, "1", "x", null]))).toEqual(["1", "2"]);
  });

  it("잘못된 저장값은 빈 목록으로 처리한다", () => {
    expect(parseHiddenCoreQuestionIds("{broken")).toEqual([]);
    expect(parseHiddenCoreQuestionIds(JSON.stringify({ 1: true }))).toEqual([]);
  });
});
