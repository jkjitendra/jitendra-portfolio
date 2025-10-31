// export-project.js
import fs from "fs";
import path from "path";

const baseDir = "./"; // root of your project
const output = "./project-portfolio.md";

// folders and file types to ignore
const excludeDirs = [".next", "node_modules", "public", ".git", ".qodo", "dist", "out", ".vercel"];
const excludeExt = [".png", ".jpg", ".jpeg", ".gif", ".ico", ".mp4", ".webp", ".pdf", ".svg", ".DS_Store"];
const includeDirs = ["app", "components", "data", "pages", "scripts"];

// top-level config files to always include
const includeFiles = [
  "package.json",
  "next.config.mjs",
  "tsconfig.json",
  "tailwind.config.ts",
  "README.md"
];

// start fresh
if (fs.existsSync(output)) fs.unlinkSync(output);
fs.writeFileSync(output, "# Jitendra Portfolio Project\n\n");

// recursive traversal for subfolders
function readDirRecursively(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // skip ignored folders
      if (excludeDirs.includes(entry.name)) continue;
      readDirRecursively(fullPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (excludeExt.includes(ext)) continue;

      try {
        const code = fs.readFileSync(fullPath, "utf8");
        const header = `\n\n## ${fullPath}\n\`\`\`${ext.slice(1) || "txt"}\n`;
        fs.appendFileSync(output, header + code + "\n```\n");
      } catch (err) {
        console.warn(`Skipped ${fullPath} (${err.message})`);
      }
    }
  }
}

// Include main code directories
includeDirs.forEach(dir => {
  const dirPath = path.join(baseDir, dir);
  if (fs.existsSync(dirPath)) readDirRecursively(dirPath);
});

// Include top-level config files
fs.appendFileSync(output, "\n\n# Project Configuration Files\n");
for (const file of includeFiles) {
  const filePath = path.join(baseDir, file);
  if (fs.existsSync(filePath)) {
    try {
      const code = fs.readFileSync(filePath, "utf8");
      const ext = path.extname(filePath).slice(1) || "txt";
      const header = `\n\n## ${file}\n\`\`\`${ext}\n`;
      fs.appendFileSync(output, header + code + "\n```\n");
    } catch (err) {
      console.warn(`Skipped ${file} (${err.message})`);
    }
  }
}

console.log(`Export completed → ${output}`);
