import Header from "@/components/Header";
import Footer from "@/components/Footer";
import projects from "@/data/personal-projects.json";

export default function ProjectsPage() {
  return (
    <main className="page-glow">
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

              {p.demo && (
                <div className="mt-3 text-xs opacity-80">
                  Demo: <b>{p.demo.username}</b> / <b>{p.demo.password}</b>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}