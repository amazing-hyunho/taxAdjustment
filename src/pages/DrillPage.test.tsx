import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { questions } from "../content/questions";
import { DrillPage } from "./DrillPage";

describe("Grill Me", () => {
  it("질문을 먼저 보여주고 사용자가 완료하기 전에는 모범답변을 숨긴다", () => {
    render(<DrillPage progress={{}} updateQuestion={vi.fn()} />);
    expect(screen.getByText(questions[0]!.question)).toBeInTheDocument();
    expect(screen.queryByText("60초 모범답변")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "답변을 마쳤습니다" }));
    expect(screen.getByText("60초 모범답변")).toBeInTheDocument();
  });

  it("자신감 평가를 저장 콜백으로 전달한다", () => {
    const update = vi.fn();
    render(<DrillPage progress={{}} updateQuestion={update} />);
    fireEvent.click(screen.getByRole("button", { name: "답변을 마쳤습니다" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(update).toHaveBeenCalledWith(questions[0]!.id, { confidence: 2, completed: true }, true);
  });
});
