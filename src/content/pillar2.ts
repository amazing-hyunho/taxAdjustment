import { LAST_VERIFIED } from "./sources";

export const pillar2 = {
  verifiedAt: LAST_VERIFIED,
  fact: "OECD GloBE는 적용대상 다국적기업의 국가별 실효세율이 최저 15%에 미달할 때 추가세액을 부과하는 공통 접근이다.",
  caution:
    "실제 NAVER 영향은 적용범위, 국가별 구성기업, 조정세금·소득, QDMTT/IIR/UTPR 순서, 세이프하버와 한국·현지법을 확인해야 하므로 공개자료만으로 결론내리지 않는다.",
  buildPlan: [
    "법인·국가·신고주체 맵과 책임자 지정",
    "회계 데이터→GloBE 조정 데이터 사전 구축",
    "국가별 ETR·추가세액 시나리오와 현금 납부 캘린더",
    "세이프하버 증빙과 내부통제·검토 흔적",
    "투자세액공제·M&A·이전가격 의사결정과 연동",
  ],
  sourceIds: ["oecd-pillar2", "oecd-gmt-2026"],
};
