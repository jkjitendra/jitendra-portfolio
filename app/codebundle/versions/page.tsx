import type { Metadata } from "next";

// ---------------------------------------------------------------------------
// Types for the GitHub Releases API response
// ---------------------------------------------------------------------------

type GitHubAsset = {
  name: string;
  browser_download_url: string;
};

type GitHubRelease = {
  tag_name: string;
  published_at: string;
  html_url: string;
  assets: GitHubAsset[];
};

// ---------------------------------------------------------------------------
// Types for our processed release data
// ---------------------------------------------------------------------------

type OsAsset = {
  name: string;
  url: string;
};

type ProcessedRelease = {
  version: string;
  releaseUrl: string;
  publishedAt: string;
  mac: OsAsset | null;
  windows: OsAsset | null;
  linux: OsAsset | null;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const IGNORED_EXTENSIONS = [
  ".blockmap",
  ".yml",
  ".yaml",
  ".json",
  ".sha256",
  ".sha512",
  ".sig",
];

function isIgnoredAsset(name: string): boolean {
  const lower = name.toLowerCase();
  return IGNORED_EXTENSIONS.some((ext) => lower.endsWith(ext)) || lower.includes("blockmap");
}

const OS_EXTENSIONS: Record<"mac" | "windows" | "linux", string[]> = {
  mac: [".dmg", ".pkg"],
  windows: [".exe", ".msi"],
  linux: [".appimage", ".deb", ".rpm"],
};

function pickOsAsset(assets: GitHubAsset[], os: "mac" | "windows" | "linux"): OsAsset | null {
  const match = assets
    .filter((a) => !isIgnoredAsset(a.name))
    .find((a) => {
      const lower = a.name.toLowerCase();
      return OS_EXTENSIONS[os].some((ext) => lower.endsWith(ext));
    });

  if (!match) return null;
  return { name: match.name, url: match.browser_download_url };
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function fetchReleases(): Promise<ProcessedRelease[] | null> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/jkjitendra/codebundle/releases",
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 600 },
      },
    );

    if (!response.ok) return null;

    const releases = (await response.json()) as GitHubRelease[];

    return releases
      .filter((r) => !r.tag_name.includes("draft"))
      .map((r) => ({
        version: r.tag_name,
        releaseUrl: r.html_url,
        publishedAt: r.published_at,
        mac: pickOsAsset(r.assets, "mac"),
        windows: pickOsAsset(r.assets, "windows"),
        linux: pickOsAsset(r.assets, "linux"),
      }));
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "CodeBundle — All Versions",
  description: "Download any version of CodeBundle for macOS, Windows, or Linux.",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CodeBundleVersionsPage() {
  const releases = await fetchReleases();

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-[#071226]">
      <section className="mx-auto w-full max-w-5xl px-5 pb-20 pt-28 sm:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#06142e] sm:text-4xl">
              CodeBundle Versions
            </h1>
            <p className="mt-2 text-[#31415f]">
              Download any release for macOS, Windows, or Linux.
            </p>
          </div>
        </div>

        {/* Error state */}
        {!releases && (
          <div className="rounded-xl border border-[#e2e8f0] bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-lg text-[#31415f]">
              Unable to load CodeBundle versions right now. Please try again later.
            </p>
          </div>
        )}

        {/* Empty state */}
        {releases && releases.length === 0 && (
          <div className="rounded-xl border border-[#e2e8f0] bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-lg text-[#31415f]">No releases found.</p>
          </div>
        )}

        {/* Desktop table view */}
        {releases && releases.length > 0 && (
          <>
            <div className="hidden overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f0f4f8]">
                    <th className="px-6 py-4 font-semibold text-[#06142e]">Version</th>
                    <th className="px-6 py-4 font-semibold text-[#06142e]">macOS</th>
                    <th className="px-6 py-4 font-semibold text-[#06142e]">Windows</th>
                    <th className="px-6 py-4 font-semibold text-[#06142e]">Linux</th>
                    <th className="px-6 py-4 font-semibold text-[#06142e]">Release Date</th>
                  </tr>
                </thead>
                <tbody>
                  {releases.map((release, index) => (
                    <tr
                      key={release.version}
                      className={
                        index % 2 === 0
                          ? "border-b border-[#e2e8f0]"
                          : "border-b border-[#e2e8f0] bg-[#f9fafb]"
                      }
                    >
                      <td className="px-6 py-4">
                        <a
                          href={release.releaseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#0b5fff] transition hover:underline"
                        >
                          {release.version}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <DownloadCell asset={release.mac} label="macOS" />
                      </td>
                      <td className="px-6 py-4">
                        <DownloadCell asset={release.windows} label="Windows" />
                      </td>
                      <td className="px-6 py-4">
                        <DownloadCell asset={release.linux} label="Linux" />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-[#31415f]">
                        {formatDate(release.publishedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="flex flex-col gap-4 md:hidden">
              {releases.map((release) => (
                <div
                  key={release.version}
                  className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <a
                      href={release.releaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-[#0b5fff] transition hover:underline"
                    >
                      {release.version}
                    </a>
                    <span className="text-sm text-[#31415f]">
                      {formatDate(release.publishedAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <DownloadButton asset={release.mac} label="macOS" />
                    <DownloadButton asset={release.windows} label="Windows" />
                    <DownloadButton asset={release.linux} label="Linux" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Renders a download link or "Not available" inside a table cell. */
function DownloadCell({ asset, label }: { asset: OsAsset | null; label: string }) {
  if (!asset) {
    return <span className="text-[#94a3b8]">Not available</span>;
  }

  return (
    <a
      href={asset.url}
      className="inline-flex items-center gap-1.5 rounded-md bg-[#0b5fff] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#084ed0] focus:outline-none focus:ring-2 focus:ring-[#0b5fff]/40"
    >
      <DownloadIcon />
      Download {label}
    </a>
  );
}

/** Renders a download button for mobile cards, or a disabled state if not available. */
function DownloadButton({ asset, label }: { asset: OsAsset | null; label: string }) {
  if (!asset) {
    return (
      <span className="inline-flex items-center rounded-md border border-[#e2e8f0] px-3 py-1.5 text-xs text-[#94a3b8]">
        {label} — Not available
      </span>
    );
  }

  return (
    <a
      href={asset.url}
      className="inline-flex items-center gap-1.5 rounded-md bg-[#0b5fff] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#084ed0] focus:outline-none focus:ring-2 focus:ring-[#0b5fff]/40"
    >
      <DownloadIcon />
      {label}
    </a>
  );
}

/** Small download arrow icon. */
function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
