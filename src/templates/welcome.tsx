import { Button, Heading, Layout, Paragraph } from "../components/index.js";
import { accountNote, companyOf, noteFor } from "../copy.js";
import { orFallback, toLang, type BaseTemplateProps } from "../types.js";

export type WelcomeProps = BaseTemplateProps & {
  /** First name. Falls back to "cliente" / "friend". */
  customerName?: string;
  /** Where the next step happens (dashboard, onboarding page). */
  dashboardUrl: string;
};

export function welcomeSubject(props: WelcomeProps): string {
  if (toLang(props.lang) === "pt") return `Boas-vindas, ${orFallback(props.customerName, "cliente")}!`;
  const name = orFallback(props.customerName, "friend");
  const company = companyOf(props);
  return company ? `Welcome to ${company}, ${name}!` : `Welcome, ${name}!`;
}

/** First email after sign-up, with the next step. */
export function Welcome(props: WelcomeProps) {
  const lang = toLang(props.lang);
  const company = companyOf(props);
  const pt = lang === "pt";
  const name = orFallback(props.customerName, pt ? "cliente" : "friend");
  const ready = pt
    ? "Sua conta está pronta."
    : company
      ? `Your ${company} account is ready.`
      : "Your account is ready.";
  return (
    <Layout lang={lang} brand={props.brand} subject={welcomeSubject(props)} preview={ready} note={noteFor(props, accountNote[lang])}>
      <Heading>{pt ? `Que bom ter você aqui, ${name}!` : `Great to have you here, ${name}!`}</Heading>
      <Paragraph values={{ ready }}>{pt ? "{ready} Em poucos minutos você já consegue começar." : "{ready} You can get started in a few minutes."}</Paragraph>
      <Paragraph>{pt ? "**Próximo passo:** entre no painel e complete o seu perfil." : "**Next step:** open the dashboard and finish your profile."}</Paragraph>
      <Button href={props.dashboardUrl}>{pt ? "Abrir o painel" : "Open the dashboard"}</Button>
      <Paragraph>{pt ? "Se tiver qualquer dúvida, é só responder este e-mail." : "Any question? Just reply to this email."}</Paragraph>
    </Layout>
  );
}

Welcome.PreviewProps = {
  lang: "pt",
  customerName: "Ana",
  dashboardUrl: "https://exemplo.com.br/painel",
} satisfies WelcomeProps;

export default Welcome;
