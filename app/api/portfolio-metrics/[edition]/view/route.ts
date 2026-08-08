import { NextResponse } from "next/server";

import { isPortfolioEditionSlug } from "@/data/portfolio-versions";
import { recordPortfolioView } from "@/lib/portfolio-metrics";

type RouteContext = { params: Promise<{ edition: string }> };

export const dynamic = "force-dynamic";

export async function POST(_: Request, { params }: RouteContext) {
  const { edition } = await params;
  if (!isPortfolioEditionSlug(edition)) return NextResponse.json({ error: "Unknown edition." }, { status: 404 });

  try {
    await recordPortfolioView(edition);
  } catch {
    return NextResponse.json({ recorded: false }, { status: 200 });
  }

  return NextResponse.json({ recorded: true }, { status: 200 });
}
