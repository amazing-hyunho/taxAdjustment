import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { coreInterviewQuestions } from "../content/core-interview-questions";
import { CORE_NOTES_KEY, HIDDEN_CORE_QUESTIONS_KEY } from "../lib/storage";
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

  it("메모가 입력된 질문만 메모 답변 탭에 자동으로 모은다", () => {
    window.localStorage.setItem(CORE_NOTES_KEY, JSON.stringify({
      1: "첫 번째 질문의 준비된 답변",
      2: "   ",
      4: "네 번째 질문의 준비된 답변",
    }));

    render(<SummaryPage />);
    fireEvent.click(screen.getByRole("tab", { name: "메모 답변" }));

    expect(screen.getByText("메모가 입력된 질문 2개")).toBeInTheDocument();
    expect(screen.getByLabelText("모아보기 답변 메모 · 질문 1")).toHaveValue("첫 번째 질문의 준비된 답변");
    expect(screen.getByLabelText("모아보기 답변 메모 · 질문 4")).toHaveValue("네 번째 질문의 준비된 답변");
    expect(screen.queryByLabelText("모아보기 답변 메모 · 질문 2")).not.toBeInTheDocument();
  });

  it("모아보기 탭에서도 메모를 수정해 자동 저장한다", async () => {
    window.localStorage.setItem(CORE_NOTES_KEY, JSON.stringify({ 1: "기존 답변" }));
    render(<SummaryPage />);
    fireEvent.click(screen.getByRole("tab", { name: "메모 답변" }));

    fireEvent.change(screen.getByLabelText("모아보기 답변 메모 · 질문 1"), {
      target: { value: "수정한 최종 답변" },
    });

    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem(CORE_NOTES_KEY) ?? "{}")).toMatchObject({
        1: "수정한 최종 답변",
      });
    });
  });

  it("작성한 메모에서 키워드를 자동 추출해 표시한다", () => {
    window.localStorage.setItem(
      CORE_NOTES_KEY,
      JSON.stringify({ 1: "세무조사 대응으로 고지세액 680억을 110억으로 낮추고 재발 방지 통제를 만들었습니다." }),
    );
    render(<SummaryPage />);
    fireEvent.click(screen.getByRole("tab", { name: "메모 답변" }));

    const keywordRegion = screen.getByLabelText("자동 추출 키워드 · 질문 1");
    expect(keywordRegion).toHaveTextContent("세무조사");
    expect(keywordRegion).toHaveTextContent("고지세액");
    expect(keywordRegion).toHaveTextContent("680억");
  });

  it("질문을 노출하지 않기로 체크하면 자동 저장하고 목록에서 제외한다", async () => {
    render(<SummaryPage />);
    fireEvent.click(screen.getByRole("tab", { name: "핵심 질문" }));

    fireEvent.click(screen.getByLabelText("질문 1 노출하지 않기"));

    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem(HIDDEN_CORE_QUESTIONS_KEY) ?? "[]")).toContain("1");
    });
    expect(screen.getByText(`${coreInterviewQuestions.length - 1}개 질문 빠르게 훑기`)).toBeInTheDocument();
    expect(screen.queryByLabelText("질문 1 노출하지 않기")).not.toBeInTheDocument();
    expect(screen.getByText("숨긴 질문 관리 · 1개")).toBeInTheDocument();
  });

  it("숨긴 질문은 메모 답변에서 제외하고 다시 노출할 수 있다", async () => {
    window.localStorage.setItem(CORE_NOTES_KEY, JSON.stringify({ 1: "숨긴 질문의 답변" }));
    window.localStorage.setItem(HIDDEN_CORE_QUESTIONS_KEY, JSON.stringify(["1"]));
    render(<SummaryPage />);

    fireEvent.click(screen.getByRole("tab", { name: "메모 답변" }));
    expect(screen.getByText("메모가 입력된 질문 0개")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "핵심 질문" }));
    fireEvent.click(screen.getByText("숨긴 질문 관리 · 1개"));
    fireEvent.click(screen.getByLabelText("숨긴 질문 1 다시 노출하기"));

    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem(HIDDEN_CORE_QUESTIONS_KEY) ?? "[]")).not.toContain("1");
    });

    fireEvent.click(screen.getByRole("tab", { name: "메모 답변" }));
    expect(screen.getByLabelText("모아보기 답변 메모 · 질문 1")).toHaveValue("숨긴 질문의 답변");
  });
});
