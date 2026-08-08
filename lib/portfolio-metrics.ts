import "server-only";

import { createHash, createHmac, randomUUID, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

import { portfolioEditions, type PortfolioEditionSlug } from "@/data/portfolio-versions";

type MetricCounts = Record<PortfolioEditionSlug, { views: number; likes: number }>;
type LikeState = Record<PortfolioEditionSlug, boolean>;

type D1QueryResult = {
  success?: boolean;
  results?: Array<Record<string, unknown>>;
};

type D1Response = {
  success?: boolean;
  errors?: Array<{ message?: string }>;
  result?: D1QueryResult[];
};

const cloudflareApiUrl = "https://api.cloudflare.com/client/v4";
const visitorCookieName = "portfolio_visitor";

function emptyMetrics(): MetricCounts {
  return Object.fromEntries(portfolioEditions.map((edition) => [edition.slug, { views: 0, likes: 0 }])) as MetricCounts;
}

function emptyLiked(): LikeState {
  return Object.fromEntries(portfolioEditions.map((edition) => [edition.slug, false])) as LikeState;
}

function getD1Configuration() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_D1_API_TOKEN;
  if (!accountId || !databaseId || !apiToken) return null;
  return { accountId, databaseId, apiToken };
}

export function isMetricsConfigured() {
  return Boolean(getD1Configuration());
}

async function d1Query(sql: string, params: string[] = []) {
  const configuration = getD1Configuration();
  if (!configuration) throw new Error("Cloudflare D1 metrics are not configured.");

  const response = await fetch(
    `${cloudflareApiUrl}/accounts/${configuration.accountId}/d1/database/${configuration.databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${configuration.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
      cache: "no-store",
    },
  );
  const payload = await response.json() as D1Response;
  const result = payload.result?.[0];
  if (!response.ok || !payload.success || !result?.success) {
    throw new Error(payload.errors?.[0]?.message ?? "Cloudflare D1 query failed.");
  }
  return result.results ?? [];
}

export async function getPortfolioMetrics(visitorHash?: string) {
  const metrics = emptyMetrics();
  const liked = emptyLiked();
  if (!isMetricsConfigured()) return { metrics, liked };

  const rows = await d1Query(
    `SELECT metrics.edition_slug AS edition_slug, metrics.view_count AS views, COUNT(likes.visitor_hash) AS likes
       FROM portfolio_metrics AS metrics
       LEFT JOIN portfolio_likes AS likes ON likes.edition_slug = metrics.edition_slug AND likes.liked = 1
       GROUP BY metrics.edition_slug, metrics.view_count`,
  );
  for (const row of rows) {
    const slug = row.edition_slug;
    if (typeof slug !== "string" || !portfolioEditions.some((edition) => edition.slug === slug)) continue;
    metrics[slug as PortfolioEditionSlug] = {
      views: Number(row.views) || 0,
      likes: Number(row.likes) || 0,
    };
  }

  if (visitorHash) {
    const likeRows = await d1Query(
      "SELECT edition_slug FROM portfolio_likes WHERE visitor_hash = ? AND liked = 1",
      [visitorHash],
    );
    for (const row of likeRows) {
      const slug = row.edition_slug;
      if (typeof slug === "string" && portfolioEditions.some((edition) => edition.slug === slug)) {
        liked[slug as PortfolioEditionSlug] = true;
      }
    }
  }

  return { metrics, liked };
}

export async function recordPortfolioView(edition: PortfolioEditionSlug) {
  await d1Query(
    "UPDATE portfolio_metrics SET view_count = view_count + 1 WHERE edition_slug = ?",
    [edition],
  );
}

export async function togglePortfolioLike(edition: PortfolioEditionSlug, visitorHash: string) {
  const now = new Date().toISOString();
  const toggleRows = await d1Query(
    `INSERT INTO portfolio_likes (edition_slug, visitor_hash, liked, created_at, updated_at)
       VALUES (?, ?, 1, ?, ?)
       ON CONFLICT(edition_slug, visitor_hash) DO UPDATE SET
         liked = 1 - portfolio_likes.liked,
         updated_at = excluded.updated_at
       RETURNING liked`,
    [edition, visitorHash, now, now],
  );
  const liked = Number(toggleRows[0]?.liked) === 1;
  const countRows = await d1Query(
    "SELECT COUNT(*) AS likes FROM portfolio_likes WHERE edition_slug = ? AND liked = 1",
    [edition],
  );
  return { liked, likeCount: Number(countRows[0]?.likes) || 0 };
}

function getVisitorSignature(visitorId: string) {
  const secret = process.env.PORTFOLIO_METRICS_SECRET;
  if (!secret) return null;
  return createHmac("sha256", secret).update(visitorId).digest("hex");
}

export function getExistingPortfolioVisitor(request: NextRequest) {
  const signedValue = request.cookies.get(visitorCookieName)?.value;
  if (!signedValue) return null;
  const [visitorId, signature] = signedValue.split(".");
  const expectedSignature = visitorId ? getVisitorSignature(visitorId) : null;
  if (!visitorId || !signature || !expectedSignature || signature.length !== expectedSignature.length) return null;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;
  return visitorId;
}

export function getOrCreatePortfolioVisitor(request: NextRequest) {
  const existingVisitor = getExistingPortfolioVisitor(request);
  if (existingVisitor) return { visitorId: existingVisitor, cookie: null };

  const visitorId = randomUUID();
  const signature = getVisitorSignature(visitorId);
  if (!signature) return null;
  return { visitorId, cookie: `${visitorId}.${signature}` };
}

export function hashPortfolioVisitor(visitorId: string) {
  return createHash("sha256").update(visitorId).digest("hex");
}

export function portfolioVisitorCookie() {
  return {
    name: visitorCookieName,
    options: {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
    },
  };
}
