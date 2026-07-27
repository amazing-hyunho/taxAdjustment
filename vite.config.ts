import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolveBase } from "./src/lib/base";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.GITHUB_ACTIONS === "true"
    ? resolveBase(env.GITHUB_REPOSITORY?.split("/")[1])
    : "/";

  return {
    base,
    plugins: [react()],
    build: {
      sourcemap: false,
      target: "es2022",
    },
  };
});
