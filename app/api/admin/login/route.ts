import { env } from "cloudflare:workers";
import { adminCookie, createAdminToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const input = (await request.json()) as { password?: string };
  const expected = (env as unknown as Record<string, string>).ADMIN_PASSWORD || "";
  if (!expected || input.password !== expected) {
    return Response.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }
  const response = Response.json({ ok: true });
  response.headers.append("set-cookie", `${adminCookie.name}=${await createAdminToken()}; Path=/; Max-Age=${adminCookie.options.maxAge}; HttpOnly; Secure; SameSite=Lax`);
  return response;
}
