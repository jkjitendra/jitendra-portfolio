import Header from "@/components/Header";
import Footer from "@/components/Footer";
import testimonials from "@/data/testimonials.json";


export default function TestimonialsPage() {
  return (
    <main className="page-glow">
      <Header />

      <section className="container-edge mt-10 copy">
        <h1>Testimonials</h1>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <div className="card p-5" key={t.quote}>
              <p className="italic opacity-90">“{t.quote}”</p>
              <p className="mt-3 text-xs opacity-80">— {t.author}, {t.role}</p>

              {t.sourceUrl && (
                <a
                  className="badge mt-3 inline-block hover:bg-white/20"
                  href={t.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}