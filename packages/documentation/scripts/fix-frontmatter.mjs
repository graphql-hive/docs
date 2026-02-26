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

const files = walk(docsDir);
let titleAdded = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;

  const hasFrontmatter = content.startsWith("---");

  if (hasFrontmatter) {
    const fmEnd = content.indexOf("---", 3);
    const frontmatter = content.slice(3, fmEnd);
    const hasTitle = /^title:/m.test(frontmatter);

    if (!hasTitle) {
      const body = content.slice(fmEnd + 3);
      const headingMatch = body.match(/^#\s+(.+)$/m);
      if (headingMatch) {
        const title = headingMatch[1].replaceAll("\\", "").trim();
        const safeTitle =
          title.includes(":") || title.includes('"') || title.includes("'")
            ? JSON.stringify(title)
            : title;
        // Insert title after "---\n"
        const insertAt = content.indexOf("\n", 0) + 1;
        content =
          content.slice(0, insertAt) +
          "title: " +
          safeTitle +
          "\n" +
          content.slice(insertAt);
        titleAdded++;
        changed = true;
      }
    }
  } else {
    const headingMatch = content.match(/^#\s+(.+)$/m);
    if (headingMatch) {
      const title = headingMatch[1].replaceAll("\\", "").trim();
      const safeTitle =
        title.includes(":") || title.includes('"') || title.includes("'")
          ? JSON.stringify(title)
          : title;
      content = "---\ntitle: " + safeTitle + "\n---\n\n" + content;
      titleAdded++;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content);
  }
}

console.log("Files processed:", files.length);
console.log("Titles added:", titleAdded);
