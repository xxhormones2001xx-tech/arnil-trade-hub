import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  typescript: true,
});

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

const applicationSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  country: z.string().default("United States"),
  accountType: z.string().default("Individual brokerage"),
  planName: z.string().default("Standard"),
  amount: z.number().int().default(5000),
  currency: z.string().default("usd"),
  origin: z.string().url(),
});

async function sendAdminAndWelcome(application: {
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  phone?: string | null;
  country?: string | null;
  account_type?: string | null;
  plan_name?: string | null;
  status?: string | null;
  amount?: string;
}) {
  const { sendAdminNotification, sendWelcomeEmail } = await import("./otp-email");
  try {
    await sendWelcomeEmail({ to: application.email, firstName: application.first_name ?? "", planName: application.plan_name ?? "" });
  } catch (e) {
    console.error("Welcome email failed:", e);
  }
  try {
    await sendAdminNotification({
      to: "outdoordecorneeds@gmail.com",
      firstName: application.first_name ?? "",
      lastName: application.last_name ?? "",
      email: application.email,
      phone: application.phone ?? "",
      country: application.country ?? "",
      accountType: application.account_type ?? "",
      planName: application.plan_name ?? "",
      amount: application.amount ?? "",
      status: application.status ?? "",
    });
  } catch (e) {
    console.error("Admin notification failed:", e);
  }
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator((data) => applicationSchema.parse(data))
  .handler(async ({ data }) => {
    // Source of truth for pricing: plans table
    const { data: planRow } = await supabaseAdmin
      .from("plans")
      .select("amount_cents, currency, name")
      .eq("name", data.planName)
      .maybeSingle();
    const amount = planRow?.amount_cents ?? 0;
    const currency = planRow?.currency ?? data.currency;
    const isInstantAccess = amount > 0;

    const { data: application, error: appError } = await supabaseAdmin
      .from("account_applications")
      .upsert(
        {
          email: data.email.toLowerCase(),
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          country: data.country,
          account_type: data.accountType,
          plan_name: data.planName,
          status: isInstantAccess ? "pending_payment" : "submitted",
        },
        { onConflict: "email" }
      )
      .select()
      .single();

    if (appError || !application) {
      throw new Error(appError?.message ?? "Failed to create application");
    }

    if (!isInstantAccess) {
      await sendAdminAndWelcome({
        ...application,
        status: "submitted",
        amount: "Free",
      });
      return { requiresPayment: false, applicationId: application.id };
    }

    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .upsert(
        {
          application_id: application.id,
          email: data.email.toLowerCase(),
          amount: data.amount,
          currency: data.currency,
          status: "pending",
        },
        { onConflict: "application_id" }
      )
      .select()
      .single();

    if (paymentError || !payment) {
      throw new Error(paymentError?.message ?? "Failed to create payment");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: data.email.toLowerCase(),
      line_items: [
        {
          price_data: {
            currency: data.currency,
            unit_amount: data.amount,
            product_data: {
              name: "Instant Access activation",
              description: "Same-day account activation for Arnil Etrade",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${data.origin}/verify-otp?application_id=${application.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${data.origin}/open-account?plan=${encodeURIComponent(data.planName)}&canceled=true`,
      metadata: {
        application_id: application.id,
        payment_id: payment.id,
        plan_name: data.planName,
      },
    });

    await supabaseAdmin
      .from("payments")
      .update({ stripe_session_id: session.id })
      .eq("id", payment.id);

    await supabaseAdmin
      .from("account_applications")
      .update({ stripe_session_id: session.id })
      .eq("id", application.id);

    return { requiresPayment: true, sessionUrl: session.url, applicationId: application.id };
  });

const verifyOtpSchema = z.object({
  applicationId: z.string().uuid(),
  email: z.string().email(),
  code: z.string().length(6),
});

export const verifyOtp = createServerFn({ method: "POST" })
  .validator((data) => verifyOtpSchema.parse(data))
  .handler(async ({ data }) => {
    const { data: application, error: appError } = await supabaseAdmin
      .from("account_applications")
      .select("*")
      .eq("id", data.applicationId)
      .eq("email", data.email.toLowerCase())
      .single();

    if (appError || !application) {
      throw new Error("Application not found");
    }

    const { data: otp, error: otpError } = await supabaseAdmin
      .from("otp_codes")
      .select("*")
      .eq("application_id", data.applicationId)
      .eq("code", data.code)
      .is("verified_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otp) {
      throw new Error("Invalid or expired code");
    }

    await supabaseAdmin.from("otp_codes").update({ verified_at: new Date().toISOString() }).eq("id", otp.id);
    await supabaseAdmin.from("account_applications").update({ status: "verified" }).eq("id", data.applicationId);

    return { success: true };
  });

const resendOtpSchema = z.object({
  applicationId: z.string().uuid(),
  email: z.string().email(),
});

export const resendOtp = createServerFn({ method: "POST" })
  .validator((data) => resendOtpSchema.parse(data))
  .handler(async ({ data }) => {
    const { data: application, error: appError } = await supabaseAdmin
      .from("account_applications")
      .select("*")
      .eq("id", data.applicationId)
      .eq("email", data.email.toLowerCase())
      .single();

    if (appError || !application) {
      throw new Error("Application not found");
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await supabaseAdmin.from("otp_codes").insert({
      application_id: data.applicationId,
      email: data.email.toLowerCase(),
      code,
      expires_at: expiresAt,
    });

    const { sendOtpEmail } = await import("./otp-email");
    await sendOtpEmail({
      to: data.email,
      firstName: application.first_name ?? "",
      code,
      planName: application.plan_name,
      applicationId: data.applicationId,
    });

    return { success: true };
  });
