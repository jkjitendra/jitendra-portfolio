import Header from "@/components/Header";
import Footer from "@/components/Footer";
import projects from "@/data/personal-projects.json";
import caseStudies from "@/data/case-studies.json";
import CompanyCarousel from "@/components/CompanyCarousel";

export default function Home() {
  return (
    <main>
      <Header />

      {/* Hero Section */}
      <section className="container-edge mt-10">
        <h1>Jitendra Kumar Tiwari</h1>
        <p className="mt-3 text-white/80">
          Full-stack · Java · Spring Boot · React · NextJs 
        </p>
      </section>

      <CompanyCarousel />

      {/* Work Experience */}
      <section className="container-edge mt-12 copy">
        <h2>Work Experience</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="card p-5">
            <h3>Cricbuzz Platforms Limited</h3>
            <ul className="mt-3 list-disc pl-5 opacity-90">
              <li>Scala → Spring Boot migration (~3s → ~100ms p95).</li>
              <li>S3 hash-based image retrieval.</li>
              <li>OversGraph API; +25% engagement.</li>
            </ul>
          </div>

          <div className="card p-5">
            <h3>NCSI Technologies Pvt Ltd</h3>
            <ul className="mt-3 list-disc pl-5 opacity-90">
              <li>REST APIs (Spring Boot) + React UIs.</li>
              <li>MFA, RBAC, Maker-Checker, schedulers.</li>
              <li>Spring Cloud Config with DB.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Personal Projects */}
      <section className="container-edge mt-12 copy">
        <h2>Personal Projects</h2>
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

              <div className="mt-4 flex gap-3">
                {p.github && (
                  <a
                    className="badge hover:bg-white/20"
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                )}
                {p.live && (
                  <a
                    className="badge hover:bg-white/20"
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live
                  </a>
                )}
              </div>

              {p.demo && (
                <div className="mt-3 text-xs opacity-80">
                  Demo: <b>{p.demo.username}</b> / <b>{p.demo.password}</b>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section className="container-edge mt-12 copy">
        <h2>Case Studies</h2>
        <ol className="mt-6 space-y-6">
          {caseStudies.map((c) => (
            <li className="card p-5" key={c.title}>
              <h3>{c.title}</h3>

              <p className="mt-2 opacity-90">
                <b>Problem:</b> {c.problem}
              </p>

              <div className="mt-2">
                <p className="opacity-90">
                  <b>Approach:</b>
                </p>
                <ul className="mt-1 list-disc pl-5 opacity-90">
                  {c.approach.map((a: string) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>

              <p className="mt-2 opacity-90">
                <b>Impact:</b> {c.impact}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <Footer />
    </main>
  );
}
