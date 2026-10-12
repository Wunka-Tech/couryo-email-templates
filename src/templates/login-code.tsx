import { CodeBox, Heading, Layout, Paragraph } from "../components/index.js";
import { accountNote, companyOf, noteFor } from "../copy.js";
import { toLang, type BaseTemplateProps } from "../types.js";

export type LoginCodeProps = BaseTemplateProps & {
  /** The one-time code, e.g. "482913". */
  code: string;
  /** How long the code works, in minutes (default 10). */
  expiresInMinutes?: number;
};

export function loginCodeSubject(props: LoginCodeProps): string {
  return toLang(props.lang) === "pt" ? `Seu código de acesso: ${props.code}` : `Your sign-in code: ${props.code}`;
}

/** One-time code to sign in or confirm an action. */
export function LoginCode(props: LoginCodeProps) {
  const lang = toLang(props.lang);
  const pt = lang === "pt";
  const company = companyOf(props);
  const minutes = props.expiresInMinutes ?? 10;
  return (
    <Layout
      lang={lang}
      brand={props.brand}
      subject={loginCodeSubject(props)}
      preview={pt ? "Use o código para entrar." : "Use the code to sign in."}
      note={noteFor(props, accountNote[lang])}
    >
      <Heading>{pt ? "Seu código de acesso" : "Your sign-in code"}</Heading>
      <Paragraph values={{ where: company ? ` to ${company}` : "" }}>{pt ? "Use este código para entrar:" : "Use this code to sign in{where}:"}</Paragraph>
      <CodeBox size="lg">{props.code}</CodeBox>
      <Paragraph values={{ minutes }}>
        {pt
          ? "Ele vale por {minutes} minutos. Nunca compartilhe este código com ninguém, nem com a nossa equipe."
          : "It is valid for {minutes} minutes. Never share this code with anyone, not even our team."}
      </Paragraph>
    </Layout>
  );
}

LoginCode.PreviewProps = {
  lang: "pt",
  code: "482913",
  expiresInMinutes: 10,
} satisfies LoginCodeProps;

export default LoginCode;
