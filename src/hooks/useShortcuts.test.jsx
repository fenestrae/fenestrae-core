import { render } from "@testing-library/react";
import { createElement, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useShortcuts } from "./useShortcuts";

afterEach(() => {
  document.body.innerHTML = "";
});

function Harness({ shortcuts, active = true }) {
  const [fired, setFired] = useState("");
  useShortcuts(
    Object.fromEntries(
      Object.entries(shortcuts).map(([combo, fn]) => [
        combo,
        (event) => {
          fn(event);
          setFired(combo);
        },
      ]),
    ),
    active,
  );
  return createElement("div", { "data-fired": fired });
}

describe("useShortcuts", () => {
  it("fires the matching key combo", () => {
    const onSave = vi.fn();
    render(createElement(Harness, { shortcuts: { "Ctrl+s": onSave } }));

    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "s", ctrlKey: true, bubbles: true }),
    );

    expect(onSave).toHaveBeenCalled();
  });

  it("does nothing when inactive", () => {
    const onSave = vi.fn();
    render(createElement(Harness, { shortcuts: { "Ctrl+s": onSave }, active: false }));

    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "s", ctrlKey: true, bubbles: true }),
    );

    expect(onSave).not.toHaveBeenCalled();
  });
});
