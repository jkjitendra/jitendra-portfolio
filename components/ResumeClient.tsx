"use client";

import { useEffect, useState } from "react";

const RESUME_PATH = "/jitendra_resume.pdf";

/**
 * On small/touch devices we trigger a direct download / native viewer.
 * On larger screens we embed the PDF in an iframe.
 */
export default function ResumeClient() {
  const [wantsDownload, setWantsDownload] = useState(false);

  useEffect(() => {
    // "Small" screens or touch devices (phones/tablets)
    const mq = window.matchMedia("(max-width: 1024px), (pointer: coarse)");
    const update = () => setWantsDownload(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!wantsDownload) return;

    // Try to trigger a file download; some mobile browsers will open a viewer instead.
    const a = document.createElement("a");
    a.href = RESUME_PATH;
    a.download = ""; // hint to download when the browser supports it
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Fallback navigate (iOS will just open the PDF viewer)
    window.location.replace(RESUME_PATH);
  }, [wantsDownload]);

  if (wantsDownload) {
    // Simple message while the redirect happens
    return (
      <section className="container-edge py-10">
        <p className="opacity-80">
          Opening your resume… If it doesn’t start,{" "}
          <a href={RESUME_PATH} className="underline">
            tap here
          </a>.
        </p>
      </section>
    );
  }

  // Desktop / large screens: embed
  return (
    <section
      className="resume-main"
      style={{
        padding: 24,
        maxWidth: 1000,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          border: "1px solid #e6e6e6",
          borderRadius: 8,
          overflow: "hidden",
          height: "90vh",
          minHeight: 500,
        }}
      >
        <iframe
          src={RESUME_PATH}
          title="Resume"
          style={{ width: "100%", height: "100%", border: "none" }}
          loading="lazy"
        />
      </div>
    </section>
  );
}