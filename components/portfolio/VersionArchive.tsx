"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { portfolioEditions, type PortfolioEditionSlug } from "@/data/portfolio-versions";

type SortMode = "newest" | "oldest" | "liked" | "visited";
type Metrics = Record<PortfolioEditionSlug, { views: number; likes: number }>;
type LikeState = Record<PortfolioEditionSlug, boolean>;

const initialMetrics = portfolioEditions.reduce((metrics, edition) => {
  metrics[edition.slug] = { views: 0, likes: 0 };
  return metrics;
}, {} as Metrics);

export default function VersionArchive() {
  const [sort, setSort] = useState<SortMode>("newest");
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [liked, setLiked] = useState<LikeState>({} as LikeState);
  const [pendingLike, setPendingLike] = useState<PortfolioEditionSlug | null>(null);

  useEffect(() => {
    let active = true;
    void fetch("/api/portfolio-metrics", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((payload: { metrics?: Metrics; liked?: LikeState } | null) => {
        if (!active || !payload) return;
        if (payload.metrics) setMetrics((current) => ({ ...current, ...payload.metrics }));
        if (payload.liked) setLiked((current) => ({ ...current, ...payload.liked }));
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const editions = useMemo(() => [...portfolioEditions].sort((left, right) => {
    if (sort === "liked") return metrics[right.slug].likes - metrics[left.slug].likes;
    if (sort === "visited") return metrics[right.slug].views - metrics[left.slug].views;
    const byDate = new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
    return sort === "oldest" ? -byDate : byDate;
  }), [metrics, sort]);

  const toggleLike = async (slug: PortfolioEditionSlug) => {
    if (pendingLike) return;
    setPendingLike(slug);
    try {
      const response = await fetch(`/api/portfolio-metrics/${slug}/like`, { method: "POST" });
      if (!response.ok) return;
      const result: { likeCount: number; liked: boolean } = await response.json();
      setMetrics((current) => ({ ...current, [slug]: { ...current[slug], likes: result.likeCount } }));
      setLiked((current) => ({ ...current, [slug]: result.liked }));
    } finally {
      setPendingLike(null);
    }
  };

  return (
    <main className="portfolio-archive">
      <header className="portfolio-archive__header">
        <Link className="portfolio-archive__mark" href="/" aria-label="Return to Jitendra's profile landing page">JK</Link>
        <span>JITENDRA&apos;S ARCHIVE</span>
        <p>PORTFOLIOS · PRESERVED</p>
      </header>
      <section className="portfolio-archive__hero">
        <div aria-hidden="true" className="portfolio-archive__orb" />
        <p className="portfolio-archive__eyebrow">SELECT A PORTFOLIO EDITION</p>
        <h1>The work,<br />in <em>versions.</em></h1>
        <p>Every edition is a time capsule of the work, ideas, and details that shaped that chapter.</p>
      </section>
      <section className="portfolio-archive__list" aria-labelledby="archive-title">
        <div className="portfolio-archive__toolbar">
          <h2 id="archive-title">Archive <span>{portfolioEditions.length} editions</span></h2>
          <label htmlFor="edition-sort">Sort by
            <select id="edition-sort" value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="liked">Most liked</option>
              <option value="visited">Most visited</option>
            </select>
          </label>
        </div>
        <div className="portfolio-archive__grid">
          {editions.map((edition) => (
            <article className="edition-card" key={edition.slug}>
              <div className={`edition-card__art edition-card__art--${edition.artwork}`} aria-hidden="true" />
              <div className="edition-card__content">
                <p>EDITION {edition.year}</p>
                <div className="edition-card__title"><h3>{edition.title}</h3>{edition.isLatest && <span>Latest</span>}</div>
                <p className="edition-card__description">{edition.description}</p>
                <div className="edition-card__footer">
                  <div className="edition-card__metrics">
                    <button type="button" aria-pressed={liked[edition.slug] ?? false} onClick={() => void toggleLike(edition.slug)} disabled={pendingLike === edition.slug}>
                      {liked[edition.slug] ? "♥" : "♡"} {metrics[edition.slug].likes} likes
                    </button>
                    <span>{metrics[edition.slug].views.toLocaleString()} visits</span>
                  </div>
                  <Link href={`/home/${edition.slug}`} aria-label={`Open the ${edition.year} ${edition.title} portfolio`}>Enter <b>→</b></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
