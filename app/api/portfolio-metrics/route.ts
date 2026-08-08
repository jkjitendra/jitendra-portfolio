import { NextRequest, NextResponse } from "next/server";

import { portfolioEditions, type PortfolioEditionSlug } from "@/data/portfolio-versions";
import { getExistingPortfolioVisitor, getPortfolioMetrics, hashPortfolioVisitor, isMetricsConfigured } from "@/lib/portfolio-metrics";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const visitor = getExistingPortfolioVisitor(request);
    const snapshot = await getPortfolioMetrics(visitor ? hashPortfolioVisitor(visitor) : undefined);
    return NextResponse.json({ ...snapshot, configured: isMetricsConfigured() }, { status: 200 });
  } catch {
    const metrics = Object.fromEntries(
      portfolioEditions.map((edition) => [edition.slug, { views: 0, likes: 0 }]),
    ) as Record<PortfolioEditionSlug, { views: number; likes: number }>;
    const liked = Object.fromEntries(
      portfolioEditions.map((edition) => [edition.slug, false]),
    ) as Record<PortfolioEditionSlug, boolean>;
    return NextResponse.json({ metrics, liked, configured: false }, { status: 200 });
  }
}
