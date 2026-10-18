"use client";

import Link from "next/link";

type AdminSection = "analytics" | "inquiries" | "history";

export function AdminSidebar({ active }: { active: AdminSection }) {
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/";
  };

  return <aside className="analytics-side">
    <Link className="analytics-logo" href="/"><i className="brand-mark" /><b><span>오늘</span>계산</b></Link>
    <p>관리자</p>
    <Link className={active === "analytics" ? "active" : ""} href="/admin/analytics">방문자 분석</Link>
    <Link className={active === "inquiries" ? "active" : ""} href="/admin/inquiries">상담문의 관리</Link>
    <Link className={active === "history" ? "active" : ""} href="/admin/history">사이트 개발 및 수정 이력</Link>
    <Link href="/">사이트 보기</Link>
    <button className="admin-logout" onClick={logout}>로그아웃</button>
  </aside>;
}
