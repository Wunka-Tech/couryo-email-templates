import { Button, Heading, Layout, Paragraph } from "../components/index.js";
import { accountNote, noteFor } from "../copy.js";
import { orFallback, toLang, type BaseTemplateProps } from "../types.js";

export type SubscriptionRenewedProps = BaseTemplateProps & {
  /** First name. Falls back to "tudo bem" / "there". */
  customerName?: string;
  /** Plan name, e.g. "Pro". */
  planName: string;
  /** Amount charged, already formatted, e.g. "R$ 99,00". */
  amount: string;
  /** Next charge date, already formatted, e.g. "08/11/2026". */
  nextChargeDate: string;
  /** Receipt page (optional). */
  receiptUrl?: string;
};

export function subscriptionRenewedSubject(props: SubscriptionRenewedProps): string {
  return toLang(props.lang) === "pt" ? `Sua assinatura ${props.planName} foi renovada` : `Your ${props.planName} subscription was renewed`;
}

/** Renewal confirmation with amount and next charge. */
export function SubscriptionRenewed(props: SubscriptionRenewedProps) {
  const lang = toLang(props.lang);
  const pt = lang === "pt";
  return (
    <Layout
      lang={lang}
      brand={props.brand}
      subject={subscriptionRenewedSubject(props)}
      preview={pt ? "Tudo certo com a sua assinatura." : "All set with your subscription."}
      note={noteFor(props, accountNote[lang])}
    >
      <Heading>{pt ? "Assinatura renovada" : "Subscription renewed"}</Heading>
      <Paragraph values={{ name: orFallback(props.customerName, pt ? "tudo bem" : "there"), plan: props.planName, amount: props.amount }}>
        {pt ? "Oi, {name}! A sua assinatura **{plan}** foi renovada por **{amount}**." : "Hi {name}. Your **{plan}** subscription was renewed for **{amount}**."}
      </Paragraph>
      <Paragraph values={{ next: props.nextChargeDate }}>{pt ? "**Próxima cobrança:** {next}" : "**Next charge:** {next}"}</Paragraph>
      {props.receiptUrl ? <Button href={props.receiptUrl}>{pt ? "Ver recibo" : "View receipt"}</Button> : null}
    </Layout>
  );
}

SubscriptionRenewed.PreviewProps = {
  lang: "pt",
  customerName: "Ana",
  planName: "Pro",
  amount: "R$ 99,00",
  nextChargeDate: "08/11/2026",
  receiptUrl: "https://exemplo.com.br/recibos/1043",
} satisfies SubscriptionRenewedProps;

export default SubscriptionRenewed;
