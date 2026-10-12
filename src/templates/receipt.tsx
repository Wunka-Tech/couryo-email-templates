import { Button, Heading, InfoRows, Layout, Paragraph } from "../components/index.js";
import { accountNote, noteFor } from "../copy.js";
import { orFallback, toLang, type BaseTemplateProps } from "../types.js";

export type ReceiptProps = BaseTemplateProps & {
  /** First name. Falls back to "tudo bem" / "there". */
  customerName?: string;
  /** Order or payment number, e.g. "1042". */
  orderNumber: string;
  /** Payment date, already formatted, e.g. "08/10/2026". */
  date: string;
  /** e.g. "Pix", "Cartão de crédito", "Boleto". */
  paymentMethod: string;
  /** Total, already formatted with currency, e.g. "R$ 129,90". */
  total: string;
  /** Page with the full receipt (optional). */
  receiptUrl?: string;
};

export function receiptSubject(props: ReceiptProps): string {
  return toLang(props.lang) === "pt" ? `Recibo do pedido ${props.orderNumber}` : `Receipt for order ${props.orderNumber}`;
}

/** Payment receipt with number, amount and method. */
export function Receipt(props: ReceiptProps) {
  const lang = toLang(props.lang);
  const pt = lang === "pt";
  return (
    <Layout
      lang={lang}
      brand={props.brand}
      subject={receiptSubject(props)}
      preview={pt ? "Recebemos o seu pagamento." : "We got your payment."}
      note={noteFor(props, accountNote[lang])}
    >
      <Heading>{pt ? "Pagamento recebido" : "Payment received"}</Heading>
      <Paragraph values={{ name: orFallback(props.customerName, pt ? "tudo bem" : "there") }}>
        {pt ? "Oi, {name}! Recebemos o seu pagamento. Obrigado!" : "Hi {name}. We got your payment. Thank you!"}
      </Paragraph>
      <InfoRows
        rows={[
          { label: pt ? "Pedido" : "Order", value: props.orderNumber },
          { label: pt ? "Data" : "Date", value: props.date },
          { label: pt ? "Forma de pagamento" : "Payment method", value: props.paymentMethod },
          { label: "Total", value: props.total },
        ]}
      />
      {props.receiptUrl ? <Button href={props.receiptUrl}>{pt ? "Ver recibo" : "View receipt"}</Button> : null}
    </Layout>
  );
}

Receipt.PreviewProps = {
  lang: "pt",
  customerName: "Ana",
  orderNumber: "1042",
  date: "08/10/2026",
  paymentMethod: "Pix",
  total: "R$ 129,90",
  receiptUrl: "https://exemplo.com.br/recibos/1042",
} satisfies ReceiptProps;

export default Receipt;
