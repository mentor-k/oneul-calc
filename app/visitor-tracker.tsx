"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const randomId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    let visitorId = localStorage.getItem("oneulcalc_visitor");
    if (!visitorId) {
      visitorId = randomId();
      localStorage.setItem("oneulcalc_visitor", visitorId);
    }

    let sessionId = sessionStorage.getItem("oneulcalc_session");
    if (!sessionId) {
      sessionId = randomId();
      sessionStorage.setItem("oneulcalc_session", sessionId);
    }

    const viewId = randomId();
    const startedAt = Date.now();
    let calculatorUsed = false;
    const base = {
      path: pathname,
      visitorId,
      sessionId,
    };
    const send = (payload: Record<string, unknown>) => {
      const body = JSON.stringify({ ...base, ...payload });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics/collect", new Blob([body], { type: "application/json" }));
      } else {
        void fetch("/api/analytics/collect", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body,
          keepalive: true,
        });
      }
    };

    send({
      type: "pageview",
      viewId,
      referrer: document.referrer,
      width: window.innerWidth,
    });

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a,button") : null;
      if (!target) return;
      const label = (target.textContent || target.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 100);
      if (!label) return;
      const href = target instanceof HTMLAnchorElement ? target.getAttribute("href") || "" : "";
      const action = href.includes("#contact") ? "contact_open" : href.startsWith("/") ? "menu_click" : target.classList.contains("share-button") || target.classList.contains("tool-share") ? "share" : "button_click";
      send({ type: "event", category: "interaction", action, label });
    };
    const onChange = (event: Event) => {
      if (calculatorUsed || !(event.target instanceof Element) || !event.target.closest(".calculator")) return;
      calculatorUsed = true;
      send({ type: "event", category: "service", action: "calculator_use", label: pathname === "/" ? "메인" : decodeURIComponent(pathname.slice(1)) });
    };
    const finish = () => send({
      type: "engagement",
      viewId,
      duration: Math.min(Math.round((Date.now() - startedAt) / 1000), 1800),
    });
    document.addEventListener("click", onClick);
    document.addEventListener("change", onChange);
    window.addEventListener("pagehide", finish, { once: true });
    return () => {
      finish();
      document.removeEventListener("click", onClick);
      document.removeEventListener("change", onChange);
      window.removeEventListener("pagehide", finish);
    };
  }, [pathname]);

  return null;
}
