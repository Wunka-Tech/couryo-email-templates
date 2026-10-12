import { Button, Heading, Layout, Paragraph } from "../components/index.js";
import { accountNote, noteFor } from "../copy.js";
import { orFallback, toLang, type BaseTemplateProps } from "../types.js";

export type PaymentDeclinedProps = BaseTemplateProps & {
  /** First name. Falls back to "cliente" / "there". */
  customerName?: string;
  /** Amount, already formatted, e.g. "R$ 99,00". */
  amount: string;
  /** Plan or product name, e.g. "Pro". */
  planName: string;
  /** Page to update the card or pay another way. */
  updatePaymentUrl: string;
};

export function paymentDeclinedSubject(props: PaymentDeclinedProps): string {
  return toLang(props.lang) === "pt" ? `Não conseguimos cobrar ${props.amount}` : `We could not charge ${props.amount}`;
}

/** Declined charge notice with a link to update the payment method. */
export function PaymentDeclined(props: PaymentDeclinedProps) {
  const lang = toLang(props.lang);
  const pt = lang === "pt";
  return (
    <Layout
      lang={lang}
      brand={props.brand}
      subject={paymentDeclinedSubject(props)}
      preview={pt ? "Atualize a forma de pagamento para não perder o acesso." : "Update your payment method to keep your access."}
      note={noteFor(props, accountNote[lang])}
    >
      <Heading>{pt ? "O pagamento não passou" : "The payment did not go through"}</Heading>
      <Paragraph values={{ name: orFallback(props.customerName, pt ? "cliente" : "there"), amount: props.amount, plan: props.planName }}>
        {pt
          ? "Oi, {name}. Tentamos cobrar **{amount}** do plano **{plan}**, mas o pagamento foi recusado."
          : "Hi {name}. We tried to charge **{amount}** for the **{plan}** plan, but the payment was declined."}
      </Paragraph>
      <Paragraph>
        {pt
          ? "Isso costuma acontecer com cartão vencido ou sem limite. Atualize a forma de pagamento ou pague com Pix para manter tudo funcionando."
          : "This usually happens with an expired card or no available limit. Update your payment method to keep everything running."}
      </Paragraph>
      <Button href={props.updatePaymentUrl}>{pt ? "Atualizar pagamento" : "Update payment"}</Button>
    </Layout>
  );
}

PaymentDeclined.PreviewProps = {
  lang: "pt",
  customerName: "Ana",
  amount: "R$ 99,00",
  planName: "Pro",
  updatePaymentUrl: "https://exemplo.com.br/pagamento",
} satisfies PaymentDeclinedProps;

export default PaymentDeclined;
