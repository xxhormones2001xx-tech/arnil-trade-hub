import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./investing";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Arnil Etrade" },
      { name: "description", content: "Answers to the most common questions about opening an account, funding, trading and fees at Arnil Etrade." },
      { property: "og:title", content: "FAQ — Arnil Etrade" },
      { property: "og:description", content: "Common questions about accounts, funding, trading and fees." },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    }],
  }),
  component: FAQ,
});

const faqs = [
  { q: "How long does it take to open an account?", a: "Most accounts open in under 5 minutes. Instant Access customers are activated the same business day." },
  { q: "What is the Instant Access plan?", a: "Instant Access is a $50 one-time activation that gives you same-day approval, priority KYC review, a $50 platform credit and instant deposits up to $1,000." },
  { q: "Is there a minimum deposit?", a: "No. You can open a Standard account with $0 and start with fractional shares from $1." },
  { q: "Are stock and ETF trades really commission-free?", a: "Yes. Online US-listed stocks and ETFs trade at $0 commission on every plan." },
  { q: "How do I contact support?", a: "24/7 via WhatsApp at +1 662 607-1912, phone at +1 662 607-1912, or email support@arniletrade.com." },
  { q: "Where is Arnil Etrade located?", a: "Our head office is at 403 Cummins Street, Franklin, Tennessee 37064." },
  { q: "Is my money protected?", a: "Securities in your account are protected up to applicable SIPC limits, plus supplemental coverage from our carriers." },
  { q: "Can I trade crypto?", a: "Yes. Bitcoin, Ethereum and other major cryptocurrencies are available directly from your Arnil Etrade account." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <SiteLayout>
      <PageHero eyebrow="Help center" title="Frequently asked questions." desc="Everything you need to know about Arnil Etrade." />
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="overflow-hidden rounded-xl border border-border bg-card">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-display font-semibold text-ink">{f.q}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="border-t border-border px-5 py-4 text-sm text-muted-foreground">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
