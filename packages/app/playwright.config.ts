import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests-ui",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:4273",
    headless: true,
  },
  webServer: {
    command: "pnpm dev --host 127.0.0.1 --port 4273 --strictPort",
    url: "http://127.0.0.1:4273",
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
