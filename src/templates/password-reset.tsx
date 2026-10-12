import { Button, Heading, Layout, Paragraph } from "../components/index.js";
import { accountNote, companyOf, noteFor } from "../copy.js";
import { toLang, type BaseTemplateProps } from "../types.js";

export type PasswordResetProps = BaseTemplateProps & {
  /** Single-use link to choose a new password. */
  resetUrl: string;
  /** How long the link works, in minutes (default 30). */
  expiresInMinutes?: number;
};

export function passwordResetSubject(props: PasswordResetProps): string {
  return toLang(props.lang) === "pt" ? "Redefina a sua senha" : "Reset your password";
}

/** Password reset link with expiry and a security note. */
export function PasswordReset(props: PasswordResetProps) {
  const lang = toLang(props.lang);
  const pt = lang === "pt";
  const company = companyOf(props);
  const minutes = props.expiresInMinutes ?? 30;
  return (
    <Layout
      lang={lang}
      brand={props.brand}
      subject={passwordResetSubject(props)}
      preview={pt ? "Use o link para criar uma nova senha." : "Use the link to choose a new password."}
      note={noteFor(props, accountNote[lang])}
    >
      <Heading>{pt ? "Redefinir senha" : "Reset your password"}</Heading>
      <Paragraph values={{ account: company ? `your ${company} account` : "your account" }}>
        {pt ? "Recebemos um pedido para trocar a senha da sua conta." : "We got a request to change the password of {account}."}
      </Paragraph>
      <Button href={props.resetUrl}>{pt ? "Criar nova senha" : "Choose a new password"}</Button>
      <Paragraph values={{ minutes }}>
        {pt ? "O link vale por {minutes} minutos e só pode ser usado uma vez." : "The link is valid for {minutes} minutes and works only once."}
      </Paragraph>
      <Paragraph>{pt ? "**Não foi você?** Ignore este e-mail. A sua senha continua a mesma." : "**Not you?** Ignore this email. Your password stays the same."}</Paragraph>
    </Layout>
  );
}

PasswordReset.PreviewProps = {
  lang: "pt",
  resetUrl: "https://exemplo.com.br/senha?t=abc123",
  expiresInMinutes: 30,
} satisfies PasswordResetProps;

export default PasswordReset;
