import { fenestrae } from "fenestrae";
import { Btn, FormShell, Note, Row } from "../ui";
import { logApi } from "../lab/log";

export default function IframeProbe({ winId }) {
  function openUrl(title, url, extra = {}) {
    logApi("iframe", { url, ...extra });
    fenestrae.showTab(winId, "frmiframe", { title, id: title, url, ...extra });
  }

  return (
    <FormShell title="Iframe / URLs" testId="form-iframe">
      <Note>Same-origin funciona. javascript: y orígenes extra sin allowlist muestran URL_NOT_ALLOWED.</Note>
      <Row>
        <Btn
          id="iframe-ok"
          kind="primary"
          onClick={() => openUrl("iframe-ok", `${window.location.origin}/iframe.html`)}
        >
          Same-origin
        </Btn>
        <Btn
          id="iframe-js"
          onClick={() => openUrl("iframe-js", "javascript:alert(1)")}
        >
          javascript: (rechazada)
        </Btn>
        <Btn
          id="iframe-foreign"
          onClick={() => openUrl("iframe-foreign", "https://example.com")}
        >
          example.com
        </Btn>
        <Btn
          id="iframe-allowed"
          onClick={() => openUrl("iframe-allowed", "https://example.com", {
            allowedOrigins: ["https://example.com"],
          })}
        >
          example.com + allowedOrigins
        </Btn>
      </Row>
    </FormShell>
  );
}
