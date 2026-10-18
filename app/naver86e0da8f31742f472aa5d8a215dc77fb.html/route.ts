const VERIFICATION =
  "naver-site-verification: naver86e0da8f31742f472aa5d8a215dc77fb.html";

export function GET() {
  return new Response(VERIFICATION, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
