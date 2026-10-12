import { Button, Heading, Layout, Paragraph } from "../components/index.js";
import { accountNote, companyOf, noteFor } from "../copy.js";
import { orFallback, toLang, type BaseTemplateProps } from "../types.js";

export type EmailConfirmationProps = BaseTemplateProps & {
  /** First name. Falls back to "tudo bem" / "there" ("Oi, tudo bem!"). */
  customerName?: string;
  /** Link that confirms the address. */
  confirmationUrl: string;
  /** How long the link works, in hours (default 24). */
  expiresInHours?: number;
};

export function emailConfirmationSubject(props: EmailConfirmationProps): string {
  return toLang(props.lang) === "pt" ? "Confirme o seu e-mail" : "Confirm your email";
}

/** Link to confirm the address right after sign-up. */
export function EmailConfirmation(props: EmailConfirmationProps) {
  const lang = toLang(props.lang);
  const pt = lang === "pt";
  const company = companyOf(props);
  const hours = props.expiresInHours ?? 24;
  return (
    <Layout
      lang={lang}
      brand={props.brand}
      subject={emailConfirmationSubject(props)}
      preview={pt ? "Falta só um clique para ativar a sua conta." : "One click left to activate your account."}
      note={noteFor(props, accountNote[lang])}
    >
      <Heading>{pt ? "Confirme o seu e-mail" : "Confirm your email"}</Heading>
      <Paragraph values={{ name: orFallback(props.customerName, pt ? "tudo bem" : "there"), account: company ? `${company} account` : "account" }}>
        {pt ? "Oi, {name}! Para ativar a sua conta, confirme que este endereço é seu." : "Hi {name}. To activate your {account}, confirm that this address is yours."}
      </Paragraph>
      <Button href={props.confirmationUrl}>{pt ? "Confirmar e-mail" : "Confirm email"}</Button>
      <Paragraph muted values={{ hours }}>
        {pt
          ? "O link vale por {hours} horas. Se você não criou uma conta, pode ignorar este e-mail."
          : "The link is valid for {hours} hours. If you did not sign up, you can ignore this email."}
      </Paragraph>
    </Layout>
  );
}

EmailConfirmation.PreviewProps = {
  lang: "pt",
  customerName: "Ana",
  confirmationUrl: "https://exemplo.com.br/confirmar?t=abc123",
  expiresInHours: 24,
} satisfies EmailConfirmationProps;

export default EmailConfirmation;
