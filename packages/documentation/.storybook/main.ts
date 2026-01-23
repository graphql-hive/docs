import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  stories: ["../../design-system/src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "storybook-dark-mode",
  ],
  typescript: {
    reactDocgen: false,
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  staticDirs: ["./public"],
  async viteFinal(config) {
    config.resolve ||= {};
    config.resolve.alias ||= {};

    const aliases = config.resolve.alias as Record<string, string>;

    // Resolve @hive/design-system to the design-system package
    const designSystemPath = path.resolve(__dirname, "../../design-system/src");
    aliases["@hive/design-system"] = designSystemPath;

    // Resolve nextra/icons to local icons (since nextra isn't installed)
    aliases["nextra/icons"] = path.resolve(designSystemPath, "icons");

    return config;
  },
} satisfies StorybookConfig;
