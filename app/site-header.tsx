export function SiteHeader() {
  return <header>
    <a className="brand" href="/" aria-label="오늘계산 홈"><i className="brand-mark" aria-hidden="true" /><b><span>오늘</span>계산</b></a>
    <nav><a href="/#tools">계산기</a><a href="/about">서비스 소개</a><a href="/editorial-policy">콘텐츠 원칙</a><a href="/contact">문의</a></nav>
    <div className="header-actions"><a className="admin-login" href="/admin" aria-label="관리자 로그인" title="관리자 로그인">♙</a></div>
  </header>;
}

export function SiteFooter() {
  return <footer className="simple-footer">
    <div><a className="brand" href="/"><i className="brand-mark" aria-hidden="true" /><b><span>오늘</span>계산</b></a><p>생활 속 복잡한 계산을 쉽고 빠르게 이해할 수 있도록 돕습니다.</p></div>
    <nav><a href="/about">운영자·서비스 소개</a><a href="/editorial-policy">콘텐츠 작성 원칙</a><a href="/privacy">개인정보처리방침</a><a href="/terms">이용약관</a><a href="/contact">문의·오류 제보</a></nav>
    <small>© 2026 오늘계산. 계산 결과는 참고용이며 중요한 결정 전 관계 기관의 최신 기준을 확인하세요.</small>
  </footer>;
}
