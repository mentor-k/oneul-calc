// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const pageViews = sqliteTable(
  "page_views",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    viewedAt: text("viewed_at").notNull(),
    day: text("day").notNull(),
    visitorId: text("visitor_id").notNull(),
    sessionId: text("session_id").notNull(),
    path: text("path").notNull(),
    referrerHost: text("referrer_host").notNull().default("직접 방문"),
    device: text("device").notNull(),
    browser: text("browser").notNull(),
    country: text("country"),
    clientViewId: text("client_view_id"),
    durationSeconds: integer("duration_seconds").notNull().default(0),
    engaged: integer("engaged", { mode: "boolean" }).notNull().default(false),
  },
  (table) => [
    index("page_views_day_idx").on(table.day),
    index("page_views_path_idx").on(table.path),
    index("page_views_visitor_idx").on(table.visitorId),
  ],
);

export const analyticsEvents = sqliteTable(
  "analytics_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    occurredAt: text("occurred_at").notNull(),
    day: text("day").notNull(),
    visitorId: text("visitor_id").notNull(),
    sessionId: text("session_id").notNull(),
    path: text("path").notNull(),
    category: text("category").notNull(),
    action: text("action").notNull(),
    label: text("label").notNull().default(""),
  },
  (table) => [
    index("analytics_events_day_idx").on(table.day),
    index("analytics_events_action_idx").on(table.action),
  ],
);

export const inquiries = sqliteTable(
  "inquiries",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    createdAt: text("created_at").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    inquiryType: text("inquiry_type").notNull(),
    message: text("message").notNull(),
    status: text("status").notNull().default("new"),
    adminMemo: text("admin_memo").notNull().default(""),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    index("inquiries_created_idx").on(table.createdAt),
    index("inquiries_status_idx").on(table.status),
  ],
);

export const developmentHistory = sqliteTable(
  "development_history",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    releaseKey: text("release_key").notNull().unique(),
    occurredAt: text("occurred_at").notNull(),
    category: text("category").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    source: text("source").notNull().default("automatic"),
  },
  (table) => [
    index("development_history_occurred_idx").on(table.occurredAt),
    index("development_history_category_idx").on(table.category),
  ],
);
