import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { questions } from "../content/questions";
import { WeakPage } from "./WeakPage";

describe("취약질문 복습", () => {
  it("취약질문만 필터하고 선택 시 Drill로 연결한다", () => {
    const first = questions[0]!;
    const second = questions[1]!;
    const start = vi.fn();
    render(
      <WeakPage
        progress={{
          [first.id]: { completed: true, weak: true, bookmarked: false, note: "", attempts: 1, confidence: 2 },
          [second.id]: { completed: true, weak: false, bookmarked: true, note: "", attempts: 1, confidence: 5 },
        }}
        onStartQuestion={start}
      />,
    );
    expect(screen.getByText(first.question)).toBeInTheDocument();
    expect(screen.queryByText(second.question)).not.toBeInTheDocument();
    fireEvent.click(screen.getByText(first.question));
    expect(start).toHaveBeenCalledWith(first.id);
  });
});
