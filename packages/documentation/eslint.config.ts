import type { Linter } from "eslint";

import baseConfig from "@hasparus/eslint-config/the-guild";

const config: Linter.Config[] = [
  { ignores: ["e2e/**", "storybook-static/**"] },
  ...baseConfig,
  {
    files: ["**/*.tsx", "**/*.jsx"],
    rules: {
      "better-tailwindcss/no-unknown-classes": [
        "error",
        {
          ignore: [
            "light",
            "nextra-scrollbar",
            "no-scrollbar",
            "prose-invert",
            "subheader",
            "hive-*",
            "not-prose",
          ],
        },
      ],
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "./src/styles/app.css",
      },
    },
  },
  {
    files: ["./src/routes/**/*.ts", "./src/routes/**/*.tsx"],
    rules: {
      "unicorn/filename-case": "off",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.mjs", "*.js"],
        },
      },
    },
  },
];

export default config;
