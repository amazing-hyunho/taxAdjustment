import { useState } from "react";
import { Accordion } from "../components/Accordion";
import { Badge } from "../components/Badge";
import { SourceList } from "../components/SourceList";
import { lensTopics } from "../content/ai-investment";
import { candidateStories } from "../content/candidate-stories";
import { cfoProfile } from "../content/cfo-profile";
import { pillar2 } from "../content/pillar2";
import { sources } from "../content/sources";
import { summaryCards } from "../content/summary";
import { useStories } from "../hooks/useStories";
import type { CandidateStory, LensName } from "../types";

type SummaryTab = "3분 요약" | "CFO 렌즈" | "내 경험" | "출처";
const fieldLabels: Record<keyof CandidateStory["fields"], string> = {
  situation: "상황 / 과제",
  role: "내가 맡은 역할",
  criteria: "판단 기준",
  stakeholders: "이해관계자",
  action: "실행",
  result: "정량적 결과",
  control: "반복 방지 통제",
  naverApplication: "NAVER에서의 적용",
  cfoMeaning: "CFO 관점의 의미",
};

export function SummaryPage() {
  const [tab, setTab] = useState<SummaryTab>("3분 요약");
  const [topic, setTopic] = useState<keyof typeof lensTopics>("GPU 투자");
  const { stories, updateField } = useStories();

  return (
    <main id="main-content" className="page">
      <header className="page-header">
        <p className="eyebrow">SHORT LOOP</p>
        <h1>3분 요약과 CFO 렌즈</h1>
        <p>길게 읽지 말고 카드마다 한 문장으로 소리 내어 요약하세요.</p>
      </header>
      <div className="segmented segmented--scroll" role="tablist" aria-label="요약 메뉴">
        {(["3분 요약", "CFO 렌즈", "내 경험", "출처"] as SummaryTab[]).map((item) => (
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

      {tab === "3분 요약" && (
        <>
          <div className="summary-stack">
            {summaryCards.map((card, index) => (
              <article className="summary-card" key={card.title}>
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Badge>{card.label}</Badge>
                </div>
                <h2>{card.title}</h2>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
          <Accordion title="김희철 CFO 관련 사실과 면접 추론" eyebrow={`최종 확인 ${cfoProfile.verifiedAt}`}>
            <p><strong>확인된 사실</strong><br />{cfoProfile.fact}</p>
            <p><strong>면접 추론</strong><br />{cfoProfile.inference}</p>
            <SourceList ids={cfoProfile.sourceIds} />
          </Accordion>
          <Accordion title="Pillar 2 답변의 안전선" eyebrow={`최종 확인 ${pillar2.verifiedAt}`}>
            <p>{pillar2.fact}</p>
            <p className="callout callout--warning">{pillar2.caution}</p>
            <SourceList ids={pillar2.sourceIds} />
          </Accordion>
        </>
      )}

      {tab === "CFO 렌즈" && (
        <section>
          <div className="field">
            <label htmlFor="lens-topic">이슈 선택</label>
            <select id="lens-topic" value={topic} onChange={(event) => setTopic(event.target.value as keyof typeof lensTopics)}>
              {Object.keys(lensTopics).map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="lens-grid">
            {(Object.entries(lensTopics[topic]!) as [LensName, string][]).map(([lens, text], index) => (
              <article key={lens}>
                <span>0{index + 1}</span>
                <h2>{lens}</h2>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === "내 경험" && (
        <section>
          <div className="callout">
            <strong>개인정보 주의</strong>
            <p>고객사명·이메일·전화번호·기밀 수치는 넣지 마세요. 메모는 이 브라우저에만 저장되며 전송되지 않습니다.</p>
          </div>
          {candidateStories.map((template, index) => {
            const story = stories.find((item) => item.id === template.id) ?? template;
            return (
              <Accordion key={story.id} title={story.title} eyebrow={`STAR / CAR ${index + 1}`}>
                {(Object.entries(fieldLabels) as [keyof CandidateStory["fields"], string][]).map(([field, label]) => (
                  <div className="field" key={field}>
                    <label htmlFor={`${story.id}-${field}`}>{label}</label>
                    <textarea
                      id={`${story.id}-${field}`}
                      rows={3}
                      value={story.fields[field]}
                      onChange={(event) => updateField(story.id, field, event.target.value)}
                    />
                  </div>
                ))}
              </Accordion>
            );
          })}
        </section>
      )}

      {tab === "출처" && (
        <section>
          <div className="callout callout--warning">
            <strong>최신성 원칙</strong>
            <p>공개 면접 준비용 요약입니다. 거래 종결·규제 승인·세법 적용은 면접 직전 원문 공시와 최신 법령을 다시 확인하세요.</p>
          </div>
          {sources.map((source) => (
            <article className="source-card" key={source.id}>
              <Badge>{source.type}</Badge>
              <h2><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></h2>
              <p>{source.publisher} · 발행 {source.publishedAt}</p>
              <small>최종 확인 {source.verifiedAt}</small>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
