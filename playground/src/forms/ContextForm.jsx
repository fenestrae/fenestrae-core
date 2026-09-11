import { useEffect, useState } from "react";
import { fenestrae } from "fenestrae";
import { Btn, Field, FormShell, Note, Pre, Row } from "../ui";

export default function ContextForm({ winId }) {
  const [filters, setFilters] = useState("");
  const [draft, setDraft] = useState("");
  const [password, setPassword] = useState("secret-should-not-persist");
  const [loaded, setLoaded] = useState(null);

  async function reload() {
    const [f, d, secrets] = await Promise.all([
      fenestrae.context.load(winId, "filters", ""),
      fenestrae.context.load(winId, "draft", ""),
      fenestrae.context.load(winId, "secrets", null),
    ]);
    setLoaded({ filters: f, draft: d, secrets });
  }

  useEffect(() => {
    reload();
  }, [winId]);

  return (
    <FormShell title="Context" testId="form-context">
      <Note>password/token no deben volver de IndexedDB. F5 debe conservar filters/draft.</Note>
      <Field label="filters" testId="ctx-filters" value={filters} onChange={setFilters} />
      <Field label="draft (debounce)" testId="ctx-draft" value={draft} onChange={(v) => {
        setDraft(v);
        fenestrae.context.saveDebounced(winId, "draft", v);
      }} />
      <Field label="password (clave de objeto, no de context)" testId="ctx-password" value={password} onChange={setPassword} type="text" />
      <Row>
        <Btn id="ctx-save" kind="primary" onClick={async () => {
          await fenestrae.context.save(winId, "filters", filters);
          await fenestrae.context.save(winId, "secrets", { password, token: "abc", q: "keep" });
          await reload();
        }}>Save</Btn>
        <Btn id="ctx-reload" onClick={reload}>Load</Btn>
        <Btn id="ctx-clear" onClick={async () => {
          await fenestrae.context.clear(winId, "filters");
          await reload();
        }}>Clear filters</Btn>
        <Btn id="ctx-clear-all" onClick={async () => {
          await fenestrae.context.clearAll(winId);
          await reload();
        }}>Clear all</Btn>
      </Row>
      <Pre testId="ctx-loaded">{JSON.stringify(loaded, null, 2)}</Pre>
    </FormShell>
  );
}
