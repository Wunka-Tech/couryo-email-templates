// Send a Pix charge through any SMTP server with Nodemailer.
//
//   npm install @couryo/email-templates @react-email/components react react-dom nodemailer
//   SMTP_HOST=smtp.example.com SMTP_PORT=587 SMTP_USER=... SMTP_PASS=... npx tsx examples/nodemailer-smtp.ts
//
// Not part of the package build. Works with any provider that gives you SMTP credentials.

import nodemailer from "nodemailer";
import { renderTemplate } from "@couryo/email-templates";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT) === 465, // 465 = TLS from the start; 587 = STARTTLS
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const { subject, html, text } = await renderTemplate("pix-charge", {
  lang: "pt",
  brand: { name: "Loja Aurora", color: "#C2410C", address: "Rua das Flores, 100, São Paulo, SP" },
  customerName: "Ana",
  amount: "R$ 129,90",
  dueDate: "10/10/2026",
  pixCode: "00020126580014br.gov.bcb.pix...6304ABCD", // from your payment provider
  qrCodeUrl: "https://loja-aurora.example/pix/qr/1042.png", // hosted by you or your payment provider
  paymentUrl: "https://loja-aurora.example/pagar/1042",
});

const info = await transporter.sendMail({
  from: "Loja Aurora <cobranca@loja-aurora.example>",
  to: "ana@example.com",
  subject,
  html, // the HTML part
  text, // the plain-text part: always send both
});

console.log("Sent:", info.messageId);
