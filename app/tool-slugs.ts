export const toolSlugs = [
  "날짜계산",
  "디데이계산",
  "영업일계산",
  "양력음력변환",
  "글자수",
  "만나이계산",
  "할인계산",
  "퍼센트계산",
  "부가세계산",
  "급여계산",
  "시급월급계산",
  "연봉실수령액계산",
  "평수변환",
  "부동산-중개수수료-계산",
  "대출이자계산",
  "연체이자계산",
  "주유비계산",
  "BMI계산",
] as const;

export type ToolSlug = (typeof toolSlugs)[number];
