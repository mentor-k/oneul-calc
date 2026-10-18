import { adminCookie } from "@/lib/admin-auth";

export async function POST() {
  const response = Response.json({ ok: true });
  response.headers.append("set-cookie", `${adminCookie.name}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`);
  return response;
}
