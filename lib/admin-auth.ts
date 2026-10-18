import { env } from "cloudflare:workers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "oneulcalc_admin";
const encoder = new TextEncoder();

function secret() {
  return (env as unknown as Record<string, string>).ADMIN_SESSION_SECRET || "";
}

async function signature(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function createAdminToken() {
  const payload = String(Math.floor(Date.now() / 1000) + 60 * 60 * 12);
  return `${payload}.${await signature(payload)}`;
}

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token || !secret()) return false;
  const [expires, provided] = token.split(".");
  if (!expires || !provided || Number(expires) < Date.now() / 1000) return false;
  const expected = await signature(expires);
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let index = 0; index < provided.length; index++) {
    diff |= provided.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return diff === 0;
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin");
}

export const adminCookie = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 12,
  },
};
