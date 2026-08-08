export const PORTFOLIO_EDITION_SLUGS = ["2026-current", "2025-classic"] as const;

export type PortfolioEditionSlug = (typeof PORTFOLIO_EDITION_SLUGS)[number];

export type PortfolioEdition = {
  slug: PortfolioEditionSlug;
  year: string;
  title: string;
  description: string;
  publishedAt: string;
  renderer: "current" | "classic";
  artwork: "current" | "classic";
  isLatest?: boolean;
};

export const portfolioEditions: readonly PortfolioEdition[] = [
  {
    slug: "2026-current",
    year: "2026",
    title: "Current",
    description: "An immersive portfolio of current work, ideas, and engineering craft.",
    publishedAt: "2026-08-08",
    renderer: "current",
    artwork: "current",
    isLatest: true,
  },
  {
    slug: "2025-classic",
    year: "2025",
    title: "Classic",
    description: "The original portfolio experience, preserved as it was before the redesign.",
    publishedAt: "2025-11-26",
    renderer: "classic",
    artwork: "classic",
  },
];

export function isPortfolioEditionSlug(value: string): value is PortfolioEditionSlug {
  return PORTFOLIO_EDITION_SLUGS.includes(value as PortfolioEditionSlug);
}

export function getPortfolioEdition(slug: string): PortfolioEdition | undefined {
  return portfolioEditions.find((edition) => edition.slug === slug);
}
