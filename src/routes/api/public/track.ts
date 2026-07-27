import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/public/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const session_id = String(body.session_id || "").slice(0, 64);
          const path = String(body.path || "/").slice(0, 300);
          const referrer = String(body.referrer || "").slice(0, 500) || null;
          if (!session_id) return new Response("bad", { status: 400 });

          const h = request.headers;
          const ip =
            h.get("cf-connecting-ip") ||
            h.get("x-real-ip") ||
            (h.get("x-forwarded-for") || "").split(",")[0].trim() ||
            null;
          const country = h.get("cf-ipcountry") || h.get("x-vercel-ip-country") || null;
          const user_agent = h.get("user-agent")?.slice(0, 400) || null;

          const sb = createClient(
            process.env.SUPABASE_URL ?? "",
            process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
          );
          await sb.from("page_views").insert({
            session_id,
            ip,
            country,
            path,
            user_agent,
            referrer,
          });
          return Response.json({ ok: true });
        } catch (e) {
          return new Response("err", { status: 200 });
        }
      },
    },
  },
});
