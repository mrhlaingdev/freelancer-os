import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/e2e/"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
};

export default config;