"use client";

import { useState } from "react";

type OsType = "mac" | "windows" | "linux" | "unknown";

type ReleaseAsset = {
  name: string;
  url: string;
  size: number;
  downloadCount: number;
};

type LatestReleaseResponse = {
  version: string;
  releasePageUrl: string;
  assets: {
    mac: ReleaseAsset | null;
    windows: ReleaseAsset | null;
    linux: ReleaseAsset | null;
  };
};

type Props = {
  className?: string;
};

function detectOS(): OsType {
  const nav = navigator as Navigator & {
    userAgentData?: {
      platform?: string;
    };
  };

  const platform = (
    nav.userAgentData?.platform ||
    navigator.platform ||
    navigator.userAgent
  ).toLowerCase();

  if (platform.includes("win")) return "windows";
  if (platform.includes("mac")) return "mac";
  if (platform.includes("linux") || platform.includes("x11")) return "linux";

  return "unknown";
}

export default function CodeBundleDownloadButton({ className }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (loading) return;

    setLoading(true);

    try {
      const os = detectOS();
      const response = await fetch("/api/codebundle/latest-release");

      if (!response.ok) {
        throw new Error("Release fetch failed");
      }

      const data = (await response.json()) as LatestReleaseResponse;
      const asset = os === "unknown" ? null : data.assets[os];

      window.location.href = asset?.url ?? data.releasePageUrl;
    } catch {
      window.location.href = "https://github.com/jkjitendra/codebundle/releases/latest";
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className={className}
    >
      {loading ? "Preparing download..." : "Download latest release"}
    </button>
  );
}