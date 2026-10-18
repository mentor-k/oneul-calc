"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import KoreanLunarCalendar from "korean-lunar-calendar";
import type { ToolSlug } from "./tool-slugs";
import { toolContent, toolDetails } from "./tool-content";

const tools = [
  { slug: "날짜계산", icon: "31", title: "날짜 계산", desc: "두 날짜 사이의 정확한 기간", category: "날짜·문서", featured: true },
  { slug: "디데이계산", icon: "D", title: "D-day 계산", desc: "중요한 날까지 남은 시간", category: "날짜·문서" },
  { slug: "영업일계산", icon: "평", title: "영업일 계산", desc: "주말을 제외한 업무일", category: "날짜·문서" },
  { slug: "양력음력변환", icon: "달", title: "양력·음력 변환", desc: "양력과 음력 날짜를 간편하게 변환", category: "날짜·문서", featured: true },
  { slug: "글자수", icon: "가", title: "글자 수", desc: "공백·바이트까지 실시간 확인", category: "날짜·문서", featured: true },
  { slug: "만나이계산", icon: "나", title: "만 나이 계산", desc: "생년월일로 현재 만 나이 확인", category: "날짜·문서", featured: true },
  { slug: "할인계산", icon: "↓", title: "할인 계산", desc: "할인가와 절약 금액 즉시 확인", category: "돈·직장", featured: true },
  { slug: "퍼센트계산", icon: "%", title: "퍼센트 계산", desc: "비율과 증감률 한 번에", category: "돈·직장", featured: true },
  { slug: "부가세계산", icon: "₩", title: "부가세 계산", desc: "공급가액과 세액 구분", category: "돈·직장" },
  { slug: "급여계산", icon: "월", title: "급여 계산", desc: "월급과 연봉 간편 환산", category: "돈·직장" },
  { slug: "시급월급계산", icon: "시", title: "시급·월급 계산", desc: "근무시간과 주휴수당까지", category: "돈·직장", featured: true },
  { slug: "연봉실수령액계산", icon: "실", title: "연봉별 실수령액 계산하기", desc: "연봉에서 세금·4대보험을 뺀 월 실수령액", category: "돈·직장", featured: true },
  { slug: "평수변환", icon: "㎡", title: "평수 변환", desc: "제곱미터와 평 양방향 변환", category: "집·자동차", featured: true },
  { slug: "부동산-중개수수료-계산", icon: "집", title: "중개보수 계산", desc: "거래금액별 상한요율 참고", category: "집·자동차" },
  { slug: "대출이자계산", icon: "이", title: "대출 이자 계산", desc: "월 납입액과 총이자 확인", category: "집·자동차", featured: true },
  { slug: "연체이자계산", icon: "연", title: "연체 이자 계산", desc: "기간·단리·복리별 연체액 확인", category: "집·자동차" },
  { slug: "주유비계산", icon: "차", title: "주유비 계산", desc: "거리와 연비로 예상 비용 계산", category: "집·자동차" },
  { slug: "BMI계산", icon: "B", title: "BMI 계산", desc: "키와 체중으로 체질량지수 확인", category: "건강" },
] as const;

const money = (value: number) =>
  Number.isFinite(value) ? `${Math.round(value).toLocaleString("ko-KR")}원` : "0원";
const daysBetween = (a: string, b: string) =>
  Math.round((new Date(`${b}T00:00:00`).getTime() - new Date(`${a}T00:00:00`).getTime()) / 86400000);

function Field({
  label,
  value,
  onChange,
  type = "number",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} inputMode={type === "number" ? "decimal" : undefined} />
    </label>
  );
}

const compactMoney = (value: number) => {
  if (!value) return "0원";
  const eok = Math.floor(value / 100000000);
  const man = Math.floor((value % 100000000) / 10000);
  const won = value % 10000;
  return `${eok ? `${eok.toLocaleString()}억 ` : ""}${man ? `${man.toLocaleString()}만 ` : ""}${won ? `${won.toLocaleString()}원` : eok || man ? "원" : ""}`.trim();
};

function MoneyField({
  label,
  value,
  onChange,
  presets = [],
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  presets?: Array<{ label: string; value: number }>;
}) {
  const numeric = Number(value || 0);
  return (
    <div className="money-field">
      <label className="field">
        <span>{label}</span>
        <div className="money-input">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={value === "" ? "" : numeric.toLocaleString("ko-KR")}
            onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, "").replace(/^0+(?=\d)/, ""))}
            placeholder="0"
          />
          <b>원</b>
        </div>
      </label>
      <div className="money-caption">{value ? compactMoney(numeric) : "금액을 입력하세요"}</div>
      {presets.length > 0 && <div className="preset-row">{presets.map((preset) => <button type="button" key={preset.label} onClick={() => onChange(String(preset.value))}>{preset.label}</button>)}<button type="button" onClick={() => onChange("")}>지우기</button></div>}
    </div>
  );
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

async function shareText(title: string, text: string) {
  const url = window.location.href.split("#")[0];
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
    }
  }
  await copyText(`${text}\n${url}`);
  return "copied";
}

function Result({ label, value, sub }: { label: string; value: string; sub?: string }) {
  const [copied, setCopied] = useState(false);
  const [shareState, setShareState] = useState<"" | "copied" | "shared">("");
  const resultText = `${label}: ${value}${sub ? `\n${sub}` : ""}`;
  const copy = async () => {
    await copyText(resultText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };
  const share = async () => {
    const state = await shareText(
      document.querySelector(".calculator-card h1")?.textContent || "오늘계산",
      `오늘계산 계산 결과\n${resultText}\n계산 결과는 참고용입니다.`,
    );
    if (state === "cancelled") return;
    setShareState(state);
    window.setTimeout(() => setShareState(""), 1400);
  };
  return (
    <section className="result" aria-live="polite">
      <div className="result-head">
        <span>{label}</span>
        <div className="result-actions">
          <button type="button" onClick={copy}>{copied ? "복사됨" : "결과 복사"}</button>
          <button type="button" className="share-button" onClick={share}>
            {shareState === "copied" ? "링크 복사됨" : shareState === "shared" ? "공유됨" : "결과 공유"}
          </button>
        </div>
      </div>
      <strong>{value}</strong>
      {sub && <p>{sub}</p>}
    </section>
  );
}

function ToolShareButton({ title, desc }: { title: string; desc: string }) {
  const [state, setState] = useState<"" | "copied" | "shared">("");
  const share = async () => {
    const outcome = await shareText(title, `${title}\n${desc}\n가입 없이 바로 계산해 보세요.`);
    if (outcome === "cancelled") return;
    setState(outcome);
    window.setTimeout(() => setState(""), 1400);
  };
  return (
    <button type="button" className="tool-share" onClick={share} aria-label={`${title} 공유하기`}>
      <span aria-hidden="true">↗</span>
      {state === "copied" ? "링크 복사됨" : state === "shared" ? "공유됨" : "공유하기"}
    </button>
  );
}

function DateCalculator({ mode }: { mode: "date" | "dday" | "business" }) {
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [includeBoth, setIncludeBoth] = useState(false);
  const [dateMode, setDateMode] = useState("range");
  const [offset, setOffset] = useState("100");
  const [direction, setDirection] = useState("after");
  const total = daysBetween(start, end);
  const displayTotal = Math.abs(total) + (includeBoth ? 1 : 0);
  const offsetDate = useMemo(() => {
    const date = new Date(`${start}T00:00:00`);
    date.setDate(date.getDate() + Number(offset || 0) * (direction === "after" ? 1 : -1));
    return new Intl.DateTimeFormat("ko-KR", { dateStyle: "full" }).format(date);
  }, [start, offset, direction]);
  const business = useMemo(() => {
    if (!start || !end || total < 0) return 0;
    let count = 0;
    const cursor = new Date(`${start}T00:00:00`);
    const finish = new Date(`${end}T00:00:00`);
    while (cursor <= finish) {
      const day = cursor.getDay();
      if (day !== 0 && day !== 6) count++;
      cursor.setDate(cursor.getDate() + 1);
    }
    return count;
  }, [start, end, total]);
  const label = mode === "dday" ? "목표일" : "종료일";
  const value =
    mode === "dday" ? (total === 0 ? "D-day" : total > 0 ? `D-${total}` : `D+${Math.abs(total)}`) :
    mode === "business" ? `${business.toLocaleString()}일` : `${displayTotal.toLocaleString()}일`;
  if (mode === "date" && dateMode === "offset") {
    return <><div className="mode-tabs date-mode-tabs"><button onClick={() => setDateMode("range")}>기간 계산</button><button className="selected">날짜 더하기·빼기</button></div><Field label="기준일" type="date" value={start} onChange={setStart} /><div className="two-fields"><Field label="일수" value={offset} onChange={setOffset} /><label className="field"><span>방향</span><select value={direction} onChange={(e) => setDirection(e.target.value)}><option value="after">일 후</option><option value="before">일 전</option></select></label></div><Result label={`${offset}일 ${direction === "after" ? "후" : "전"}`} value={offsetDate} /></>;
  }
  return (
    <>
      {mode === "date" && <div className="mode-tabs date-mode-tabs"><button className="selected">기간 계산</button><button onClick={() => setDateMode("offset")}>날짜 더하기·빼기</button></div>}
      {mode !== "dday" && <Field label="시작일" type="date" value={start} onChange={setStart} />}
      <Field label={label} type="date" value={end} onChange={setEnd} />
      {mode === "date" && <label className="check-row"><input type="checkbox" checked={includeBoth} onChange={(e) => setIncludeBoth(e.target.checked)} /><span>시작일과 종료일을 모두 포함</span></label>}
      <Result label={mode === "business" ? "평일 기준" : "계산 결과"} value={value}
        sub={mode === "business" ? "토·일요일을 제외한 결과이며 공휴일은 포함합니다." : `${Math.floor(displayTotal / 7)}주 ${displayTotal % 7}일`} />
    </>
  );
}

function LunarSolarCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [direction, setDirection] = useState("solarToLunar");
  const [solarDate, setSolarDate] = useState(today);
  const [calendarMonth, setCalendarMonth] = useState(today.slice(0, 7));
  const [lunarYear, setLunarYear] = useState(String(new Date().getFullYear()));
  const [lunarMonth, setLunarMonth] = useState("1");
  const [lunarDay, setLunarDay] = useState("1");
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const conversion = useMemo(() => {
    const calendar = new KoreanLunarCalendar();
    if (direction === "solarToLunar") {
      const [year, month, day] = solarDate.split("-").map(Number);
      if (!calendar.setSolarDate(year, month, day)) return null;
      const lunar = calendar.getLunarCalendar();
      const gapja = calendar.getKoreanGapja();
      return { label: "음력 변환 결과", value: `음력 ${lunar.year}년 ${lunar.intercalation ? "윤" : ""}${lunar.month}월 ${lunar.day}일`, sub: `${gapja.year} ${gapja.month} ${gapja.day}${lunar.intercalation ? " · 윤달" : " · 평달"}` };
    }
    if (!calendar.setLunarDate(Number(lunarYear), Number(lunarMonth), Number(lunarDay), isLeapMonth)) return null;
    const solar = calendar.getSolarCalendar();
    return { label: "양력 변환 결과", value: new Intl.DateTimeFormat("ko-KR", { dateStyle: "full" }).format(new Date(solar.year, solar.month - 1, solar.day)), sub: `양력 ${solar.year}-${String(solar.month).padStart(2, "0")}-${String(solar.day).padStart(2, "0")}` };
  }, [direction, solarDate, lunarYear, lunarMonth, lunarDay, isLeapMonth]);
  const calendarDays = useMemo(() => {
    const [year, month] = calendarMonth.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();
    return Array.from({ length: firstDay + lastDate }, (_, index) => {
      if (index < firstDay) return null;
      const day = index - firstDay + 1;
      const calendar = new KoreanLunarCalendar();
      if (!calendar.setSolarDate(year, month, day)) return null;
      const lunar = calendar.getLunarCalendar();
      return { day, date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`, lunar: `${lunar.intercalation ? "윤" : ""}${lunar.month}.${lunar.day}` };
    });
  }, [calendarMonth]);
  const moveMonth = (amount: number) => {
    const [year, month] = calendarMonth.split("-").map(Number);
    const next = new Date(year, month - 1 + amount, 1);
    setCalendarMonth(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`);
  };
  const selectCalendarDate = (date: string) => {
    setSolarDate(date);
    setDirection("solarToLunar");
  };
  return (
    <>
      <div className="mode-tabs"><button className={direction === "solarToLunar" ? "selected" : ""} onClick={() => setDirection("solarToLunar")}>양력 → 음력</button><button className={direction === "lunarToSolar" ? "selected" : ""} onClick={() => setDirection("lunarToSolar")}>음력 → 양력</button></div>
      {direction === "solarToLunar" ? <Field label="양력 날짜" type="date" value={solarDate} onChange={setSolarDate} /> : <><div className="lunar-fields"><Field label="음력 연도" value={lunarYear} onChange={setLunarYear} /><Field label="월" value={lunarMonth} onChange={setLunarMonth} /><Field label="일" value={lunarDay} onChange={setLunarDay} /></div><label className="check-row"><input type="checkbox" checked={isLeapMonth} onChange={(e) => setIsLeapMonth(e.target.checked)} /><span>윤달로 계산</span></label></>}
      {conversion ? <Result label={conversion.label} value={conversion.value} sub={conversion.sub} /> : <div className="status warn">변환할 수 없는 날짜입니다. 날짜와 윤달 여부를 확인해 주세요.</div>}
      <section className="dual-calendar">
        <div className="calendar-head">
          <div><span>양력·음력 한눈에 보기</span><strong>{calendarMonth.replace("-", "년 ")}월</strong></div>
          <div><button type="button" onClick={() => moveMonth(-1)} aria-label="이전 달">‹</button><button type="button" onClick={() => setCalendarMonth(today.slice(0, 7))}>오늘</button><button type="button" onClick={() => moveMonth(1)} aria-label="다음 달">›</button></div>
        </div>
        <div className="calendar-week">{["일","월","화","수","목","금","토"].map((day) => <span key={day}>{day}</span>)}</div>
        <div className="calendar-grid">{calendarDays.map((item, index) => item ? <button type="button" key={item.date} className={`${item.date === today ? "today" : ""} ${item.date === solarDate ? "picked" : ""}`} onClick={() => selectCalendarDate(item.date)}><b>{item.day}</b><small>음 {item.lunar}</small></button> : <span key={`blank-${index}`} />)}</div>
        <p>날짜를 누르면 해당 양력 날짜의 음력 변환 결과가 위에 표시됩니다.</p>
      </section>
      <p className="source-note">한국천문연구원 기준 알고리즘을 따르며, 지원 범위는 양력 1000년 2월 13일~2050년 12월 31일입니다.</p>
    </>
  );
}

function TextCounter() {
  const [text, setText] = useState("");
  const [limit, setLimit] = useState("1000");
  const bytes = new TextEncoder().encode(text).length;
  const noSpaces = text.replace(/\s/g, "").length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split(/\r?\n/).length : 0;
  const sentences = text.trim() ? text.split(/[.!?。！？]+/).filter((v) => v.trim()).length : 0;
  const progress = Math.min(100, Number(limit) > 0 ? text.length / Number(limit) * 100 : 0);
  return (
    <>
      <label className="field">
        <span>문장을 입력하거나 붙여 넣으세요</span>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="여기에 입력하세요" />
      </label>
      <Field label="목표 글자 수" value={limit} onChange={setLimit} />
      <div className="progress"><i style={{ width: `${progress}%` }} /><span>{progress.toFixed(0)}%</span></div>
      <div className="result-grid">
        <Result label="공백 포함" value={`${text.length.toLocaleString()}자`} />
        <Result label="공백 제외" value={`${noSpaces.toLocaleString()}자`} />
        <Result label="UTF-8" value={`${bytes.toLocaleString()} bytes`} />
      </div>
      <div className="mini-results"><span>단어 <b>{words}</b></span><span>문장 <b>{sentences}</b></span><span>줄 <b>{lines}</b></span><span>원고지 약 <b>{Math.ceil(noSpaces / 200)}매</b></span></div>
    </>
  );
}

function PercentCalculator() {
  const [base, setBase] = useState("100");
  const [rate, setRate] = useState("10");
  const [mode, setMode] = useState("portion");
  const result = mode === "portion" ? Number(base) * Number(rate) / 100 : mode === "ratio" ? (Number(rate) / Number(base)) * 100 : ((Number(rate) - Number(base)) / Number(base)) * 100;
  return <><label className="field"><span>계산 유형</span><select value={mode} onChange={(e) => setMode(e.target.value)}><option value="portion">기준값의 몇 %</option><option value="ratio">전체 중 일부의 비율</option><option value="change">이전값 대비 증감률</option></select></label><Field label={mode === "portion" ? "기준값" : mode === "ratio" ? "전체값" : "이전값"} value={base} onChange={setBase} /><Field label={mode === "portion" ? "퍼센트 (%)" : mode === "ratio" ? "일부값" : "새 값"} value={rate} onChange={setRate} /><Result label="계산 결과" value={mode === "portion" ? result.toLocaleString("ko-KR") : `${Number.isFinite(result) ? result.toFixed(2) : "0"}%`} /></>;
}

function DiscountCalculator() {
  const [price, setPrice] = useState("89000");
  const [rate, setRate] = useState("30");
  const [coupon, setCoupon] = useState("0");
  const [extraRate, setExtraRate] = useState("0");
  const afterRate = Number(price) * (1 - Number(rate) / 100);
  const afterCoupon = Math.max(0, afterRate - Number(coupon));
  const finalPrice = Math.max(0, afterCoupon * (1 - Math.min(Math.max(Number(extraRate), 0), 100) / 100));
  return <><MoneyField label="정가" value={price} onChange={setPrice} presets={[{label:"1만원",value:10000},{label:"5만원",value:50000},{label:"10만원",value:100000}]} /><Field label="기본 할인율 (%)" value={rate} onChange={setRate} /><MoneyField label="할인 후 적용할 쿠폰 금액" value={coupon} onChange={setCoupon} presets={[{label:"5천원",value:5000},{label:"1만원",value:10000},{label:"3만원",value:30000}]} /><Field label="쿠폰 적용 후 추가 할인율 (%)" value={extraRate} onChange={setExtraRate} /><div className="mini-results"><span>기본 할인 후 <b>{money(afterRate)}</b></span><span>쿠폰 적용 후 <b>{money(afterCoupon)}</b></span><span>추가 할인액 <b>{money(afterCoupon - finalPrice)}</b></span><span>총 절약 금액 <b>{money(Number(price) - finalPrice)}</b></span></div><Result label="최종 결제 금액" value={money(finalPrice)} sub={`${money(Number(price) - finalPrice)} 절약 · 정가 대비 ${Number(price) ? ((Number(price) - finalPrice) / Number(price) * 100).toFixed(1) : 0}% 할인 · 기본 할인 → 쿠폰 → 추가 할인 순서`} /></>;
}

function AgeCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [birth, setBirth] = useState("1995-08-17");
  const [reference, setReference] = useState(today);
  const age = useMemo(() => {
    const b = new Date(`${birth}T00:00:00`);
    const r = new Date(`${reference}T00:00:00`);
    let years = r.getFullYear() - b.getFullYear();
    if (r.getMonth() < b.getMonth() || (r.getMonth() === b.getMonth() && r.getDate() < b.getDate())) years--;
    return Math.max(0, years);
  }, [birth, reference]);
  const birthdayInfo = useMemo(() => {
    const b = new Date(`${birth}T00:00:00`);
    const r = new Date(`${reference}T00:00:00`);
    let next = new Date(r.getFullYear(), b.getMonth(), b.getDate());
    if (next < r) next = new Date(r.getFullYear() + 1, b.getMonth(), b.getDate());
    return { days: Math.ceil((next.getTime() - r.getTime()) / 86400000), date: new Intl.DateTimeFormat("ko-KR", { dateStyle: "long" }).format(next) };
  }, [birth, reference]);
  return <><Field label="생년월일" type="date" value={birth} onChange={setBirth} /><Field label="기준일" type="date" value={reference} onChange={setReference} /><Result label="기준일 현재" value={`만 ${age}세`} sub={`연 나이 ${Math.max(0, new Date(reference).getFullYear() - new Date(birth).getFullYear())}세 · 다음 생일 ${birthdayInfo.date} (${birthdayInfo.days === 0 ? "오늘" : `${birthdayInfo.days}일 후`})`} /></>;
}

function VatCalculator() {
  const [total, setTotal] = useState("110000");
  const [mode, setMode] = useState("total");
  const supply = mode === "total" ? Number(total) / 1.1 : Number(total);
  const vat = supply * 0.1;
  return <><div className="mode-tabs"><button className={mode === "total" ? "selected" : ""} onClick={() => setMode("total")}>합계에서 분리</button><button className={mode === "supply" ? "selected" : ""} onClick={() => setMode("supply")}>공급가액에 추가</button></div><MoneyField label={mode === "total" ? "부가세 포함 합계" : "공급가액"} value={total} onChange={setTotal} presets={[{label:"11만원",value:110000},{label:"110만원",value:1100000},{label:"1,100만원",value:11000000}]} /><Result label={mode === "total" ? "공급가액" : "최종 합계"} value={money(mode === "total" ? supply : supply + vat)} sub={`부가세 ${money(vat)}`} /></>;
}

function AreaCalculator() {
  const [sqm, setSqm] = useState("84");
  const [pyeong, setPyeong] = useState("");
  const fromSqm = pyeong === "";
  return <><div className="mode-tabs"><button className={fromSqm ? "selected" : ""} onClick={() => setPyeong("")}>㎡ → 평</button><button className={!fromSqm ? "selected" : ""} onClick={() => setPyeong("25")}>평 → ㎡</button></div>{fromSqm ? <><Field label="제곱미터 (㎡)" value={sqm} onChange={setSqm} /><Result label="평으로 환산" value={`${(Number(sqm) / 3.305785).toFixed(2)}평`} sub="1평 = 3.305785㎡ 기준" /></> : <><Field label="평" value={pyeong} onChange={setPyeong} /><Result label="제곱미터로 환산" value={`${(Number(pyeong) * 3.305785).toFixed(2)}㎡`} sub="1평 = 3.305785㎡ 기준" /></>}</>;
}

function SalaryCalculator() {
  const [monthly, setMonthly] = useState("3000000");
  const [bonus, setBonus] = useState("0");
  const [mode, setMode] = useState("monthly");
  const annual = mode === "monthly" ? Number(monthly) * 12 + Number(bonus) : Number(monthly);
  const presets = mode === "monthly" ? [{label:"300만원",value:3000000},{label:"400만원",value:4000000},{label:"500만원",value:5000000}] : [{label:"3천만원",value:30000000},{label:"5천만원",value:50000000},{label:"1억원",value:100000000}];
  return <><div className="mode-tabs"><button className={mode === "monthly" ? "selected" : ""} onClick={() => setMode("monthly")}>월급 → 연봉</button><button className={mode === "annual" ? "selected" : ""} onClick={() => setMode("annual")}>연봉 → 월급</button></div><MoneyField label={mode === "monthly" ? "월 급여(세전)" : "연봉(세전)"} value={monthly} onChange={setMonthly} presets={presets} />{mode === "monthly" && <MoneyField label="연간 고정 상여금" value={bonus} onChange={setBonus} presets={[{label:"100만원",value:1000000},{label:"300만원",value:3000000},{label:"500만원",value:5000000}]} />}<Result label={mode === "monthly" ? "세전 연봉" : "월 환산액"} value={money(mode === "monthly" ? annual : annual / 12)} sub="퇴직금·세금·4대보험을 포함하지 않은 단순 환산입니다." /></>;
}

function HourlyCalculator() {
  const [hourly, setHourly] = useState("10320");
  const [dailyHours, setDailyHours] = useState("8");
  const [days, setDays] = useState("5");
  const weeklyHours = Number(dailyHours) * Number(days);
  const holidayHours = weeklyHours >= 15 ? Math.min(8, weeklyHours / 5) : 0;
  const monthly = Number(hourly) * (weeklyHours + holidayHours) * 365 / 7 / 12;
  const minimumGap = Number(hourly) - 10320;
  return <><MoneyField label="시급" value={hourly} onChange={setHourly} presets={[{label:"최저임금",value:10320},{label:"1.2만원",value:12000},{label:"1.5만원",value:15000}]} /><div className="two-fields"><Field label="하루 근무시간" value={dailyHours} onChange={setDailyHours} /><Field label="주 근무일수" value={days} onChange={setDays} /></div><Result label="예상 월급(세전)" value={money(monthly)} sub={`${holidayHours ? `주휴 ${holidayHours.toFixed(1)}시간 포함` : "주휴시간 미포함"} · 예상 연봉 ${money(monthly * 12)}`} /><div className={`status ${minimumGap >= 0 ? "good" : "warn"}`}>{minimumGap >= 0 ? `2026년 최저임금보다 시간당 ${money(minimumGap)} 높습니다.` : `2026년 최저임금보다 시간당 ${money(Math.abs(minimumGap))} 낮습니다.`}</div><p className="source-note">2026년 적용 최저임금 10,320원 기준입니다. 실제 주휴수당은 근무조건에 따라 달라질 수 있습니다.</p></>;
}

function NetSalaryCalculator() {
  const [annualSalary, setAnnualSalary] = useState("50000000");
  const [nonTaxMonthly, setNonTaxMonthly] = useState("200000");
  const [dependents, setDependents] = useState("1");
  const annual = Number(annualSalary || 0);
  const monthly = annual / 12;
  const taxableAnnual = Math.max(0, annual - Number(nonTaxMonthly || 0) * 12);
  const pension = taxableAnnual * 0.0475;
  const health = taxableAnnual * 0.03595;
  const longTermCare = health * (0.009448 / 0.0719);
  const employment = taxableAnnual * 0.009;
  const earnedDeduction = taxableAnnual <= 5000000 ? taxableAnnual * .7 : taxableAnnual <= 15000000 ? 3500000 + (taxableAnnual - 5000000) * .4 : taxableAnnual <= 45000000 ? 7500000 + (taxableAnnual - 15000000) * .15 : taxableAnnual <= 100000000 ? 12000000 + (taxableAnnual - 45000000) * .05 : 14750000 + (taxableAnnual - 100000000) * .02;
  const taxBase = Math.max(0, taxableAnnual - earnedDeduction - Math.max(1, Number(dependents || 1)) * 1500000 - pension);
  const annualIncomeTax = taxBase <= 14000000 ? taxBase * .06 : taxBase <= 50000000 ? taxBase * .15 - 1260000 : taxBase <= 88000000 ? taxBase * .24 - 5760000 : taxBase <= 150000000 ? taxBase * .35 - 15440000 : taxBase * .38 - 19940000;
  const incomeTax = Math.max(0, annualIncomeTax * .45);
  const localTax = incomeTax * .1;
  const annualDeductions = pension + health + longTermCare + employment + incomeTax + localTax;
  const netAnnual = Math.max(0, annual - annualDeductions);
  const deductionRate = annual > 0 ? annualDeductions / annual * 100 : 0;
  return <><MoneyField label="세전 연봉" value={annualSalary} onChange={setAnnualSalary} presets={[{label:"3천만원",value:30000000},{label:"5천만원",value:50000000},{label:"7천만원",value:70000000},{label:"1억원",value:100000000}]} /><div className="two-fields"><MoneyField label="월 비과세액" value={nonTaxMonthly} onChange={setNonTaxMonthly} presets={[{label:"0원",value:0},{label:"20만원",value:200000}]} /><Field label="본인 포함 부양가족 수" value={dependents} onChange={setDependents} /></div><Result label="월 예상 실수령액" value={money(netAnnual / 12)} sub={`세전 월급 ${money(monthly)} · 연 예상 실수령액 ${money(netAnnual)}`} /><div className="interest-breakdown"><span>국민연금<b>{money(pension / 12)}</b></span><span>건강보험<b>{money(health / 12)}</b></span><span>장기요양<b>{money(longTermCare / 12)}</b></span><span>고용보험<b>{money(employment / 12)}</b></span><span>소득세 예상<b>{money(incomeTax / 12)}</b></span><span>지방소득세 예상<b>{money(localTax / 12)}</b></span></div><div className="status good">월 예상 공제액 {money(annualDeductions / 12)} · 예상 공제율 {deductionRate.toFixed(1)}%</div><p className="source-note">2026년 근로자 부담률(국민연금 4.75%, 건강보험 3.595%, 고용보험 0.9%)과 간소화한 세액 추정식을 적용한 참고값입니다. 급여 구성, 보험료 상·하한, 부양가족·자녀 수, 소득공제와 회사 원천징수 방식에 따라 실제 금액은 달라집니다.</p></>;
}

function LoanCalculator() {
  const [principal, setPrincipal] = useState("300000000");
  const [annualRate, setAnnualRate] = useState("4");
  const [years, setYears] = useState("30");
  const [method, setMethod] = useState("amortized");
  const months = Math.max(1, Number(years) * 12);
  const r = Number(annualRate) / 100 / 12;
  const amortized = r === 0 ? Number(principal) / months : Number(principal) * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
  const equalPrincipalFirst = Number(principal) / months + Number(principal) * r;
  const monthly = method === "bullet" ? Number(principal) * r : method === "principal" ? equalPrincipalFirst : amortized;
  const totalInterest = method === "bullet" ? monthly * months : method === "principal" ? Number(principal) * r * (months + 1) / 2 : amortized * months - Number(principal);
  return <><label className="field"><span>상환 방식</span><select value={method} onChange={(e) => setMethod(e.target.value)}><option value="amortized">원리금균등상환</option><option value="principal">원금균등상환</option><option value="bullet">만기일시상환</option></select></label><MoneyField label="대출금액" value={principal} onChange={setPrincipal} presets={[{label:"1억원",value:100000000},{label:"3억원",value:300000000},{label:"5억원",value:500000000}]} /><div className="two-fields"><Field label="연 금리 (%)" value={annualRate} onChange={setAnnualRate} /><Field label="기간 (년)" value={years} onChange={setYears} /></div><Result label={method === "principal" ? "첫 달 예상 납입액" : "예상 월 납입액"} value={money(monthly)} sub={`예상 총이자 ${money(totalInterest)} · 총상환액 ${money(Number(principal) + totalInterest)}`} /><p className="source-note">원금균등상환은 첫 달 금액이며 이후 매월 이자가 감소합니다. 실제 금융기관의 일수 계산·수수료는 다를 수 있습니다.</p></>;
}

function OverdueInterestCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const [principal, setPrincipal] = useState("10000000");
  const [rateMode, setRateMode] = useState("direct");
  const [directRate, setDirectRate] = useState("8");
  const [contractRate, setContractRate] = useState("5");
  const [extraRate, setExtraRate] = useState("3");
  const [periodMode, setPeriodMode] = useState("date");
  const [start, setStart] = useState(thirtyDaysAgo);
  const [end, setEnd] = useState(today);
  const [days, setDays] = useState("30");
  const [months, setMonths] = useState("3");
  const [interestType, setInterestType] = useState("simple");
  const [compoundCycle, setCompoundCycle] = useState("daily");
  const appliedRate = rateMode === "direct" ? Number(directRate) : Number(contractRate) + Number(extraRate);
  const dateDays = Math.max(0, daysBetween(start, end));
  const appliedDays = periodMode === "date" ? dateDays : periodMode === "days" ? Math.max(0, Number(days)) : Math.max(0, Number(months)) * 365 / 12;
  const yearFraction = periodMode === "months" ? Number(months) / 12 : appliedDays / 365;
  const simpleInterest = Number(principal) * appliedRate / 100 * yearFraction;
  const compoundInterest = compoundCycle === "monthly"
    ? Number(principal) * (Math.pow(1 + appliedRate / 100 / 12, periodMode === "months" ? Number(months) : appliedDays / (365 / 12)) - 1)
    : Number(principal) * (Math.pow(1 + appliedRate / 100 / 365, appliedDays) - 1);
  const interest = interestType === "simple" ? simpleInterest : compoundInterest;
  const periodText = periodMode === "months" ? `${months}개월` : `${Math.round(appliedDays)}일`;
  return (
    <>
      <MoneyField label="연체 원금" value={principal} onChange={setPrincipal} presets={[{label:"100만원",value:1000000},{label:"1천만원",value:10000000},{label:"1억원",value:100000000}]} />
      <div className="mode-tabs"><button className={rateMode === "direct" ? "selected" : ""} onClick={() => setRateMode("direct")}>연체이율 직접 입력</button><button className={rateMode === "contract" ? "selected" : ""} onClick={() => setRateMode("contract")}>약정＋가산금리</button></div>
      {rateMode === "direct" ? <Field label="연체이율 (연 %)" value={directRate} onChange={setDirectRate} /> : <div className="two-fields"><Field label="약정금리 (연 %)" value={contractRate} onChange={setContractRate} /><Field label="가산금리 (%p)" value={extraRate} onChange={setExtraRate} /></div>}
      <label className="field"><span>연체 기간 입력</span><select value={periodMode} onChange={(e) => setPeriodMode(e.target.value)}><option value="date">시작일·납부일 선택</option><option value="days">연체 일수 입력</option><option value="months">연체 개월 입력</option></select></label>
      {periodMode === "date" && <div className="two-fields"><Field label="연체 시작일" type="date" value={start} onChange={setStart} /><Field label="납부 예정일" type="date" value={end} onChange={setEnd} /></div>}
      {periodMode === "days" && <Field label="연체 일수" value={days} onChange={setDays} />}
      {periodMode === "months" && <Field label="연체 개월" value={months} onChange={setMonths} />}
      <div className="mode-tabs"><button className={interestType === "simple" ? "selected" : ""} onClick={() => setInterestType("simple")}>단리</button><button className={interestType === "compound" ? "selected" : ""} onClick={() => setInterestType("compound")}>복리 상세</button></div>
      {interestType === "compound" && <label className="field"><span>복리 주기</span><select value={compoundCycle} onChange={(e) => setCompoundCycle(e.target.value)}><option value="daily">일 복리</option><option value="monthly">월 복리</option></select></label>}
      <Result label="예상 연체이자" value={money(interest)} sub={`원금＋이자 ${money(Number(principal) + interest)} · 적용 연체이율 연 ${appliedRate.toFixed(2)}% · ${periodText}`} />
      <div className="interest-breakdown"><span>하루 단리 참고액 <b>{money(Number(principal) * appliedRate / 100 / 365)}</b></span><span>계산 방식 <b>{interestType === "simple" ? "단리" : compoundCycle === "daily" ? "일 복리" : "월 복리"}</b></span></div>
      <div className="safety-note"><strong>계약 조건을 먼저 확인하세요</strong><p>금융기관·상품·연체 발생 시점에 따라 적용 대상 원금과 일수 산정이 다릅니다. 복리는 계약상 적용 근거가 있을 때만 선택하고, 이 결과를 법적 청구액으로 사용하지 마세요.</p></div>
    </>
  );
}

function FuelCalculator() {
  const [distance, setDistance] = useState("320");
  const [efficiency, setEfficiency] = useState("12");
  const [fuelPrice, setFuelPrice] = useState("1680");
  const [roundTrip, setRoundTrip] = useState(false);
  const [people, setPeople] = useState("1");
  const actualDistance = Number(distance) * (roundTrip ? 2 : 1);
  const liters = Number(efficiency) > 0 ? actualDistance / Number(efficiency) : 0;
  const cost = liters * Number(fuelPrice);
  return <><Field label="편도 주행거리 (km)" value={distance} onChange={setDistance} /><label className="check-row"><input type="checkbox" checked={roundTrip} onChange={(e) => setRoundTrip(e.target.checked)} /><span>왕복으로 계산</span></label><Field label="차량 연비 (km/L)" value={efficiency} onChange={setEfficiency} /><MoneyField label="유가 (L당)" value={fuelPrice} onChange={setFuelPrice} presets={[{label:"1,600원",value:1600},{label:"1,700원",value:1700},{label:"1,800원",value:1800}]} /><Field label="비용을 나눌 인원" value={people} onChange={setPeople} /><Result label="예상 주유비" value={money(cost)} sub={`필요 연료 약 ${liters.toFixed(1)}L · 1인당 ${money(cost / Math.max(1, Number(people)))}`} /></>;
}

function BmiCalculator() {
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("68");
  const bmi = Number(weight) / Math.pow(Number(height) / 100, 2);
  const label = bmi < 18.5 ? "저체중" : bmi < 23 ? "정상" : bmi < 25 ? "비만 전단계" : bmi < 30 ? "1단계 비만" : bmi < 35 ? "2단계 비만" : "3단계 비만";
  const advice = bmi < 18.5
    ? { title:"체중 감소 원인을 살펴보세요", body:"규칙적인 식사와 충분한 단백질·에너지 섭취를 점검하세요. 의도하지 않은 체중 감소나 지속적인 소화 불편이 있다면 의료진과 상담하는 것이 좋습니다." }
    : bmi < 23
    ? { title:"현재의 생활 습관을 유지하세요", body:"균형 잡힌 식사, 규칙적인 신체활동과 수면을 유지하고 체중뿐 아니라 허리둘레와 혈압 같은 지표도 함께 살펴보세요." }
    : bmi < 25
    ? { title:"작은 습관부터 점검해 보세요", body:"음료·간식과 활동량을 일주일 정도 기록하고, 오래 앉아 있는 시간을 줄이는 것부터 시작해 보세요. 허리둘레도 함께 확인하면 도움이 됩니다." }
    : { title:"개인 상태에 맞는 목표가 중요합니다", body:"무리한 단기 감량보다 식사 조절과 신체활동을 함께 꾸준히 실천하세요. 고혈압·당뇨 등 동반 질환이 있거나 BMI가 높다면 의료진과 목표를 정하는 것이 안전합니다." };
  const h2 = Math.pow(Number(height) / 100, 2);
  const ranges = [
    ["18.5 미만","저체중"],["18.5–22.9","정상"],["23.0–24.9","비만 전단계"],["25.0–29.9","1단계 비만"],["30.0–34.9","2단계 비만"],["35.0 이상","3단계 비만"],
  ];
  return <><div className="two-fields"><Field label="키 (cm)" value={height} onChange={setHeight} /><Field label="몸무게 (kg)" value={weight} onChange={setWeight} /></div><Result label="체질량지수" value={Number.isFinite(bmi) ? bmi.toFixed(1) : "0"} sub={`${label} · 해당 키의 정상 체중 참고 범위 ${Math.ceil(18.5 * h2)}~${Math.floor(22.9 * h2)}kg`} /><div className="bmi-scale"><i /><i /><i /><i /><i /><i /><span style={{ left: `${Math.max(2, Math.min(98, (bmi - 15) / 25 * 100))}%` }} /></div><section className="bmi-detail"><h3>성인 BMI 구간 안내</h3><div className="bmi-table">{ranges.map(([range,name]) => <div className={name === label ? "current" : ""} key={name}><span>{range}</span><b>{name}</b>{name === label && <em>현재</em>}</div>)}</div><div className={`bmi-advice ${bmi < 18.5 || bmi >= 25 ? "attention" : ""}`}><strong>{advice.title}</strong><p>{advice.body}</p></div><ul><li>BMI는 체지방 분포와 근육량을 직접 측정하지 않습니다.</li><li>허리둘레, 혈압, 혈당과 개인의 병력을 함께 고려해야 합니다.</li><li>임신부·성장기 아동·운동선수에게는 이 성인 기준이 적합하지 않을 수 있습니다.</li></ul><a href="https://health.kdca.go.kr/healthinfo/biz/health/gnrlzHealthInfo/gnrlzHealthInfo/gnrlzHealthInfoView.do?cntnts_sn=6694" target="_blank" rel="noreferrer">질병관리청 비만 건강정보 보기 →</a></section></>;
}

function BrokerageCalculator() {
  const [price, setPrice] = useState("500000000");
  const [monthlyRent, setMonthlyRent] = useState("0");
  const [kind, setKind] = useState("sale");
  const rentConverted = Number(price) + Number(monthlyRent) * 100;
  const p = kind === "rent" ? (rentConverted < 50000000 ? Number(price) + Number(monthlyRent) * 70 : rentConverted) : Number(price);
  const rate = kind === "sale" ? (p < 50000000 ? 0.006 : p < 200000000 ? 0.005 : p < 900000000 ? 0.004 : p < 1200000000 ? 0.005 : p < 1500000000 ? 0.006 : 0.007)
    : (p < 50000000 ? 0.005 : p < 100000000 ? 0.004 : p < 600000000 ? 0.003 : p < 1200000000 ? 0.004 : p < 1500000000 ? 0.005 : 0.006);
  const statutoryCap = kind === "sale" ? (p < 50000000 ? 250000 : p < 200000000 ? 800000 : Infinity) : (p < 50000000 ? 200000 : p < 100000000 ? 300000 : Infinity);
  const fee = Math.min(p * rate, statutoryCap);
  return (
    <>
      <label className="field"><span>거래 유형</span><select value={kind} onChange={(e) => setKind(e.target.value)}><option value="sale">주택 매매·교환</option><option value="rent">주택 임대차</option></select></label>
      <MoneyField label={kind === "rent" ? "보증금" : "거래금액"} value={price} onChange={setPrice} presets={kind === "rent" ? [{label:"1천만원",value:10000000},{label:"5천만원",value:50000000},{label:"1억원",value:100000000}] : [{label:"1억원",value:100000000},{label:"5억원",value:500000000},{label:"10억원",value:1000000000}]} />
      {kind === "rent" && <MoneyField label="월세 (전세는 0)" value={monthlyRent} onChange={setMonthlyRent} presets={[{label:"50만원",value:500000},{label:"100만원",value:1000000},{label:"150만원",value:1500000}]} />}
      <Result label="중개보수 상한 참고액" value={money(fee)} sub={`${kind === "rent" ? `환산 거래금액 ${money(p)} · ` : ""}상한요율 ${(rate * 100).toFixed(1)}% · 부가세는 별도일 수 있습니다.`} />
      <p className="source-note">월세는 보증금＋월세×100으로 환산하며, 환산액이 5천만원 미만이면 월세×70을 적용했습니다. 실제 보수는 상한 안에서 협의하고 지역 조례를 확인하세요.</p>
    </>
  );
}

function ActiveCalculator({ slug }: { slug: ToolSlug }) {
  if (slug === "날짜계산") return <DateCalculator mode="date" />;
  if (slug === "디데이계산") return <DateCalculator mode="dday" />;
  if (slug === "영업일계산") return <DateCalculator mode="business" />;
  if (slug === "양력음력변환") return <LunarSolarCalculator />;
  if (slug === "글자수") return <TextCounter />;
  if (slug === "만나이계산") return <AgeCalculator />;
  if (slug === "할인계산") return <DiscountCalculator />;
  if (slug === "퍼센트계산") return <PercentCalculator />;
  if (slug === "부가세계산") return <VatCalculator />;
  if (slug === "평수변환") return <AreaCalculator />;
  if (slug === "급여계산") return <SalaryCalculator />;
  if (slug === "시급월급계산") return <HourlyCalculator />;
  if (slug === "연봉실수령액계산") return <NetSalaryCalculator />;
  if (slug === "대출이자계산") return <LoanCalculator />;
  if (slug === "연체이자계산") return <OverdueInterestCalculator />;
  if (slug === "주유비계산") return <FuelCalculator />;
  if (slug === "BMI계산") return <BmiCalculator />;
  return <BrokerageCalculator />;
}

const categories = ["날짜·문서", "돈·직장", "집·자동차", "건강"] as const;

function AdReserve({ position }: { position: string }) {
  return <div className="ad-reserve" data-ad-position={position} aria-hidden="true" />;
}

export function CalculatorHub({ initialTool }: { initialTool?: string }) {
  const selected = tools.find((tool) => tool.slug === initialTool);
  const content = selected ? toolContent[selected.slug] : undefined;
  const [query, setQuery] = useState("");
  const [inquiryNotice, setInquiryNotice] = useState("");
  const searchResults = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return [];
    return tools.filter((tool) =>
      `${tool.title} ${tool.desc} ${tool.category}`.toLowerCase().includes(keyword)
    ).slice(0, 6);
  }, [query]);
  const sendInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const subject = `[오늘계산 문의] ${form.get("inquiryType")} · ${form.get("name")}`;
    const body = [
      `이름: ${form.get("name")}`,
      `회신 이메일: ${form.get("email")}`,
      `문의 유형: ${form.get("inquiryType")}`,
      "",
      String(form.get("message") || ""),
    ].join("\n");
    setInquiryNotice("문의 내용을 접수하고 있습니다.");
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        inquiryType: form.get("inquiryType"),
        message: form.get("message"),
      }),
    });
    if (!response.ok) {
      setInquiryNotice("접수하지 못했습니다. 잠시 후 다시 시도하거나 이메일로 문의해 주세요.");
      return;
    }
    formElement.reset();
    setInquiryNotice("문의가 접수되었습니다. 이메일 앱에서도 같은 내용을 보낼 수 있습니다.");
    window.location.href = `mailto:misiceo@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <main>
      <header>
        <a className="brand" href="/" aria-label="오늘계산 홈"><i className="brand-mark" aria-hidden="true" /><b><span>오늘</span>계산</b></a>
        <nav><a href="/#tools">계산기</a><a href="/about">서비스 소개</a><a href="/editorial-policy">콘텐츠 원칙</a><a href="/contact">문의</a></nav>
        <div className="header-actions"><a className="header-quick" href={selected ? "/#tools" : "#tools"}>계산기 전체</a><a className="admin-login" href="/admin" aria-label="관리자 로그인" title="관리자 로그인">♙</a></div>
      </header>
      {selected ? (
        <div className="tool-layout">
          <aside>
            <a className="back" href="/">← 모든 계산기</a>
            <p>빠른 이동</p>
            {tools.map((tool) => <a className={tool.slug === selected.slug ? "active" : ""} href={`/${tool.slug}`} key={tool.slug}>{tool.title}</a>)}
          </aside>
          <div className="mobile-tool-strip" aria-label="계산기 빠른 이동">
            {tools.map((tool) => <a className={tool.slug === selected.slug ? "active" : ""} href={`/${tool.slug}`} key={tool.slug}>{tool.title}</a>)}
          </div>
          <article className="calculator-card">
            <div className="eyebrow">오늘 필요한 계산, 10초면 충분해요</div>
            <div className="tool-title-row">
              <h1>{selected.title}</h1>
              <ToolShareButton title={selected.title} desc={selected.desc} />
            </div>
            <p className="lead">{selected.desc}. 입력한 정보는 서버에 저장하지 않습니다.</p>
            <div className="calculator"><ActiveCalculator slug={selected.slug} /></div>
            <div className="notice result-disclaimer">
              <strong>계산 결과 이용 전 확인해 주세요</strong>
              <p>이 결과는 사용자가 입력한 값과 화면에 표시된 조건을 바탕으로 산출한 참고값이며, 법률·세무·금융·부동산·노무·의료 분야의 전문적인 판단이나 공식 증빙을 대신하지 않습니다.</p>
              <ul><li>입력값, 단위, 기간과 선택 조건이 정확한지 다시 확인해 주세요.</li><li>세율·금리·보험료율·법령·기관 기준은 변경될 수 있으므로 실제 신고, 계약, 지급 또는 의사결정 전 관계 기관의 최신 기준을 확인해 주세요.</li><li>중요한 재산상·법률상·건강상 결정은 해당 기관이나 자격을 갖춘 전문가와 상담해 주세요.</li></ul>
              <small>오늘계산은 결과의 정확성을 높이기 위해 노력하지만 모든 상황에 대한 완전성이나 특정 목적 적합성을 보증하지 않습니다. 서비스 이용에 따른 책임은 관련 법령이 허용하는 범위에서 제한되며, 운영자의 고의 또는 중대한 과실에 관한 법정 책임은 배제하지 않습니다.</small>
            </div>
            <AdReserve position="tool-after-result" />
            <section className="tool-guide">
              <span>쉽게 알아보기</span>
              <h2>{selected.title}, 이렇게 사용하세요</h2>
              <p>{content?.answer}</p>
              <ol>{content?.steps.map((step, index) => <li key={step}><b>{index + 1}</b><span>{step}</span></li>)}</ol>
              <div><strong>결과를 확인할 때</strong><p>날짜·금액·단위를 다시 확인하고, 계약이나 신고에 사용하는 값은 해당 기관의 최신 기준과 함께 확인해 주세요.</p></div>
            </section>
            {(() => {
              const details = toolDetails[selected.slug];
              return details ? <section className="tool-method">
                <span>계산 원리와 활용 예시</span>
                <h2>{selected.title} 결과를 이해하는 법</h2>
                <div className="method-grid">
                  <article><h3>계산 기준</h3><p>{details.formula}</p></article>
                  <article><h3>활용 예시</h3><p>{details.example}</p></article>
                </div>
                <p className="method-review">내용 검토 기준일: {details.reviewed}{details.source && <> · <a href={details.source.url} target="_blank" rel="noreferrer">근거·참고자료: {details.source.label}</a></>}</p>
              </section> : null;
            })()}
            <section className="tool-faq">
              <span>자주 묻는 질문</span>
              <h2>{selected.title} FAQ</h2>
              {content?.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
            </section>
            <AdReserve position="tool-after-guide" />
            <section className="related-tools">
              <span>이어서 계산하기</span>
              <div>{tools.filter((tool) => tool.category === selected.category && tool.slug !== selected.slug).slice(0, 4).map((tool) => <a href={`/${tool.slug}`} key={tool.slug}>{tool.title}<b>→</b></a>)}</div>
            </section>
          </article>
        </div>
      ) : (
        <>
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow">설치도, 가입도 필요 없어요</div>
              <h1>오늘 필요한 계산,<br /><em>바로 끝내세요.</em></h1>
              <p>날짜부터 급여, 부동산 중개보수까지.<br />복잡한 생활 계산을 가장 간단하게.</p>
            </div>
            <div className="finder">
              <label htmlFor="calculator-search">어떤 계산이 필요한가요?</label>
              <div className="search-box"><span>⌕</span><input id="calculator-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="날짜, 연봉, 할인처럼 검색하세요" autoComplete="off" /><kbd>검색</kbd></div>
              {query && <div className="search-results">
                {searchResults.length ? searchResults.map((tool) => <a href={`/${tool.slug}`} key={tool.slug}><i>{tool.icon}</i><span><strong>{tool.title}</strong><small>{tool.desc}</small></span><b>→</b></a>) : <p>일치하는 계산기가 없어요. 아래 분야별 메뉴에서 찾아보세요.</p>}
              </div>}
              {!query && <div className="quick-links"><span>빠른 선택</span><a href="/날짜계산">날짜</a><a href="/할인계산">할인</a><a href="/급여계산">연봉</a><a href="/대출이자계산">대출이자</a></div>}
            </div>
          </section>
          <nav className="category-jump" aria-label="분야별 바로가기">
            <a href="#category-date"><i>31</i><span>날짜·문서</span></a>
            <a href="#category-money"><i>₩</i><span>돈·직장</span></a>
            <a href="#category-home"><i>집</i><span>집·자동차</span></a>
            <a href="#category-health"><i>B</i><span>건강</span></a>
          </nav>
          <section id="tools" className="tools-section featured-tools">
            <div className="section-title"><span>가장 많이 쓰는 도구</span><h2>자주 찾는 계산기</h2></div>
            <div className="tool-grid">{tools.filter((tool) => "featured" in tool && tool.featured).map((tool) => <a className="tool-card" href={`/${tool.slug}`} key={tool.slug}><i>{tool.icon}</i><div><h3>{tool.title}</h3><p>{tool.desc}</p></div><b>→</b></a>)}</div>
          </section>
          <AdReserve position="home-after-featured" />
          <section id="all-tools" className="category-section">
            <div className="section-title"><span>전체 계산기</span><h2>필요한 분야에서 찾아보세요</h2></div>
            {categories.map((category, index) => <div id={["category-date","category-money","category-home","category-health"][index]} className="category-row" key={category}><h3>{category}<small>{tools.filter((tool) => tool.category === category).length}개 도구</small></h3><div>{tools.filter((tool) => tool.category === category).map((tool) => <a href={`/${tool.slug}`} key={tool.slug}><i>{tool.icon}</i><span><strong>{tool.title}</strong><small>{tool.desc}</small></span><b>→</b></a>)}</div></div>)}
          </section>
          <section id="service-about" className="info-section service-section">
            <div className="section-title"><span>서비스 소개</span><h2>생활 속 계산을 쉽고 빠르게</h2><p>오늘계산은 자주 필요하지만 매번 검색하기 번거로운 생활 계산을 한곳에 모은 웹 서비스입니다.</p></div>
            <div className="info-grid">
              <article><b>01</b><h3>필요한 계산을 한곳에서</h3><p>날짜·문서, 급여·직장, 대출·주거, 자동차·건강처럼 서로 다른 생활 계산을 분야별로 정리했습니다. 검색창이나 분야 메뉴를 이용하면 원하는 도구로 바로 이동할 수 있습니다.</p></article>
              <article><b>02</b><h3>입력하면 즉시 보이는 결과</h3><p>별도의 계산 버튼을 여러 번 누르지 않아도 입력값이 바뀌는 즉시 결과를 확인할 수 있습니다. 금액 입력에는 천 단위 구분과 빠른 선택값을 제공해 모바일에서도 편리합니다.</p></article>
              <article><b>03</b><h3>가입과 설치 없이 사용</h3><p>회원가입이나 앱 설치 없이 PC와 모바일 브라우저에서 바로 이용할 수 있습니다. 기본 계산은 브라우저 안에서 처리하며 입력값을 별도 서버에 저장하지 않습니다.</p></article>
            </div>
          </section>
          <section id="guide" className="info-section guide-section">
            <div className="section-title"><span>이용안내</span><h2>더 정확하게 사용하는 방법</h2><p>간단한 세 단계만 확인하면 계산 결과를 더욱 안전하게 활용할 수 있습니다.</p></div>
            <div className="info-grid">
              <article><b>1단계</b><h3>계산기 선택</h3><p>검색창에 날짜, 연봉, 할인처럼 필요한 단어를 입력하거나 분야별 메뉴에서 계산기를 선택하세요. 자주 찾는 도구는 메인화면 상단에 먼저 배치했습니다.</p></article>
              <article><b>2단계</b><h3>단위와 조건 확인</h3><p>원·만원, 일·개월, 연이율·월이율처럼 입력 단위를 확인하세요. 시작일 포함 여부, 상환 방식, 단리·복리처럼 결과에 영향을 주는 조건도 함께 선택해야 합니다.</p></article>
              <article><b>3단계</b><h3>결과 검토와 활용</h3><p>결과는 빠른 판단을 돕는 참고값입니다. 세금, 급여, 금융, 부동산, 건강 관련 최종 결정은 관계 기관의 최신 기준이나 전문가 확인을 함께 거치세요.</p></article>
            </div>
            <div className="guide-note"><strong>개인정보 안내</strong><p>계산기에 입력한 값은 브라우저에서만 처리됩니다. 문의 폼에 입력한 이름, 이메일과 문의 내용은 상담 접수·회신을 위해 안전하게 저장됩니다.</p></div>
          </section>
        </>
      )}
      <footer>
        <section id="contact" className="footer-panel contact-panel">
          <div><span>문의·상담 신청</span><h2>개선 의견이나 제휴 문의를 남겨주세요</h2><p>보내주신 문의는 관리자 상담함에 바로 접수됩니다. 접수 후 이메일 앱에서도 같은 내용을 보낼 수 있습니다.</p></div>
          <form className="contact-form" onSubmit={sendInquiry}>
            <div className="two-fields"><label><span>이름</span><input name="name" required placeholder="이름 또는 업체명" /></label><label><span>회신 이메일</span><input name="email" type="email" required placeholder="name@example.com" /></label></div>
            <label><span>문의 유형</span><select name="inquiryType"><option>서비스 이용 문의</option><option>오류·개선 제안</option><option>제휴·광고 상담</option><option>기타 문의</option></select></label>
            <label><span>문의 내용</span><textarea name="message" required placeholder="문의하실 내용을 입력해 주세요." /></label>
            <label className="contact-consent"><input type="checkbox" required /><span>문의 회신을 위한 <a href="/privacy">개인정보 수집·이용</a>에 동의합니다.</span></label>
            <button type="submit">상담 문의 접수하기</button>
            {inquiryNotice && <p className="form-notice" aria-live="polite">{inquiryNotice}</p>}
          </form>
        </section>
        <div className="footer-bottom">
          <div className="footer-signature"><a className="brand" href="/" aria-label="오늘계산 홈"><i className="brand-mark" aria-hidden="true" /><b><span>오늘</span>계산</b></a><small>© 2026 오늘계산. All rights reserved. · 계산 결과는 참고용입니다.</small></div>
          <div className="footer-legal">
            <a href="/about">운영자 소개</a>
            <a href="/editorial-policy">콘텐츠 원칙</a>
            <a href="/privacy">개인정보처리방침</a>
            <a href="/terms">이용약관</a>
            <details id="privacy"><summary>개인정보처리방침</summary><div><p>오늘계산의 기본 계산 기능은 입력값을 서버에 저장하지 않습니다. 상담 문의 시 이름, 회신 이메일, 문의 유형과 내용이 상담 접수·회신을 위해 저장됩니다.</p><p>방문 통계에는 익명 방문 식별자, 접속 일시, 페이지, 유입 경로, 기기·브라우저 유형이 사용되며 원문 IP 주소는 저장하지 않습니다. 브라우저 저장공간을 삭제하면 익명 식별자도 삭제됩니다.</p><p>수집 정보는 문의 처리와 서비스 개선 목적으로만 이용하며, 관련 법령상 보존 의무가 있는 경우를 제외하고 목적 달성 후 지체 없이 삭제합니다. 개인정보 문의: misiceo@gmail.com. 시행일: 2026년 7월 27일.</p></div></details>
            <details id="terms"><summary>이용약관</summary><div><p>오늘계산은 생활에 필요한 계산 결과를 참고용으로 제공합니다. 법률, 세무, 금융, 의료 또는 계약상 최종 판단을 대신하지 않으며, 중요한 결정 전에는 관계 기관이나 전문가의 최신 기준을 확인해야 합니다.</p><p>서비스 화면, 문구, 디자인과 자체 제작 콘텐츠의 권리는 오늘계산에 있습니다. 이용자는 결과를 개인적인 용도로 활용할 수 있으나 서비스의 화면이나 콘텐츠를 허가 없이 복제·재판매할 수 없습니다.</p><p>운영자는 정확성과 안정성을 높이기 위해 노력하지만 제도 변경, 입력 오류, 통신 장애 등으로 발생한 손해에 대해 법령이 허용하는 범위에서 책임이 제한될 수 있습니다.</p></div></details>
            <details id="disclaimer"><summary>면책·저작권 안내</summary><div><p><strong>결과의 성격</strong><br />모든 계산 결과는 사용자가 입력한 값과 제공된 산식에 따른 참고정보입니다. 공공기관의 처분, 금융기관의 심사, 세무 신고, 근로계약, 부동산 계약, 진단이나 치료를 대신하지 않습니다.</p><p><strong>확인 책임</strong><br />법령, 요율, 공휴일, 상품 조건과 기관별 적용 기준은 수시로 달라질 수 있습니다. 실제 거래나 신고 전에는 원문 자료와 관계 기관의 최신 안내를 확인해야 합니다.</p><p><strong>책임 범위</strong><br />운영자는 서비스의 안정성과 정확성을 위해 합리적으로 노력합니다. 다만 이용자의 입력 오류, 제도 변경, 통신 장애, 외부 서비스 또는 자료의 변경 등 운영자가 통제하기 어려운 사유로 발생한 손해에 대한 책임은 관련 법령이 허용하는 범위에서 제한됩니다. 운영자의 고의 또는 중대한 과실에 따른 법정 책임은 배제되지 않습니다.</p><p><strong>저작권</strong><br />오늘계산이 독자적으로 제작한 문구, 화면 구성, 디자인, 그래픽, 설명자료와 프로그램 소스 등 창작성이 있는 콘텐츠는 저작권의 보호를 받습니다. 법령·공식 산식·공공데이터 자체에 대한 권리를 주장하지 않으며, 정당한 인용과 법령상 허용되는 이용을 제외한 무단 복제·배포·재판매·변형 서비스 제공을 금지합니다.</p></div></details>
          </div>
        </div>
      </footer>
      <nav className="mobile-dock" aria-label="모바일 빠른 메뉴">
        <a href="/"><i>⌂</i><span>홈</span></a>
        <a href="/#tools"><i>★</i><span>인기</span></a>
        <a href="/#all-tools"><i>＋</i><span>전체</span></a>
      </nav>
    </main>
  );
}
