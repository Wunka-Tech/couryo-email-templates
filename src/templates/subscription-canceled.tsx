import { Button, Heading, Layout, Paragraph } from "../components/index.js";
import { accountNote, noteFor } from "../copy.js";
import { orFallback, toLang, type BaseTemplateProps } from "../types.js";

export type SubscriptionCanceledProps = BaseTemplateProps & {
  /** First name. Falls back to "cliente" / "there". */
  customerName?: string;
  /** Plan name, e.g. "Pro". */
  planName: string;
  /** Last day with access, already formatted, e.g. "08/11/2026". */
  accessUntil: string;
  /** Page to reactivate (optional). */
  reactivateUrl?: string;
};

export function subscriptionCanceledSubject(props: SubscriptionCanceledProps): string {
  return toLang(props.lang) === "pt" ? `Sua assinatura ${props.planName} foi cancelada` : `Your ${props.planName} subscription was canceled`;
}

/** Cancellation confirmation, access end date and how to come back. */
export function SubscriptionCanceled(props: SubscriptionCanceledProps) {
  const lang = toLang(props.lang);
  const pt = lang === "pt";
  return (
    <Layout
      lang={lang}
      brand={props.brand}
      subject={subscriptionCanceledSubject(props)}
      preview={pt ? "O seu acesso continua até o fim do período." : "Your access continues until the end of the period."}
      note={noteFor(props, accountNote[lang])}
    >
      <Heading>{pt ? "Assinatura cancelada" : "Subscription canceled"}</Heading>
      <Paragraph values={{ name: orFallback(props.customerName, pt ? "cliente" : "there"), plan: props.planName, until: props.accessUntil }}>
        {pt
          ? "Oi, {name}. Confirmamos o cancelamento da assinatura **{plan}**. Você continua com acesso até **{until}**."
          : "Hi {name}. We confirmed the cancellation of your **{plan}** subscription. You keep access until **{until}**."}
      </Paragraph>
      {props.reactivateUrl ? (
        <>
          <Paragraph>
            {pt ? "Mudou de ideia? Dá para reativar em um clique, sem perder nada." : "Changed your mind? You can reactivate in one click, without losing anything."}
          </Paragraph>
          <Button href={props.reactivateUrl}>{pt ? "Reativar assinatura" : "Reactivate subscription"}</Button>
        </>
      ) : null}
    </Layout>
  );
}

SubscriptionCanceled.PreviewProps = {
  lang: "pt",
  customerName: "Ana",
  planName: "Pro",
  accessUntil: "08/11/2026",
  reactivateUrl: "https://exemplo.com.br/assinatura",
} satisfies SubscriptionCanceledProps;

export default SubscriptionCanceled;
