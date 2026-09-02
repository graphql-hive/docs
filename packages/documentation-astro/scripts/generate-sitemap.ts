import { fileURLToPath } from "node:url";

const SITE_URL = "https://the-guild.dev/graphql/hive";
const distDirectory = fileURLToPath(new URL("../dist", import.meta.url));
const pages = [
  ...new Bun.Glob("**/index.html").scanSync({
    cwd: distDirectory,
    onlyFiles: true,
  }),
]
  .map((file) => {
    const path =
      file === "index.html" ? "" : `/${file.replace(/\/index\.html$/, "")}`;
    // Percent-encode: tag pages contain spaces, invalid raw inside <loc>.
    return `${SITE_URL}${encodeURI(path)}`;
  })
  .sort();

const urls = pages.map((url) => `  <url><loc>${url}</loc></url>`).join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

await Bun.write(new URL("../dist/sitemap.xml", import.meta.url), sitemap);
console.log(`Generated sitemap.xml with ${pages.length} URLs`);
