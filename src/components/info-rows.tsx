import { colors, monoStack } from "./theme.js";

export type InfoRow = { label: string; value: string; mono?: boolean };

const cell = { padding: "10px 0", borderBottom: `1px solid ${colors.border}`, verticalAlign: "top" } as const;

/** Label and value pairs (order number, date, total...) as a simple two-column table. */
export function InfoRows({ rows }: { rows: InfoRow[] }) {
  return (
    <table
      role="presentation"
      className="e-rows"
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      border={0}
      style={{ width: "100%", borderCollapse: "collapse", borderTop: `1px solid ${colors.border}`, margin: "0 0 24px" }}
    >
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td className="e-muted" style={{ ...cell, fontSize: 14, lineHeight: "22px", color: colors.muted, width: "45%", paddingRight: 12 }}>
              {r.label}
            </td>
            <td
              className="e-text"
              style={{
                ...cell,
                fontSize: 15,
                lineHeight: "22px",
                fontWeight: 600,
                color: colors.text,
                textAlign: "right",
                ...(r.mono ? { fontFamily: monoStack, wordBreak: "break-all" as const } : {}),
              }}
            >
              {r.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
