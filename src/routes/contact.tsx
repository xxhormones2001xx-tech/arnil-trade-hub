import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./investing";
import { useState } from "react";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Arnil Etrade" },
      { name: "description", content: "Get in touch with Arnil Etrade support 24/7 via chat, phone, WhatsApp or email." },
      { property: "og:title", content: "Contact — Arnil Etrade" },
      { property: "og:description", content: "24/7 support via chat, phone, WhatsApp or email." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <SiteLayout>
      <PageHero eyebrow="Contact" title="We're here 24/7." desc="Real people, ready to help — whenever you need us." />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:px-6">
        <div>
          <div className="space-y-4">
            {[
              { icon: MessageCircle, title: "WhatsApp us", desc: "+1 662 607-1912", href: "https://wa.me/16626071912" },
              { icon: Phone, title: "Call support", desc: "+1 662 607-1912 · 24/7", href: "tel:+16626071912" },
              { icon: Mail, title: "support@arniletrade.com", desc: "We reply within a few hours", href: "mailto:support@arniletrade.com" },
              { icon: MapPin, title: "Head office", desc: "403 Cummins Street, Franklin, Tennessee 37064" },
            ].map((c) => {
              const Inner = (
                <>
                  <c.icon className="h-6 w-6 text-brand" />
                  <div>
                    <p className="font-semibold text-ink">{c.title}</p>
                    <p className="text-sm text-muted-foreground">{c.desc}</p>
                  </div>
                </>
              );
              return c.href ? (
                <a key={c.title} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition hover:border-brand">
                  {Inner}
                </a>
              ) : (
                <div key={c.title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">{Inner}</div>
              );
            })}
          </div>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="rounded-2xl border border-border bg-card p-8"
        >
          {sent ? (
            <div className="py-16 text-center">
              <p className="font-display text-2xl font-bold text-ink">Message sent</p>
              <p className="mt-2 text-muted-foreground">A specialist will reach out shortly.</p>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl font-bold text-ink">Send us a message</h2>
              <div className="mt-6 space-y-4">
                <Field label="Full name" name="name" required />
                <Field label="Email" name="email" type="email" required />
                <Field label="Subject" name="subject" />
                <div>
                  <label className="text-sm font-medium text-ink">Message</label>
                  <textarea rows={5} required className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand" />
                </div>
                <button type="submit" className="w-full rounded-md bg-ink px-6 py-3 font-semibold text-background hover:bg-ink/85">Send message</button>
              </div>
            </>
          )}
        </form>
      </section>
    </SiteLayout>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-medium text-ink" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} required={required} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand" />
    </div>
  );
}
