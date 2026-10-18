import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "오늘계산 — 생활 계산기",
    short_name: "오늘계산",
    description: "오늘 필요한 생활 계산을 쉽고 빠르게 해결하세요.",
    start_url: "/",
    display: "standalone",
    background_color: "#fcfcf8",
    theme_color: "#176b4d",
    lang: "ko",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
