import type { CandidateStory } from "../types";

const emptyFields = {
  situation: "공개 가능한 범위에서 규모·기간·문제를 한 문장으로 적으세요.",
  role: "내가 직접 소유한 의사결정과 산출물을 구분하세요.",
  criteria: "금액, 기한, 법적 근거, 통제 위험 중 우선순위를 적으세요.",
  stakeholders: "CFO·사업·회계·법무·외부자문 등 조율 대상을 적으세요.",
  action: "분석→대안→권고→실행 순서로 동사를 사용하세요.",
  result: "익명화한 금액·기간·오류율·현금효과 등 숫자를 넣으세요.",
  control: "체크리스트, 시스템 검증, 책임자, 보고주기 등 재발 방지를 적으세요.",
  naverApplication: "AI 투자·두나무 거래·글로벌 사업 중 어디에 재사용할지 적으세요.",
  cfoMeaning: "손익·현금·리스크·주주가치 중 무엇이 개선되는지 적으세요.",
};

export const candidateStories: CandidateStory[] = [
  "대기업·플랫폼 기업 세무조정",
  "세무조사 대응",
  "해외 종속법인 이전가격",
  "투자세액공제 및 잠재환급",
  "M&A·지분거래·SPC",
  "계열사 거래 매뉴얼",
  "ERP 연계 및 프로세스 개선",
].map((title, index) => ({
  id: `story-${index + 1}`,
  title,
  fields: { ...emptyFields },
}));
