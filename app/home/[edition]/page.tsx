import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EditionViewTracker from "@/components/portfolio/EditionViewTracker";
import PortfolioExperience from "@/components/portfolio/PortfolioExperience";
import ClassicPortfolioExperience from "@/components/portfolio/classic/ClassicPortfolioExperience";
import { getPortfolioEdition, isPortfolioEditionSlug, portfolioEditions } from "@/data/portfolio-versions";

type PageProps = { params: Promise<{ edition: string }> };

export function generateStaticParams() {
  return portfolioEditions.map(({ slug }) => ({ edition: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { edition: slug } = await params;
  const edition = getPortfolioEdition(slug);
  if (!edition) return {};

  return {
    title: `${edition.year} ${edition.title} · Jitendra Portfolio`,
    description: edition.description,
    alternates: { canonical: `https://www.jkjitendra.in/home/${edition.slug}` },
    robots: edition.renderer === "classic" ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function EditionPage({ params }: PageProps) {
  const { edition: slug } = await params;
  if (!isPortfolioEditionSlug(slug)) notFound();
  const edition = getPortfolioEdition(slug);
  if (!edition) notFound();

  return (
    <>
      <EditionViewTracker edition={edition.slug} />
      {edition.renderer === "current" ? <PortfolioExperience /> : <ClassicPortfolioExperience />}
    </>
  );
}
