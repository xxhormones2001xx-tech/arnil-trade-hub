import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { useState } from "react";
import { Check } from "lucide-react";

export const Route = createFileRoute("/open-account")({
  head: () => ({
    meta: [
      { title: "Open an account — Arnil Etrade" },
      { name: "description", content: "Open a free Arnil Etrade brokerage account in minutes. No minimums. Get up to $1,000 bonus." },
      { property: "og:title", content: "Open an account — Arnil Etrade" },
      { property: "og:description", content: "Open your free brokerage account in minutes." },
    ],
  }),
  component: OpenAccount,
});

const steps = ["Account type", "Your details", "Review"];

function OpenAccount() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <SiteLayout ticker={false}>
      <section className="mx-auto max-w-2xl px-4 py-16 md:px-6">
        {done ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-ink"><Check className="h-6 w-6" /></div>
            <h1 className="mt-6 font-display text-3xl font-bold text-ink">You're on the list.</h1>
            <p className="mt-3 text-muted-foreground">Thanks for signing up. We'll email next steps within one business day.</p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center gap-3">
              {steps.map((s, i) => (
                <div key={s} className="flex flex-1 items-center gap-3">
                  <div className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ${i <= step ? "bg-ink text-background" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
                  <span className={`text-sm ${i === step ? "font-semibold text-ink" : "text-muted-foreground"}`}>{s}</span>
                  {i < steps.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-ink" : "bg-border"}`} />}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); if (step < 2) setStep(step + 1); else setDone(true); }}
              className="rounded-2xl border border-border bg-card p-8"
            >
              {step === 0 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink">Choose an account type</h2>
                  <div className="mt-6 space-y-3">
                    {["Individual brokerage", "Joint brokerage", "Traditional IRA", "Roth IRA"].map((t, i) => (
                      <label key={t} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 hover:border-brand">
                        <input type="radio" name="type" defaultChecked={i === 0} className="accent-brand" />
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
                    <Field label="First name" required />
                    <Field label="Last name" required />
                    <Field label="Email" type="email" required />
                    <Field label="Phone" type="tel" required />
                    <div className="sm:col-span-2"><Field label="Country of residence" defaultValue="United States" /></div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink">Review</h2>
                  <p className="mt-3 text-sm text-muted-foreground">By continuing, you agree to Arnil Etrade's terms and acknowledge our privacy policy. Investing involves risk, including loss of principal.</p>
                  <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4">
                    <input type="checkbox" required className="accent-brand" />
                    <span className="text-sm text-ink">I agree to the terms & disclosures.</span>
                  </label>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="text-sm font-semibold text-muted-foreground disabled:opacity-40">Back</button>
                <button className="rounded-md bg-ink px-6 py-3 font-semibold text-background hover:bg-ink/85">{step === 2 ? "Submit application" : "Continue"}</button>
              </div>
            </form>
          </>
        )}
      </section>
    </SiteLayout>
  );
}

function Field({ label, type = "text", required, defaultValue }: { label: string; type?: string; required?: boolean; defaultValue?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-ink">{label}</label>
      <input type={type} required={required} defaultValue={defaultValue} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand" />
    </div>
  );
}
