import config from "@hasparus/eslint-config/the-guild";

export default [
  ...config,
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
          allowDefaultProject: ["*.config.ts"],
        },
      },
    },
  },
];
