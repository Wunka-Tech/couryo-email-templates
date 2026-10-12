import { Button, Heading, InfoRows, Layout, Paragraph } from "../components/index.js";
import { accountNote, noteFor } from "../copy.js";
import { orFallback, toLang, type BaseTemplateProps } from "../types.js";

export type OrderShippedProps = BaseTemplateProps & {
  /** First name. Falls back to "tudo bem" / "there". */
  customerName?: string;
  /** Order number, e.g. "1042". */
  orderNumber: string;
  /** Carrier, e.g. "Correios". */
  carrier: string;
  /** Tracking code, e.g. "QB123456789BR". */
  trackingCode: string;
  /** Delivery estimate, already formatted, e.g. "14/10/2026". */
  estimatedDelivery: string;
  /** Tracking page (optional). */
  trackingUrl?: string;
};

export function orderShippedSubject(props: OrderShippedProps): string {
  return toLang(props.lang) === "pt" ? `Seu pedido ${props.orderNumber} saiu para entrega` : `Your order ${props.orderNumber} has shipped`;
}

/** Shipping notice with carrier, tracking code and estimate. */
export function OrderShipped(props: OrderShippedProps) {
  const lang = toLang(props.lang);
  const pt = lang === "pt";
  return (
    <Layout
      lang={lang}
      brand={props.brand}
      subject={orderShippedSubject(props)}
      preview={pt ? "Acompanhe a entrega pelo código de rastreio." : "Track the delivery with the tracking code."}
      note={noteFor(props, accountNote[lang])}
    >
      <Heading>{pt ? "Pedido a caminho" : "Order on the way"}</Heading>
      <Paragraph values={{ name: orFallback(props.customerName, pt ? "tudo bem" : "there"), order: props.orderNumber }}>
        {pt ? "Oi, {name}! O pedido **{order}** foi enviado." : "Hi {name}. Order **{order}** has shipped."}
      </Paragraph>
      <InfoRows
        rows={[
          { label: pt ? "Transportadora" : "Carrier", value: props.carrier },
          { label: pt ? "Código de rastreio" : "Tracking code", value: props.trackingCode, mono: true },
          { label: pt ? "Previsão de entrega" : "Estimated delivery", value: props.estimatedDelivery },
        ]}
      />
      {props.trackingUrl ? <Button href={props.trackingUrl}>{pt ? "Acompanhar entrega" : "Track delivery"}</Button> : null}
    </Layout>
  );
}

OrderShipped.PreviewProps = {
  lang: "pt",
  customerName: "Ana",
  orderNumber: "1042",
  carrier: "Correios",
  trackingCode: "QB123456789BR",
  estimatedDelivery: "14/10/2026",
  trackingUrl: "https://exemplo.com.br/rastreio/QB123456789BR",
} satisfies OrderShippedProps;

export default OrderShipped;
