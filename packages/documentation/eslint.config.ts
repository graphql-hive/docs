import type { Linter } from "eslint";

import baseConfig from "@hasparus/eslint-config/the-guild";

const config: Linter.Config[] = [
  ...baseConfig,
  {
    files: ["**/*.tsx", "**/*.jsx"],
    rules: {
      "better-tailwindcss/no-unknown-classes": [
        "error",
        { ignore: ["light", "nextra-scrollbar", "hive-focus"] },
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
];

export default config;
