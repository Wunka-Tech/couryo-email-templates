// Send a boleto through any email provider with an HTTP API, using fetch (Node 18+).
//
//   npm install @couryo/email-templates @react-email/components react react-dom
//   EMAIL_API_URL=https://api.your-provider.example/send EMAIL_API_KEY=... npx tsx examples/fetch-any-api.ts
//
// Not part of the package build. Every provider names the fields a little differently; the
// idea is always the same: subject, html and text go into the JSON body.

import { renderTemplate } from "@couryo/email-templates";

const { subject, html, text } = await renderTemplate("boleto", {
  lang: "pt",
  brand: { name: "Loja Aurora" },
  customerName: "Ana",
  amount: "R$ 129,90",
  dueDate: "15/10/2026",
  barcodeLine: "34191.79001 01043.510047 91020.150008 8 12340000012990",
  boletoUrl: "https://loja-aurora.example/boletos/1042", // a link, never an attachment
});

const res = await fetch(process.env.EMAIL_API_URL ?? "https://api.your-provider.example/send", {
  method: "POST",
  headers: {
    authorization: `Bearer ${process.env.EMAIL_API_KEY}`,
    "content-type": "application/json",
  },
  body: JSON.stringify({
    from: "Loja Aurora <cobranca@loja-aurora.example>",
    to: ["ana@example.com"],
    subject,
    html, // check your provider docs: sometimes "html_body" or "content[0].value"
    text, // sometimes "text_body"; send it whenever the API accepts it
  }),
});

if (!res.ok) throw new Error(`Send failed: ${res.status} ${await res.text()}`);
console.log("Sent:", await res.json());
