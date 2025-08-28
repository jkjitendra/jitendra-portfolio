import Header from "@/components/Header";
import type { Metadata } from "next";
import ResumeClient from "@/components/ResumeClient";

export const metadata: Metadata = {
  title: "Resume | Jitendra Portfolio",
  description: "View and download Jitendra’s resume as a PDF.",
};

export default function ResumePage() {
  return (
    <main>
      <Header />
      <ResumeClient />
      {/* Optional <noscript> fallback */}
      <noscript>
        <p className="container-edge py-6">
          JavaScript is disabled. You can{" "}
          <a href="/jitendra_resume.pdf" className="underline">
            download the resume here
          </a>.
        </p>
      </noscript>
    </main>
  );
}