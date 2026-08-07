import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  integrations: [mdx()],
  publicDir: fileURLToPath(new URL("../documentation/public", import.meta.url)),
});
