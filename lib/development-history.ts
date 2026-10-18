import { generatedBuild } from "@/app/generated-build";
import { analyticsDb } from "./analytics-db";

let historyReady: Promise<void> | null = null;

const initialHistory = [
  {
    key: "2026-07-25-planning",
    occurredAt: "2026-07-25T00:00:00.000Z",
    category: "기획",
    title: "오늘계산 서비스 기획 및 MVP 범위 확정",
    description: "일상에서 자주 필요한 계산을 한곳에서 빠르게 해결하는 생활 계산기 서비스의 구조, 핵심 기능, 화면 방향을 설계했습니다.",
  },
  {
    key: "2026-07-25-mvp",
    occurredAt: "2026-07-25T03:00:00.000Z",
    category: "개발",
    title: "생활 계산기 MVP 구축",
    description: "날짜·금액·급여·금융·생활·건강 분야 계산기와 검색, 카테고리 탐색, 반응형 기본 화면을 구축했습니다.",
  },
  {
    key: "2026-07-25-calculators-mobile",
    occurredAt: "2026-07-25T09:00:00.000Z",
    category: "기능 개선",
    title: "계산기 기능 및 모바일 이용성 확대",
    description: "금액 빠른 입력, 계산 결과 안내, 공유, 양력·음력 변환, 연봉 실수령액 등 계산기를 확장하고 모바일 탐색 동선을 개선했습니다.",
  },
  {
    key: "2026-07-27-admin",
    occurredAt: "2026-07-27T02:30:00.000Z",
    category: "관리자",
    title: "관리자·통계·상담문의 기능 구축",
    description: "비밀번호 기반 관리자 접속, 방문자·이용행동 통계, 상담문의 확인 및 처리상태 관리 기능을 추가했습니다.",
  },
  {
    key: "2026-07-27-search-operations",
    occurredAt: "2026-07-27T04:45:00.000Z",
    category: "운영 개선",
    title: "검색 노출 및 사이트 운영 기반 정비",
    description: "SEO·AEO·GEO용 계산기 설명을 보강하고 Google·Naver 사이트 인증과 광고 운영에 필요한 설정을 정비했습니다.",
  },
  {
    key: "2026-07-30-social-brand",
    occurredAt: "2026-07-30T09:10:00.000Z",
    category: "브랜드",
    title: "브랜드 및 공유 미리보기 개선",
    description: "오늘계산 명칭과 대표 이미지를 소셜 공유 화면에 일관되게 표시하도록 메타데이터와 미리보기 이미지를 개선했습니다.",
  },
] as const;

export type DevelopmentHistoryRow = {
  id: number;
  release_key: string;
  occurred_at: string;
  category: string;
  title: string;
  description: string;
  source: string;
};

export function ensureDevelopmentHistorySchema() {
  if (!historyReady) {
    const db = analyticsDb();
    historyReady = (async () => {
      await db.batch([
        db.prepare(`CREATE TABLE IF NOT EXISTS development_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          release_key TEXT NOT NULL UNIQUE,
          occurred_at TEXT NOT NULL,
          category TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          source TEXT NOT NULL DEFAULT 'automatic'
        )`),
        db.prepare("CREATE INDEX IF NOT EXISTS development_history_occurred_idx ON development_history(occurred_at)"),
        db.prepare("CREATE INDEX IF NOT EXISTS development_history_category_idx ON development_history(category)"),
      ]);

      const seeds = initialHistory.map((item) => db.prepare(`INSERT OR IGNORE INTO development_history
        (release_key, occurred_at, category, title, description, source) VALUES (?, ?, ?, ?, ?, 'initial')`)
        .bind(item.key, item.occurredAt, item.category, item.title, item.description));
      const currentRelease = db.prepare(`INSERT OR IGNORE INTO development_history
        (release_key, occurred_at, category, title, description, source) VALUES (?, ?, ?, ?, ?, 'automatic')`)
        .bind(generatedBuild.id, generatedBuild.builtAt, generatedBuild.category, generatedBuild.title, generatedBuild.description);

      await db.batch([...seeds, currentRelease]);
    })();
  }
  return historyReady;
}
