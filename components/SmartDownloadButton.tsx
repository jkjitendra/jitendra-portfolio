"use client";

import React, { useState } from "react";

interface SmartDownloadButtonProps {
  windowsUrl?: string;
  macUrl?: string;
  linuxUrl?: string;
  fallbackUrl: string;
  className?: string;
  children?: React.ReactNode;
}

export default function SmartDownloadButton({
  windowsUrl,
  macUrl,
  linuxUrl,
  fallbackUrl,
  className,
  children,
}: SmartDownloadButtonProps): React.JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const handleDownload = async (e: React.MouseEvent) => {
    // Prevent multiple clicks
    if (status !== "idle") return;

    // 1. Detect OS
    setStatus("loading");

    // Small delay to show feedback if it happens too fast
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log("User windowsUrl:", windowsUrl);
    console.log("User macUrl:", macUrl);
    console.log("User linuxUrl:", linuxUrl);

    const userAgent = window.navigator.userAgent.toLowerCase();
    let downloadUrl = "";
    let osType: "win" | "mac" | "linux" | null = null;

    if (userAgent.indexOf("win") !== -1) {
      downloadUrl = windowsUrl || "";
      osType = "win";
    } else if (userAgent.indexOf("mac") !== -1) {
      downloadUrl = macUrl || "";
      osType = "mac";
    } else if (userAgent.indexOf("linux") !== -1) {
      downloadUrl = linuxUrl || "";
      osType = "linux";
    }

    // 2. If no direct URL, try fetching from GitHub releases API (client-side fallback)
    if (!downloadUrl && fallbackUrl.includes("github.com") && fallbackUrl.includes("releases")) {
      try {
        // Extract owner/repo from fallback URL
        const match = fallbackUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (match) {
          const [, owner, repo] = match;
          const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
          if (res.ok) {
            const data = await res.json();
            if (data.assets) {
              const extMap = { win: ".msi", mac: ".dmg", linux: ".deb" };
              const ext = osType ? extMap[osType] : null;
              const asset = ext ? data.assets.find((a: any) => a.name.endsWith(ext)) : null;
              if (asset) {
                downloadUrl = asset.browser_download_url;
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch release:", error);
      }
    }

    // 3. Redirect
    if (downloadUrl) {
      // Give UI a moment to show "Downloading" before redirect takes over
      setTimeout(() => {
        window.location.href = downloadUrl;

        // Reset state when user focuses window (e.g. after closing valid/cancel dialog)
        const onFocus = () => {
          setStatus("idle");
          window.removeEventListener("focus", onFocus);
        };
        window.addEventListener("focus", onFocus);

        // Fallback reset timer in case focus event doesn't fire or happens too fast
        setTimeout(() => {
          setStatus("idle");
          window.removeEventListener("focus", onFocus);
        }, 5000); // Increased slightly to prioritize focus event but ensure eventual reset
      }, 600);
    } else {
      // Fallback to releases page
      window.location.href = fallbackUrl;
      setStatus("idle");
    }
  };

  const getButtonContent = () => {
    if (status === "loading") {
      return (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Downloading App...
        </span>
      );
    }
    return children || "Download App";
  };

  return (
    <button
      onClick={handleDownload}
      className={className}
      disabled={status !== "idle"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {getButtonContent()}
    </button>
  );
}
