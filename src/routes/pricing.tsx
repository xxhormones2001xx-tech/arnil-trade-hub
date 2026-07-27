import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./investing";
import { Check, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & Plans — Arnil Etrade" },
      { name: "description", content: "Zero commissions on stocks and ETFs. Choose from Instant Access, Standard, Active Trader or Wealth plans." },
      { property: "og:title", content: "Pricing — Arnil Etrade" },
      { property: "og:description", content: "Transparent, low pricing across every market." },
    ],
  }),
  component: Pricing,
});

type Plan = {
  id: string;
  name: string;
  price: string;
  period: string;
  tag: string;
  cta: string;
  features: string[];
  featured: boolean;
  sort_order: number;
};

function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    supabase
      .from("plans")
      .select("id,name,price,period,tag,cta,features,featured,sort_order")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => setPlans((data as Plan[]) ?? []));
  }, []);

  return (
    <SiteLayout>
      <PageHero eyebrow="Pricing" title="Transparent pricing. No hidden fees." desc="Zero commissions on stocks and ETFs. Pay only for what you use." />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-16 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <div key={p.id} className={`rounded-2xl border p-6 sm:p-8 ${p.featured ? "border-brand bg-ink text-background shadow-2xl" : "border-border bg-card"}`}>
              <div className="flex items-center justify-between gap-2">
                <p className={`text-xs font-semibold uppercase tracking-widest ${p.featured ? "text-brand" : "text-muted-foreground"}`}>{p.tag}</p>
                {p.featured ? <Zap className="h-5 w-5 shrink-0 text-brand" /> : null}
              </div>
              <h3 className={`mt-2 font-display text-xl sm:text-2xl font-bold ${p.featured ? "text-background" : "text-ink"}`}>{p.name}</h3>
              <p className={`mt-4 font-display text-4xl sm:text-5xl font-bold ${p.featured ? "text-background" : "text-ink"}`}>{p.price}</p>
              <p className={`mt-1 text-sm ${p.featured ? "text-background/60" : "text-muted-foreground"}`}>{p.period}</p>
              <ul className="mt-6 sm:mt-8 space-y-3 text-sm">
                {(p.features ?? []).map((f, i) => (
                  <li key={i} className={`flex items-start gap-2 ${p.featured ? "text-background/90" : "text-ink"}`}>
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span className="min-w-0 break-words">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/open-account"
                search={{ plan: p.name }}
                className={`mt-8 block rounded-md px-6 py-3 text-center font-semibold ${p.featured ? "bg-brand text-ink hover:bg-brand/90" : "bg-ink text-background hover:bg-ink/85"}`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 sm:mt-20">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">Detailed pricing</h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <tbody className="bg-card">
                {[
                  ["Instant Access activation fee", "$50 one-time"],
                  ["US stocks & ETFs (online)", "$0"],
                  ["Options — per contract", "$0.50"],
                  ["Futures — per contract, per side", "$1.50"],
                  ["Crypto spread", "~1.0%"],
                  ["Mutual funds (no-load, NTF)", "$0"],
                  ["Broker-assisted trade", "$25"],
                  ["Account maintenance", "$0"],
                  ["Domestic wire transfer", "$25"],
                ].map(([l, v]) => (
                  <tr key={l} className="border-t border-border first:border-0">
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-ink">{l}</td>
                    <td className="px-4 sm:px-5 py-3 sm:py-4 text-right font-semibold text-ink">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
