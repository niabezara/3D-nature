"use server";

import { Resend } from "resend";
import { site } from "@/config/site";
import { enquiryHtml, enquirySubject, enquiryText, type Enquiry } from "@/lib/email/enquiry";

export type ContactField = "name" | "email" | "link" | "message";

export type ContactState =
  | { status: "idle" }
  | {
      status: "error";
      errors: Partial<Record<ContactField, string>>;
      /** Problem with sending rather than with a field. */
      formError?: string;
      values: Enquiry;
    }
  | { status: "sent"; name: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { short: 200, message: 5000 };

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const text = (key: string, max = MAX.short) => String(formData.get(key) ?? "").trim().slice(0, max);
  const values: Enquiry = {
    name: text("name"),
    email: text("email"),
    company: text("company"),
    link: text("link", 500),
    projectTypes: formData.getAll("projectTypes").map(String).slice(0, 10),
    budget: text("budget"),
    timeline: text("timeline"),
    message: text("message", MAX.message),
  };

  // honeypot: real people never see this field, so pretend it worked
  if (text("website")) return { status: "sent", name: values.name };

  const errors: Partial<Record<ContactField, string>> = {};
  if (!values.name) errors.name = "Tell me what to call you.";
  if (!EMAIL.test(values.email)) errors.email = "That email doesn’t look quite right.";
  if (values.link && !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}/i.test(values.link)) errors.link = "That doesn’t look like a link.";
  if (values.message.length < 10) errors.message = "A few more words, please.";
  if (Object.keys(errors).length) return { status: "error", errors, values };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? `${site.name} <onboarding@resend.dev>`;

  if (!apiKey || !to) {
    console.warn("[lets-talk] RESEND_API_KEY or CONTACT_TO_EMAIL is not set; enquiry not delivered:", values);
    // let the form be tested locally before the key is added
    if (process.env.NODE_ENV !== "production") return { status: "sent", name: values.name };
    return { status: "error", errors: {}, formError: unavailable(), values };
  }

  const { error } = await new Resend(apiKey).emails.send({
    from,
    to,
    replyTo: values.email,
    subject: enquirySubject(values),
    html: enquiryHtml(values),
    text: enquiryText(values),
  });

  if (error) {
    console.error("[lets-talk] Resend failed:", error);
    return { status: "error", errors: {}, formError: unavailable(), values };
  }

  return { status: "sent", name: values.name };
}

const unavailable = () =>
  `Couldn’t send that just now. Please email me directly at ${site.email}.`;
