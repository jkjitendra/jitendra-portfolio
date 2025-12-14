// scripts/bump-sw-version.js
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/** Try multiple ways to get a build id */
function resolveBuildId() {
  // 1) Git (local dev or CI with git available)
  try {
    const sha = execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
    if (sha) return `swr-${sha}`;
  } catch (_) { }

  // 2) Common CI envs
  const ciSha =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.NETLIFY_COMMIT_REF ||
    process.env.GITHUB_SHA ||
    process.env.CI_COMMIT_SHA ||
    process.env.TRAVIS_COMMIT ||
    "";

  if (ciSha) return `swr-${ciSha.slice(0, 7)}`;

  // 3) Timestamp fallback (yyyyMMdd-HHmmss)
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const ts = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    "-",
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("");
  return `swr-${ts}`;
}

/** Replace const VERSION = '...'; (single/double quotes both supported) */
function bumpInFile(filePath, newVersion) {
  if (!fs.existsSync(filePath)) return false;

  const src = fs.readFileSync(filePath, "utf8");
  const versionRegex = /const\s+VERSION\s*=\s*(['"])[^'"]*\1\s*;/;

  // First check if the pattern exists at all
  if (!versionRegex.test(src)) {
    console.warn(`⚠️  VERSION pattern not found in ${filePath}. No changes written.`);
    return false;
  }

  const replaced = src.replace(
    versionRegex,
    `const VERSION = '${newVersion}';`
  );

  if (replaced === src) {
    // Pattern found but already has the correct version
    console.log(`✅ SW version in ${filePath} already up-to-date: ${newVersion}`);
    return true;
  }

  fs.writeFileSync(filePath, replaced);
  console.log(`✅ Bumped SW version in ${filePath} → ${newVersion}`);
  return true;
}

function run() {
  const buildId = resolveBuildId();

  // Try common SW locations
  const candidates = [
    path.resolve(process.cwd(), "public/sw.js"),
    path.resolve(process.cwd(), "public/service-worker.js"),
  ];

  const changedAny = candidates.map((p) => bumpInFile(p, buildId)).some(Boolean);

  if (!changedAny) {
    console.error(
      "❌ No service worker found at public/sw.js or public/service-worker.js. " +
      "Make sure your compiled SW ends up at one of these paths before Next serves it."
    );
    process.exit(1);
  } else {
    console.log(`🎯 SW version set to: ${buildId}`);
  }
}

run();