import { useMemo } from "react";
import { cfoProfile } from "../content/cfo-profile";
import { questions } from "../content/questions";
import type { QuestionProgress } from "../types";
import { Badge } from "../components/Badge";
import type { PageId } from "../components/BottomNav";

interface HomePageProps {
  progress: Record<string, QuestionProgress>;
  stats: { completed: number; weak: number; attempts: number; streak: number };
  lastStudyDate?: string;
  online: boolean;
  onNavigate: (page: PageId) => void;
  onStartQuestion: (id: string) => void;
}

export function HomePage({
  progress,
  stats,
  lastStudyDate,
  online,
  onNavigate,
  onStartQuestion,
}: HomePageProps) {
  const dailyQuestions = useMemo(() => {
    const day = new Date().getDate();
    return Array.from({ length: 5 }, (_, index) => questions[(day * 7 + index * 11) % questions.length]).filter(
      (item): item is (typeof questions)[number] => Boolean(item),
    );
  }, []);
  const completionRate = Math.round((stats.completed / questions.length) * 100);

  return (
    <main id="main-content" className="page">
      <section className="hero">
        <div className="hero__topline">
          <Badge>{online ? "온라인" : "오프라인 학습 가능"}</Badge>
          <span>{stats.streak}일 연속</span>
        </div>
        <p className="eyebrow">NAVER CFO INTERVIEW DRILL</p>
        <h1>오늘도 60초,<br />결론부터 말해보세요.</h1>
        <p>{cfoProfile.headline}</p>
        <div className="hero__actions">
          <button type="button" className="button button--primary" onClick={() => onNavigate("summary")}>
            3분 요약 시작
          </button>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => {
              const random = questions[Math.floor(Math.random() * questions.length)];
              if (random) onStartQuestion(random.id);
            }}
          >
            랜덤 압박질문
          </button>
        </div>
      </section>

      <section aria-labelledby="progress-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MY PACE</p>
            <h2 id="progress-title">학습 진행</h2>
          </div>
          <strong>{completionRate}%</strong>
        </div>
        <div className="progress-track" aria-label={`전체 질문의 ${completionRate}% 완료`}>
          <span style={{ width: `${completionRate}%` }} />
        </div>
        <div className="stat-grid">
          <div><strong>{stats.completed}</strong><span>완료</span></div>
          <div><strong>{stats.weak}</strong><span>취약</span></div>
          <div><strong>{stats.attempts}</strong><span>답변 시도</span></div>
        </div>
        <p className="muted">마지막 학습: {lastStudyDate ?? "아직 기록 없음"} · 진행 정보는 이 기기에만 저장됩니다.</p>
      </section>

      <section aria-labelledby="daily-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">TODAY'S FIVE</p>
            <h2 id="daily-title">면접까지 오늘의 핵심 5개</h2>
          </div>
        </div>
        <div className="question-list">
          {dailyQuestions.map((question, index) => (
            <button type="button" key={question.id} onClick={() => onStartQuestion(question.id)}>
              <span className="question-list__number">0{index + 1}</span>
              <span>
                <small>{question.category} · {question.difficulty}</small>
                <strong>{question.question}</strong>
              </span>
              <span aria-label={progress[question.id]?.completed ? "완료" : "미완료"}>
                {progress[question.id]?.completed ? "✓" : "→"}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="quick-grid" aria-label="빠른 학습 메뉴">
        <button type="button" onClick={() => onNavigate("deal")}>
          <small>DEAL ROOM</small>
          <strong>포괄적 주식교환</strong>
          <span>6개 관점으로 검증 →</span>
        </button>
        <button type="button" onClick={() => onNavigate("weak")}>
          <small>RETRY</small>
          <strong>취약질문 {stats.weak}개</strong>
          <span>낮은 자신감부터 →</span>
        </button>
      </section>
    </main>
  );
}
