import { getSources } from "../content/sources";

export function SourceList({ ids }: { ids: string[] }) {
  const items = getSources(ids);
  if (items.length === 0) {
    return <p className="muted">이 항목은 면접 전략 또는 지원자 경험 연결이며 외부 사실을 단정하지 않습니다.</p>;
  }
  return (
    <ul className="source-list">
      {items.map((source) => (
        <li key={source.id}>
          <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
          <span>{source.publisher} · {source.publishedAt} · 최종 확인 {source.verifiedAt} · {source.type}</span>
        </li>
      ))}
    </ul>
  );
}
