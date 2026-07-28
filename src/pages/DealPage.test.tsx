import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DealPage } from "./DealPage";

describe("DealPage", () => {
  it("switches from the Dunamu deal to the AI and NVIDIA investment issue", () => {
    render(<DealPage />);

    expect(screen.getByRole("heading", { name: /네이버파이낸셜–두나무/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "AI·NVIDIA 투자" }));

    expect(screen.getByRole("heading", { name: /NAVER–NVIDIA–Brookfield/ })).toBeInTheDocument();
    expect(screen.getByText(/NVIDIA는 NAVER에 10억 달러를 전략적으로 투자할 계획/)).toBeInTheDocument();
    expect(screen.getByText(/Brookfield는 최대 90억 달러를 조달하는 비구속적 조건서/)).toBeInTheDocument();
    expect(screen.getByText(/조건부 투자 계획 · 금융 확정 전/)).toBeInTheDocument();
  });

  it("shows the AI issue's analysis tabs and source links", () => {
    render(<DealPage />);
    fireEvent.click(screen.getByRole("tab", { name: "AI·NVIDIA 투자" }));

    expect(screen.getByRole("tab", { name: "투자 구조" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("세 축의 역할")).toBeInTheDocument();

    fireEvent.click(screen.getByText("공식 출처 원문"));
    expect(screen.getByRole("link", { name: /NAVER·NVIDIA·Brookfield/ })).toHaveAttribute(
      "href",
      expect.stringContaining("nvidianews.nvidia.com"),
    );
  });
});
