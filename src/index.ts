import { createElement, type ReactElement } from "react";
import { render } from "@react-email/render";
import { AbandonedCart, abandonedCartSubject, type AbandonedCartProps, type CartItem } from "./templates/abandoned-cart.js";
import { Boleto, boletoSubject, type BoletoProps } from "./templates/boleto.js";
import { EmailConfirmation, emailConfirmationSubject, type EmailConfirmationProps } from "./templates/email-confirmation.js";
import { LoginCode, loginCodeSubject, type LoginCodeProps } from "./templates/login-code.js";
import { OrderShipped, orderShippedSubject, type OrderShippedProps } from "./templates/order-shipped.js";
import { PasswordReset, passwordResetSubject, type PasswordResetProps } from "./templates/password-reset.js";
import { PaymentDeclined, paymentDeclinedSubject, type PaymentDeclinedProps } from "./templates/payment-declined.js";
import { PixCharge, pixChargeSubject, type PixChargeProps } from "./templates/pix-charge.js";
import { Receipt, receiptSubject, type ReceiptProps } from "./templates/receipt.js";
import { SubscriptionCanceled, subscriptionCanceledSubject, type SubscriptionCanceledProps } from "./templates/subscription-canceled.js";
import { SubscriptionRenewed, subscriptionRenewedSubject, type SubscriptionRenewedProps } from "./templates/subscription-renewed.js";
import { TeamInvite, teamInviteSubject, type TeamInviteProps } from "./templates/team-invite.js";
import { Welcome, welcomeSubject, type WelcomeProps } from "./templates/welcome.js";
import type { Lang, TemplateCategory, TemplateStream } from "./types.js";

export * from "./components/index.js";
export { toLang, type Brand, type BaseTemplateProps, type Lang, type TemplateCategory, type TemplateStream } from "./types.js";
export { Welcome, welcomeSubject, type WelcomeProps };
export { EmailConfirmation, emailConfirmationSubject, type EmailConfirmationProps };
export { PasswordReset, passwordResetSubject, type PasswordResetProps };
export { LoginCode, loginCodeSubject, type LoginCodeProps };
export { TeamInvite, teamInviteSubject, type TeamInviteProps };
export { Receipt, receiptSubject, type ReceiptProps };
export { PixCharge, pixChargeSubject, type PixChargeProps };
export { Boleto, boletoSubject, type BoletoProps };
export { PaymentDeclined, paymentDeclinedSubject, type PaymentDeclinedProps };
export { SubscriptionRenewed, subscriptionRenewedSubject, type SubscriptionRenewedProps };
export { SubscriptionCanceled, subscriptionCanceledSubject, type SubscriptionCanceledProps };
export { AbandonedCart, abandonedCartSubject, type AbandonedCartProps, type CartItem };
export { OrderShipped, orderShippedSubject, type OrderShippedProps };

/** Props of each template, by id. */
export type TemplatePropsMap = {
  welcome: WelcomeProps;
  "email-confirmation": EmailConfirmationProps;
  "password-reset": PasswordResetProps;
  "login-code": LoginCodeProps;
  "team-invite": TeamInviteProps;
  receipt: ReceiptProps;
  "pix-charge": PixChargeProps;
  boleto: BoletoProps;
  "payment-declined": PaymentDeclinedProps;
  "subscription-renewed": SubscriptionRenewedProps;
  "subscription-canceled": SubscriptionCanceledProps;
  "abandoned-cart": AbandonedCartProps;
  "order-shipped": OrderShippedProps;
};

export type TemplateId = keyof TemplatePropsMap;

export type TemplateDefinition<K extends TemplateId = TemplateId> = {
  id: K;
  component: (props: TemplatePropsMap[K]) => ReactElement;
  /** Subject line for the given props (same language as the body). */
  subject: (props: TemplatePropsMap[K]) => string;
  category: TemplateCategory;
  /** "marketing" emails need an unsubscribe link and consent; "transactional" ones answer an action. */
  stream: TemplateStream;
  name: Record<Lang, string>;
  description: Record<Lang, string>;
  /** Sample props (Portuguese), the same ones the React Email preview server uses. */
  previewProps: TemplatePropsMap[K];
};

type AnyTemplate = { [K in TemplateId]: TemplateDefinition<K> }[TemplateId];

/** Every template with its metadata, in the order of the docs. */
export const templates: AnyTemplate[] = [
  {
    id: "welcome",
    component: Welcome,
    subject: welcomeSubject,
    category: "account",
    stream: "transactional",
    name: { pt: "Boas-vindas", en: "Welcome" },
    description: { pt: "Primeiro e-mail depois do cadastro, com o próximo passo.", en: "First email after sign-up, with the next step." },
    previewProps: Welcome.PreviewProps,
  },
  {
    id: "email-confirmation",
    component: EmailConfirmation,
    subject: emailConfirmationSubject,
    category: "account",
    stream: "transactional",
    name: { pt: "Confirmação de e-mail", en: "Email confirmation" },
    description: { pt: "Link para confirmar o endereço logo depois do cadastro.", en: "Link to confirm the address right after sign-up." },
    previewProps: EmailConfirmation.PreviewProps,
  },
  {
    id: "password-reset",
    component: PasswordReset,
    subject: passwordResetSubject,
    category: "account",
    stream: "transactional",
    name: { pt: "Recuperação de senha", en: "Password reset" },
    description: { pt: "Link de troca de senha com validade e aviso de segurança.", en: "Password reset link with expiry and a security note." },
    previewProps: PasswordReset.PreviewProps,
  },
  {
    id: "login-code",
    component: LoginCode,
    subject: loginCodeSubject,
    category: "account",
    stream: "transactional",
    name: { pt: "Código de login (OTP)", en: "Login code (OTP)" },
    description: { pt: "Código de uso único para entrar ou confirmar uma ação.", en: "One-time code to sign in or confirm an action." },
    previewProps: LoginCode.PreviewProps,
  },
  {
    id: "team-invite",
    component: TeamInvite,
    subject: teamInviteSubject,
    category: "account",
    stream: "transactional",
    name: { pt: "Convite de equipe", en: "Team invite" },
    description: { pt: "Convite para entrar no time de uma conta.", en: "Invitation to join a team account." },
    previewProps: TeamInvite.PreviewProps,
  },
  {
    id: "receipt",
    component: Receipt,
    subject: receiptSubject,
    category: "billing",
    stream: "transactional",
    name: { pt: "Recibo", en: "Receipt" },
    description: { pt: "Comprovante do pagamento com número, valor e forma de pagamento.", en: "Payment receipt with number, amount and method." },
    previewProps: Receipt.PreviewProps,
  },
  {
    id: "pix-charge",
    component: PixCharge,
    subject: pixChargeSubject,
    category: "billing",
    stream: "transactional",
    name: { pt: "Cobrança Pix", en: "Pix charge" },
    description: {
      pt: "QR Code (imagem por URL) e o código Pix copia e cola, com valor e vencimento.",
      en: "Pix QR code (image URL) and the copy and paste code, with amount and due date.",
    },
    previewProps: PixCharge.PreviewProps,
  },
  {
    id: "boleto",
    component: Boleto,
    subject: boletoSubject,
    category: "billing",
    stream: "transactional",
    name: { pt: "Boleto", en: "Boleto" },
    description: {
      pt: "Linha digitável e link do boleto (sem anexo, que cai no spam).",
      en: "Boleto barcode line and link (no attachment, which lands in spam).",
    },
    previewProps: Boleto.PreviewProps,
  },
  {
    id: "payment-declined",
    component: PaymentDeclined,
    subject: paymentDeclinedSubject,
    category: "billing",
    stream: "transactional",
    name: { pt: "Pagamento recusado", en: "Payment declined" },
    description: {
      pt: "Aviso de cobrança recusada com o link para atualizar o pagamento.",
      en: "Declined charge notice with a link to update the payment method.",
    },
    previewProps: PaymentDeclined.PreviewProps,
  },
  {
    id: "subscription-renewed",
    component: SubscriptionRenewed,
    subject: subscriptionRenewedSubject,
    category: "billing",
    stream: "transactional",
    name: { pt: "Assinatura renovada", en: "Subscription renewed" },
    description: { pt: "Confirmação da renovação com valor e próxima cobrança.", en: "Renewal confirmation with amount and next charge." },
    previewProps: SubscriptionRenewed.PreviewProps,
  },
  {
    id: "subscription-canceled",
    component: SubscriptionCanceled,
    subject: subscriptionCanceledSubject,
    category: "billing",
    stream: "transactional",
    name: { pt: "Assinatura cancelada", en: "Subscription canceled" },
    description: {
      pt: "Confirmação do cancelamento, até quando vale o acesso e como voltar.",
      en: "Cancellation confirmation, access end date and how to come back.",
    },
    previewProps: SubscriptionCanceled.PreviewProps,
  },
  {
    id: "abandoned-cart",
    component: AbandonedCart,
    subject: abandonedCartSubject,
    category: "commerce",
    stream: "marketing",
    name: { pt: "Carrinho abandonado", en: "Abandoned cart" },
    description: {
      pt: "Lembrete do carrinho com os itens e o link para finalizar. Marketing, com descadastro.",
      en: "Cart reminder with the items and a link to check out. Marketing, with unsubscribe.",
    },
    previewProps: AbandonedCart.PreviewProps,
  },
  {
    id: "order-shipped",
    component: OrderShipped,
    subject: orderShippedSubject,
    category: "commerce",
    stream: "transactional",
    name: { pt: "Pedido enviado", en: "Order shipped" },
    description: { pt: "Aviso de envio com transportadora, código de rastreio e previsão.", en: "Shipping notice with carrier, tracking code and estimate." },
    previewProps: OrderShipped.PreviewProps,
  },
];

/** Looks up a template definition by id. */
export function getTemplate<K extends TemplateId>(id: K): TemplateDefinition<K> {
  const t = templates.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown template: ${String(id)}`);
  return t as unknown as TemplateDefinition<K>;
}

export type RenderOptions = {
  /** Also render the plain-text part (default true). Always send it: some apps and filters prefer it. */
  plainText?: boolean;
};

export type RenderedTemplate = { subject: string; html: string; text: string };

/**
 * Renders a template to a subject, the HTML and the plain-text part, ready for any provider.
 * `text` is an empty string when `plainText` is false.
 */
export async function renderTemplate<K extends TemplateId>(id: K, props: TemplatePropsMap[K], options: RenderOptions = {}): Promise<RenderedTemplate> {
  const t = getTemplate(id);
  const element = createElement(t.component, props);
  const [html, text] = await Promise.all([render(element), options.plainText === false ? Promise.resolve("") : render(element, { plainText: true })]);
  return { subject: t.subject(props), html, text };
}
