import { useEffect, useState } from "react";

interface TimerProps {
  seconds: number;
  label: string;
  onComplete?: () => void;
}

export function Timer({ seconds, label, onComplete }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const id = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(id);
          setRunning(false);
          onComplete?.();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [onComplete, remaining, running]);

  const minutes = Math.floor(remaining / 60);
  const secondsPart = String(remaining % 60).padStart(2, "0");

  return (
    <div className={`timer ${running ? "timer--running" : ""}`} aria-live="polite">
      <div>
        <small>{label}</small>
        <strong>{minutes}:{secondsPart}</strong>
      </div>
      <button
        type="button"
        className="button button--ghost"
        onClick={() => {
          if (remaining === 0) setRemaining(seconds);
          setRunning((value) => !value);
        }}
      >
        {running ? "일시정지" : remaining === 0 ? "다시 시작" : "시작"}
      </button>
    </div>
  );
}
