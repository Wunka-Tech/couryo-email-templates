import { Button, Heading, Layout, Paragraph } from "../components/index.js";
import { accountNote, companyOf, noteFor } from "../copy.js";
import { toLang, type BaseTemplateProps } from "../types.js";

export type TeamInviteProps = BaseTemplateProps & {
  /** Who sent the invite, e.g. "Carlos Lima". */
  invitedBy: string;
  /** Team or account name, e.g. "Loja Aurora". */
  teamName: string;
  /** Link that accepts the invite. */
  inviteUrl: string;
  /** How long the invite works, in days (default 7). */
  expiresInDays?: number;
};

export function teamInviteSubject(props: TeamInviteProps): string {
  return toLang(props.lang) === "pt"
    ? `${props.invitedBy} convidou você para a ${props.teamName}`
    : `${props.invitedBy} invited you to ${props.teamName}`;
}

/** Invitation to join a team account. */
export function TeamInvite(props: TeamInviteProps) {
  const lang = toLang(props.lang);
  const pt = lang === "pt";
  const company = companyOf(props);
  const days = props.expiresInDays ?? 7;
  return (
    <Layout
      lang={lang}
      brand={props.brand}
      subject={teamInviteSubject(props)}
      preview={pt ? "Aceite o convite para entrar na equipe." : "Accept the invite to join the team."}
      note={noteFor(props, accountNote[lang])}
    >
      <Heading>{pt ? "Você foi convidado" : "You are invited"}</Heading>
      <Paragraph values={{ by: props.invitedBy, team: props.teamName, on: company ? ` on ${company}` : "" }}>
        {pt ? "**{by}** chamou você para participar da equipe **{team}**." : "**{by}** invited you to join the **{team}** team{on}."}
      </Paragraph>
      <Button href={props.inviteUrl}>{pt ? "Aceitar convite" : "Accept invite"}</Button>
      <Paragraph muted values={{ days }}>
        {pt
          ? "O convite vale por {days} dias. Se não esperava por ele, pode ignorar este e-mail."
          : "The invite is valid for {days} days. If you were not expecting it, you can ignore this email."}
      </Paragraph>
    </Layout>
  );
}

TeamInvite.PreviewProps = {
  lang: "pt",
  invitedBy: "Carlos Lima",
  teamName: "Loja Aurora",
  inviteUrl: "https://exemplo.com.br/convite?t=abc123",
  expiresInDays: 7,
} satisfies TeamInviteProps;

export default TeamInvite;
