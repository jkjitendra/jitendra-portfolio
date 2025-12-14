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
  const [status, setStatus] = useState<string>("");

  const handleDownload = async () => {
    // 1. Detect OS
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
      setStatus("Fetching download link...");
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
      setStatus("Download starting...");
      window.location.href = downloadUrl;

      // Reset status after a delay
      setTimeout(() => setStatus(""), 3000);
    } else {
      // Fallback to releases page
      window.location.href = fallbackUrl;
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button onClick={handleDownload} className={className}>
        {children || "Download App"}
      </button>
      {status && <p className="text-xs text-gray-400" id="downloadStatus">{status}</p>}
    </div>
  );
}
