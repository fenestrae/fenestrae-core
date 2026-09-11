import { afterEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEYS } from "../core/constants";
import {
  clearFenestraeSessionStorage,
  FENESTRAE_SESSION_KEYS,
  getFrameSandbox,
  isSensitiveKey,
  postToWindow,
  resolveTrustedFrameUrl,
  sanitizePersistable,
  writeBlankPopupDocument,
} from "./security";

describe("resolveTrustedFrameUrl", () => {
  it("rejects empty, non-string and dangerous schemes", () => {
    expect(resolveTrustedFrameUrl(null)).toBeNull();
    expect(resolveTrustedFrameUrl("")).toBeNull();
    expect(resolveTrustedFrameUrl("   ")).toBeNull();
    expect(resolveTrustedFrameUrl("javascript:alert(1)")).toBeNull();
    expect(resolveTrustedFrameUrl("data:text/html,hi")).toBeNull();
    expect(resolveTrustedFrameUrl("blob:http://localhost/abc")).toBeNull();
    expect(resolveTrustedFrameUrl("file:///etc/passwd")).toBeNull();
    expect(resolveTrustedFrameUrl("vbscript:msgbox(1)")).toBeNull();
  });

  it("accepts same-origin http(s) and relative urls", () => {
    const relative = resolveTrustedFrameUrl("/customers?id=1");
    expect(relative.origin).toBe(window.location.origin);
    expect(relative.sameOrigin).toBe(true);
    expect(relative.href).toContain("/customers?id=1");

    const absolute = resolveTrustedFrameUrl(`${window.location.origin}/ok`);
    expect(absolute.sameOrigin).toBe(true);
  });

  it("accepts extra origins listed in allowedOrigins", () => {
    const trusted = resolveTrustedFrameUrl("https://forms.example.test/x", [
      "https://forms.example.test",
    ]);
    expect(trusted).toMatchObject({
      origin: "https://forms.example.test",
      sameOrigin: false,
    });
  });

  it("rejects other origins and non-http protocols", () => {
    expect(resolveTrustedFrameUrl("https://evil.test/x")).toBeNull();
    expect(resolveTrustedFrameUrl("ftp://localhost/x")).toBeNull();
    expect(resolveTrustedFrameUrl("about:blank")).toBeNull();
  });

  it("ignores non-string allowedOrigins entries", () => {
    expect(
      resolveTrustedFrameUrl("https://forms.example.test/x", [12, "https://forms.example.test"]),
    ).not.toBeNull();
  });
});

describe("getFrameSandbox", () => {
  it("only grants allow-same-origin for trusted same-origin frames", () => {
    expect(getFrameSandbox(true)).toBe("allow-scripts allow-forms allow-same-origin");
    expect(getFrameSandbox(false)).toBe("allow-scripts allow-forms");
  });
});

describe("postToWindow", () => {
  it("posts only to an open window with the app origin", () => {
    const target = { closed: false, postMessage: vi.fn() };
    postToWindow(target, { type: "PING" });
    expect(target.postMessage).toHaveBeenCalledWith({ type: "PING" }, window.location.origin);

    postToWindow(null, { type: "PING" });
    postToWindow({ closed: true, postMessage: vi.fn() }, { type: "PING" });
    expect(target.postMessage).toHaveBeenCalledTimes(1);
  });
});

describe("sanitizePersistable", () => {
  it("strips secrets, forbidden keys, functions and DOM-like values", () => {
    expect(isSensitiveKey("password")).toBe(true);
    expect(isSensitiveKey("DNI")).toBe(true);
    expect(isSensitiveKey("api_key")).toBe(true);
    expect(isSensitiveKey("city")).toBe(false);

    const clean = sanitizePersistable({
      city: "Madrid",
      password: "secret",
      token: "abc",
      nested: { apiKey: "x", q: 1 },
      fn: () => 1,
      constructor: { probed: true },
      prototype: { probed: true },
    });

    expect(clean).toEqual({
      city: "Madrid",
      nested: { q: 1 },
    });
    expect(sanitizePersistable(() => {})).toBeUndefined();
    expect(sanitizePersistable([1, () => 2, 3])).toEqual([1, 3]);
  });

  it("drops values deeper than 6 levels", () => {
    const nested = { a: { b: { c: { d: { e: { f: { g: { keep: true } } } } } } } };
    const clean = sanitizePersistable(nested);
    expect(JSON.stringify(clean)).not.toContain("keep");
  });
});

describe("clearFenestraeSessionStorage", () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it("removes only fenestrae_* keys", () => {
    Object.values(STORAGE_KEYS).forEach((key) => sessionStorage.setItem(key, "x"));
    sessionStorage.setItem("other_app", "keep");

    clearFenestraeSessionStorage();

    FENESTRAE_SESSION_KEYS.forEach((key) => {
      expect(sessionStorage.getItem(key)).toBeNull();
    });
    expect(sessionStorage.getItem("other_app")).toBe("keep");
  });
});

describe("writeBlankPopupDocument", () => {
  it("writes a blank document with origin base and title", () => {
    const created = [];
    const doc = {
      head: { appendChild: vi.fn((node) => created.push(node)) },
      open: vi.fn(),
      write: vi.fn(),
      close: vi.fn(),
      title: "",
      createElement: vi.fn((tag) => {
        const node = { tag, attrs: {}, textContent: "" };
        node.setAttribute = (name, value) => {
          node.attrs[name] = value;
        };
        return node;
      }),
    };

    writeBlankPopupDocument({ document: doc }, "Customers");

    expect(doc.open).toHaveBeenCalled();
    expect(doc.write).toHaveBeenCalled();
    expect(doc.close).toHaveBeenCalled();
    expect(doc.title).toBe("Customers");
    expect(created.some((node) => node.tag === "base" && node.attrs.href === window.location.origin)).toBe(true);
  });
});
