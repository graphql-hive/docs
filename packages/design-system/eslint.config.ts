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
    files: ["**/*.tsx", "**/*.jsx"],
    rules: {
      "better-tailwindcss/no-unknown-classes": [
        "error",
        {
          ignore: [
            "light",
            "hive-focus",
            "hive-label-separator",
            "hive-slider",
            "MarketplaceSearch",
            "nextra-banner",
            "nextra-bleed",
            "nextra-callout",
            "nextra-cards",
            "nextra-collapse",
            "nextra-filetree",
            "nextra-focus",
            "nextra-hamburger",
            "nextra-mermaid",
            "nextra-scrollbar",
            "nextra-search",
            "nextra-steps",
            "no-scrollbar",
            "subheader",
            "subheading-anchor",
          ],
        },
      ],
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: new URL(
          "../documentation/src/styles/app.css",
          import.meta.url,
        ).pathname,
      },
    },
  },
  {
    languageOptions: {
      parserOptions: {
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
