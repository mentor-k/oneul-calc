import type { Metadata } from "next";
import { InfoPage } from "../info-page";

export const metadata: Metadata = { title: "문의·오류 제보", description: "오늘계산 오류 제보, 개선 의견과 제휴 문의 안내입니다." };

export default function ContactPage() {
  return <InfoPage eyebrow="CONTACT" title="문의·오류 제보" intro="계산 결과의 오류, 개선 의견, 제휴·광고 문의를 보내주세요.">
    <section><h2>문의 방법</h2><p>홈 화면 하단의 상담 문의 양식을 이용하거나 <a href="mailto:misiceo@gmail.com">misiceo@gmail.com</a>으로 보내주세요. 오류 제보 시 이용한 계산기, 입력값, 예상 결과와 실제 결과를 함께 알려주시면 더 빠르게 확인할 수 있습니다.</p><a className="primary" href="/#contact">상담 문의 작성하기</a></section>
    <section><h2>처리 안내</h2><p>접수된 문의는 운영자가 확인하며 필요한 경우 입력한 이메일로 답변합니다. 개인정보나 금융 계정정보처럼 민감한 내용은 문의에 포함하지 마세요.</p></section>
  </InfoPage>;
}
