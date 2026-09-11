import { useState } from "react";
import { Btn, Field, FormShell, Note, Row } from "../ui";
import { logApi } from "../lab/log";

export default function Detail({
  winId,
  routeParams,
  onSave,
  onCancel,
  onClose,
  onDelete,
}) {
  const initial = routeParams?.initialData || routeParams?.this || {};
  const [name, setName] = useState(initial.name || `Item ${routeParams?.id || ""}`);

  function emit(fn, label, payload) {
    logApi(label, { winId, payload });
    fn?.(payload);
  }

  return (
    <FormShell title={routeParams?.title || "Detalle"} testId="form-detail">
      <Note>winId {winId} · id {routeParams?.id || "—"}</Note>
      <Field label="Nombre" testId="detail-name" value={name} onChange={setName} />
      <Row>
        <Btn id="detail-save" kind="primary" onClick={() => emit(onSave, "onSave", { name })}>Save</Btn>
        <Btn id="detail-cancel" onClick={() => emit(onCancel, "onCancel", "cancelled")}>Cancel</Btn>
        <Btn id="detail-delete" onClick={() => emit(onDelete, "onDelete", { name })}>Delete</Btn>
        <Btn id="detail-close" onClick={() => emit(onClose, "onClose", { name })}>Close</Btn>
      </Row>
    </FormShell>
  );
}
