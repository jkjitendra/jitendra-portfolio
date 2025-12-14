import Header from "@/components/Header";
import Footer from "@/components/Footer";
import projects from "@/data/personal-projects.json";
import SmartDownloadButton from "@/components/SmartDownloadButton";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Jitendra",
  description: "A showcase of my personal projects, case studies, and open source contributions.",
};


async function getMazeSolverRelease() {
  try {
    const res = await fetch(
      "https://api.github.com/repos/jkjitendra/MazeSolver/releases/latest",
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch MazeSolver release:", error);
    return null;
  }
}

export default async function ProjectsPage() {
  const releaseData = await getMazeSolverRelease();

  let windowsUrl = "";
  let macUrl = "";
  let linuxUrl = "";

  if (releaseData && releaseData.assets) {
    const winAsset = releaseData.assets.find((a: any) => a.name.endsWith(".msi"));
    const macAsset = releaseData.assets.find((a: any) => a.name.endsWith(".dmg"));
    const linuxAsset = releaseData.assets.find((a: any) => a.name.endsWith(".deb"));

    if (winAsset) windowsUrl = winAsset.browser_download_url;
    if (macAsset) macUrl = macAsset.browser_download_url;
    if (linuxAsset) linuxUrl = linuxAsset.browser_download_url;
  }

  return (
    <main className="page-glow min-h-screen flex flex-col">
      <Header />

      <section className="container-edge mt-10 copy">
        <h1>Projects</h1>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <div className="card p-5" key={p.name}>
              <h3>{p.name}</h3>
              <p className="mt-2 opacity-90">{p.description}</p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {p.tech.map((t: string) => (
                  <span className="badge" key={t}>{t}</span>
                ))}
              </div>

              {p.demo.username && (
                <div className="mt-3 text-xs opacity-80">
                  Demo: <b>{p.demo?.username}</b> / <b>{p.demo?.password}</b>
                </div>
              )}

              <div className="mt-4 flex gap-3 text-sm">
                {p.github && (
                  <a
                    className="btn btn-sm btn-ghost hover:bg-blue-600 hover:text-white"
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                )}
                {p.live && !p.name.includes("MazeSolver") && (
                  <a
                    className="btn"
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live
                  </a>
                )}
                {p.live.includes("MazeSolver") && (
                  <>
                    <SmartDownloadButton
                      windowsUrl={windowsUrl}
                      macUrl={macUrl}
                      linuxUrl={linuxUrl}
                      fallbackUrl={p.live}
                      className="btn"
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <br />
      <Footer />
    </main>
  );
}