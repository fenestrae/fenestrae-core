export function FormShell({ title, testId, children }) {
  return (
    <div
      data-testid={testId}
      style={{
        height: "100%",
        overflow: "auto",
        padding: 12,
        boxSizing: "border-box",
        background: "var(--color-window-content, #fafafa)",
        color: "var(--color-window-text, #111)",
        fontSize: 13,
      }}
    >
      {title ? <h2 style={{ margin: "0 0 12px", fontSize: 15 }}>{title}</h2> : null}
      {children}
    </div>
  );
}

export function Btn({ id, onClick, children, disabled, kind = "default" }) {
  const primary = kind === "primary";
  return (
    <button
      type="button"
      data-testid={id}
      disabled={disabled}
      onClick={onClick}
      style={{
        font: "inherit",
        fontSize: 12,
        padding: "4px 8px",
        borderRadius: 4,
        border: "1px solid var(--color-window-border, #d1d5db)",
        background: primary ? "var(--color-window-header, #1e293b)" : "var(--color-window-bg, #fff)",
        color: primary ? "var(--color-window-header-text, #fff)" : "var(--color-window-text, #111)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

export function Row({ children }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
      {children}
    </div>
  );
}

export function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 14 }}>
      <h3 style={{ margin: "0 0 6px", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.4, opacity: 0.7 }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function Field({ label, value, onChange, type = "text", testId }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, marginBottom: 8 }}>
      {label}
      <input
        data-testid={testId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          font: "inherit",
          padding: "4px 6px",
          border: "1px solid var(--color-window-border, #d1d5db)",
          borderRadius: 4,
          background: "var(--color-window-bg, #fff)",
          color: "inherit",
        }}
      />
    </label>
  );
}

export function Note({ children }) {
  return (
    <p style={{ margin: "0 0 8px", fontSize: 12, opacity: 0.8 }}>{children}</p>
  );
}

export function Pre({ children, testId }) {
  return (
    <pre
      data-testid={testId}
      style={{
        margin: 0,
        padding: 8,
        fontSize: 11,
        overflow: "auto",
        maxHeight: 240,
        background: "var(--color-window-bg, #fff)",
        border: "1px solid var(--color-window-border, #d1d5db)",
        borderRadius: 4,
      }}
    >
      {children}
    </pre>
  );
}
