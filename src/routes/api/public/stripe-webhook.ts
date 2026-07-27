import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendOtpEmail, sendAdminNotification, sendWelcomeEmail } from "@/lib/otp-email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", { typescript: true });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const signature = request.headers.get("stripe-signature");
        const body = await request.text();

        if (!webhookSecret) {
          console.error("STRIPE_WEBHOOK_SECRET is not configured");
          return new Response("Webhook secret not configured", { status: 500 });
        }

        let event: Stripe.Event;
        try {
          event = stripe.webhooks.constructEvent(body, signature ?? "", webhookSecret);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Invalid signature";
          console.error("Stripe webhook signature verification failed:", message);
          return new Response(`Webhook Error: ${message}`, { status: 400 });
        }

        if (event.type === "checkout.session.completed") {
          const session = event.data.object as Stripe.Checkout.Session;
          const applicationId = session.metadata?.application_id;
          const paymentId = session.metadata?.payment_id;

          if (!applicationId || !paymentId) {
            return new Response("Missing metadata", { status: 400 });
          }

          const { data: application, error: appError } = await supabaseAdmin
            .from("account_applications")
            .select("*")
            .eq("id", applicationId)
            .single();

          if (appError || !application) {
            console.error("Application not found:", appError);
            return new Response("Application not found", { status: 404 });
          }

          const { error: paymentUpdateError } = await supabaseAdmin
            .from("payments")
            .update({
              status: "succeeded",
              stripe_payment_intent_id: session.payment_intent as string,
              stripe_customer_id: session.customer as string,
              paid_at: new Date().toISOString(),
            })
            .eq("id", paymentId);

          if (paymentUpdateError) {
            console.error("Failed to update payment:", paymentUpdateError);
          }

          const { error: appUpdateError } = await supabaseAdmin
            .from("account_applications")
            .update({
              status: "paid",
              paid_at: new Date().toISOString(),
              stripe_customer_id: session.customer as string,
            })
            .eq("id", applicationId);

          if (appUpdateError) {
            console.error("Failed to update application:", appUpdateError);
          }

          const code = Math.floor(100000 + Math.random() * 900000).toString();
          const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

          await supabaseAdmin.from("otp_codes").insert({
            application_id: applicationId,
            email: application.email,
            code,
            expires_at: expiresAt,
          });

          try {
            await sendOtpEmail({
              to: application.email,
              firstName: application.first_name ?? "",
              code,
              planName: application.plan_name,
              applicationId,
            });
          } catch (e) {
            console.error("Failed to send OTP email:", e);
          }

          try {
            await sendWelcomeEmail({
              to: application.email,
              firstName: application.first_name ?? "",
              planName: application.plan_name,
            });
          } catch (e) {
            console.error("Failed to send welcome email:", e);
          }

          try {
            const amountCents = (session.amount_total ?? session.amount_subtotal ?? 0);
            const currency = (session.currency ?? "usd").toUpperCase();
            const amountStr = `${currency} $${(amountCents / 100).toFixed(2)}`;
            const now = new Date();
            await sendAdminNotification({
              to: "sakihhassan7883@gmail.com",
              firstName: application.first_name ?? "",
              lastName: application.last_name ?? "",
              email: application.email,
              phone: application.phone ?? "",
              country: application.country ?? "",
              accountType: application.account_type ?? "",
              planName: application.plan_name ?? "",
              amount: `${amountStr} • ${now.toUTCString()}`,
              status: "paid",
            });
          } catch (e) {
            console.error("Failed to send admin notification:", e);
          }
        }

        return new Response(JSON.stringify({ received: true }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
