import { useMemo } from "react";
import { FormShell, Note } from "../ui";

const COUNT = 2500;

export default function Heavy({ winId }) {
  const rows = useMemo(
    () => Array.from({ length: COUNT }, (_, i) => `Row ${i + 1} · ${winId}`),
    [winId],
  );

  return (
    <FormShell title={`Heavy (${COUNT})`} testId="form-heavy">
      <Note>Cambia de tab inactiva: FreezeInactive no debe re-renderizar esta lista.</Note>
      <div data-testid="heavy-list">
        {rows.map((row) => (
          <div key={row} style={{ fontSize: 11, lineHeight: "18px" }}>{row}</div>
        ))}
      </div>
    </FormShell>
  );
}
