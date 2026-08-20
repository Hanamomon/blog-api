import { defineConfig } from "jest";

export default defineConfig({
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  globalSetup: "./tests/testSetup.js",
});
