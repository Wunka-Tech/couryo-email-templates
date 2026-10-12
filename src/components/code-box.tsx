import { Text } from "@react-email/components";
import { colors, monoStack } from "./theme.js";

export type CodeBoxProps = {
  children: string;
  /** "lg" for short codes people type (login code), "md" for long codes people copy (Pix, boleto). */
  size?: "md" | "lg";
};

/** Monospace box for codes to copy: Pix copia e cola, linha digitável, login code. */
export function CodeBox({ children, size = "md" }: CodeBoxProps) {
  const lg = size === "lg";
  return (
    <Text
      className="e-code"
      style={{
        fontFamily: monoStack,
        fontSize: lg ? 32 : 14,
        lineHeight: lg ? "40px" : "22px",
        fontWeight: lg ? 700 : 400,
        letterSpacing: lg ? 8 : 0,
        textAlign: lg ? "center" : "left",
        color: colors.text,
        backgroundColor: colors.codeBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 6,
        padding: lg ? "16px" : "14px 16px",
        margin: "0 0 16px",
        wordBreak: "break-all",
        userSelect: "all",
        WebkitUserSelect: "all",
      }}
    >
      {children}
    </Text>
  );
}
