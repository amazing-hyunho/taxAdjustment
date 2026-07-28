import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CORE_NOTES_KEY } from "../lib/storage";
import { SummaryPage } from "./SummaryPage";

describe("핵심 질문 답변 메모", () => {
  it("질문별 메모를 입력 즉시 브라우저에 저장한다", async () => {
    render(<SummaryPage />);
    fireEvent.click(screen.getByRole("tab", { name: "핵심 질문" }));

    const note = screen.getByLabelText("내가 생각하는 답변 메모 · 질문 1");
    fireEvent.change(note, { target: { value: "조언에서 소유로 전환한 경험" } });

    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem(CORE_NOTES_KEY) ?? "{}")).toMatchObject({
        1: "조언에서 소유로 전환한 경험",
      });
    });
  });

  it("저장된 질문별 메모를 다시 불러온다", () => {
    window.localStorage.setItem(CORE_NOTES_KEY, JSON.stringify({ 1: "저장된 답변" }));
    render(<SummaryPage />);
    fireEvent.click(screen.getByRole("tab", { name: "핵심 질문" }));

    expect(screen.getByLabelText("내가 생각하는 답변 메모 · 질문 1")).toHaveValue("저장된 답변");
    expect(screen.getByLabelText("내가 생각하는 답변 메모 · 질문 2")).toHaveValue("");
  });
});
