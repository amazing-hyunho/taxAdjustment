import { useState } from "react";
import { Accordion } from "../components/Accordion";
import { Badge } from "../components/Badge";
import { SourceList } from "../components/SourceList";
import { dealFacts, dealMeta, dealTabs } from "../content/dunamu-deal";
import { nvidiaAiFacts, nvidiaAiMeta, nvidiaAiTabs } from "../content/nvidia-ai-deal";

type DealItem = {
  readonly title: string;
  readonly body: string;
};

type DealConfig = {
  selectorLabel: string;
  eyebrow: string;
  title: string;
  status: string;
  facts: readonly string[];
  meta: {
    verifiedAt: string;
    sourceIds: string[];
    caution: string;
  };
  tabs: Record<string, readonly DealItem[]>;
  answerFrame: (title: string) => string;
};

const dealConfigs = {
  dunamu: {
    selectorLabel: "두나무 주식교환",
    eyebrow: "M&A · 포괄적 주식교환",
    title: "네이버파이낸셜–두나무\n포괄적 주식교환",
    status: "아직 종결 전 · 추진 중",
    facts: dealFacts,
    meta: dealMeta,
    tabs: dealTabs,
    answerFrame: (title: string) =>
      `“이 쟁점은 결론을 단정하기보다 거래일의 사실관계와 ${title} 기준을 확인한 뒤, 세후 현금과 주당가치 영향으로 권고하겠습니다.”`,
  },
  nvidia: {
    selectorLabel: "AI·NVIDIA 투자",
    eyebrow: "AI INFRA · 전략적 투자",
    title: "NAVER–NVIDIA–Brookfield\nAI 팩토리 투자",
    status: "조건부 투자 계획 · 금융 확정 전",
    facts: nvidiaAiFacts,
    meta: nvidiaAiMeta,
    tabs: nvidiaAiTabs,
    answerFrame: (title: string) =>
      `“${title}을 규모 자체보다 단계별 확정 수요와 세후 현금흐름으로 검증하고, 목표 ROIC 미달 시 다음 증설을 보류하는 투자 게이트로 관리하겠습니다.”`,
  },
} satisfies Record<string, DealConfig>;

type DealId = keyof typeof dealConfigs;

export function DealPage() {
  const [dealId, setDealId] = useState<DealId>("dunamu");
  const config: DealConfig = dealConfigs[dealId];
  const [tab, setTab] = useState("거래구조");
  const activeItems = config.tabs[tab] ?? Object.values(config.tabs)[0] ?? [];

  const selectDeal = (nextDealId: DealId) => {
    const nextConfig: DealConfig = dealConfigs[nextDealId];
    setDealId(nextDealId);
    setTab(Object.keys(nextConfig.tabs)[0] ?? "");
  };

  return (
    <main id="main-content" className="page">
      <section className="deal-switcher" aria-labelledby="deal-switcher-title">
        <div>
          <p className="eyebrow">RECENT NAVER DEALS</p>
          <h1 id="deal-switcher-title">최근 핵심 이슈</h1>
        </div>
        <div className="deal-switcher__options" role="tablist" aria-label="분석할 딜 선택">
          {(Object.keys(dealConfigs) as DealId[]).map((item, index) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-label={dealConfigs[item].selectorLabel}
              aria-selected={dealId === item}
              className={dealId === item ? "is-active" : ""}
              onClick={() => selectDeal(item)}
            >
              <span>0{index + 1}</span>
              <strong>{dealConfigs[item].selectorLabel}</strong>
            </button>
          ))}
        </div>
      </section>

      <header className="page-header page-header--deal">
        <p className="eyebrow">{config.eyebrow} · 최종 확인 {config.meta.verifiedAt}</p>
        <h1>
          {config.title.split("\n").map((line, index) => (
            <span key={line}>
              {index > 0 && <br />}
              {line}
            </span>
          ))}
        </h1>
        <div className="fact-labels">
          <Badge>확인된 사실</Badge>
          <span>{config.status}</span>
        </div>
      </header>

      <section className="deal-facts" aria-labelledby="facts-title">
        <h2 id="facts-title">면접 전 반드시 정확히</h2>
        {config.facts.map((fact, index) => (
          <div key={fact}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{fact}</p>
          </div>
        ))}
        <p className="callout callout--warning">{config.meta.caution}</p>
      </section>

      <div className="segmented segmented--scroll" role="tablist" aria-label="거래 분석 관점">
        {Object.keys(config.tabs).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            className={tab === item ? "is-active" : ""}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <section>
        {activeItems.map((item, index) => (
          <Accordion key={item.title} title={item.title} eyebrow={`${tab} · 0${index + 1}`} open={index === 0}>
            <p>{item.body}</p>
            <div className="answer-prompt">
              <strong>면접 답변에 붙일 한 문장</strong>
              <p>{config.answerFrame(item.title)}</p>
            </div>
          </Accordion>
        ))}
      </section>

      <Accordion title="공식 출처 원문" eyebrow="사실 확인">
        <SourceList ids={config.meta.sourceIds} />
      </Accordion>
    </main>
  );
}
