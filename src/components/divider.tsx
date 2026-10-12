import { Hr } from "@react-email/components";
import { colors } from "./theme.js";

export function Divider() {
  return <Hr className="e-hr" style={{ border: "none", borderTop: `1px solid ${colors.border}`, margin: "8px 0 24px" }} />;
}
