import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { resolveBase } from "./lib/base";

describe("정적 배포와 PWA 기본", () => {
  it("GitHub Pages project base path를 만든다", () => {
    expect(resolveBase("taxAdjustment")).toBe("/taxAdjustment/");
    expect(resolveBase()).toBe("/");
  });

  it("모바일 viewport와 오프라인 fallback을 포함한다", () => {
    const index = readFileSync("index.html", "utf8");
    const offline = readFileSync("public/offline.html", "utf8");
    const serviceWorker = readFileSync("public/sw.js", "utf8");
    expect(index).toContain('name="viewport"');
    expect(index).toContain("width=device-width");
    expect(index).toContain("manifest.webmanifest");
    expect(offline).toContain("오프라인");
    expect(offline).toContain('href="./"');
    expect(serviceWorker).toContain('event.request.mode === "navigate"');
    expect(serviceWorker).toContain("SKIP_WAITING");
  });
});
