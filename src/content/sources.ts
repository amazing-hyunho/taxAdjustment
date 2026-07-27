import type { Source } from "../types";

export const LAST_VERIFIED = "2026-07-27";

export const sources: Source[] = [
  {
    id: "krx-deal-latest",
    title: "주식교환·이전 결정(종속회사의 주요경영사항) 정정",
    publisher: "한국거래소 KIND / NAVER",
    publishedAt: "2026-07-06",
    url: "https://kind.krx.co.kr/external/2026/07/06/000561/20260617000253/91766.htm",
    verifiedAt: LAST_VERIFIED,
    type: "공식 공시",
  },
  {
    id: "krx-deal-original",
    title: "주식교환·이전 결정(종속회사의 주요경영사항)",
    publisher: "한국거래소 KIND / NAVER",
    publishedAt: "2025-11-26",
    url: "https://kind.krx.co.kr/external/2025/11/26/000699/20251126001571/91766.htm",
    verifiedAt: LAST_VERIFIED,
    type: "공식 공시",
  },
  {
    id: "naver-deal-vision",
    title: "TEAM NAVER와 두나무, AI와 Web3 결합 전략 발표",
    publisher: "NAVER",
    publishedAt: "2025-11-27",
    url: "https://navercorp.com/en/media/pressReleasesDetail?seq=33621",
    verifiedAt: LAST_VERIFIED,
    type: "회사 발표",
  },
  {
    id: "naver-cfo-board",
    title: "제27기 정기주주총회: 김희철 CFO 사내이사 선임",
    publisher: "NAVER",
    publishedAt: "2026-03-20",
    url: "https://www.navercorp.com/media/pressReleasesDetail?seq=34436",
    verifiedAt: LAST_VERIFIED,
    type: "회사 발표",
  },
  {
    id: "naver-ai-cluster",
    title: "B200 GPU 4,000장 기반 AI 클러스터 구축",
    publisher: "NAVER",
    publishedAt: "2026-01-08",
    url: "https://www.navercorp.com/media/pressReleasesDetail?seq=34272",
    verifiedAt: LAST_VERIFIED,
    type: "회사 발표",
  },
  {
    id: "naver-q1-2026",
    title: "2026년 1분기 실적 발표",
    publisher: "NAVER",
    publishedAt: "2026-04-30",
    url: "https://www.navercorp.com/media/pressReleasesDetail?seq=34994",
    verifiedAt: LAST_VERIFIED,
    type: "회사 발표",
  },
  {
    id: "naver-ai-factory",
    title: "NAVER·Brookfield·NVIDIA AI Factory 인프라 확장",
    publisher: "NAVER",
    publishedAt: "2026-07-24",
    url: "https://www.navercorp.com/media/pressReleasesDetail?seq=10034517",
    verifiedAt: LAST_VERIFIED,
    type: "회사 발표",
  },
  {
    id: "oecd-pillar2",
    title: "Global Anti-Base Erosion Model Rules (Pillar Two)",
    publisher: "OECD",
    publishedAt: "2021-12-20",
    url: "https://www.oecd.org/en/topics/sub-issues/global-minimum-tax/global-anti-base-erosion-model-rules-pillar-two.html",
    verifiedAt: LAST_VERIFIED,
    type: "국제기구",
  },
  {
    id: "oecd-gmt-2026",
    title: "Global Minimum Tax Implementation Toolkit",
    publisher: "OECD",
    publishedAt: "2026-04-24",
    url: "https://www.oecd.org/en/topics/sub-issues/global-minimum-tax/global-anti-base-erosion-model-rules-pillar-two.html",
    verifiedAt: LAST_VERIFIED,
    type: "국제기구",
  },
];

export const getSources = (ids: string[]) =>
  ids.map((id) => sources.find((source) => source.id === id)).filter((source): source is Source => Boolean(source));
