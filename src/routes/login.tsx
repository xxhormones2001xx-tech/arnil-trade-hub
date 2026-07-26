import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Arnil Etrade" },
      { name: "description", content: "Log in to your Arnil Etrade account to manage investments and place trades." },
      { property: "og:title", content: "Log in — Arnil Etrade" },
      { property: "og:description", content: "Access your Arnil Etrade brokerage account." },
    ],
  }),
  component: Login,
});

function Login() {
  const [err, setErr] = useState("");
  return (
    <SiteLayout ticker={false}>
      <section className="mx-auto grid min-h-[80vh] max-w-md px-4 py-16 md:px-6">
        <div className="rounded-2xl border border-border bg-card p-8">
          <h1 className="font-display text-3xl font-bold text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Log in to your Arnil Etrade account.</p>
          <form onSubmit={(e) => { e.preventDefault(); setErr("Demo site — connect Lovable Cloud to enable real accounts."); }} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium text-ink">Username or email</label>
              <input required className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand" />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">Password</label>
              <input type="password" required className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand" />
            </div>
            {err && <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{err}</p>}
            <button className="w-full rounded-md bg-ink px-6 py-3 font-semibold text-background hover:bg-ink/85">Log in</button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to Arnil Etrade? <Link to="/open-account" className="font-semibold text-brand hover:underline">Open an account</Link>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
