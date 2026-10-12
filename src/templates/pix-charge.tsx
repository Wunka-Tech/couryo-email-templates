import { Button, CodeBox, Heading, Layout, Paragraph, QrImage } from "../components/index.js";
import { accountNote, noteFor } from "../copy.js";
import { orFallback, toLang, type BaseTemplateProps } from "../types.js";

export type PixChargeProps = BaseTemplateProps & {
  /** First name. Falls back to "tudo bem" / "there". */
  customerName?: string;
  /** Amount, already formatted, e.g. "R$ 129,90". */
  amount: string;
  /** Due date, already formatted, e.g. "10/10/2026". */
  dueDate: string;
  /** The Pix "copia e cola" code (BR Code / EMV payload) your payment provider returned. */
  pixCode: string;
  /**
   * Absolute URL of the QR code image (PNG) your payment provider hosts. The template never
   * generates the QR itself. Use https so mail apps load it.
   */
  qrCodeUrl: string;
  /** Payment page with the same charge (optional). */
  paymentUrl?: string;
};

export function pixChargeSubject(props: PixChargeProps): string {
  return toLang(props.lang) === "pt"
    ? `Pix de ${props.amount} para pagar até ${props.dueDate}`
    : `Pix of ${props.amount} due ${props.dueDate}`;
}

/** Pix QR code (image URL) and the copy and paste code, with amount and due date. */
export function PixCharge(props: PixChargeProps) {
  const lang = toLang(props.lang);
  const pt = lang === "pt";
  return (
    <Layout
      lang={lang}
      brand={props.brand}
      subject={pixChargeSubject(props)}
      preview={pt ? "Pague com o QR Code ou o Pix copia e cola." : "Pay with the QR code or the copy and paste code."}
      note={noteFor(props, accountNote[lang])}
    >
      <Heading>{pt ? "Seu Pix está pronto" : "Your Pix is ready"}</Heading>
      <Paragraph values={{ name: orFallback(props.customerName, pt ? "tudo bem" : "there"), amount: props.amount, due: props.dueDate }}>
        {pt
          ? "Oi, {name}! Para pagar **{amount}** até **{due}**, aponte a câmera do app do seu banco para o QR Code:"
          : "Hi {name}. To pay **{amount}** by **{due}**, scan the QR code with your bank app:"}
      </Paragraph>
      <QrImage src={props.qrCodeUrl} alt={pt ? "QR Code do Pix" : "Pix QR code"} />
      <Paragraph>{pt ? "Ou use o **Pix copia e cola**:" : "Or use the **Pix copy and paste** code:"}</Paragraph>
      <CodeBox>{props.pixCode}</CodeBox>
      {props.paymentUrl ? <Button href={props.paymentUrl}>{pt ? "Abrir a página de pagamento" : "Open the payment page"}</Button> : null}
      <Paragraph muted>
        {pt
          ? "O pagamento é confirmado na hora. Depois do vencimento, este código deixa de valer."
          : "Payment is confirmed right away. After the due date this code stops working."}
      </Paragraph>
    </Layout>
  );
}

PixCharge.PreviewProps = {
  lang: "pt",
  customerName: "Ana",
  amount: "R$ 129,90",
  dueDate: "10/10/2026",
  pixCode:
    "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865406129.905802BR5913LOJA AURORA6009SAO PAULO62070503***6304ABCD",
  qrCodeUrl: "https://exemplo.com.br/pix/qr/1042.png",
  paymentUrl: "https://exemplo.com.br/pagar/1042",
} satisfies PixChargeProps;

export default PixCharge;
