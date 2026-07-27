import { useEffect, useRef, useState } from "react";

export function usePwaStatus() {
  const registration = useRef<ServiceWorkerRegistration | undefined>(undefined);
  const [offlineReady, setOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || import.meta.env.DEV) return;
    let disposed = false;

    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).then((current) => {
      if (disposed) return;
      registration.current = current;
      if (navigator.serviceWorker.controller) setOfflineReady(true);

      current.addEventListener("updatefound", () => {
        const worker = current.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state !== "installed") return;
          if (navigator.serviceWorker.controller) setNeedRefresh(true);
          else setOfflineReady(true);
        });
      });
    });

    return () => {
      disposed = true;
    };
  }, []);

  const updateServiceWorker = () => {
    const waiting = registration.current?.waiting;
    if (!waiting) {
      void registration.current?.update();
      return;
    }
    navigator.serviceWorker.addEventListener("controllerchange", () => window.location.reload(), { once: true });
    waiting.postMessage({ type: "SKIP_WAITING" });
  };

  return {
    needRefresh,
    setNeedRefresh,
    offlineReady,
    setOfflineReady,
    updateServiceWorker,
  };
}
