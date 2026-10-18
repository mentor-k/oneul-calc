import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VisitorTracker } from "./visitor-tracker";
import { env } from "cloudflare:workers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oneulcalc.kr"),
  verification: { google: "L9E7jQyldOxWmi61XIudBjHIZTUpVnhyQ8fLMEGIZ3s" },
  title: {
    default: "오늘계산 — 생활 계산기",
    template: "%s | 오늘계산",
  },
  description: "날짜, 할인, 글자 수, 만 나이, 시급·월급, 대출이자, 평수, 주유비와 BMI를 쉽고 빠르게 계산하세요.",
  alternates: { canonical: "/" },
  authors: [{ name: "DRAGON HAN", url: "/about" }],
  creator: "오늘계산",
  publisher: "오늘계산",
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "오늘계산",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "오늘계산",
    description: "오늘 필요한 계산, 바로 끝내세요.",
    url: "https://oneulcalc.kr/",
    siteName: "오늘계산",
    images: [{ url: "/og-oneulcalc-20260730.png", width: 1536, height: 1024, alt: "오늘계산 생활 계산기" }],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "오늘계산",
    description: "오늘 필요한 계산, 바로 끝내세요.",
    images: ["/og-oneulcalc-20260730.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icon-32.png",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#176b4d",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publisherId = (env as unknown as Record<string, string>).ADSENSE_PUBLISHER_ID || "";
  return (
    <html lang="ko">
      <head>
        <meta name="naver-site-verification" content="599275f13406fcb4e9b92326cfedfd45cbfc7f49" />
        {publisherId && <meta name="google-adsense-account" content={publisherId} />}
        {publisherId && <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(publisherId)}`} crossOrigin="anonymous" />}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "오늘계산",
          url: "https://oneulcalc.kr",
          description: "생활 속 날짜, 금액, 급여, 금융과 건강 계산을 돕는 무료 계산기 서비스",
          publisher: { "@type": "Person", name: "DRAGON HAN" },
        }) }} />
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
