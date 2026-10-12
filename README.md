# @couryo/email-templates

Brazilian transactional email templates for [React Email](https://react.email): Pix, boleto, password reset, login code, receipt and more. Portuguese and English copy, 600 px layout, plain-text part included. Works with any email provider.

[Leia em português](https://github.com/Wunka-Tech/couryo-email-templates/blob/main/README.pt-BR.md)

> **Status:** version 0.1.0, not published on npm yet. The install command below works once it is published; until then, build it from this folder (see [Contributing](#contributing)).

## Templates

| | | |
|---|---|---|
| **Welcome** `welcome`<br><img src="previews/welcome.png" width="220" alt="Welcome email preview"> | **Email confirmation** `email-confirmation`<br><img src="previews/email-confirmation.png" width="220" alt="Email confirmation preview"> | **Password reset** `password-reset`<br><img src="previews/password-reset.png" width="220" alt="Password reset preview"> |
| **Login code (OTP)** `login-code`<br><img src="previews/login-code.png" width="220" alt="Login code preview"> | **Team invite** `team-invite`<br><img src="previews/team-invite.png" width="220" alt="Team invite preview"> | **Receipt** `receipt`<br><img src="previews/receipt.png" width="220" alt="Receipt preview"> |
| **Pix charge** `pix-charge`<br><img src="previews/pix-charge.png" width="220" alt="Pix charge preview"> | **Boleto** `boleto`<br><img src="previews/boleto.png" width="220" alt="Boleto preview"> | **Payment declined** `payment-declined`<br><img src="previews/payment-declined.png" width="220" alt="Payment declined preview"> |
| **Subscription renewed** `subscription-renewed`<br><img src="previews/subscription-renewed.png" width="220" alt="Subscription renewed preview"> | **Subscription canceled** `subscription-canceled`<br><img src="previews/subscription-canceled.png" width="220" alt="Subscription canceled preview"> | **Abandoned cart** `abandoned-cart` (marketing)<br><img src="previews/abandoned-cart.png" width="220" alt="Abandoned cart preview"> |
| **Order shipped** `order-shipped`<br><img src="previews/order-shipped.png" width="220" alt="Order shipped preview"> | | |

The previews show the Portuguese version with the sample props. Every template also has an English version (`lang: "en"`).

| Id | Component | Category | Stream |
|---|---|---|---|
| `welcome` | `Welcome` | account | transactional |
| `email-confirmation` | `EmailConfirmation` | account | transactional |
| `password-reset` | `PasswordReset` | account | transactional |
| `login-code` | `LoginCode` | account | transactional |
| `team-invite` | `TeamInvite` | account | transactional |
| `receipt` | `Receipt` | billing | transactional |
| `pix-charge` | `PixCharge` | billing | transactional |
| `boleto` | `Boleto` | billing | transactional |
| `payment-declined` | `PaymentDeclined` | billing | transactional |
| `subscription-renewed` | `SubscriptionRenewed` | billing | transactional |
| `subscription-canceled` | `SubscriptionCanceled` | billing | transactional |
| `abandoned-cart` | `AbandonedCart` | commerce | marketing |
| `order-shipped` | `OrderShipped` | commerce | transactional |

## Install

```bash
npm install @couryo/email-templates @react-email/components react
```

`react`, `react-dom` and `@react-email/components` are peer dependencies, so your project keeps a single copy of each (the one your own React Email templates already use). npm 7 and later install `react-dom` automatically; with pnpm or Yarn, add it too if it is not there yet. `@react-email/render` is a regular dependency, used by `renderTemplate`. React 18 or newer.

## Usage

### Render to HTML and text

```ts
import { renderTemplate } from "@couryo/email-templates";

const { subject, html, text } = await renderTemplate("pix-charge", {
  lang: "pt",
  brand: { name: "Loja Aurora", color: "#C2410C" },
  customerName: "Ana",
  amount: "R$ 129,90",
  dueDate: "10/10/2026",
  pixCode: "00020126580014br.gov.bcb.pix...6304ABCD",
  qrCodeUrl: "https://loja-aurora.example/pix/qr/1042.png",
  paymentUrl: "https://loja-aurora.example/pagar/1042",
});
```

`renderTemplate(id, props, { plainText? })` returns `{ subject, html, text }`. The props are typed per template, so your editor completes them and TypeScript flags a missing one. Pass `{ plainText: false }` to skip the text part (you get `text: ""`), but sending both parts is the better default.

### Use the components directly

Each template is a regular React Email component, so you can render it yourself:

```tsx
import { render } from "@react-email/render";
import { Boleto } from "@couryo/email-templates";

const element = (
  <Boleto
    customerName="Ana"
    amount="R$ 129,90"
    dueDate="15/10/2026"
    barcodeLine="34191.79001 01043.510047 91020.150008 8 12340000012990"
    boletoUrl="https://loja-aurora.example/boletos/1042"
  />
);
const html = await render(element);
const text = await render(element, { plainText: true });
```

There is also a `templates` array with `{ id, component, subject, category, stream, name, description, previewProps }` for each template (names and descriptions in `pt` and `en`), handy for building a picker or a gallery. The layout pieces (`Layout`, `Heading`, `Paragraph`, `Button`, `CodeBox`, `InfoRows`, `Divider`, `Footer`) are exported too, if you want to write a new email with the same look.

## Send with any provider

The output is plain HTML and text, so it goes anywhere:

- **SMTP with Nodemailer**: [examples/nodemailer-smtp.ts](examples/nodemailer-smtp.ts) (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`).
- **Any HTTP API with fetch**: [examples/fetch-any-api.ts](examples/fetch-any-api.ts) shows where `subject`, `html` and `text` go in a JSON body.
- **Couryo**: [examples/couryo.ts](examples/couryo.ts) uses the REST API at `https://api.couryo.com/v1/emails` with `COURYO_API_KEY`. It is one option among many; nothing in the templates depends on it.

```ts
// Nodemailer, in short
await transporter.sendMail({ from, to, subject, html, text });
```

## Props

Every template accepts:

| Prop | Type | Default | |
|---|---|---|---|
| `lang` | `"pt" \| "en"` | `"pt"` | Copy language. Sets `lang="pt-BR"` or `lang="en"` on the HTML. |
| `brand` | `{ name, logoUrl?, color?, address? }` | `{ name: "Sua empresa" }` / `"Your company"` | Company name in the header and footer, optional logo (40 px tall; use PNG or JPG), button and link color (default `#C2410C`; the button text turns white or black for contrast) and an address line. |
| `footerNote` | `string` | why the person got the email | Replaces the footer line. Accepts `**bold**`, `` `code` ``, `[link](https://...)` and line breaks. |

Amounts and dates are **preformatted strings** (`"R$ 129,90"`, `"10/10/2026"`): the templates never guess currency, locale or time zone. Format them where you have the data:

```ts
const amount = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(129.9); // "R$ 129,90"
const dueDate = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" }).format(new Date(2026, 9, 10)); // "10/10/2026"
```

Values you pass are always rendered as plain text: HTML is escaped and markup characters stay as typed. Links accept only `https://`, `http://`, `mailto:` and `tel:`.

### Pix charge (`PixCharge`)

| Prop | Required | |
|---|---|---|
| `amount` | yes | `"R$ 129,90"` |
| `dueDate` | yes | `"10/10/2026"` |
| `pixCode` | yes | The "copia e cola" code (BR Code) returned by your payment provider. Shown in a monospace box that selects in one tap where the mail app allows it, and also in the plain-text part. |
| `qrCodeUrl` | yes | Absolute `https` URL of the QR image your payment provider hosts. The template never generates the QR itself, so no payment secret or key ever goes into this code. |
| `paymentUrl` | no | Payment page with the same charge (adds a button). |
| `customerName` | no | Falls back to "tudo bem" ("Oi, tudo bem!"). |

### Boleto (`Boleto`)

| Prop | Required | |
|---|---|---|
| `amount` | yes | `"R$ 129,90"` |
| `dueDate` | yes | `"15/10/2026"` |
| `barcodeLine` | yes | The linha digitável, shown in a monospace box and in the plain-text part. |
| `boletoUrl` | yes | Link to the boleto page or PDF. |
| `customerName` | no | |

The other templates follow the same pattern; see the typed props in your editor or in `src/templates/<id>.tsx`. Each file also has `PreviewProps` with sample values.

### Why the boleto goes by link

Payment slips sent as PDF attachments are one of the most common scam patterns in Brazil, so filters treat an unexpected email with a boleto attachment with suspicion, and many people are taught not to open one. A link to a page on your own domain (or your payment provider's) avoids that, keeps the email small, lets you update or cancel the boleto after sending, and lets you see if it was opened. That is why these templates have URL props and no attachment option.

### Abandoned cart is marketing

`abandoned-cart` is the only marketing template. Send it only to people who agreed to receive it, pass `unsubscribeUrl` (it adds an unsubscribe link to the footer) and also send the `List-Unsubscribe` and `List-Unsubscribe-Post` headers through your provider, so mail apps can show their own unsubscribe button.

## Dark mode and accessibility

- Light layout that reads well everywhere, with dark-mode overrides for apps that support `prefers-color-scheme` (and the Outlook.com hooks). The Pix QR sits on a white tile so it stays scannable in dark mode.
- `lang` on the `<html>` element, a `<title>` with the subject, alt text on the logo and the QR, text colors that pass WCAG AA, and the button text color picked for contrast against your brand color.
- Layout tables carry `role="presentation"` (React Email handles that), and the content fits small screens.

## React Email preview server

To see the templates live with your brand, create a file per template in your React Email `emails/` folder and re-export the component; its `PreviewProps` come along:

```tsx
// emails/pix-charge.tsx
import { PixCharge } from "@couryo/email-templates";
export default PixCharge;
```

Then run `npx react-email dev`. In a clone of this package you can point the server straight at the sources: `npx react-email dev --dir src/templates`.

## Contributing

```bash
pnpm install
pnpm build       # tsc to dist/
pnpm typecheck
pnpm lint
pnpm test        # vitest: renders every template in PT and EN and checks the output
pnpm previews    # rebuilds and regenerates previews/<id>.png
```

`pnpm previews` needs Chrome, Chromium or Edge installed. It looks for `CHROME_PATH`, then the usual install paths on Windows and macOS, then `google-chrome` or `chromium` on the `PATH`. It only uses the browser command line (`--headless=new --dump-dom` to measure the height, then `--screenshot`), with no extra packages. The Pix preview uses a locally drawn stand-in QR image, since the sample URL does not exist.

Rules for changes: keep both languages in sync, keep amounts and dates as strings, no attachments for payment documents, and no provider-specific code in `src/`. The tests check for leftover placeholders, `undefined` and a few strings that must never ship.

## License

[MIT](LICENSE), Copyright (c) 2026 Wunka.
