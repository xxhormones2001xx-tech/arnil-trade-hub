import React from "react";
import { sendLovableEmail } from "@lovable.dev/email-js";
import { render } from "@react-email/render";
import { TEMPLATES, type TemplateName } from "./registry";

const SENDER_DOMAIN = process.env.SENDER_DOMAIN ?? "";
const FROM_DOMAIN = process.env.FROM_DOMAIN ?? SENDER_DOMAIN;
const FROM_NAME = process.env.FROM_NAME ?? "Arnil Etrade";
const API_KEY = process.env.LOVABLE_API_KEY ?? "";

export interface SendTemplateEmailOptions<T extends TemplateName> {
  templateData: React.ComponentProps<typeof TEMPLATES[T]["component"]>;
  idempotencyKey: string;
  replyTo?: string;
}

export async function sendTemplateEmail<T extends TemplateName>(
  templateName: T,
  to: string,
  options: SendTemplateEmailOptions<T>
) {
  if (!SENDER_DOMAIN) {
    throw new Error("SENDER_DOMAIN is not configured");
  }
  if (!API_KEY) {
    throw new Error("LOVABLE_API_KEY is not configured");
  }

  const entry = TEMPLATES[templateName];
  const Component = entry.component as React.ComponentType<Record<string, unknown>>;
  const html = await render(React.createElement(Component, options.templateData as Record<string, unknown>));
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const subject =
    typeof entry.subject === "function"
      ? (entry.subject as (data: typeof options.templateData) => string)(options.templateData)
      : entry.subject;

  return sendLovableEmail(
    {
      to,
      from: `${FROM_NAME} <noreply@${FROM_DOMAIN || SENDER_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      idempotency_key: options.idempotencyKey,
      reply_to: options.replyTo,
    },
    { apiKey: API_KEY }
  );
}
