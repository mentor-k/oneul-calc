"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminSidebar } from "../admin-sidebar";

type Inquiry = {
  id: number; created_at: string; name: string; email: string; inquiry_type: string;
  message: string; status: "new" | "checking" | "done"; admin_memo: string;
};
const statusLabel = { new: "신규", checking: "확인 중", done: "답변 완료" };

export function InquiryManager({ userName, initialItems }: { userName: string; initialItems: Inquiry[] }) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState("all");
  const shown = useMemo(() => filter === "all" ? items : items.filter((item) => item.status === filter), [items, filter]);
  const update = async (id: number, status: Inquiry["status"], memo: string) => {
    const response = await fetch("/api/inquiries", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, status, memo }) });
    if (response.ok) setItems((current) => current.map((item) => item.id === id ? { ...item, status, admin_memo: memo } : item));
  };
  return <main className="analytics-shell">
    <AdminSidebar active="inquiries" />
    <section className="analytics-main">
      <header className="analytics-header"><div><span>INQUIRY MANAGER</span><h1>상담문의 관리</h1><p>접수된 문의를 확인하고 답변 상태를 관리하세요.</p></div><div className="analytics-header-actions"><Link className="history-top-link" href="/admin/history">사이트 개발 및 수정 이력 <b>→</b></Link><div className="analytics-user">{userName}<small>관리자</small></div></div></header>
      <div className="inquiry-summary"><strong>전체 {items.length}</strong><span>신규 {items.filter((i) => i.status === "new").length}</span><span>확인 중 {items.filter((i) => i.status === "checking").length}</span><span>완료 {items.filter((i) => i.status === "done").length}</span></div>
      <div className="inquiry-filters">{(["all", "new", "checking", "done"] as const).map((value) => <button className={filter === value ? "active" : ""} onClick={() => setFilter(value)} key={value}>{value === "all" ? "전체" : statusLabel[value]}</button>)}</div>
      <section className="inquiry-list">{shown.length ? shown.map((item) => <InquiryCard item={item} onUpdate={update} key={item.id} />) : <div className="inquiry-empty">해당 상태의 문의가 없습니다.</div>}</section>
    </section>
  </main>;
}

function InquiryCard({ item, onUpdate }: { item: Inquiry; onUpdate: (id: number, status: Inquiry["status"], memo: string) => Promise<void> }) {
  const [status, setStatus] = useState(item.status);
  const [memo, setMemo] = useState(item.admin_memo);
  const [saved, setSaved] = useState(false);
  const save = async () => { await onUpdate(item.id, status, memo); setSaved(true); window.setTimeout(() => setSaved(false), 1300); };
  const subject = encodeURIComponent(`[오늘계산 답변] ${item.inquiry_type}`);
  return <article className={`inquiry-card status-${item.status}`}>
    <div className="inquiry-card-head"><div><span>{item.inquiry_type}</span><h2>{item.name}</h2><a href={`mailto:${item.email}?subject=${subject}`}>{item.email}</a></div><time>{new Date(item.created_at).toLocaleString("ko-KR")}</time></div>
    <p className="inquiry-message">{item.message}</p>
    <div className="inquiry-actions"><label>처리 상태<select value={status} onChange={(e) => setStatus(e.target.value as Inquiry["status"])}><option value="new">신규</option><option value="checking">확인 중</option><option value="done">답변 완료</option></select></label><label className="memo">관리자 메모<input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="처리 내용이나 참고 메모" /></label><a className="reply" href={`mailto:${item.email}?subject=${subject}`}>이메일 답장</a><button onClick={save}>{saved ? "저장됨" : "변경 저장"}</button></div>
  </article>;
}
