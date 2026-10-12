import { Button, Heading, InfoRows, Layout, Paragraph } from "../components/index.js";
import { noteFor } from "../copy.js";
import { orFallback, toLang, type BaseTemplateProps } from "../types.js";

export type CartItem = {
  /** Product name with variant, e.g. "Camiseta Aurora (M)". */
  name: string;
  /** Default 1. */
  quantity?: number;
  /** Line price, already formatted, e.g. "R$ 89,90" (optional). */
  price?: string;
};

export type AbandonedCartProps = BaseTemplateProps & {
  /** First name. Falls back to "tudo bem" / "there" in the body and "Ei" / "Hey" in the subject. */
  customerName?: string;
  /** Items left in the cart. */
  items: CartItem[];
  /** Cart total, already formatted, e.g. "R$ 89,90". */
  total: string;
  /** Link back to the cart or checkout. */
  cartUrl: string;
  /**
   * Unsubscribe page. This is a marketing email: pass it (and also send the List-Unsubscribe
   * header) so people can opt out in one click.
   */
  unsubscribeUrl?: string;
};

export function abandonedCartSubject(props: AbandonedCartProps): string {
  return toLang(props.lang) === "pt"
    ? `${orFallback(props.customerName, "Ei")}, seu carrinho está esperando`
    : `${orFallback(props.customerName, "Hey")}, your cart is waiting`;
}

function defaultNote(pt: boolean, unsubscribeUrl: string | undefined): string {
  const why = pt ? "Você recebeu este e-mail porque deixou itens no carrinho." : "You got this email because you left items in your cart.";
  if (!unsubscribeUrl?.trim()) return why;
  // The URL goes through the link parser, so it must not contain spaces or parentheses.
  const url = unsubscribeUrl.trim().replace(/\s/g, "%20").replace(/\(/g, "%28").replace(/\)/g, "%29");
  return pt ? `${why} [Não quero mais receber estes e-mails](${url}).` : `${why} [Unsubscribe from these emails](${url}).`;
}

/** Cart reminder with the items and a link to check out. Marketing, with unsubscribe. */
export function AbandonedCart(props: AbandonedCartProps) {
  const lang = toLang(props.lang);
  const pt = lang === "pt";
  return (
    <Layout
      lang={lang}
      brand={props.brand}
      subject={abandonedCartSubject(props)}
      preview={pt ? "Seus itens ainda estão no carrinho." : "Your items are still in the cart."}
      note={noteFor(props, defaultNote(pt, props.unsubscribeUrl))}
    >
      <Heading>{pt ? "Esqueceu alguma coisa?" : "Forgot something?"}</Heading>
      <Paragraph values={{ name: orFallback(props.customerName, pt ? "tudo bem" : "there") }}>
        {pt ? "Oi, {name}! Guardamos o seu carrinho:" : "Hi {name}. We saved your cart:"}
      </Paragraph>
      <InfoRows
        rows={[
          ...props.items.map((item) => ({ label: `${item.quantity ?? 1}x ${item.name}`, value: item.price ?? "" })),
          { label: "Total", value: props.total },
        ]}
      />
      <Button href={props.cartUrl}>{pt ? "Finalizar compra" : "Check out"}</Button>
    </Layout>
  );
}

AbandonedCart.PreviewProps = {
  lang: "pt",
  customerName: "Ana",
  items: [{ name: "Camiseta Aurora (M)", quantity: 1, price: "R$ 89,90" }],
  total: "R$ 89,90",
  cartUrl: "https://exemplo.com.br/carrinho",
  unsubscribeUrl: "https://exemplo.com.br/descadastrar?t=abc123",
} satisfies AbandonedCartProps;

export default AbandonedCart;
