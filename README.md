# Fenestrae

## Workspace Manager for Enterprise Applications  
### *Modern, inspired by the classic, designed for real productivity*

---

![Fenestrae Logo](https://raw.githubusercontent.com/fenestrae/fenestrae/main/logo.png)

---

## Badges

![npm version](https://img.shields.io/npm/v/fenestrae)
![license](https://img.shields.io/badge/license-Apache%202.0-blue)
![typescript](https://img.shields.io/badge/TypeScript-Ready-blue)
![react](https://img.shields.io/badge/React-Compatible-61dafb)

---

# Table of Contents

1. [Introduction](#introduction)  
2. [Identity](#identity)  
3. [What is Fenestrae](#what-is-fenestrae-version-103)  
4. [Important Notice](#-important)  
5. [Roadmap](#roadmap-toward-the-context-manager)  
6. [Quick Start](#quick-start)  
7. [Usage](#usage)  
8. [Examples](#examples)  
9. [Architecture Overview](#architecture-overview)  
10. [Contributing](#contributing)  
11. [Contact](#contact--support)  
12. [License](#license)  
13. [Installation](#installation)

---

## Introduction

For years we accepted an idea without questioning it:

**Migrating an enterprise application to the web meant losing productivity.**

- Less context  
- Less multitasking  
- Less continuity  

**Fenestrae** was created to bring back what always worked in enterprise applications, reimagined with modern technologies like **React** and **TypeScript**.

---

## Identity

The name **Fenestrae** comes from Latin and means **windows** — a direct reference to the roots of enterprise productivity: multiple processes, multiple contexts, and uninterrupted workflows.

The logo —a classic window with organic lines inspired by **Gaudí**— represents its essence:

> **Modernity without forgetting what always worked.**

**Gaudí** symbolizes innovation, craftsmanship, and reinterpretation of the past.  
**Fenestrae** embraces the same philosophy: a modern architecture that restores the productivity enterprise applications have always required.

> **Fenestrae is not for general web development.**  
> **It is exclusively for enterprise applications.**

---

## What is Fenestrae (version 1.0.3)

Version **1.0.3** is a **workspace manager** that brings back capabilities the modern web lost:

- Window management  
- Real multitasking  
- Basic form persistence  
- Docking  
- Floating tools  
- External windows  
- Multi‑monitor support  

---

## ❗ Important

> Version **1.0.3** does not yet include context management.  
> This functionality will arrive in future versions **(1.1.x)**.

---

## Roadmap Toward the Context Manager

Fenestrae will evolve into a **full context manager**, capable of handling:

- User contexts  
- Application contexts  
- Deep process persistence  
- Intelligent workspaces  
- Total continuity  

---

# Quick Start
Fenestrae se inicializa mediante dos componentes:

Fenestrae is initialized through the FenestraeProvider and rendered through the FenestraeContainer.
Once initialized, you can open windows anywhere in your application using the win API.
---

# Usage

### Opening a window

```js
fenestrae.showTab(null, "frmcustomers", {
  title: "Customers",
  id: "001",
});

fenestrae.showFloat(winId, "frmcustomers", { id: "001231" });

fenestrae.showFloat(winId, "", { url: "/customers?id=001231" });
```

Other openers: `showModal`, `showSide`, `showTop`, `showPanel`, `showExt`, `showPopup`.

### Closing a window

```js
fenestrae.destroyWindow(winId);
```

### Session and persistence

```js
await fenestrae.init({ user: "pepe", workspace: "erp" });
await fenestrae.activateSession(sessionId);
await fenestrae.restoreWindows(initialWinConfig);
```

Window position, size and basic form data are stored in IndexedDB. Per-window UI state uses the context API:

```js
await fenestrae.context.save(winId, "filters", { q: "acme" });
const filters = await fenestrae.context.load(winId, "filters");
```

### Cross-window messaging

Native popup windows receive an injected `window.externalBus`. Subscribe from the popup; the opener dispatches through the popup bridge (`EVENT`, `STORE_SYNC`, heartbeat). There is no `app.send` / `app.on` API.


# Architecture Overview

Fenestrae is built around three core pillars:

### 1. Workspace Engine  
Responsible for window lifecycle, multitasking, docking, and multi‑monitor support.

### 2. Communication Layer  
Event‑based messaging between windows and the main application.

### 3. Persistence Layer  
Stores window state, basic form data, and layout continuity.

Future versions will introduce:

- Context Manager  
- Deep process persistence  
- Intelligent workspace restoration  

---

# Contributing

Contributions are welcome.

To contribute:

1. Fork the repository  
2. Create a feature branch  
3. Submit a pull request  
4. Follow the coding style guidelines  
5. Include tests when possible  

---

## Contact & Support

fenestrae.ws@gmail.com

---

## License

Apache 2.0 — designed for adoption, extensibility, and enterprise integration.

---

## Installation

```bash
npm install fenestrae
```

