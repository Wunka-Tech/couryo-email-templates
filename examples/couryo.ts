// Send a boleto email with the Couryo REST API (one of the options; any provider works).
//
//   npm install @couryo/email-templates @react-email/components react react-dom
//   COURYO_API_KEY=... npx tsx examples/couryo.ts
//
// Not part of the package build. The sender must be on a domain verified in your account.

import { randomUUID } from "node:crypto";
import { renderTemplate } from "@couryo/email-templates";

const { subject, html, text } = await renderTemplate("boleto", {
  lang: "pt",
  brand: { name: "Loja Aurora" },
  customerName: "Ana",
  amount: "R$ 129,90",
  dueDate: "15/10/2026",
  barcodeLine: "34191.79001 01043.510047 91020.150008 1 10260000012990",
  boletoUrl: "https://loja-aurora.example/boletos/123",
});

const res = await fetch("https://api.couryo.com/v1/emails", {
  method: "POST",
  headers: {
    authorization: `Bearer ${process.env.COURYO_API_KEY}`,
    "content-type": "application/json",
    "idempotency-key": randomUUID(), // reuse the same key if you retry, so it is never sent twice
  },
  body: JSON.stringify({
    from: "Loja Aurora <cobranca@loja-aurora.example>",
    to: "ana@example.com",
    subject,
    html,
    text,
    stream: "transactional", // use "marketing" for the abandoned cart
  }),
});

if (!res.ok) throw new Error(`Send failed: ${res.status} ${await res.text()}`);
console.log("Queued:", await res.json());
