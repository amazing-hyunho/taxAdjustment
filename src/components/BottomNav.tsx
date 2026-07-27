export type PageId = "home" | "summary" | "deal" | "drill" | "weak";

const items: { id: PageId; label: string; icon: string }[] = [
  { id: "home", label: "홈", icon: "⌂" },
  { id: "summary", label: "요약", icon: "≡" },
  { id: "deal", label: "Deal", icon: "◇" },
  { id: "drill", label: "Drill", icon: "●" },
  { id: "weak", label: "약점", icon: "↺" },
];

export function BottomNav({ page, onNavigate }: { page: PageId; onNavigate: (page: PageId) => void }) {
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          className={page === item.id ? "is-active" : ""}
          aria-current={page === item.id ? "page" : undefined}
          onClick={() => onNavigate(item.id)}
        >
          <span aria-hidden="true">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
