import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

export function GET() {
  const publisherId = (env as unknown as Record<string, string>).ADSENSE_PUBLISHER_ID || "";
  if (!/^ca-pub-\d+$/.test(publisherId)) {
    return new Response("AdSense publisher ID is not configured.", { status: 404 });
  }
  const adsTxtPublisherId = publisherId.replace(/^ca-/, "");
  return new Response(`google.com, ${adsTxtPublisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
