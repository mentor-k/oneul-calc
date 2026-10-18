import type { Metadata } from "next";
import { InfoPage } from "../info-page";

export const metadata: Metadata = { title: "이용약관" };

export default function TermsPage() {
  return <InfoPage eyebrow="TERMS" title="이용약관" intro="오늘계산을 이용하기 전에 서비스의 성격과 이용 조건을 확인해 주세요.">
    <section><h2>서비스의 성격</h2><p>오늘계산은 생활에 필요한 계산 결과를 참고용으로 제공합니다. 법률, 세무, 금융, 의료 또는 계약상 최종 판단을 대신하지 않습니다.</p></section>
    <section><h2>이용자의 확인</h2><p>법령, 요율, 공휴일, 상품 조건과 기관별 기준은 달라질 수 있습니다. 실제 거래·계약·신고 전에는 관계 기관의 최신 안내를 확인해야 합니다.</p></section>
    <section><h2>지식재산권</h2><p>오늘계산이 직접 제작한 문구, 화면 구성, 설명자료와 프로그램은 관련 법령의 보호를 받습니다. 법령과 공식 산식 자체에 대한 권리를 주장하지 않습니다.</p></section>
    <section><h2>책임 범위</h2><p>운영자는 정확성과 안정성을 위해 노력하지만 입력 오류, 제도 변경, 통신 장애 등으로 발생한 손해에 대한 책임은 관련 법령이 허용하는 범위에서 제한됩니다.</p></section>
  </InfoPage>;
}
