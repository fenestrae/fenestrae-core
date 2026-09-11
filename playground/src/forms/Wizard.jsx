import { useState } from "react";
import { Btn, FormShell, Note, Row } from "../ui";
import { logApi } from "../lab/log";

export default function Wizard({ winId, onNext, onPrev, onApply, onSave, onClose }) {
  const [step, setStep] = useState(1);

  function go(fn, label, nextStep) {
    logApi(label, { winId, step });
    setStep(nextStep);
    fn?.({ step: nextStep });
  }

  return (
    <FormShell title={`Wizard · paso ${step}`} testId="form-wizard">
      <Note>onNext / onPrev / onApply cierran la Promise del opener.</Note>
      <Row>
        <Btn id="wizard-prev" disabled={step <= 1} onClick={() => go(onPrev, "onPrev", step - 1)}>Prev</Btn>
        <Btn id="wizard-next" disabled={step >= 3} onClick={() => go(onNext, "onNext", step + 1)}>Next</Btn>
        <Btn id="wizard-apply" onClick={() => { logApi("onApply", { winId, step }); onApply?.({ step }); }}>Apply</Btn>
        <Btn id="wizard-save" kind="primary" onClick={() => { logApi("onSave", { winId, step }); onSave?.({ step }); }}>Save</Btn>
        <Btn id="wizard-close" onClick={() => onClose?.({ step })}>Close</Btn>
      </Row>
    </FormShell>
  );
}
