import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./investing";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Arnil Etrade" },
      { name: "description", content: "Arnil Etrade is a modern online brokerage on a mission to make investing accessible to everyone." },
      { property: "og:title", content: "About — Arnil Etrade" },
      { property: "og:description", content: "Our mission is to make investing accessible to everyone." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <PageHero eyebrow="About" title="Investing, made for everyone." desc="We're building the brokerage we always wanted — powerful, transparent and designed around real people." />
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <p className="text-lg text-muted-foreground">
          Arnil Etrade was founded on a simple belief: financial markets should be open, fair and understandable. We combine institution-grade infrastructure with a modern experience so anyone can invest with confidence.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            ["2018", "Founded"],
            ["2.4M+", "Investors served"],
            ["$180B", "Assets under custody"],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="font-display text-4xl font-bold text-ink">{n}</p>
              <p className="mt-1 text-sm text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {[
            ["Transparent", "No hidden fees. Ever. We disclose every cost, plainly."],
            ["Secure", "SIPC-protected accounts, bank-grade encryption, and 2FA by default."],
            ["Human support", "Real people, available 24/7 via chat, phone or email."],
            ["Modern tools", "A platform designed with clarity and speed in mind."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-xl font-semibold text-ink">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
