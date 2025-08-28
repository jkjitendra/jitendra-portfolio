import Header from "@/components/Header";
import Footer from "@/components/Footer";
import radar from "@/data/tech-radar.json";

function Lane({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card p-5">
      <h3>{title}</h3>
      <ul className="mt-3 list-disc pl-5 opacity-90">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}

export default function TechRadar() {
  return (
    <main>
      <Header />

      <section className="container-edge mt-10 copy">
        <h1>Tech Radar</h1>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Lane title="Adopt" items={radar.adopt} />
          <Lane title="Trial" items={radar.trial} />
          <Lane title="Assess" items={radar.assess} />
          <Lane title="Hold" items={radar.hold} />
        </div>
      </section>

      <Footer />
    </main>
  );
}