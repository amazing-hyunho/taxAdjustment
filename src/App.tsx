import { useCallback, useEffect, useState } from "react";
import { BottomNav, type PageId } from "./components/BottomNav";
import { usePwaStatus } from "./hooks/usePwaStatus";
import { useStudyState } from "./hooks/useStudyState";
import { DealPage } from "./pages/DealPage";
import { DrillPage } from "./pages/DrillPage";
import { HomePage } from "./pages/HomePage";
import { SummaryPage } from "./pages/SummaryPage";
import { WeakPage } from "./pages/WeakPage";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const pageFromHash = (): PageId => {
  const value = window.location.hash.replace("#/", "");
  return ["home", "summary", "deal", "drill", "weak"].includes(value) ? (value as PageId) : "home";
};

export default function App() {
  const [page, setPageState] = useState<PageId>(pageFromHash);
  const [questionId, setQuestionId] = useState<string>();
  const [online, setOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent>();
  const { state, stats, updateQuestion, setTheme } = useStudyState();
  const { needRefresh, setNeedRefresh, offlineReady, setOfflineReady, updateServiceWorker } = usePwaStatus();

  const setPage = useCallback((next: PageId) => {
    window.location.hash = `/${next}`;
    setPageState(next);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onHashChange = () => setPageState(pageFromHash());
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  const startQuestion = (id: string) => {
    setQuestionId(id);
    setPage("drill");
  };

  const cycleTheme = () => {
    const next = state.theme === "system" ? "light" : state.theme === "light" ? "dark" : "system";
    setTheme(next);
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>
      <header className="topbar">
        <button type="button" className="brand" onClick={() => setPage("home")} aria-label="홈으로">
          <span>N</span>
          <strong>CFO DRILL</strong>
        </button>
        <div>
          {installPrompt && (
            <button
              type="button"
              className="topbar__button"
              onClick={async () => {
                await installPrompt.prompt();
                await installPrompt.userChoice;
                setInstallPrompt(undefined);
              }}
            >
              설치
            </button>
          )}
          <button type="button" className="topbar__button" onClick={cycleTheme} aria-label={`테마 변경, 현재 ${state.theme}`}>
            {state.theme === "dark" ? "☾" : state.theme === "light" ? "☀" : "◐"}
          </button>
        </div>
      </header>

      {(needRefresh || offlineReady) && (
        <aside className="update-toast" role="status">
          <p>{needRefresh ? "새 학습 콘텐츠가 준비됐습니다." : "오프라인 학습 준비가 끝났습니다."}</p>
          {needRefresh && (
            <button type="button" onClick={updateServiceWorker}>업데이트하기</button>
          )}
          <button
            type="button"
            aria-label="알림 닫기"
            onClick={() => {
              setNeedRefresh(false);
              setOfflineReady(false);
            }}
          >
            ×
          </button>
        </aside>
      )}

      {page === "home" && (
        <HomePage
          progress={state.questions}
          stats={stats}
          lastStudyDate={state.lastStudyDate}
          online={online}
          onNavigate={setPage}
          onStartQuestion={startQuestion}
        />
      )}
      {page === "summary" && <SummaryPage />}
      {page === "deal" && <DealPage />}
      {page === "drill" && (
        <DrillPage initialQuestionId={questionId} progress={state.questions} updateQuestion={updateQuestion} />
      )}
      {page === "weak" && <WeakPage progress={state.questions} onStartQuestion={startQuestion} />}
      <BottomNav page={page} onNavigate={setPage} />
    </div>
  );
}
