import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

const KEY = "arnil_cookie_consent_v1";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {}
  }, []);

  const persist = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    setShow(false);
  };

  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 md:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-2xl md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/15 text-brand">
            <Cookie className="h-4 w-4" />
          </span>
          <div className="text-sm text-ink">
            <p className="font-semibold">We value your privacy</p>
            <p className="mt-1 text-muted-foreground">
              Arnil Etrade uses cookies to secure your session, remember preferences and improve
              performance. By clicking "Accept all", you agree to our use of cookies.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:shrink-0">
          <button
            onClick={() => persist("rejected")}
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-ink hover:bg-muted"
          >
            Reject
          </button>
          <button
            onClick={() => persist("accepted")}
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-background hover:bg-ink/85"
          >
            Accept all
          </button>
          <button
            onClick={() => persist("rejected")}
            className="ml-1 rounded-md p-2 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
