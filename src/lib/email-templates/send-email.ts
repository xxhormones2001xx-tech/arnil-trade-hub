import React from "react";
import { sendLovableEmail } from "@lovable.dev/email-js";
import { render } from "@react-email/render";
import { TEMPLATES, type TemplateName } from "./registry";

const SENDER_DOMAIN = process.env.SENDER_DOMAIN ?? "";
const FROM_DOMAIN = process.env.FROM_DOMAIN ?? SENDER_DOMAIN;
const FROM_NAME = process.env.FROM_NAME ?? "Arnil Etrade";

export interface SendTemplateEmailOptions<T extends TemplateName> {
  templateData: Parameters<typeof TEMPLATES[T]["component"]>[0];
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

  const entry = TEMPLATES[templateName];
  const Component = entry.component as React.ComponentType<Record<string, unknown>>;
  const html = await render(React.createElement(Component, options.templateData as Record<string, unknown>));
  const subject = typeof entry.subject === "function" ? entry.subject(options.templateData as never) : entry.subject;

  return sendLovableEmail({
    to,
    from: { email: `noreply@${FROM_DOMAIN || SENDER_DOMAIN}`, name: FROM_NAME },
    senderDomain: SENDER_DOMAIN,
    subject,
    html,
    idempotencyKey: options.idempotencyKey,
    replyTo: options.replyTo,
  });
}
