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

export const adminGetLiveStats = createServerFn({ method: "POST" })
  .validator((d) => z.object({ password: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const sb = supabaseAdmin();
    const now = Date.now();
    const liveCutoff = new Date(now - 60_000).toISOString(); // 60s = live
    const dayCutoff = new Date(now - 24 * 3600_000).toISOString();

    const [liveRes, todayRes, totalRes, recentRes] = await Promise.all([
      sb.from("page_views").select("session_id, ip, country, path, user_agent, created_at").gte("created_at", liveCutoff).order("created_at", { ascending: false }),
      sb.from("page_views").select("session_id", { count: "exact", head: false }).gte("created_at", dayCutoff),
      sb.from("page_views").select("session_id", { count: "exact", head: true }),
      sb.from("page_views").select("session_id, ip, country, path, user_agent, referrer, created_at").order("created_at", { ascending: false }).limit(50),
    ]);

    const liveRows = liveRes.data ?? [];
    const liveByUser = new Map<string, any>();
    for (const r of liveRows) {
      if (!liveByUser.has(r.session_id)) liveByUser.set(r.session_id, r);
    }
    const liveUsers = Array.from(liveByUser.values());

    const todayRows = todayRes.data ?? [];
    const uniqueToday = new Set(todayRows.map((r: any) => r.session_id)).size;

    return {
      liveCount: liveUsers.length,
      liveUsers,
      uniqueToday,
      totalViews: totalRes.count ?? 0,
      recent: recentRes.data ?? [],
    };
  });
