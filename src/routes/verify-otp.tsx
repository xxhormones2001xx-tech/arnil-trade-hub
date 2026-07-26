import { createFileRoute, useSearch } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { verifyOtp, resendOtp } from "@/lib/payments.functions";
import { Check, Loader2 } from "lucide-react";

export const Route = createFileRoute("/verify-otp")({
  head: () => ({
    meta: [
      { title: "Verify your email — Arnil Etrade" },
      { name: "description", content: "Enter the verification code sent to your email to complete your Arnil Etrade account setup." },
      { property: "og:title", content: "Verify your email — Arnil Etrade" },
      { property: "og:description", content: "Enter the verification code sent to your email." },
    ],
  }),
  component: VerifyOtp,
});

function VerifyOtp() {
  const { application_id, session_id } = useSearch({ strict: false }) as {
    application_id?: string;
    session_id?: string;
  };
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [resendStatus, setResendStatus] = useState<"idle" | "loading" | "sent">("idle");

  const doVerify = useServerFn(verifyOtp);
  const doResend = useServerFn(resendOtp);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application_id || !email || code.length !== 6) return;
    setStatus("loading");
    try {
      await doVerify({ data: { applicationId: application_id, email, code } });
      setStatus("success");
      setMessage("Your email has been verified. We'll activate your account within one business day.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Invalid or expired code.");
    }
  };

  const handleResend = async () => {
    if (!application_id || !email) return;
    setResendStatus("loading");
    try {
      await doResend({ data: { applicationId: application_id, email } });
      setResendStatus("sent");
    } catch (err) {
      setResendStatus("idle");
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Could not resend code.");
    }
  };

  return (
    <SiteLayout ticker={false}>
      <section className="mx-auto max-w-md px-4 py-16 md:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          {status === "success" ? (
            <>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-ink">
                <Check className="h-6 w-6" />
              </div>
              <h1 className="mt-6 font-display text-2xl font-bold text-ink">Verified</h1>
              <p className="mt-3 text-muted-foreground">{message}</p>
            </>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-ink">Verify your email</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Enter the 6-digit code sent to your email after payment.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
                <div>
                  <label className="text-sm font-medium text-ink">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink">Verification code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-center text-lg tracking-[0.25em] outline-none focus:border-brand"
                    placeholder="000000"
                  />
                </div>
                {message && (
                  <p className={`text-sm ${status === "error" ? "text-danger" : "text-success"}`}>{message}</p>
                )}
                <button
                  disabled={status === "loading" || code.length !== 6}
                  className="flex w-full items-center justify-center rounded-md bg-ink px-6 py-3 font-semibold text-background hover:bg-ink/85 disabled:opacity-50"
                >
                  {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                </button>
              </form>
              <div className="mt-4">
                <button
                  onClick={handleResend}
                  disabled={resendStatus === "loading" || resendStatus === "sent" || !email}
                  className="text-sm font-medium text-brand hover:underline disabled:opacity-50"
                >
                  {resendStatus === "sent" ? "Code resent" : resendStatus === "loading" ? "Sending..." : "Resend code"}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
