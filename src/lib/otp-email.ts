import { sendTemplateEmail } from "./email-templates/send-email";

export interface SendOtpEmailInput {
  to: string;
  firstName: string;
  code: string;
  planName: string;
  applicationId: string;
}

export async function sendOtpEmail(input: SendOtpEmailInput) {
  return sendTemplateEmail("otp-verification", input.to, {
    templateData: {
      name: input.firstName,
      code: input.code,
      planName: input.planName,
    },
    idempotencyKey: `otp-${input.applicationId}-${input.code}`,
    fromLocalPart: "otp",
    fromName: "Arnil Etrade OTP",
  });
}

export interface SendAdminNotificationInput {
  to: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  country?: string;
  accountType?: string;
  planName?: string;
  amount?: string;
  status?: string;
}

export async function sendAdminNotification(input: SendAdminNotificationInput) {
  return sendTemplateEmail("admin-notification", input.to, {
    templateData: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      country: input.country,
      accountType: input.accountType,
      planName: input.planName,
      amount: input.amount,
      status: input.status,
    },
    idempotencyKey: `admin-${input.email}-${Date.now()}`,
    fromLocalPart: "notification",
    fromName: "Arnil Etrade Notifications",
  });
}

export interface SendWelcomeEmailInput {
  to: string;
  firstName?: string;
  planName?: string;
}

export async function sendWelcomeEmail(input: SendWelcomeEmailInput) {
  return sendTemplateEmail("welcome-email", input.to, {
    templateData: {
      name: input.firstName,
      planName: input.planName,
    },
    idempotencyKey: `welcome-${input.to}-${Date.now()}`,
    fromLocalPart: "payment",
    fromName: "Arnil Etrade Payments",
  });
}
