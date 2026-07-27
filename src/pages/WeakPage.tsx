import { useMemo, useState } from "react";
import { Badge } from "../components/Badge";
import { questions } from "../content/questions";
import type { QuestionProgress } from "../types";

type Filter = "취약" | "북마크" | "미완료" | "전체";

export function WeakPage({
  progress,
  onStartQuestion,
}: {
  progress: Record<string, QuestionProgress>;
  onStartQuestion: (id: string) => void;
}) {
  const [filter, setFilter] = useState<Filter>("취약");
  const filtered = useMemo(
    () =>
      questions
        .filter((question) => {
          const item = progress[question.id];
          if (filter === "취약") return item?.weak;
          if (filter === "북마크") return item?.bookmarked;
          if (filter === "미완료") return !item?.completed;
          return true;
        })
        .sort((a, b) => (progress[a.id]?.confidence ?? 0) - (progress[b.id]?.confidence ?? 0)),
    [filter, progress],
  );

  return (
    <main id="main-content" className="page">
      <header className="page-header">
        <p className="eyebrow">RETRY LOOP</p>
        <h1>약점은 저장하고,<br />짧게 다시 묻습니다.</h1>
        <p>자신감 1~2점 또는 ‘다시 묻기’로 저장한 질문부터 반복하세요.</p>
      </header>
      <div className="segmented" role="tablist" aria-label="약점 필터">
        {(["취약", "북마크", "미완료", "전체"] as Filter[]).map((item) => (
          <button
            type="button"
            key={item}
            role="tab"
            aria-selected={filter === item}
            className={filter === item ? "is-active" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <strong>아직 {filter} 질문이 없습니다.</strong>
          <p>Drill에서 답변하고 자신감을 평가하면 여기에 자동으로 모입니다.</p>
        </div>
      ) : (
        <div className="weak-list">
          {filtered.map((question) => {
            const item = progress[question.id];
            return (
              <button type="button" key={question.id} onClick={() => onStartQuestion(question.id)}>
                <div>
                  <Badge>{question.category}</Badge>
                  <Badge>{question.difficulty}</Badge>
                </div>
                <strong>{question.question}</strong>
                <span>
                  자신감 {item?.confidence ?? "–"} · 시도 {item?.attempts ?? 0}
                  {item?.note && " · 메모 있음"}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
}
