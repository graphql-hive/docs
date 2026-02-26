import type { Linter } from "eslint";

import baseConfig from "@hasparus/eslint-config/the-guild";

const config: Linter.Config[] = [
  { ignores: ["e2e/**", "storybook-static/**", "playwright-report/**"] },
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
            "fd-*",
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
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              message:
                "Use '@hive/design-system/hive-components/card' instead. The Hive card has the arrow style from the old site.",
              name: "fumadocs-ui/components/card",
            },
            {
              message: "Use '@hive/design-system/tabs' instead.",
              name: "fumadocs-ui/components/tabs",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["content/**/_meta.ts"],
    rules: {
      "import/no-default-export": "off",
    },
  },
  {
    files: ["scripts/**/*.mjs"],
    rules: {
      "no-console": "off",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.mjs", "*.js", "scripts/*.mjs"],
        },
      },
    },
  },
];

export default config;
