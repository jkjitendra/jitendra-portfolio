"use client";

type T = { quote: string; author: string; role?: string };

export default function TestimonialMarquee({ items }: { items: T[] }) {
  // Render two copies for seamless loop
  const Row = () => (
    <div className="flex shrink-0 gap-8 pr-8">
      {items.map((t, i) => (
        <div
          key={i}
          className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm"
          title={t.role ? `${t.author} — ${t.role}` : t.author}
        >
          <b className="mr-2">{t.quote}</b> — {t.author}
        </div>
      ))}
    </div>
  );

  return (
    <section className="mt-16 border-y border-white/10 py-6 [mask-image:linear-gradient(90deg,transparent,black 10%,black 90%,transparent)]">
      <div className="relative overflow-hidden">
        <div className="marquee inline-flex w-max animate-marquee will-change-transform">
          <Row />
          <Row />
        </div>
      </div>
    </section>
  );
}