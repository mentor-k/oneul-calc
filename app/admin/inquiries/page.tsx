import { requireAdmin } from "@/lib/admin-auth";
import { analyticsDb, ensureAnalyticsSchema } from "@/lib/analytics-db";
import { InquiryManager } from "./inquiry-manager";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  await requireAdmin();
  await ensureAnalyticsSchema();
  const result = await analyticsDb().prepare(`SELECT id, created_at, name, email, inquiry_type,
    message, status, admin_memo FROM inquiries ORDER BY created_at DESC LIMIT 200`).all();
  return <InquiryManager userName="오늘계산 관리자" initialItems={result.results as never[]} />;
}
