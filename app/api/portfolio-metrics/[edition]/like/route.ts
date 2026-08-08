import { NextRequest, NextResponse } from "next/server";

import { isPortfolioEditionSlug } from "@/data/portfolio-versions";
import { getOrCreatePortfolioVisitor, hashPortfolioVisitor, portfolioVisitorCookie, togglePortfolioLike } from "@/lib/portfolio-metrics";

type RouteContext = { params: Promise<{ edition: string }> };

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { edition } = await params;
  if (!isPortfolioEditionSlug(edition)) return NextResponse.json({ error: "Unknown edition." }, { status: 404 });

  const visitor = getOrCreatePortfolioVisitor(request);
  if (!visitor) return NextResponse.json({ error: "Portfolio likes are not configured." }, { status: 503 });

  try {
    const visitorHash = hashPortfolioVisitor(visitor.visitorId);
    const result = await togglePortfolioLike(edition, visitorHash);
    const response = NextResponse.json(result);
    if (visitor.cookie) {
      const { name, options } = portfolioVisitorCookie();
      response.cookies.set(name, visitor.cookie, options);
    }
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to update this like right now." }, { status: 503 });
  }
}
