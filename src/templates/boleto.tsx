import { Button, CodeBox, Heading, Layout, Paragraph } from "../components/index.js";
import { accountNote, noteFor } from "../copy.js";
import { orFallback, toLang, type BaseTemplateProps } from "../types.js";

export type BoletoProps = BaseTemplateProps & {
  /** First name. Falls back to "tudo bem" / "there". */
  customerName?: string;
  /** Amount, already formatted, e.g. "R$ 129,90". */
  amount: string;
  /** Due date, already formatted, e.g. "15/10/2026". */
  dueDate: string;
  /** The linha digitável (47 or 48 digits, with the usual dots and spaces). */
  barcodeLine: string;
  /**
   * Link to the boleto page or PDF, hosted by you or your payment provider. Always a link, never
   * an attachment: PDF attachments with payment slips are a classic scam pattern and get filtered.
   */
  boletoUrl: string;
};

export function boletoSubject(props: BoletoProps): string {
  return toLang(props.lang) === "pt"
    ? `Seu boleto de ${props.amount} vence em ${props.dueDate}`
    : `Your boleto of ${props.amount} is due ${props.dueDate}`;
}

/** Boleto with the linha digitável and a link (no attachment). */
export function Boleto(props: BoletoProps) {
  const lang = toLang(props.lang);
  const pt = lang === "pt";
  return (
    <Layout
      lang={lang}
      brand={props.brand}
      subject={boletoSubject(props)}
      preview={pt ? "Linha digitável e link do boleto." : "Barcode line and boleto link."}
      note={noteFor(props, accountNote[lang])}
    >
      <Heading>{pt ? "Seu boleto chegou" : "Your boleto is here"}</Heading>
      <Paragraph values={{ name: orFallback(props.customerName, pt ? "tudo bem" : "there"), amount: props.amount, due: props.dueDate }}>
        {pt ? "Oi, {name}! O boleto de **{amount}** vence em **{due}**." : "Hi {name}. The boleto of **{amount}** is due on **{due}**."}
      </Paragraph>
      <Paragraph>{pt ? "**Linha digitável:**" : "**Barcode line:**"}</Paragraph>
      <CodeBox>{props.barcodeLine}</CodeBox>
      <Button href={props.boletoUrl}>{pt ? "Ver boleto" : "View boleto"}</Button>
      <Paragraph muted>
        {pt
          ? "O pagamento pode levar até 3 dias úteis para ser confirmado. Mandamos o boleto por link, e não como anexo, para ele chegar na sua caixa de entrada."
          : "Payment can take up to 3 business days to confirm. We send the boleto as a link, not an attachment, so it reaches your inbox."}
      </Paragraph>
    </Layout>
  );
}

Boleto.PreviewProps = {
  lang: "pt",
  customerName: "Ana",
  amount: "R$ 129,90",
  dueDate: "15/10/2026",
  barcodeLine: "34191.79001 01043.510047 91020.150008 8 12340000012990",
  boletoUrl: "https://exemplo.com.br/boletos/1042",
} satisfies BoletoProps;

export default Boleto;
