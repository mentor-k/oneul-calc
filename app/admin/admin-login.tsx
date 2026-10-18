"use client";

import { useState } from "react";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!response.ok) {
      setMessage("비밀번호가 올바르지 않습니다.");
      return;
    }
    window.location.href = "/admin/analytics";
  };
  return <main className="admin-login-page">
    <a className="analytics-logo" href="/"><i className="brand-mark" /><b><span>오늘</span>계산</b></a>
    <section className="admin-login-card">
      <span>ADMIN MODE</span>
      <h1>관리자 로그인</h1>
      <p>관리자 비밀번호를 입력해 주세요.</p>
      <form onSubmit={login}>
        <label><span>비밀번호</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus autoComplete="current-password" required /></label>
        <button disabled={loading}>{loading ? "확인 중..." : "관리자 모드 시작"}</button>
        {message && <p className="admin-login-error" role="alert">{message}</p>}
      </form>
      <a href="/">← 오늘계산으로 돌아가기</a>
    </section>
  </main>;
}
