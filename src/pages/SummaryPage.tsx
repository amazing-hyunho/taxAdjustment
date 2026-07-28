import { useState } from "react";
import { Accordion } from "../components/Accordion";
import { Badge } from "../components/Badge";
import { SourceList } from "../components/SourceList";
import { lensTopics } from "../content/ai-investment";
import { candidateStories } from "../content/candidate-stories";
import { cfoProfile } from "../content/cfo-profile";
import { coreInterviewQuestions, coreQuestionGroups } from "../content/core-interview-questions";
import { pillar2 } from "../content/pillar2";
import { selfIntroduction } from "../content/self-introduction";
import { sources } from "../content/sources";
import { summaryCards } from "../content/summary";
import { useCoreQuestionNotes } from "../hooks/useCoreQuestionNotes";
import { useStories } from "../hooks/useStories";
import { extractKeywords } from "../lib/keywords";
import type { CandidateStory, LensName } from "../types";
import { Timer } from "../components/Timer";

type SummaryTab = "3분 요약" | "자기소개" | "핵심 질문" | "메모 답변" | "CFO 렌즈" | "내 경험" | "출처";
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
  const { notes: coreQuestionNotes, updateNote: updateCoreQuestionNote } = useCoreQuestionNotes();
  const { stories, updateField } = useStories();
  const memoAnswers = coreInterviewQuestions.filter(
    (item) => (coreQuestionNotes[String(item.id)] ?? "").trim().length > 0,
  );

  return (
    <main id="main-content" className="page">
      <header className="page-header">
        <p className="eyebrow">SHORT LOOP</p>
        <h1>3분 요약과 실전 스크립트</h1>
        <p>길게 읽지 말고 카드마다 한 문장으로 소리 내어 반복하세요.</p>
      </header>
      <div className="segmented segmented--scroll" role="tablist" aria-label="요약 메뉴">
        {(["3분 요약", "자기소개", "핵심 질문", "메모 답변", "CFO 렌즈", "내 경험", "출처"] as SummaryTab[]).map((item) => (
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
          <Accordion title="NAVER CFO 관련 사실과 면접 추론" eyebrow={`최종 확인 ${cfoProfile.verifiedAt}`}>
            <p><strong>확인된 사실</strong><br />{cfoProfile.fact}</p>
            <p><strong>면접 추론</strong><br />{cfoProfile.inference}</p>
            <p><strong>답변에서 보여줄 관리 기준</strong></p>
            <ul className="intro-notes">
              {cfoProfile.priorities.map((priority) => <li key={priority}>{priority}</li>)}
            </ul>
            <SourceList ids={cfoProfile.sourceIds} />
          </Accordion>
          <Accordion title="Pillar 2 답변의 안전선" eyebrow={`최종 확인 ${pillar2.verifiedAt}`}>
            <p>{pillar2.fact}</p>
            <p className="callout callout--warning">{pillar2.caution}</p>
            <SourceList ids={pillar2.sourceIds} />
          </Accordion>
        </>
      )}

      {tab === "자기소개" && (
        <section className="intro-study">
          <div className="callout">
            <strong>이 답변의 한 줄</strong>
            <p>{selfIntroduction.coreMessage}</p>
          </div>

          <Timer seconds={60} label="자기소개 연습" />

          <article className="intro-script">
            <div className="intro-script__heading">
              <div>
                <p className="eyebrow">MY ORIGINAL SCRIPT</p>
                <h2>사용자 자기소개 원문</h2>
              </div>
              <Badge>다듬지 않고 반영</Badge>
            </div>
            {selfIntroduction.fullAnswer.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </article>

          <div className="section-heading">
            <div>
              <p className="eyebrow">MEMORY CHUNKS</p>
              <h2>키워드만 보고 말하기</h2>
            </div>
          </div>
          <div className="intro-chunks">
            {selfIntroduction.chunks.map((chunk, index) => (
              <article key={chunk.title}>
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Badge>{chunk.time}</Badge>
                </div>
                <h3>{chunk.title}</h3>
                <strong>{chunk.cue}</strong>
                <p>{chunk.text}</p>
              </article>
            ))}
          </div>

          <div className="section-heading">
            <div>
              <p className="eyebrow">FOLLOW-UP DRILL</p>
              <h2>바로 이어질 꼬리질문</h2>
            </div>
          </div>
          {selfIntroduction.followUps.map((item, index) => (
            <Accordion key={item.question} title={item.question} eyebrow={`꼬리질문 ${index + 1}`}>
              <p className="answer-prompt"><strong>암기 키워드</strong><br />{item.cue}</p>
              <p className="intro-answer">{item.answer}</p>
            </Accordion>
          ))}

          <Accordion title="말할 때 주의할 표현" eyebrow="최종 점검">
            <ul className="intro-notes">
              {selfIntroduction.coachingNotes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          </Accordion>
        </section>
      )}

      {tab === "핵심 질문" && (
        <section className="core-study">
          <div className="callout">
            <strong>지하철 10분 루틴</strong>
            <p>질문만 훑기 → 한 문제를 60초로 답하기 → 막힌 문제의 키워드와 꼬리질문 확인.</p>
          </div>
          <Timer seconds={60} label="핵심 질문 1문답" />

          <div className="section-heading">
            <div>
              <p className="eyebrow">QUESTION ONLY</p>
              <h2>{coreInterviewQuestions.length}개 질문 빠르게 훑기</h2>
            </div>
          </div>
          <ol className="core-question-list">
            {coreInterviewQuestions.map((item) => (
              <li key={item.id}>
                <span>{String(item.id).padStart(2, "0")}</span>
                <p>{item.question}</p>
              </li>
            ))}
          </ol>

          {coreQuestionGroups.map((group) => (
            <section className="core-question-group" key={group}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">CORE QUESTIONS</p>
                  <h2>{group}</h2>
                </div>
              </div>
              {coreInterviewQuestions.filter((item) => item.category === group).map((item) => (
                <Accordion
                  key={item.id}
                  title={`${String(item.id).padStart(2, "0")}. ${item.question}`}
                >
                  <p className="answer-prompt"><strong>한 줄 결론</strong><br />{item.thesis}</p>
                  <div className="core-cues" aria-label="암기 키워드">
                    {item.cues.map((cue) => <Badge key={cue}>{cue}</Badge>)}
                  </div>
                  <h3>답변 뼈대</h3>
                  <ol className="intro-notes">
                    {item.framework.map((line) => <li key={line}>{line}</li>)}
                  </ol>
                  <div className="field core-question-note">
                    <label htmlFor={`core-question-note-${item.id}`}>
                      내가 생각하는 답변 메모 · 질문 {item.id}
                    </label>
                  <textarea
                    id={`core-question-note-${item.id}`}
                      rows={5}
                      value={coreQuestionNotes[String(item.id)] ?? ""}
                      placeholder="내 경험, 숫자, 실제로 말할 문장을 자유롭게 적으세요."
                    onChange={(event) => updateCoreQuestionNote(item.id, event.target.value)}
                  />
                  <small>입력 내용은 이 브라우저에 자동 저장됩니다.</small>
                  {extractKeywords(coreQuestionNotes[String(item.id)] ?? "").length > 0 && (
                    <div className="auto-keywords" aria-label={`자동 추출 키워드 · 질문 ${item.id}`}>
                      <strong>자동 추출 키워드</strong>
                      <div>
                        {extractKeywords(coreQuestionNotes[String(item.id)] ?? "").map((keyword) => (
                          <Badge key={keyword}>{keyword}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  </div>
                  <h3>이어질 압박 질문</h3>
                  <ul className="intro-notes">
                    {item.followUps.map((question) => <li key={question}>{question}</li>)}
                  </ul>
                </Accordion>
              ))}
            </section>
          ))}
        </section>
      )}

      {tab === "메모 답변" && (
        <section className="memo-answer-study">
          <div className="callout">
            <strong>메모가 입력된 질문 {memoAnswers.length}개</strong>
            <p>핵심 질문에서 작성한 답변 메모가 있는 질문만 자동으로 모았습니다. 수정 내용도 즉시 같은 메모에 저장됩니다.</p>
          </div>

          {memoAnswers.length === 0 ? (
            <div className="empty-state">
              <strong>아직 작성된 답변 메모가 없습니다.</strong>
              <p>‘핵심 질문’ 탭에서 답변 메모를 입력하면 이곳에 자동으로 추가됩니다.</p>
            </div>
          ) : (
            memoAnswers.map((item, index) => (
              <Accordion
                key={item.id}
                title={`${String(item.id).padStart(2, "0")}. ${item.question}`}
                eyebrow={`${item.category} · 메모 완료`}
                open={index === 0}
              >
                <div className="memo-answer__note">
                  <strong>내가 준비한 답변</strong>
                  <p>{coreQuestionNotes[String(item.id)]}</p>
                </div>
                <div className="auto-keywords" aria-label={`자동 추출 키워드 · 질문 ${item.id}`}>
                  <strong>자동 추출 키워드</strong>
                  <div>
                    {extractKeywords(coreQuestionNotes[String(item.id)] ?? "").map((keyword) => (
                      <Badge key={keyword}>{keyword}</Badge>
                    ))}
                  </div>
                </div>
                <h3>답변 전략</h3>
                <p className="answer-prompt"><strong>한 줄 결론</strong><br />{item.thesis}</p>
                <div className="core-cues" aria-label="암기 키워드">
                  {item.cues.map((cue) => <Badge key={cue}>{cue}</Badge>)}
                </div>
                <ol className="intro-notes">
                  {item.framework.map((line) => <li key={line}>{line}</li>)}
                </ol>
                <div className="field core-question-note">
                  <label htmlFor={`memo-answer-note-${item.id}`}>
                    모아보기 답변 메모 · 질문 {item.id}
                  </label>
                  <textarea
                    id={`memo-answer-note-${item.id}`}
                    rows={6}
                    value={coreQuestionNotes[String(item.id)] ?? ""}
                    onChange={(event) => updateCoreQuestionNote(item.id, event.target.value)}
                  />
                  <small>입력 내용은 이 브라우저에 자동 저장됩니다. 내용을 모두 지우면 이 목록에서 제외됩니다.</small>
                </div>
              </Accordion>
            ))
          )}
        </section>
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
                {story.coaching && (
                  <div className="callout">
                    <strong>{story.coaching.headline}</strong>
                    <p>{story.coaching.cfoTranslation}</p>
                    <ol className="intro-notes">
                      {story.coaching.answerOrder.map((line) => <li key={line}>{line}</li>)}
                    </ol>
                    <p className="muted">{story.coaching.caution}</p>
                  </div>
                )}
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
