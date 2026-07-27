import { useState } from "react";
import { Accordion } from "../components/Accordion";
import { Badge } from "../components/Badge";
import { SourceList } from "../components/SourceList";
import { dealFacts, dealMeta, dealTabs } from "../content/dunamu-deal";

type DealTab = keyof typeof dealTabs;

export function DealPage() {
  const [tab, setTab] = useState<DealTab>("거래구조");
  return (
    <main id="main-content" className="page">
      <header className="page-header page-header--deal">
        <p className="eyebrow">DEAL ROOM · 최종 확인 {dealMeta.verifiedAt}</p>
        <h1>네이버파이낸셜–두나무<br />포괄적 주식교환</h1>
        <div className="fact-labels">
          <Badge>확인된 사실</Badge>
          <span>아직 종결 전 · 추진 중</span>
        </div>
      </header>

      <section className="deal-facts" aria-labelledby="facts-title">
        <h2 id="facts-title">면접 전 반드시 정확히</h2>
        {dealFacts.map((fact, index) => (
          <div key={fact}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{fact}</p>
          </div>
        ))}
        <p className="callout callout--warning">{dealMeta.caution}</p>
      </section>

      <div className="segmented segmented--scroll" role="tablist" aria-label="거래 분석 관점">
        {(Object.keys(dealTabs) as DealTab[]).map((item) => (
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
        {dealTabs[tab].map((item, index) => (
          <Accordion key={item.title} title={item.title} eyebrow={`${tab} · 0${index + 1}`} open={index === 0}>
            <p>{item.body}</p>
            <div className="answer-prompt">
              <strong>면접 답변에 붙일 한 문장</strong>
              <p>“이 쟁점은 결론을 단정하기보다 거래일의 사실관계와 {item.title} 기준을 확인한 뒤, 세후 현금과 주당가치 영향으로 권고하겠습니다.”</p>
            </div>
          </Accordion>
        ))}
      </section>

      <Accordion title="공식 출처 원문" eyebrow="사실 확인">
        <SourceList ids={dealMeta.sourceIds} />
      </Accordion>
    </main>
  );
}
