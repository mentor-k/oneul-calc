import type { Metadata } from "next";
import { InfoPage } from "../info-page";

export const metadata: Metadata = { title: "서비스·운영자 소개", description: "오늘계산의 운영 목적, 콘텐츠 제작 방식과 운영자 정보를 안내합니다." };

export default function AboutPage() {
  return <InfoPage eyebrow="ABOUT ONEUL CALC" title="생활 계산을 더 이해하기 쉽게" intro="오늘계산은 날짜, 급여, 금융, 부동산과 건강 등 일상에서 자주 마주치는 계산을 한곳에서 해결하도록 만든 독립 생활도구 서비스입니다.">
    <section><h2>서비스가 하는 일</h2><p>사용자가 값을 입력하면 결과를 즉시 보여주고, 계산 결과의 의미와 적용 시 주의할 점을 함께 설명합니다. 회원가입이나 앱 설치 없이 이용할 수 있으며 기본 계산값은 서버에 저장하지 않습니다.</p></section>
    <section><h2>운영자</h2><p>오늘계산은 DRAGON HAN이 기획·운영합니다. 계산식과 안내 문구는 공개된 제도·일반적인 산식에 근거해 직접 구성하며, 이용자가 실제 생활에서 판단을 내리는 데 도움이 되는 명확성과 사용성을 우선합니다.</p></section>
    <section><h2>정확성과 한계</h2><p>세율, 금리, 보험료율, 법령과 기관별 기준은 바뀔 수 있습니다. 오늘계산은 최신성과 정확성을 높이기 위해 노력하지만 결과는 참고용입니다. 계약·신고·의료·법률 판단 전에는 관계 기관 또는 전문가의 최신 기준을 확인해 주세요.</p></section>
    <section><h2>연락처</h2><p>오류 제보, 개선 의견, 제휴 문의는 <a href="mailto:misiceo@gmail.com">misiceo@gmail.com</a> 또는 문의 페이지에서 접수합니다.</p></section>
  </InfoPage>;
}
