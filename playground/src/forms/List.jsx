import { useEffect, useState } from "react";
import { fenestrae } from "fenestrae";
import { Btn, Field, FormShell, Note, Row } from "../ui";

export default function List({ winId, routeParams }) {
  const recordId = routeParams?.id || "0";
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await fenestrae.context.load(winId, "filters", { q: "" });
      if (!cancelled) setQuery(stored?.q || "");
    })();
    return () => { cancelled = true; };
  }, [winId]);

  function onQuery(q) {
    setQuery(q);
    fenestrae.context.saveDebounced(winId, "filters", { q });
  }

  return (
    <FormShell title={`Lista ${recordId}`} testId="form-list">
      <Note>uniqueKey reutiliza la misma tab si el id coincide.</Note>
      <Field label="Filtro (context)" testId="list-filter" value={query} onChange={onQuery} />
      <Row>
        <Btn
          id="list-open-detail"
          kind="primary"
          onClick={() => fenestrae.showModal(winId, "frmdetail", {
            title: `Detalle ${recordId}`,
            id: recordId,
            initialData: { id: recordId, q: query },
          })}
        >
          Abrir detalle
        </Btn>
        <Btn
          id="list-same-id"
          onClick={() => fenestrae.showTab(null, "frmlist", { title: `Lista ${recordId}`, id: recordId })}
        >
          Reabrir mismo id
        </Btn>
        <Btn
          id="list-new-id"
          onClick={() => fenestrae.showTab(null, "frmlist", { title: "Lista nueva", id: `${recordId}-b` })}
        >
          Abrir otro id
        </Btn>
      </Row>
    </FormShell>
  );
}
