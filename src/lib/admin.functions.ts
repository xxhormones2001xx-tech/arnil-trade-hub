import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = () =>
  createClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
  );

function checkPassword(pw: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || pw !== expected) {
    throw new Error("Unauthorized");
  }
}

export const adminLogin = createServerFn({ method: "POST" })
  .validator((d) => z.object({ password: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    checkPassword(data.password);
    return { ok: true };
  });

export const adminGetData = createServerFn({ method: "POST" })
  .validator((d) => z.object({ password: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const sb = supabaseAdmin();

    const [apps, payments, otps, newsletter] = await Promise.all([
      sb.from("account_applications").select("*").order("created_at", { ascending: false }).limit(500),
      sb.from("payments").select("*").order("created_at", { ascending: false }).limit(500),
      sb.from("otp_codes").select("*").order("created_at", { ascending: false }).limit(500),
      sb.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false }).limit(500),
    ]);

    return {
      applications: apps.data ?? [],
      payments: payments.data ?? [],
      otps: otps.data ?? [],
      newsletter: newsletter.data ?? [],
    };
  });
