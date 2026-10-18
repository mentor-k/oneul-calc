import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "./site-header";

export function InfoPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <main><SiteHeader /><article className="info-page"><span>{eyebrow}</span><h1>{title}</h1><p className="info-intro">{intro}</p>{children}</article><SiteFooter /></main>;
}
