import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CORE_QUESTION_KEYWORDS_KEY } from "../lib/storage";
import { HomePage } from "./HomePage";

const renderHome = () => render(
  <HomePage
    stats={{ completed: 0, weak: 0, attempts: 0, streak: 0 }}
    online
    onNavigate={vi.fn()}
    onStartQuestion={vi.fn()}
  />,
);

describe("홈 핵심 질문", () => {
  it("일반 Drill 질문 대신 핵심 질문 5개와 키워드 편집란을 표시한다", () => {
    renderHome();

    expect(screen.getByRole("heading", { name: "오늘 준비할 핵심 질문" })).toBeInTheDocument();
    expect(screen.getAllByLabelText(/답변 키워드 · 질문/)).toHaveLength(5);
  });

  it("홈에서 수정한 키워드를 자동 저장한다", async () => {
    renderHome();
    const keywordInputs = screen.getAllByLabelText(/답변 키워드 · 질문/);
    const firstInput = keywordInputs[0];
    expect(firstInput).toBeDefined();

    fireEvent.change(firstInput!, { target: { value: "핵심 근거 · 실행 결과" } });

    await waitFor(() => {
      const saved = JSON.parse(window.localStorage.getItem(CORE_QUESTION_KEYWORDS_KEY) ?? "{}");
      expect(Object.values(saved)).toContain("핵심 근거 · 실행 결과");
    });
  });
});
