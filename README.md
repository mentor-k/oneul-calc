# 오늘계산

날짜, 글자 수, 퍼센트, 부가세, 평수, 급여, 대출이자와 주유비 등을 무료로 계산하는 생활도구 웹서비스입니다.

## 주요 기능

- 날짜·디데이·영업일·양력/음력 변환
- 글자 수·만 나이·할인·퍼센트·부가세 계산
- 급여·시급·연봉 실수령액 계산
- 평수·부동산 중개보수·대출이자·연체이자·주유비·BMI 계산
- 계산기별 사용 방법, 계산 원리, 활용 예시와 FAQ
- 서비스 소개, 콘텐츠 작성 원칙, 개인정보처리방침, 이용약관과 문의 접수

## 기술 스택

- Next.js 호환 App Router와 React
- Vinext·Vite·Cloudflare Workers
- Cloudflare D1·Drizzle ORM 기반 문의 및 익명 방문 통계
- Google AdSense 메타태그·스크립트와 `/ads.txt` 동적 응답

## 실행

```bash
pnpm install
pnpm run dev
pnpm run build
```

Node.js `22.13.0` 이상이 필요합니다.

## 환경변수

운영 환경의 Sites 환경변수로 다음 값을 설정합니다.

- `ADSENSE_PUBLISHER_ID`: `ca-pub-...` 형식의 Google AdSense 게시자 ID
- `ADMIN_PASSWORD`: 관리자 로그인 비밀번호
- `ADMIN_SESSION_SECRET`: 관리자 세션 서명용 비밀값

`ADSENSE_PUBLISHER_ID`가 설정되면 사이트의 AdSense 계정 메타태그와 스크립트가 활성화되고 `/ads.txt`가 게시자 ID를 반환합니다. 광고 게재 전에는 Google AdSense 정책, 광고 배치, 개인정보 안내를 다시 확인해야 합니다.

## 공개 경로

- `/`: 계산기 홈
- `/{계산기명}`: 계산기별 상세 페이지
- `/about`: 서비스·운영자 소개
- `/editorial-policy`: 콘텐츠 작성 원칙
- `/privacy`: 개인정보처리방침
- `/terms`: 이용약관
- `/contact`: 문의·오류 제보
- `/sitemap.xml`, `/robots.txt`, `/ads.txt`: 검색·광고 크롤링 지원 경로

계산 결과는 입력값과 공개된 산식에 따른 참고값입니다. 세무·금융·부동산·노무·의료 등 중요한 판단 전에는 관계 기관이나 전문가의 최신 기준을 확인하세요.
