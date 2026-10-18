import { isAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { AdminLogin } from "./admin-login";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (await isAdmin()) redirect("/admin/analytics");
  return <AdminLogin />;
}
