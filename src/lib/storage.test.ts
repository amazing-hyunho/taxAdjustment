import { describe, expect, it } from "vitest";
import { calculateStreak, parseStudyState, sanitizeProgress } from "./storage";

describe("학습 상태 저장", () => {
  it("손상된 localStorage를 초기 상태로 복구한다", () => {
    expect(parseStudyState("{broken")).toMatchObject({ questions: {}, studyDates: [], theme: "system" });
    expect(parseStudyState(JSON.stringify({ questions: "bad", theme: "neon" }))).toMatchObject({
      questions: {},
      studyDates: [],
      theme: "system",
    });
  });

  it("낮은 자신감은 취약질문으로 분류하고 비정상 값을 제거한다", () => {
    expect(sanitizeProgress({ confidence: 2, attempts: 3.8 })).toMatchObject({
      confidence: 2,
      weak: true,
      attempts: 3,
    });
    expect(sanitizeProgress({ confidence: 99, note: 12 }).confidence).toBeUndefined();
  });

  it("오늘부터 이어진 연속 학습일을 계산한다", () => {
    expect(calculateStreak(["2026-07-25", "2026-07-26", "2026-07-27"], new Date(2026, 6, 27))).toBe(3);
    expect(calculateStreak(["2026-07-25", "2026-07-26"], new Date(2026, 6, 27))).toBe(2);
  });
});
