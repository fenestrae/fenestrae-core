import { fenestrae } from "fenestrae";
import { Btn, FormShell, Note, Row } from "../ui";
import { nextId } from "../lab/log";

export default function Nested({ winId }) {
  return (
    <FormShell title="Nested" testId="form-nested">
      <Note>Cerrar este padre debe destruir los hijos en cascada.</Note>
      <Row>
        <Btn
          id="nested-modal"
          onClick={() => fenestrae.showModal(winId, "frmdetail", { title: "Hijo modal", id: nextId("child") })}
        >
          Modal hijo
        </Btn>
        <Btn
          id="nested-float"
          onClick={() => fenestrae.showFloat(winId, "frmdetail", { title: "Hijo float", id: nextId("child") })}
        >
          Float hijo
        </Btn>
        <Btn
          id="nested-panel"
          onClick={() => fenestrae.showPanel(winId, "frmlist", { title: "Hijo panel", id: nextId("child") })}
        >
          Panel hijo
        </Btn>
      </Row>
    </FormShell>
  );
}
