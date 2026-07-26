import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

const schema = z.object({
  email: z.string().email(),
});

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((data) => schema.parse(data))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .upsert({ email: data.email.toLowerCase(), source: "footer" }, { onConflict: "email" });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  });
