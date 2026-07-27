import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createCheckoutSession } from "@/lib/payments.functions";
import { supabase } from "@/integrations/supabase/client";
import { Check, Loader2 } from "lucide-react";

export const Route = createFileRoute("/open-account")({
  head: () => ({
    meta: [
      { title: "Open an account — Arnil Etrade" },
      { name: "description", content: "Open a free Arnil Etrade brokerage account in minutes. No minimums. Instant Access available for $50." },
      { property: "og:title", content: "Open an account — Arnil Etrade" },
      { property: "og:description", content: "Open your brokerage account in minutes." },
    ],
  }),
  component: OpenAccount,
});

const steps = ["Account type", "Your details", "Review"];
const accountTypes = ["Individual brokerage", "Joint brokerage", "Traditional IRA", "Roth IRA"];

type PlanOpt = { name: string; amount_cents: number };

function OpenAccount() {
  const { plan } = useSearch({ strict: false }) as { plan?: string };
  const navigate = useNavigate();
  const [planOptions, setPlanOptions] = useState<PlanOpt[]>([]);
  const [selectedPlan, setSelectedPlan] = useState(plan ?? "Instant Access");
  const currentPlan = planOptions.find((p) => p.name === selectedPlan);
  const isInstantAccess = (currentPlan?.amount_cents ?? 0) > 0;

  useEffect(() => {
    supabase
      .from("plans")
      .select("name, amount_cents, sort_order")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => setPlanOptions((data as PlanOpt[]) ?? []));
  }, []);

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    accountType: accountTypes[0],
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "United States",
  });

  const doCreateCheckout = useServerFn(createCheckoutSession);

  const update = (field: keyof typeof form, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const result = await doCreateCheckout({
        data: {
          ...form,
          planName: selectedPlan,
          amount: currentPlan?.amount_cents ?? 0,
          currency: "usd",
          origin,
        },
      });

      if (result.requiresPayment && result.sessionUrl) {
        window.location.href = result.sessionUrl;
        return;
      }

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout ticker={false}>
      <section className="mx-auto max-w-2xl px-4 py-16 md:px-6">
        {done ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-ink">
              <Check className="h-6 w-6" />
            </div>
            <h1 className="mt-6 font-display text-3xl font-bold text-ink">You're on the list.</h1>
            <p className="mt-3 text-muted-foreground">
              Thanks for signing up. We'll email next steps within one business day.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center gap-3">
              {steps.map((s, i) => (
                <div key={s} className="flex flex-1 items-center gap-3">
                  <div
                    className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ${
                      i <= step ? "bg-ink text-background" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`text-sm ${i === step ? "font-semibold text-ink" : "text-muted-foreground"}`}>{s}</span>
                  {i < steps.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-ink" : "bg-border"}`} />}
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <div className="mb-6 rounded-lg bg-muted p-4">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Select your plan</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 font-display text-lg font-bold text-ink outline-none focus:border-brand"
                >
                  {planOptions.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name} — {p.amount_cents > 0 ? `$${(p.amount_cents / 100).toFixed(2)} one-time` : "Free"}
                    </option>
                  ))}
                </select>
                {isInstantAccess && <p className="mt-2 text-sm text-muted-foreground">${((currentPlan?.amount_cents ?? 0) / 100).toFixed(2)} one-time activation fee — instant account access after payment.</p>}
              </div>

              {step === 0 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink">Choose an account type</h2>
                  <div className="mt-6 space-y-3">
                    {accountTypes.map((t) => (
                      <label key={t} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 hover:border-brand">
                        <input
                          type="radio"
                          name="type"
                          value={t}
                          checked={form.accountType === t}
                          onChange={(e) => update("accountType", e.target.value)}
                          className="accent-brand"
                        />
                        <span className="text-ink">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {step === 1 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink">Your details</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field label="First name" required value={form.firstName} onChange={(v) => update("firstName", v)} />
                    <Field label="Last name" required value={form.lastName} onChange={(v) => update("lastName", v)} />
                    <Field label="Email" type="email" required value={form.email} onChange={(v) => update("email", v)} />
                    <Field label="Phone" type="tel" required value={form.phone} onChange={(v) => update("phone", v)} />
                    <div className="sm:col-span-2">
                      <Field label="Country of residence" value={form.country} onChange={(v) => update("country", v)} />
                    </div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink">Review</h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    By continuing, you agree to Arnil Etrade's terms and acknowledge our privacy policy. Investing involves risk, including loss of principal.
                  </p>
                  {isInstantAccess && (
                    <p className="mt-3 text-sm text-ink">
                      You will be redirected to Stripe to complete the <strong>${((currentPlan?.amount_cents ?? 0) / 100).toFixed(2)}</strong> {selectedPlan} payment.
                    </p>
                  )}
                  <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4">
                    <input type="checkbox" required className="accent-brand" />
                    <span className="text-sm text-ink">I agree to the terms & disclosures.</span>
                  </label>
                </div>
              )}

              {error && <p className="mt-4 text-sm text-danger">{error}</p>}

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="text-sm font-semibold text-muted-foreground disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  disabled={loading}
                  className="flex items-center gap-2 rounded-md bg-ink px-6 py-3 font-semibold text-background hover:bg-ink/85 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {step === 2 ? (isInstantAccess ? "Pay & register" : "Submit application") : "Continue"}
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  type = "text",
  required,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-ink">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand"
      />
    </div>
  );
}
