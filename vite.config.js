/* eslint-env node */

import path from "path";
import { defineConfig } from "vite";
import excludeDependenciesFromBundle from "rollup-plugin-exclude-dependencies-from-bundle";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    test: {
      include: ["test/**/*.test.ts"],
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        formats: ["es", "cjs"],
      },
      outDir: "dist",
      sourcemap: isProd,
      minify: false,
    },
    plugins: [excludeDependenciesFromBundle()],
  };
});
