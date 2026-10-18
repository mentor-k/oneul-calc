import { env } from "cloudflare:workers";

let ready: Promise<void> | null = null;

export function analyticsDb(): D1Database {
  if (!env.DB) throw new Error("DB binding is unavailable");
  return env.DB;
}

export function ensureAnalyticsSchema() {
  if (!ready) {
    const db = analyticsDb();
    ready = db
      .batch([
        db.prepare(`CREATE TABLE IF NOT EXISTS page_views (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          viewed_at TEXT NOT NULL,
          day TEXT NOT NULL,
          visitor_id TEXT NOT NULL,
          session_id TEXT NOT NULL,
          path TEXT NOT NULL,
          referrer_host TEXT NOT NULL DEFAULT '직접 방문',
          device TEXT NOT NULL,
          browser TEXT NOT NULL,
          country TEXT
        )`),
        db.prepare("CREATE INDEX IF NOT EXISTS page_views_day_idx ON page_views(day)"),
        db.prepare("CREATE INDEX IF NOT EXISTS page_views_path_idx ON page_views(path)"),
        db.prepare("CREATE INDEX IF NOT EXISTS page_views_visitor_idx ON page_views(visitor_id)"),
        db.prepare(`CREATE TABLE IF NOT EXISTS inquiries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          created_at TEXT NOT NULL,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          inquiry_type TEXT NOT NULL,
          message TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'new',
          admin_memo TEXT NOT NULL DEFAULT '',
          updated_at TEXT NOT NULL
        )`),
        db.prepare("CREATE INDEX IF NOT EXISTS inquiries_created_idx ON inquiries(created_at)"),
        db.prepare("CREATE INDEX IF NOT EXISTS inquiries_status_idx ON inquiries(status)"),
        db.prepare(`CREATE TABLE IF NOT EXISTS analytics_events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          occurred_at TEXT NOT NULL,
          day TEXT NOT NULL,
          visitor_id TEXT NOT NULL,
          session_id TEXT NOT NULL,
          path TEXT NOT NULL,
          category TEXT NOT NULL,
          action TEXT NOT NULL,
          label TEXT NOT NULL DEFAULT ''
        )`),
        db.prepare("CREATE INDEX IF NOT EXISTS analytics_events_day_idx ON analytics_events(day)"),
        db.prepare("CREATE INDEX IF NOT EXISTS analytics_events_action_idx ON analytics_events(action)"),
      ])
      .then(() => undefined);
  }
  return ready;
}
