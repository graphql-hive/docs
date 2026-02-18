import fs from "node:fs";
import path from "node:path";

const docsDir = "content/docs";

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith(".mdx")) files.push(full);
  }
  return files;
}

let fixed = 0;
for (const file of walk(docsDir)) {
  let content = fs.readFileSync(file, "utf8");
  // Fix "---title: ..." → "---\ntitle: ..."
  if (content.startsWith("---title:")) {
    content = "---\n" + content.slice(3);
    fs.writeFileSync(file, content);
    fixed++;
  }
}

console.log("Fixed glued frontmatter:", fixed);
