import type { Metadata } from "next";
import { InfoPage } from "../info-page";

export const metadata: Metadata = { title: "개인정보처리방침", description: "오늘계산이 계산기 이용, 문의 접수, 방문 통계와 Google AdSense 관련 정보를 처리하는 방법을 안내합니다." };

export default function PrivacyPage() {
  return <InfoPage eyebrow="PRIVACY" title="개인정보처리방침" intro="오늘계산은 계산기와 문의 기능 제공에 필요한 최소한의 정보만 처리합니다. 시행일: 2026년 9월 15일">
    <section><h2>1. 처리하는 정보와 목적</h2><p>계산기에 입력한 날짜·금액·문자·건강 관련 값은 기본적으로 이용자의 브라우저에서 계산되며 계산 결과를 제공하기 위해 서버에 저장하지 않습니다. 문의를 보낼 때는 이름 또는 업체명, 회신 이메일, 문의 유형과 내용을 접수·회신 목적으로 처리합니다.</p></section>
    <section><h2>2. 방문 통계</h2><p>서비스 개선을 위해 익명 방문 식별자, 접속 일시, 페이지 경로, 유입 경로, 체류시간, 이용 메뉴, 화면 크기와 기기·브라우저 유형을 처리합니다. 원문 IP 주소는 저장하지 않으며, 브라우저 저장공간을 삭제하면 익명 식별자도 삭제됩니다.</p></section>
    <section><h2>3. Google AdSense와 제3자 쿠키</h2><p>오늘계산은 Google AdSense를 사용할 수 있으며, 광고가 게재되는 경우 Google과 광고 파트너가 광고 제공·측정·보안 목적으로 쿠키, 웹 비콘, IP 주소와 유사한 기술을 사용할 수 있습니다. 광고의 개인화 여부와 쿠키 사용 방식은 이용자의 브라우저 및 Google 광고 설정에 따라 달라질 수 있습니다. Google의 <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer">광고 기술 안내</a>와 <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer">광고 설정</a>에서 관련 내용을 확인하고 설정을 관리할 수 있습니다.</p></section>
    <section><h2>4. 보유 기간과 이용자 문의</h2><p>문의 정보는 문의 처리와 회신에 필요한 기간 동안 보관하며, 목적이 달성되면 지체 없이 삭제합니다. 관련 법령에 따라 보존해야 하는 정보는 해당 기간 동안 보관합니다. 개인정보 관련 문의와 삭제 요청은 <a href="mailto:misiceo@gmail.com">misiceo@gmail.com</a>으로 보내주세요.</p></section>
    <section><h2>5. 방침의 변경</h2><p>서비스 기능, 광고 운영 방식 또는 관련 법령이 바뀌면 이 페이지에 변경 내용을 반영하고 시행일을 갱신합니다. 페이지 상단의 시행일을 통해 최신 방침인지 확인할 수 있습니다.</p></section>
  </InfoPage>;
}
