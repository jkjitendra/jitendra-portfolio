CREATE TABLE IF NOT EXISTS portfolio_metrics (
  edition_slug TEXT PRIMARY KEY,
  view_count INTEGER NOT NULL DEFAULT 0 CHECK (view_count >= 0)
);

CREATE TABLE IF NOT EXISTS portfolio_likes (
  edition_slug TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  liked INTEGER NOT NULL DEFAULT 1 CHECK (liked IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (edition_slug, visitor_hash),
  FOREIGN KEY (edition_slug) REFERENCES portfolio_metrics(edition_slug) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS portfolio_likes_by_visitor
  ON portfolio_likes(visitor_hash);

INSERT OR IGNORE INTO portfolio_metrics (edition_slug) VALUES
  ('2026-current'),
  ('2025-classic');
