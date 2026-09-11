import type { ComponentType, ReactNode } from "react";

export type WinType = "tab" | "modal" | "float" | "side" | "top" | "panel" | "ext";
export type DockZone = "top" | "left" | "right" | "bottom";

export interface WindowParams {
  title?: string;
  url?: string;
  id?: string;
  name?: string;
  initialData?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface WindowCallbacks {
  onSave?: (...args: unknown[]) => void;
  onClose?: (...args: unknown[]) => void;
  onCancel?: (...args: unknown[]) => void;
  onDelete?: (...args: unknown[]) => void;
  onApply?: (...args: unknown[]) => void;
  onError?: (...args: unknown[]) => void;
  onNext?: (...args: unknown[]) => void;
  onPrev?: (...args: unknown[]) => void;
}

export interface CreateWindowOptions {
  component?: string;
  typeshow?: WinType;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  params?: WindowParams;
  callbacks?: WindowCallbacks;
  title?: string;
}

export type RegisteredComponent =
  | ComponentType<any>
  | { component: ComponentType<any>; options?: Record<string, unknown> };

export interface SessionRecord {
  sessionId: string;
  userId: string;
  workspaceId: string;
  winOrder?: string[];
  activeWinId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContextApi {
  save: (winId: string, key: string, value: unknown) => Promise<void>;
  saveDebounced: (winId: string, key: string, value: unknown, delay?: number) => void;
  load: (winId: string, key: string, defaultValue?: unknown) => Promise<unknown>;
  clear: (winId: string, key: string) => Promise<void>;
  clearAll: (winId: string) => Promise<void>;
}

export interface WinApi {
  register: (components: Record<string, RegisteredComponent>) => void;
  createWindow: (parentId: string | undefined, options?: CreateWindowOptions) => string | null;
  showWindow: (winId: string) => void;
  hideWindow: (winId: string) => void;
  destroyWindow: (winId: string) => void;
  moveWindow: (winId: string, x: number, y: number) => void;
  resizeWindow: (winId: string, width: number, height: number) => void;
  setWindowTitle: (winId: string, caption: string) => void;
  focusWindow: (winId: string) => void;
  minimizeWindow: (winId: string) => void;
  maximizeWindow: (winId: string) => void;
  getActiveTab: () => string | null;
  showTab: (parent: string | null, name: string, params?: WindowParams, route?: string) => unknown;
  showModal: (parent: string | null, name: string, params?: WindowParams, cb?: WindowCallbacks) => unknown;
  showFloat: (parent: string | null, name: string, params?: WindowParams, cb?: WindowCallbacks) => unknown;
  showSide: (parent: string | null, name: string, params?: WindowParams, cb?: WindowCallbacks) => unknown;
  showTop: (parent: string | null, name: string, params?: WindowParams, cb?: WindowCallbacks) => unknown;
  showPanel: (parent: string | null, name: string, params?: WindowParams, cb?: WindowCallbacks) => unknown;
  showExt: (parent: string | null, name: string, params?: WindowParams, cb?: WindowCallbacks) => unknown;
  showPopup: (
    parent: string | null,
    name: string,
    params?: WindowParams,
    cb?: WindowCallbacks,
    opt?: Record<string, unknown>
  ) => unknown;
  showPopupSimple: (name: string, params?: WindowParams, opt?: Record<string, unknown>) => unknown;
  setMatchCode: (winId: string) => void;
  setUser: (user: unknown) => void;
  setEmpresa: (nombre: string) => void;
  setCache: (winId: string, data: unknown) => void;
  isModal: (winId: string) => boolean;
  isFloat: (winId: string) => boolean;
  isRestored: (winId: string) => boolean;
  reset: () => void;
  dock: (winId: string, zone: DockZone) => void;
  undock: (winId: string) => void;
  fixed: (winId: string, zone: DockZone) => void;
  unfixed: (winId: string) => void;
}

export interface FNMainMenuProps {
  items?: unknown[];
  orientation?: "horizontal" | "vertical";
  winId?: string;
}

export type FNMainMenuComponent = ComponentType<FNMainMenuProps>;

export interface FenestraeApi extends WinApi {
  context: ContextApi;
  init: (options: { user: string; workspace: string }) => Promise<number>;
  getSessionsByUserId: (userId: string) => Promise<SessionRecord[]>;
  getSessionsByUserAndWorkspace: (user: string, workspace: string) => Promise<SessionRecord[]>;
  getSessions: () => Promise<SessionRecord[]>;
  createNewSession: (userId?: string | null, workspace?: string | null) => Promise<string>;
  activateSession: (sessionId?: string) => Promise<string>;
  setSession: (options?: { winOrder?: string[]; activeWinId?: string | null }) => Promise<string | void>;
  closeSession: () => Promise<void>;
  delSession: (sessionId: string) => Promise<void>;
  clearSessions: () => Promise<void>;
  restoreWindows: (initialWinConfig?: WindowParams) => Promise<boolean | void>;
  registerCommand: (name: string, fn: (winId: string, payload?: unknown) => void) => void;
  executeCommand: (winId: string, name: string, payload?: unknown) => void;
  setPermissions: (permissions: string[]) => void;
  getPermissions: () => string[];
  hasPermission: (required?: string) => boolean;
  FNMainMenu: FNMainMenuComponent;
}

export interface FenestraeProviderProps {
  components?: Record<string, RegisteredComponent>;
  themes?: Record<string, unknown>;
  defaultTheme?: string;
  children?: ReactNode;
}

export interface FenestraeContainerProps {
  initialWinConfig?: WindowParams;
  bootStrap?: ((workspace: string | null) => void) | null;
}

export const FenestraeProvider: ComponentType<FenestraeProviderProps>;
export const FenestraeContainer: ComponentType<FenestraeContainerProps>;

export const winStore: any;
export const win: WinApi;
export const context: ContextApi;
export const fenestrae: FenestraeApi;
export const ae: FenestraeApi;
export default fenestrae;

export const init: FenestraeApi["init"];
export const getSessionsByUserId: FenestraeApi["getSessionsByUserId"];
export const getSessionsByUserAndWorkspace: FenestraeApi["getSessionsByUserAndWorkspace"];
export const getSessions: FenestraeApi["getSessions"];
export const createNewSession: FenestraeApi["createNewSession"];
export const activateSession: FenestraeApi["activateSession"];
export const setSession: FenestraeApi["setSession"];
export const closeSession: FenestraeApi["closeSession"];
export const delSession: FenestraeApi["delSession"];
export const clearSessions: FenestraeApi["clearSessions"];
export const restoreWindows: FenestraeApi["restoreWindows"];
export const registerCommand: FenestraeApi["registerCommand"];
export const executeCommand: FenestraeApi["executeCommand"];
export const setPermissions: FenestraeApi["setPermissions"];
export const getPermissions: FenestraeApi["getPermissions"];
export const hasPermission: FenestraeApi["hasPermission"];

export const version: string;
export const author: string;
export const license: string;
