import { NextResponse } from "next/server";

type GithubAsset = {
  name: string;
  browser_download_url: string;
  size: number;
  download_count: number;
};

type GithubRelease = {
  tag_name: string;
  name: string | null;
  html_url: string;
  assets: GithubAsset[];
};

type ReleaseAsset = {
  name: string;
  url: string;
  size: number;
  downloadCount: number;
};

const OWNER = process.env.CODEBUNDLE_GITHUB_OWNER ?? "jkjitendra";
const REPO = process.env.CODEBUNDLE_GITHUB_REPO ?? "codebundle";

function isIgnoredAsset(name: string) {
  const lower = name.toLowerCase();

  return (
    lower.includes("blockmap") ||
    lower.endsWith(".yml") ||
    lower.endsWith(".yaml") ||
    lower.endsWith(".json") ||
    lower.endsWith(".sha256") ||
    lower.endsWith(".sha512") ||
    lower.endsWith(".sig")
  );
}

function toReleaseAsset(asset?: GithubAsset): ReleaseAsset | null {
  if (!asset) return null;

  return {
    name: asset.name,
    url: asset.browser_download_url,
    size: asset.size,
    downloadCount: asset.download_count,
  };
}

function pickAsset(assets: GithubAsset[], os: "mac" | "windows" | "linux") {
  const validAssets = assets.filter((asset) => !isIgnoredAsset(asset.name));

  const matchers: Record<typeof os, string[]> = {
    mac: [".dmg", ".pkg"],
    windows: [".exe", ".msi"],
    linux: [".appimage", ".deb", ".rpm"],
  };

  return validAssets.find((asset) => {
    const lower = asset.name.toLowerCase();
    return matchers[os].some((ext) => lower.endsWith(ext));
  });
}

export async function GET() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: {
          revalidate: 600,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to fetch latest CodeBundle release" },
        { status: response.status }
      );
    }

    const release = (await response.json()) as GithubRelease;

    return NextResponse.json({
      version: release.tag_name,
      name: release.name,
      releasePageUrl: release.html_url,
      assets: {
        mac: toReleaseAsset(pickAsset(release.assets, "mac")),
        windows: toReleaseAsset(pickAsset(release.assets, "windows")),
        linux: toReleaseAsset(pickAsset(release.assets, "linux")),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while fetching CodeBundle release" },
      { status: 500 }
    );
  }
}