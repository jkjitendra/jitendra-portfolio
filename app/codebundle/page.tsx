import Image from "next/image";
import type { Metadata } from "next";
import CodeBundleDownloadButton from "@/components/CodeBundleDownloadButton";

const releaseUrl = process.env.NEXT_PUBLIC_CODEBUNDLE_RELEASE_URL ?? "https://github.com/jkjitendra/codebundle/releases/latest";
const repoUrl = process.env.NEXT_PUBLIC_CODEBUNDLE_REPO_URL ?? "https://github.com/jkjitendra/codebundle";

const points = [
  "Local-first desktop app",
  "No uploads",
  "Built for developers",
  "Excludes common secret/generated files by default",
  "Bundled Python sidecar in packaged builds",
];

export const metadata: Metadata = {
  title: "CodeBundle",
  description: "Bundle selected project files into one AI-ready Markdown or TXT export.",
  alternates: {
    canonical: "https://codebundle.jkjitendra.in",
  },
  openGraph: {
    title: "CodeBundle",
    description: "Bundle selected project files into one AI-ready Markdown or TXT export.",
    url: "https://codebundle.jkjitendra.in",
    images: ["/codebundle/primary_logo.png"],
  },
};

export default function CodeBundlePage() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] text-[#071226]">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-24 sm:px-8 lg:grid-cols-[1fr_420px] lg:gap-16">
        <div className="space-y-8">
          <Image
            src="/codebundle/horizontal_logo.png"
            alt="CodeBundle"
            width={540}
            height={180}
            priority
            className="h-auto w-full max-w-[360px] sm:max-w-[460px]"
          />

          <div className="space-y-5">
            <h1 className="text-5xl font-semibold tracking-normal text-[#06142e] sm:text-6xl">CodeBundle</h1>
            <p className="max-w-2xl text-xl leading-8 text-[#31415f]">
              Bundle selected project files into one AI-ready Markdown or TXT export.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* <a
              href={releaseUrl}
              className="inline-flex min-h-12 items-center rounded-md bg-[#0b5fff] px-5 py-3 font-semibold text-white transition hover:bg-[#084ed0] focus:outline-none focus:ring-2 focus:ring-[#0b5fff]/40"
            >
              Download latest release
            </a> */}
            <CodeBundleDownloadButton
              className="inline-flex min-h-12 items-center rounded-md bg-[#0b5fff] px-5 py-3 font-semibold text-white transition hover:bg-[#084ed0] focus:outline-none focus:ring-2 focus:ring-[#0b5fff]/40 disabled:cursor-not-allowed disabled:opacity-70"
            />
            <a
              href={repoUrl}
              className="inline-flex min-h-12 items-center rounded-md border border-[#c9d4e7] bg-white px-5 py-3 font-semibold text-[#10213f] transition hover:border-[#8ea5c8] focus:outline-none focus:ring-2 focus:ring-[#0b5fff]/30"
            >
              View GitHub repository
            </a>
          </div>

          <ul className="grid max-w-2xl gap-3 pt-2 sm:grid-cols-2">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[15px] leading-6 text-[#263855]">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#11c7ba]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative aspect-square w-full max-w-[380px]">
            <Image
              src="/codebundle/primary_logo.png"
              alt="CodeBundle app logo"
              fill
              priority
              sizes="(max-width: 1024px) 80vw, 380px"
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
