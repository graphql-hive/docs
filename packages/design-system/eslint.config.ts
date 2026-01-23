import type { Linter } from "eslint";

import baseConfig from "@hasparus/eslint-config/the-guild";

const config: Linter.Config[] = [
  ...baseConfig,
  {
    files: ["src/routes/**/*.tsx"],
    rules: {
      "unicorn/filename-case": "off",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        projectService: {
          allowDefaultProject: [],
        },
      },
    },
  },
  {
    ignores: [
      ".storybook/**",
      "**/*.stories.ts",
      "**/*.stories.tsx",
      "src/__storybook__/**",
      "storybook-static/**",
    ],
  },
];

export default config;
