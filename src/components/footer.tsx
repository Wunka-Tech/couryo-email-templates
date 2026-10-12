import { Text } from "@react-email/components";
import { useEmail } from "./context.js";
import { rich } from "./rich.js";
import { colors } from "./theme.js";

const muted = { fontSize: 13, lineHeight: "20px", color: colors.muted, textAlign: "center", margin: "0 0 4px" } as const;

/** Company name, optional address and the note that explains why the person got the email. */
export function Footer({ note }: { note: string }) {
  const { brand } = useEmail();
  return (
    <>
      <Text className="e-muted" style={{ ...muted, fontWeight: 600 }}>
        {brand.name}
      </Text>
      {brand.address ? (
        <Text className="e-muted" style={muted}>
          {brand.address}
        </Text>
      ) : null}
      <Text className="e-muted" style={{ ...muted, margin: 0 }}>
        {rich(note, {}, colors.muted)}
      </Text>
    </>
  );
}
