import { useMemo, useState } from "react";
import { Accordion } from "../components/Accordion";
import { Badge } from "../components/Badge";
import { SourceList } from "../components/SourceList";
import { Timer } from "../components/Timer";
import { getRandomQuestion, questionCategories, questions } from "../content/questions";
import type { Difficulty, QuestionProgress } from "../types";

interface DrillPageProps {
  initialQuestionId?: string;
  progress: Record<string, QuestionProgress>;
  updateQuestion: (id: string, update: Partial<QuestionProgress>, countAttempt?: boolean) => void;
}

const difficulties: Array<Difficulty | "전체"> = ["전체", "기본", "임원", "CFO 압박"];
const pressureChecklist = [
  "결론부터 말했다",
  "숫자 또는 판단기준이 있다",
  "세무와 사업을 연결했다",
  "손익과 현금을 구분했다",
  "사실과 추정을 구분했다",
  "권고안을 제시했다",
  "반대 논리를 고려했다",
  "60초 안에 끝냈다",
];

export function DrillPage({ initialQuestionId, progress, updateQuestion }: DrillPageProps) {
  const [difficulty, setDifficulty] = useState<Difficulty | "전체">("전체");
  const [category, setCategory] = useState("전체");
  const [questionId, setQuestionId] = useState(initialQuestionId ?? questions[0]?.id ?? "");
  const [revealed, setRevealed] = useState(false);
  const [followUpIndex, setFollowUpIndex] = useState(0);
  const [checked, setChecked] = useState<string[]>([]);

  const pool = useMemo(
    () =>
      questions.filter(
        (question) =>
          (difficulty === "전체" || question.difficulty === difficulty) &&
          (category === "전체" || question.category === category),
      ),
    [category, difficulty],
  );
  const question = questions.find((item) => item.id === questionId) ?? pool[0];
  const currentProgress = question ? progress[question.id] : undefined;

  const nextRandom = () => {
    const next = getRandomQuestion(pool, question?.id);
    if (!next) return;
    setQuestionId(next.id);
    setRevealed(false);
    setFollowUpIndex(0);
    setChecked([]);
  };

  if (!question) {
    return (
      <main id="main-content" className="page">
        <p className="empty-state">선택한 조건에 질문이 없습니다. 필터를 변경해 주세요.</p>
      </main>
    );
  }

  return (
    <main id="main-content" className="page">
      <header className="page-header">
        <p className="eyebrow">GRILL ME · {questions.length} QUESTIONS</p>
        <h1>말하기가 먼저,<br />답은 나중에.</h1>
        <p>준비 30초, 답변 60초. 결론–근거–반론–권고 순서로 소리 내어 답하세요.</p>
      </header>

      <section className="filter-grid" aria-label="질문 필터">
        <div className="field">
          <label htmlFor="difficulty">난이도</label>
          <select id="difficulty" value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty | "전체")}>
            {difficulties.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="category">카테고리</label>
          <select id="category" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option>전체</option>
            {questionCategories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <article className="drill-card">
        <div className="drill-card__meta">
          <div><Badge>{question.difficulty}</Badge><Badge>{question.category}</Badge></div>
          <span>{question.id.toUpperCase()} · 시도 {currentProgress?.attempts ?? 0}</span>
        </div>
        <h2>{question.question}</h2>
        <p className="muted">답을 펼치기 전에 실제로 말하세요. 완벽한 문장보다 의사결정 구조가 중요합니다.</p>
        <div className="timer-stack">
          <Timer seconds={30} label="준비" />
          <Timer seconds={60} label="답변" onComplete={() => updateQuestion(question.id, {}, true)} />
        </div>
        <button type="button" className="button button--primary button--full" onClick={() => setRevealed(true)}>
          답변을 마쳤습니다
        </button>
      </article>

      {revealed && (
        <section className="reveal-panel" aria-live="polite">
          <div className="callout">
            <strong>3문장 핵심답변</strong>
            <ol>{question.keyAnswer.map((line) => <li key={line}>{line}</li>)}</ol>
          </div>
          <Accordion title="60초 모범답변" eyebrow="말하기 구조" open>
            <p>{question.modelAnswer}</p>
            <h3>판단기준</h3>
            <ul>{question.metrics.map((metric) => <li key={metric}>{metric}</li>)}</ul>
            <h3>예상 반론</h3>
            <p>{question.counterArgument}</p>
          </Accordion>
          <Accordion title="면접관의 평가 의도" eyebrow="왜 묻는가">
            <p>{question.interviewerIntent}</p>
            <h3>피해야 할 답변</h3>
            <ul>{question.redFlags.map((flag) => <li key={flag}>{flag}</li>)}</ul>
          </Accordion>

          <div className="follow-up">
            <p className="eyebrow">FOLLOW-UP {followUpIndex + 1}/{question.followUps.length}</p>
            <h3>{question.followUps[followUpIndex]}</h3>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => setFollowUpIndex((value) => (value + 1) % question.followUps.length)}
            >
              다음 꼬리질문
            </button>
          </div>

          {question.difficulty === "CFO 압박" && (
            <div className="checklist">
              <h3>CFO 압박 자가검증</h3>
              {pressureChecklist.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={checked.includes(item)}
                    onChange={(event) =>
                      setChecked((current) =>
                        event.target.checked ? [...current, item] : current.filter((value) => value !== item),
                      )
                    }
                  />
                  <span>{item}</span>
                </label>
              ))}
              <strong>{checked.length}/8 통과</strong>
            </div>
          )}

          <div className="confidence">
            <h3>지금 답변의 자신감</h3>
            <div role="group" aria-label="자신감 점수">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  type="button"
                  key={score}
                  aria-pressed={currentProgress?.confidence === score}
                  className={currentProgress?.confidence === score ? "is-active" : ""}
                  onClick={() =>
                    updateQuestion(question.id, { confidence: score, completed: true }, !currentProgress?.completed)
                  }
                >
                  {score}
                </button>
              ))}
            </div>
            <p className="muted">1~2점은 자동으로 취약질문에 분류됩니다.</p>
          </div>

          <div className="field">
            <label htmlFor="question-note">개인 메모 · 이 기기에만 저장</label>
            <textarea
              id="question-note"
              rows={4}
              value={currentProgress?.note ?? ""}
              placeholder="내 숫자, 사례, 더 짧게 말할 문장을 적으세요. 개인정보·고객사명은 넣지 마세요."
              onChange={(event) => updateQuestion(question.id, { note: event.target.value })}
            />
          </div>

          <div className="drill-actions">
            <button
              type="button"
              className="button button--secondary"
              aria-pressed={currentProgress?.weak ?? false}
              onClick={() => updateQuestion(question.id, { weak: !currentProgress?.weak })}
            >
              {currentProgress?.weak ? "다시 묻기 저장됨 ✓" : "다시 묻기 저장"}
            </button>
            <button
              type="button"
              className="button button--ghost"
              aria-pressed={currentProgress?.bookmarked ?? false}
              onClick={() => updateQuestion(question.id, { bookmarked: !currentProgress?.bookmarked })}
            >
              {currentProgress?.bookmarked ? "북마크됨 ★" : "북마크 ☆"}
            </button>
          </div>

          <Accordion title="지원자 경험 연결" eyebrow="내 답변">
            <p>{question.candidateEvidence}</p>
          </Accordion>
          <Accordion title="근거 출처" eyebrow={`최종 확인 ${question.lastVerifiedAt}`}>
            <SourceList ids={question.sourceIds} />
          </Accordion>
        </section>
      )}

      <button type="button" className="button button--dark button--full" onClick={nextRandom}>
        다음 랜덤 질문
      </button>
    </main>
  );
}
