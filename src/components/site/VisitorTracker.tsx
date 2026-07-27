import { useEffect } from "react";

function getSessionId(): string {
  try {
    const key = "arnil_sid";
    let id = sessionStorage.getItem(key);
    if (!id) {
      id =
        (crypto as any)?.randomUUID?.() ||
        Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(key, id);
    }
    return id;
  } catch {
    return "anon-" + Math.random().toString(36).slice(2);
  }
}

export function VisitorTracker() {
  useEffect(() => {
    const session_id = getSessionId();
    const send = () => {
      fetch("/api/public/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          session_id,
          path: window.location.pathname + window.location.search,
          referrer: document.referrer || "",
        }),
      }).catch(() => {});
    };
    send();
    const interval = setInterval(send, 30_000); // heartbeat every 30s
    const onFocus = () => send();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, []);
  return null;
}
