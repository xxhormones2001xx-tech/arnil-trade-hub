import type { ComponentType } from "react";
import { template as otpVerification } from "./otp-verification";
import { template as adminNotification } from "./admin-notification";
import { template as welcomeEmail } from "./welcome-email";

export interface TemplateEntry<P = Record<string, unknown>> {
  component: ComponentType<P>;
  subject: string | ((data: P) => string);
  displayName?: string;
  previewData?: P;
  to?: string | ((data: P) => string);
}

export const TEMPLATES = {
  "otp-verification": otpVerification,
  "admin-notification": adminNotification,
  "welcome-email": welcomeEmail,
} satisfies Record<string, TemplateEntry>;

export type TemplateName = keyof typeof TEMPLATES;
