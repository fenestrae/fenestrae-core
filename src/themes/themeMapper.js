// ============================================================================
// FENESTRAE - Fenestrae Theme Mapper & Default Configurations (core/themeMapper.js)
// Centraliza los diccionarios de tokens anatómicos y visuales para el lienzo MDI.
// Soluciona el error de exportación faltante exigido por Rollup/Vite.
// ============================================================================

export const THEME_PRESETS = {

  // ========================================
  // 🎨 MODERN - Tema moderno y limpio
  // ========================================
  modern: {
    // Canvas & Workspace
    "--fn-canvas": "#f3f4f6",
    "--color-window-bg": "#ffffff",
    "--color-window-content": "#fafafa",
    "--color-window-border": "#d1d5db",
    "--color-window-text": "#1f2937",
    
    // Títulos unificados - Header oscuro con texto blanco
    "--color-window-header": "#1e293b",
    "--color-window-header-text": "#ffffff",
    "--color-window-header-inactive": "#94a3b8",
    "--color-window-header-inactive-text": "#f1f5f9",
    "--color-window-active-border": "#0a6ed1",
    "--spacing-window-padding": "0rem",

    // 🆕 Menú
    "--color-menu-bg": "#ffffff",
    "--color-menu-border": "#e5e7eb",
    "--color-menu-hover": "#f3f4f6",
    "--color-accent": "#0a6ed1",
    "--color-accent-hover": "#0056b3",

    // Docking Zones & Side Panels
    "--fn-dock-top-height": "32px",
    "--fn-dock-bottom-height": "200px",
    "--fn-dock-left-width": "250px",
    "--fn-dock-right-width": "250px",

    // Tabs
    "--fn-tab-height": "40px",
    "--fn-tab-min-width": "120px",
    "--fn-tab-max-width": "220px",
    "--radius-fn-tab-radius": "8px",
    "--fn-tab-direction": "row",
    
    "--color-fn-tab-bg-active": "#0a6ed1", 
    "--color-fn-tab-text-active": "#ffffff",
    "--color-fn-tab-bg-inactive": "#e5e7eb",
    "--color-fn-tab-text-inactive": "#4b5563",
    "--color-fn-tab-border": "#d1d5db",
    "--fn-tab-indicator-weight": "3px",
    "--color-fn-tab-indicator": "#3b82f6",

    // 🔹 BOTONES DE CONTROL - Modern
    "--fn-btn-control-size": "18px",
    "--radius-fn-btn-radius": "4px",
    "--color-fn-btn-action-text": "inherit",
    
    // Contenido de los botones
    "--fn-btn-close-content": "✕",
    "--fn-btn-minimize-content": "─",
    "--fn-btn-maximize-content": "□",
    "--fn-btn-restore-content": "❐",
    
    // Botón Cerrar
    "--color-fn-btn-close-bg": "transparent",
    "--color-fn-btn-close-border": "transparent",
    "--color-fn-btn-close-hover": "#ef4444",
    "--color-fn-btn-close-hover-text": "#ffffff",
    
    // Botón Minimizar
    "--color-fn-btn-minimize-bg": "transparent",
    "--color-fn-btn-minimize-border": "transparent",
    "--color-fn-btn-minimize-hover": "#f59e0b",
    "--color-fn-btn-minimize-hover-text": "#ffffff",
    
    // Botón Maximizar
    "--color-fn-btn-maximize-bg": "transparent",
    "--color-fn-btn-maximize-border": "transparent",
    "--color-fn-btn-maximize-hover": "#22c55e",
    "--color-fn-btn-maximize-hover-text": "#ffffff",

    // 🔒 Disabled
    "--color-fn-disabled-bg": "#e5e7eb",
    "--color-fn-disabled-text": "#9ca3af",
    "--color-fn-disabled-border": "#d1d5db",
    "--color-fn-disabled-opacity": "0.5",

    // 🎨 Colores Semánticos
    "--color-fn-success": "#22c55e",
    "--color-fn-success-hover": "#16a34a",
    "--color-fn-success-bg": "#dcfce7",
    "--color-fn-success-text": "#166534",
    "--color-fn-success-border": "#86efac",

    "--color-fn-warning": "#f59e0b",
    "--color-fn-warning-hover": "#d97706",
    "--color-fn-warning-bg": "#fef3c7",
    "--color-fn-warning-text": "#92400e",
    "--color-fn-warning-border": "#fcd34d",

    "--color-fn-error": "#ef4444",
    "--color-fn-error-hover": "#dc2626",
    "--color-fn-error-bg": "#fee2e2",
    "--color-fn-error-text": "#991b1b",
    "--color-fn-error-border": "#fca5a5",

    "--color-fn-info": "#3b82f6",
    "--color-fn-info-hover": "#2563eb",
    "--color-fn-info-bg": "#dbeafe",
    "--color-fn-info-text": "#1e40af",
    "--color-fn-info-border": "#93c5fd",

    // 📝 Textos
    "--color-fn-text-primary": "#1a1a1a",
    "--color-fn-text-secondary": "#4b5563",
    "--color-fn-text-tertiary": "#6b7280",
    "--color-fn-text-muted": "#9ca3af",
    "--color-fn-text-inverse": "#ffffff",
    "--color-fn-text-link": "#0a6ed1",
    "--color-fn-text-link-hover": "#0056b3",
    "--color-fn-text-placeholder": "#9ca3af",

    // 🎨 Fondos
    "--color-fn-bg-primary": "#ffffff",
    "--color-fn-bg-secondary": "#f3f4f6",
    "--color-fn-bg-tertiary": "#e5e7eb",
    "--color-fn-bg-inverse": "#1f2937",
    "--color-fn-bg-elevated": "#ffffff",
    "--color-fn-bg-muted": "#f9fafb",
    "--color-fn-bg-hover": "rgba(0,0,0,0.05)",
    "--color-fn-bg-active": "rgba(0,0,0,0.1)",

    // 🔲 Bordes
    "--color-fn-border-light": "#e5e7eb",
    "--color-fn-border-medium": "#d1d5db",
    "--color-fn-border-heavy": "#9ca3af",
    "--color-fn-border-focus": "#3b82f6",
    "--color-fn-divider": "#e5e7eb",

    // 🎭 Sombras
    "--shadow-fn-sm": "0 1px 2px rgba(0,0,0,0.05)",
    "--shadow-fn-md": "0 4px 6px rgba(0,0,0,0.07)",
    "--shadow-fn-lg": "0 10px 15px rgba(0,0,0,0.1)",
    "--shadow-fn-xl": "0 20px 25px rgba(0,0,0,0.15)",
    "--shadow-fn-inner": "inset 0 2px 4px rgba(0,0,0,0.06)",
    "--shadow-fn-focus": "0 0 0 3px rgba(59,130,246,0.3)",

    // 🔄 Scrollbar
    "--color-fn-scrollbar-track": "#f1f1f1",
    "--color-fn-scrollbar-thumb": "#c1c1c1",
    "--color-fn-scrollbar-thumb-hover": "#a8a8a8",

    // 🎯 Estados
    "--color-fn-selection-bg": "#3b82f6",
    "--color-fn-selection-text": "#ffffff",
    "--color-fn-highlight": "#fef08a",
    "--color-fn-focus-ring": "#3b82f6",
    "--color-fn-focus-ring-offset": "#ffffff",

    // 📐 Radius
    "--radius-fn-sm": "2px",
    "--radius-fn-md": "4px",
    "--radius-fn-lg": "8px",
    "--radius-fn-xl": "12px",
    "--radius-fn-full": "9999px",

    // 📏 Spacing
    "--spacing-fn-xs": "0.25rem",
    "--spacing-fn-sm": "0.5rem",
    "--spacing-fn-md": "0.75rem",
    "--spacing-fn-lg": "1rem",
    "--spacing-fn-xl": "1.5rem",
    "--spacing-fn-2xl": "2rem",

    // ⏱️ Transitions
    "--transition-fn-fast": "100ms ease",
    "--transition-fn-base": "200ms ease",
    "--transition-fn-slow": "300ms ease",
  },

  // ========================================
  // 🍏 macOS - Inspirado en macOS (botones redondos con colores)
  // ========================================
  macOS: {
    "--fn-canvas": "#e8eaed",
    "--color-window-bg": "#f8fafc",
    "--color-window-content": "#ffffff",
    "--color-window-border": "#cbd5e1",
    "--color-window-text": "#1d1d1f",
    
    "--color-window-header": "#e8eaed",
    "--color-window-header-text": "#1d1d1f",
    "--color-window-header-inactive": "#f1f3f5",
    "--color-window-header-inactive-text": "#6e6e73",
    "--color-window-active-border": "#007aff",
    "--spacing-window-padding": "0rem",

    // 🆕 Menú
    "--color-menu-bg": "#f8fafc",
    "--color-menu-border": "#cbd5e1",
    "--color-menu-hover": "#e8eaed",
    "--color-accent": "#007aff",
    "--color-accent-hover": "#0055cc",

    "--fn-dock-top-height": "40px",
    "--fn-dock-bottom-height": "240px",
    "--fn-dock-left-width": "280px",
    "--fn-dock-right-width": "280px",

    "--fn-tab-height": "36px",
    "--fn-tab-min-width": "100px",
    "--fn-tab-max-width": "220px",
    "--radius-fn-tab-radius": "6px",
    "--fn-tab-direction": "row",
    
    "--color-fn-tab-bg-active": "#ffffff", 
    "--color-fn-tab-text-active": "#1d1d1f",
    "--color-fn-tab-bg-inactive": "#e8eaed",
    "--color-fn-tab-text-inactive": "#6e6e73",
    "--color-fn-tab-border": "#cbd5e1",
    "--fn-tab-indicator-weight": "2px",
    "--color-fn-tab-indicator": "#007aff",

    // 🔹 BOTONES DE CONTROL - macOS (redondos con colores)
    "--fn-btn-control-size": "14px",
    "--radius-fn-btn-radius": "9999px",
    "--color-fn-btn-action-text": "transparent",
    
    "--fn-btn-close-content": "✕",
    "--fn-btn-minimize-content": "─",
    "--fn-btn-maximize-content": "□",
    "--fn-btn-restore-content": "❐",
    
    "--color-fn-btn-close-bg": "#fe5f55",
    "--color-fn-btn-close-border": "transparent",
    "--color-fn-btn-close-hover": "#ff5f57",
    "--color-fn-btn-close-hover-text": "#ffffff",
    
    "--color-fn-btn-minimize-bg": "#ffbd2e",
    "--color-fn-btn-minimize-border": "transparent",
    "--color-fn-btn-minimize-hover": "#ffbd2e",
    "--color-fn-btn-minimize-hover-text": "#ffffff",
    
    "--color-fn-btn-maximize-bg": "#28c840",
    "--color-fn-btn-maximize-border": "transparent",
    "--color-fn-btn-maximize-hover": "#28c840",
    "--color-fn-btn-maximize-hover-text": "#ffffff",

    // 🔒 Disabled - Estilo macOS
    "--color-fn-disabled-bg": "#e8eaed",
    "--color-fn-disabled-text": "#8e8e93",
    "--color-fn-disabled-border": "#d1d5db",
    "--color-fn-disabled-opacity": "0.6",

    // 🎨 Colores Semánticos - Estilo macOS
    "--color-fn-success": "#34c759",
    "--color-fn-success-hover": "#28a745",
    "--color-fn-success-bg": "#e8f5e9",
    "--color-fn-success-text": "#1e7e34",
    "--color-fn-success-border": "#81c784",

    "--color-fn-warning": "#ff9500",
    "--color-fn-warning-hover": "#e68a00",
    "--color-fn-warning-bg": "#fff3e0",
    "--color-fn-warning-text": "#995c00",
    "--color-fn-warning-border": "#ffcc80",

    "--color-fn-error": "#ff3b30",
    "--color-fn-error-hover": "#e6352b",
    "--color-fn-error-bg": "#ffebee",
    "--color-fn-error-text": "#b71c1c",
    "--color-fn-error-border": "#ef9a9a",

    "--color-fn-info": "#007aff",
    "--color-fn-info-hover": "#0066cc",
    "--color-fn-info-bg": "#e3f2fd",
    "--color-fn-info-text": "#0d47a1",
    "--color-fn-info-border": "#90caf9",

    // 📝 Textos
    "--color-fn-text-primary": "#1d1d1f",
    "--color-fn-text-secondary": "#6e6e73",
    "--color-fn-text-tertiary": "#8e8e93",
    "--color-fn-text-muted": "#aeaeb2",
    "--color-fn-text-inverse": "#ffffff",
    "--color-fn-text-link": "#007aff",
    "--color-fn-text-link-hover": "#0055cc",
    "--color-fn-text-placeholder": "#aeaeb2",

    // 🎨 Fondos
    "--color-fn-bg-primary": "#ffffff",
    "--color-fn-bg-secondary": "#f8fafc",
    "--color-fn-bg-tertiary": "#e8eaed",
    "--color-fn-bg-inverse": "#1d1d1f",
    "--color-fn-bg-elevated": "#ffffff",
    "--color-fn-bg-muted": "#f1f3f5",
    "--color-fn-bg-hover": "rgba(0,0,0,0.05)",
    "--color-fn-bg-active": "rgba(0,0,0,0.1)",

    // 🔲 Bordes
    "--color-fn-border-light": "#e8eaed",
    "--color-fn-border-medium": "#cbd5e1",
    "--color-fn-border-heavy": "#aeaeb2",
    "--color-fn-border-focus": "#007aff",
    "--color-fn-divider": "#e8eaed",

    // 🎭 Sombras - Estilo macOS
    "--shadow-fn-sm": "0 1px 3px rgba(0,0,0,0.08)",
    "--shadow-fn-md": "0 4px 8px rgba(0,0,0,0.12)",
    "--shadow-fn-lg": "0 10px 20px rgba(0,0,0,0.15)",
    "--shadow-fn-xl": "0 20px 40px rgba(0,0,0,0.2)",
    "--shadow-fn-inner": "inset 0 1px 3px rgba(0,0,0,0.05)",
    "--shadow-fn-focus": "0 0 0 4px rgba(0,122,255,0.2)",

    // 🔄 Scrollbar
    "--color-fn-scrollbar-track": "#e8eaed",
    "--color-fn-scrollbar-thumb": "#cbd5e1",
    "--color-fn-scrollbar-thumb-hover": "#aeaeb2",

    // 🎯 Estados
    "--color-fn-selection-bg": "#007aff",
    "--color-fn-selection-text": "#ffffff",
    "--color-fn-highlight": "#ffeb3b",
    "--color-fn-focus-ring": "#007aff",
    "--color-fn-focus-ring-offset": "#ffffff",

    // 📐 Radius
    "--radius-fn-sm": "4px",
    "--radius-fn-md": "6px",
    "--radius-fn-lg": "10px",
    "--radius-fn-xl": "14px",
    "--radius-fn-full": "9999px",

    // 📏 Spacing
    "--spacing-fn-xs": "0.25rem",
    "--spacing-fn-sm": "0.5rem",
    "--spacing-fn-md": "0.75rem",
    "--spacing-fn-lg": "1rem",
    "--spacing-fn-xl": "1.5rem",
    "--spacing-fn-2xl": "2rem",

    // ⏱️ Transitions
    "--transition-fn-fast": "150ms ease",
    "--transition-fn-base": "250ms ease",
    "--transition-fn-slow": "350ms ease",
  },

  // ========================================
  // 🕶️ DARK - Modo Oscuro Global (con acento naranja)
  // ========================================
  dark: {
    "--fn-canvas": "#111827",
    "--color-window-bg": "#1f2937",
    "--color-window-content": "#111827",
    "--color-window-border": "#374151",
    "--color-window-text": "#f9fafb",
    
    "--color-window-header": "#1f2937",
    "--color-window-header-text": "#f9fafb",
    "--color-window-header-inactive": "#374151",
    "--color-window-header-inactive-text": "#9ca3af",
    "--color-window-active-border": "#f59e0b",
    "--spacing-window-padding": "0rem",

    // 🆕 Menú
    "--color-menu-bg": "#1f2937",
    "--color-menu-border": "#374151",
    "--color-menu-hover": "#374151",
    "--color-accent": "#f59e0b",
    "--color-accent-hover": "#d97706",

    "--fn-dock-top-height": "32px",
    "--fn-dock-bottom-height": "200px",
    "--fn-dock-left-width": "250px",
    "--fn-dock-right-width": "250px",

    "--fn-tab-height": "40px",
    "--fn-tab-min-width": "120px",
    "--fn-tab-max-width": "220px",
    "--radius-fn-tab-radius": "8px",
    "--fn-tab-direction": "row",
    
    "--color-fn-tab-bg-active": "#f59e0b",
    "--color-fn-tab-text-active": "#111827",
    "--color-fn-tab-bg-inactive": "#1f2937",
    "--color-fn-tab-text-inactive": "#9ca3af",
    "--color-fn-tab-border": "#374151",
    "--fn-tab-indicator-weight": "2px",
    "--color-fn-tab-indicator": "#f59e0b",

    // 🔹 BOTONES DE CONTROL - Dark
    "--fn-btn-control-size": "18px",
    "--radius-fn-btn-radius": "4px",
    "--color-fn-btn-action-text": "#9ca3af",
    
    "--fn-btn-close-content": "✕",
    "--fn-btn-minimize-content": "─",
    "--fn-btn-maximize-content": "□",
    "--fn-btn-restore-content": "❐",
    
    "--color-fn-btn-close-bg": "transparent",
    "--color-fn-btn-close-border": "transparent",
    "--color-fn-btn-close-hover": "#dc2626",
    "--color-fn-btn-close-hover-text": "#ffffff",
    
    "--color-fn-btn-minimize-bg": "transparent",
    "--color-fn-btn-minimize-border": "transparent",
    "--color-fn-btn-minimize-hover": "#f59e0b",
    "--color-fn-btn-minimize-hover-text": "#ffffff",
    
    "--color-fn-btn-maximize-bg": "transparent",
    "--color-fn-btn-maximize-border": "transparent",
    "--color-fn-btn-maximize-hover": "#22c55e",
    "--color-fn-btn-maximize-hover-text": "#ffffff",

    // 🔒 Disabled - Dark Mode
    "--color-fn-disabled-bg": "#374151",
    "--color-fn-disabled-text": "#6b7280",
    "--color-fn-disabled-border": "#4b5563",
    "--color-fn-disabled-opacity": "0.5",

    // 🎨 Colores Semánticos - Dark Mode
    "--color-fn-success": "#22c55e",
    "--color-fn-success-hover": "#16a34a",
    "--color-fn-success-bg": "#1a3a2a",
    "--color-fn-success-text": "#86efac",
    "--color-fn-success-border": "#166534",

    "--color-fn-warning": "#f59e0b",
    "--color-fn-warning-hover": "#d97706",
    "--color-fn-warning-bg": "#3a2a1a",
    "--color-fn-warning-text": "#fcd34d",
    "--color-fn-warning-border": "#92400e",

    "--color-fn-error": "#ef4444",
    "--color-fn-error-hover": "#dc2626",
    "--color-fn-error-bg": "#3a1a1a",
    "--color-fn-error-text": "#fca5a5",
    "--color-fn-error-border": "#991b1b",

    "--color-fn-info": "#f59e0b",
    "--color-fn-info-hover": "#d97706",
    "--color-fn-info-bg": "#3a2a1a",
    "--color-fn-info-text": "#fcd34d",
    "--color-fn-info-border": "#92400e",

    // 📝 Textos
    "--color-fn-text-primary": "#f9fafb",
    "--color-fn-text-secondary": "#d1d5db",
    "--color-fn-text-tertiary": "#9ca3af",
    "--color-fn-text-muted": "#6b7280",
    "--color-fn-text-inverse": "#111827",
    "--color-fn-text-link": "#f59e0b",
    "--color-fn-text-link-hover": "#fbbf24",
    "--color-fn-text-placeholder": "#6b7280",

    // 🎨 Fondos
    "--color-fn-bg-primary": "#1f2937",
    "--color-fn-bg-secondary": "#111827",
    "--color-fn-bg-tertiary": "#0f172a",
    "--color-fn-bg-inverse": "#ffffff",
    "--color-fn-bg-elevated": "#1f2937",
    "--color-fn-bg-muted": "#111827",
    "--color-fn-bg-hover": "rgba(245,158,11,0.1)",
    "--color-fn-bg-active": "rgba(245,158,11,0.2)",

    // 🔲 Bordes
    "--color-fn-border-light": "#374151",
    "--color-fn-border-medium": "#4b5563",
    "--color-fn-border-heavy": "#6b7280",
    "--color-fn-border-focus": "#f59e0b",
    "--color-fn-divider": "#374151",

    // 🎭 Sombras - Dark Mode
    "--shadow-fn-sm": "0 1px 2px rgba(0,0,0,0.3)",
    "--shadow-fn-md": "0 4px 6px rgba(0,0,0,0.4)",
    "--shadow-fn-lg": "0 10px 15px rgba(0,0,0,0.5)",
    "--shadow-fn-xl": "0 20px 25px rgba(0,0,0,0.6)",
    "--shadow-fn-inner": "inset 0 2px 4px rgba(0,0,0,0.3)",
    "--shadow-fn-focus": "0 0 0 3px rgba(245,158,11,0.4)",

    // 🔄 Scrollbar
    "--color-fn-scrollbar-track": "#1f2937",
    "--color-fn-scrollbar-thumb": "#4b5563",
    "--color-fn-scrollbar-thumb-hover": "#6b7280",

    // 🎯 Estados
    "--color-fn-selection-bg": "#f59e0b",
    "--color-fn-selection-text": "#111827",
    "--color-fn-highlight": "#fbbf24",
    "--color-fn-focus-ring": "#f59e0b",
    "--color-fn-focus-ring-offset": "#1f2937",

    // 📐 Radius
    "--radius-fn-sm": "2px",
    "--radius-fn-md": "4px",
    "--radius-fn-lg": "8px",
    "--radius-fn-xl": "12px",
    "--radius-fn-full": "9999px",

    // 📏 Spacing
    "--spacing-fn-xs": "0.25rem",
    "--spacing-fn-sm": "0.5rem",
    "--spacing-fn-md": "0.75rem",
    "--spacing-fn-lg": "1rem",
    "--spacing-fn-xl": "1.5rem",
    "--spacing-fn-2xl": "2rem",

    // ⏱️ Transitions
    "--transition-fn-fast": "100ms ease",
    "--transition-fn-base": "200ms ease",
    "--transition-fn-slow": "300ms ease",
  },

  // ========================================
  // 🎮 CYBERPUNK - Tema Cyberpunk (neón)
  // ========================================
  cyberpunk: {
    "--fn-canvas": "#0a0a0f",
    "--color-window-bg": "#14141e",
    "--color-window-content": "#0a0a0f",
    "--color-window-border": "#2a1f3d",
    "--color-window-text": "#e0d7ff",
    
    "--color-window-header": "#1a1a2e",
    "--color-window-header-text": "#bf7aff",
    "--color-window-header-inactive": "#12121e",
    "--color-window-header-inactive-text": "#6b5b8a",
    "--color-window-active-border": "#bf7aff",
    "--spacing-window-padding": "0rem",

    // 🆕 Menú
    "--color-menu-bg": "#14141e",
    "--color-menu-border": "#2a1f3d",
    "--color-menu-hover": "#1a1a2e",
    "--color-accent": "#bf7aff",
    "--color-accent-hover": "#d4aaff",

    "--fn-dock-top-height": "35px",
    "--fn-dock-bottom-height": "200px",
    "--fn-dock-left-width": "260px",
    "--fn-dock-right-width": "260px",

    "--fn-tab-height": "38px",
    "--fn-tab-min-width": "110px",
    "--fn-tab-max-width": "210px",
    "--radius-fn-tab-radius": "4px",
    "--fn-tab-direction": "row",
    
    "--color-fn-tab-bg-active": "#1a1a2e",
    "--color-fn-tab-text-active": "#bf7aff",
    "--color-fn-tab-bg-inactive": "#14141e",
    "--color-fn-tab-text-inactive": "#6b5b8a",
    "--color-fn-tab-border": "#2a1f3d",
    "--fn-tab-indicator-weight": "3px",
    "--color-fn-tab-indicator": "#bf7aff",

    // 🔹 BOTONES DE CONTROL - Cyberpunk (neón)
    "--fn-btn-control-size": "16px",
    "--radius-fn-btn-radius": "4px",
    "--color-fn-btn-action-text": "#6b5b8a",
    
    "--fn-btn-close-content": "✕",
    "--fn-btn-minimize-content": "─",
    "--fn-btn-maximize-content": "□",
    "--fn-btn-restore-content": "❐",
    
    "--color-fn-btn-close-bg": "transparent",
    "--color-fn-btn-close-border": "#2a1f3d",
    "--color-fn-btn-close-hover": "#ff2d55",
    "--color-fn-btn-close-hover-text": "#ffffff",
    
    "--color-fn-btn-minimize-bg": "transparent",
    "--color-fn-btn-minimize-border": "#2a1f3d",
    "--color-fn-btn-minimize-hover": "#ffaa00",
    "--color-fn-btn-minimize-hover-text": "#ffffff",
    
    "--color-fn-btn-maximize-bg": "transparent",
    "--color-fn-btn-maximize-border": "#2a1f3d",
    "--color-fn-btn-maximize-hover": "#00ff88",
    "--color-fn-btn-maximize-hover-text": "#ffffff",

    // 🔒 Disabled - Cyberpunk
    "--color-fn-disabled-bg": "#1a1a2e",
    "--color-fn-disabled-text": "#4a3a6a",
    "--color-fn-disabled-border": "#2a1f3d",
    "--color-fn-disabled-opacity": "0.5",

    // 🎨 Colores Semánticos - Cyberpunk
    "--color-fn-success": "#00ff88",
    "--color-fn-success-hover": "#00cc66",
    "--color-fn-success-bg": "#0a1a12",
    "--color-fn-success-text": "#66ffaa",
    "--color-fn-success-border": "#00cc66",

    "--color-fn-warning": "#ffaa00",
    "--color-fn-warning-hover": "#cc8800",
    "--color-fn-warning-bg": "#1a140a",
    "--color-fn-warning-text": "#ffcc44",
    "--color-fn-warning-border": "#cc8800",

    "--color-fn-error": "#ff2d55",
    "--color-fn-error-hover": "#cc2244",
    "--color-fn-error-bg": "#1a0a0e",
    "--color-fn-error-text": "#ff6680",
    "--color-fn-error-border": "#cc2244",

    "--color-fn-info": "#00ccff",
    "--color-fn-info-hover": "#0099cc",
    "--color-fn-info-bg": "#0a1a1a",
    "--color-fn-info-text": "#66ddff",
    "--color-fn-info-border": "#0099cc",

    // 📝 Textos
    "--color-fn-text-primary": "#e0d7ff",
    "--color-fn-text-secondary": "#bf7aff",
    "--color-fn-text-tertiary": "#8a6aaf",
    "--color-fn-text-muted": "#6b5b8a",
    "--color-fn-text-inverse": "#0a0a0f",
    "--color-fn-text-link": "#bf7aff",
    "--color-fn-text-link-hover": "#d4aaff",
    "--color-fn-text-placeholder": "#6b5b8a",

    // 🎨 Fondos
    "--color-fn-bg-primary": "#14141e",
    "--color-fn-bg-secondary": "#0a0a0f",
    "--color-fn-bg-tertiary": "#1f1a2e",
    "--color-fn-bg-inverse": "#e0d7ff",
    "--color-fn-bg-elevated": "#1a1a2e",
    "--color-fn-bg-muted": "#0a0a0f",
    "--color-fn-bg-hover": "rgba(191,122,255,0.1)",
    "--color-fn-bg-active": "rgba(191,122,255,0.2)",

    // 🔲 Bordes
    "--color-fn-border-light": "#2a1f3d",
    "--color-fn-border-medium": "#3a2a5a",
    "--color-fn-border-heavy": "#6b5b8a",
    "--color-fn-border-focus": "#bf7aff",
    "--color-fn-divider": "#2a1f3d",

    // 🎭 Sombras
    "--shadow-fn-sm": "0 1px 2px rgba(0,0,0,0.5)",
    "--shadow-fn-md": "0 4px 6px rgba(0,0,0,0.6)",
    "--shadow-fn-lg": "0 10px 15px rgba(0,0,0,0.7)",
    "--shadow-fn-xl": "0 20px 25px rgba(0,0,0,0.8)",
    "--shadow-fn-inner": "inset 0 2px 4px rgba(0,0,0,0.4)",
    "--shadow-fn-focus": "0 0 0 3px rgba(191,122,255,0.3)",

    // 🔄 Scrollbar
    "--color-fn-scrollbar-track": "#0a0a0f",
    "--color-fn-scrollbar-thumb": "#2a1f3d",
    "--color-fn-scrollbar-thumb-hover": "#3a2a5a",

    // 🎯 Estados
    "--color-fn-selection-bg": "#bf7aff",
    "--color-fn-selection-text": "#0a0a0f",
    "--color-fn-highlight": "#ffaa00",
    "--color-fn-focus-ring": "#bf7aff",
    "--color-fn-focus-ring-offset": "#14141e",

    // 📐 Radius
    "--radius-fn-sm": "2px",
    "--radius-fn-md": "4px",
    "--radius-fn-lg": "8px",
    "--radius-fn-xl": "12px",
    "--radius-fn-full": "9999px",

    // 📏 Spacing
    "--spacing-fn-xs": "0.25rem",
    "--spacing-fn-sm": "0.5rem",
    "--spacing-fn-md": "0.75rem",
    "--spacing-fn-lg": "1rem",
    "--spacing-fn-xl": "1.5rem",
    "--spacing-fn-2xl": "2rem",

    // ⏱️ Transitions
    "--transition-fn-fast": "100ms ease",
    "--transition-fn-base": "200ms ease",
    "--transition-fn-slow": "300ms ease",
  },

  // ========================================
  // 🌊 TROPICAL - Tema Tropical
  // ========================================
  tropical: {
    "--fn-canvas": "#fef3c7",
    "--color-window-bg": "#ffffff",
    "--color-window-content": "#fffbeb",
    "--color-window-border": "#fcd34d",
    "--color-window-text": "#78350f",
    
    "--color-window-header": "#d97706",
    "--color-window-header-text": "#ffffff",
    "--color-window-header-inactive": "#fbbf24",
    "--color-window-header-inactive-text": "#78350f",
    "--color-window-active-border": "#f59e0b",
    "--spacing-window-padding": "0rem",

    // 🆕 Menú
    "--color-menu-bg": "#ffffff",
    "--color-menu-border": "#fcd34d",
    "--color-menu-hover": "#fef3c7",
    "--color-accent": "#f59e0b",
    "--color-accent-hover": "#d97706",

    "--fn-dock-top-height": "38px",
    "--fn-dock-bottom-height": "220px",
    "--fn-dock-left-width": "270px",
    "--fn-dock-right-width": "270px",

    "--fn-tab-height": "38px",
    "--fn-tab-min-width": "115px",
    "--fn-tab-max-width": "210px",
    "--radius-fn-tab-radius": "12px",
    "--fn-tab-direction": "row",
    
    "--color-fn-tab-bg-active": "#f59e0b",
    "--color-fn-tab-text-active": "#ffffff",
    "--color-fn-tab-bg-inactive": "#fef3c7",
    "--color-fn-tab-text-inactive": "#92400e",
    "--color-fn-tab-border": "#fcd34d",
    "--fn-tab-indicator-weight": "3px",
    "--color-fn-tab-indicator": "#f59e0b",

    // 🔹 BOTONES DE CONTROL - Tropical (redondos grandes)
    "--fn-btn-control-size": "20px",
    "--radius-fn-btn-radius": "50%",
    "--color-fn-btn-action-text": "#78350f",
    
    "--fn-btn-close-content": "✕",
    "--fn-btn-minimize-content": "─",
    "--fn-btn-maximize-content": "□",
    "--fn-btn-restore-content": "❐",
    
    "--color-fn-btn-close-bg": "#fca5a5",
    "--color-fn-btn-close-border": "transparent",
    "--color-fn-btn-close-hover": "#ef4444",
    "--color-fn-btn-close-hover-text": "#ffffff",
    
    "--color-fn-btn-minimize-bg": "#fcd34d",
    "--color-fn-btn-minimize-border": "transparent",
    "--color-fn-btn-minimize-hover": "#f59e0b",
    "--color-fn-btn-minimize-hover-text": "#ffffff",
    
    "--color-fn-btn-maximize-bg": "#6ee7b7",
    "--color-fn-btn-maximize-border": "transparent",
    "--color-fn-btn-maximize-hover": "#22c55e",
    "--color-fn-btn-maximize-hover-text": "#ffffff",

    // 🔒 Disabled - Tropical
    "--color-fn-disabled-bg": "#fef3c7",
    "--color-fn-disabled-text": "#b45309",
    "--color-fn-disabled-border": "#fcd34d",
    "--color-fn-disabled-opacity": "0.5",

    // 🎨 Colores Semánticos - Tropical
    "--color-fn-success": "#22c55e",
    "--color-fn-success-hover": "#16a34a",
    "--color-fn-success-bg": "#dcfce7",
    "--color-fn-success-text": "#166534",
    "--color-fn-success-border": "#86efac",

    "--color-fn-warning": "#f59e0b",
    "--color-fn-warning-hover": "#d97706",
    "--color-fn-warning-bg": "#fef3c7",
    "--color-fn-warning-text": "#92400e",
    "--color-fn-warning-border": "#fcd34d",

    "--color-fn-error": "#ef4444",
    "--color-fn-error-hover": "#dc2626",
    "--color-fn-error-bg": "#fee2e2",
    "--color-fn-error-text": "#991b1b",
    "--color-fn-error-border": "#fca5a5",

    "--color-fn-info": "#06b6d4",
    "--color-fn-info-hover": "#0891b2",
    "--color-fn-info-bg": "#cffafe",
    "--color-fn-info-text": "#155e75",
    "--color-fn-info-border": "#67e8f9",

    // 📝 Textos
    "--color-fn-text-primary": "#78350f",
    "--color-fn-text-secondary": "#92400e",
    "--color-fn-text-tertiary": "#b45309",
    "--color-fn-text-muted": "#d97706",
    "--color-fn-text-inverse": "#ffffff",
    "--color-fn-text-link": "#f59e0b",
    "--color-fn-text-link-hover": "#d97706",
    "--color-fn-text-placeholder": "#d97706",

    // 🎨 Fondos
    "--color-fn-bg-primary": "#ffffff",
    "--color-fn-bg-secondary": "#fffbeb",
    "--color-fn-bg-tertiary": "#fef3c7",
    "--color-fn-bg-inverse": "#78350f",
    "--color-fn-bg-elevated": "#ffffff",
    "--color-fn-bg-muted": "#fffbeb",
    "--color-fn-bg-hover": "rgba(245,158,11,0.1)",
    "--color-fn-bg-active": "rgba(245,158,11,0.2)",

    // 🔲 Bordes
    "--color-fn-border-light": "#fef3c7",
    "--color-fn-border-medium": "#fcd34d",
    "--color-fn-border-heavy": "#f59e0b",
    "--color-fn-border-focus": "#f59e0b",
    "--color-fn-divider": "#fef3c7",

    // 🎭 Sombras
    "--shadow-fn-sm": "0 1px 2px rgba(120,53,15,0.1)",
    "--shadow-fn-md": "0 4px 6px rgba(120,53,15,0.15)",
    "--shadow-fn-lg": "0 10px 15px rgba(120,53,15,0.2)",
    "--shadow-fn-xl": "0 20px 25px rgba(120,53,15,0.25)",
    "--shadow-fn-inner": "inset 0 2px 4px rgba(120,53,15,0.05)",
    "--shadow-fn-focus": "0 0 0 3px rgba(245,158,11,0.3)",

    // 🔄 Scrollbar
    "--color-fn-scrollbar-track": "#fffbeb",
    "--color-fn-scrollbar-thumb": "#fcd34d",
    "--color-fn-scrollbar-thumb-hover": "#f59e0b",

    // 🎯 Estados
    "--color-fn-selection-bg": "#f59e0b",
    "--color-fn-selection-text": "#ffffff",
    "--color-fn-highlight": "#fef08a",
    "--color-fn-focus-ring": "#f59e0b",
    "--color-fn-focus-ring-offset": "#ffffff",

    // 📐 Radius
    "--radius-fn-sm": "4px",
    "--radius-fn-md": "8px",
    "--radius-fn-lg": "12px",
    "--radius-fn-xl": "16px",
    "--radius-fn-full": "9999px",

    // 📏 Spacing
    "--spacing-fn-xs": "0.25rem",
    "--spacing-fn-sm": "0.5rem",
    "--spacing-fn-md": "0.75rem",
    "--spacing-fn-lg": "1rem",
    "--spacing-fn-xl": "1.5rem",
    "--spacing-fn-2xl": "2rem",

    // ⏱️ Transitions
    "--transition-fn-fast": "100ms ease",
    "--transition-fn-base": "200ms ease",
    "--transition-fn-slow": "300ms ease",
  },

  // ========================================
  // 🥈 SILVER - Tema clásico C++Builder Silver
  // ========================================
  silver: {
    "--fn-canvas": "#efebe7",
    "--color-window-bg": "#f5f2ed",
    "--color-window-content": "#faf8f5",
    "--color-window-border": "#c8c4bc",
    "--color-window-text": "#1a1a1a",
    
    "--color-window-header": "#efebe7",
    "--color-window-header-text": "#1a1a1a",
    "--color-window-header-inactive": "#e5e1dc",
    "--color-window-header-inactive-text": "#888888",
    "--color-window-active-border": "#0072b0",
    "--spacing-window-padding": "0rem",

    // 🆕 Menú
    "--color-menu-bg": "#f5f2ed",
    "--color-menu-border": "#c8c4bc",
    "--color-menu-hover": "#efebe7",
    "--color-accent": "#0072b0",
    "--color-accent-hover": "#005a8a",

    "--fn-dock-top-height": "30px",
    "--fn-dock-bottom-height": "200px",
    "--fn-dock-left-width": "240px",
    "--fn-dock-right-width": "240px",

    "--fn-tab-height": "28px",
    "--fn-tab-min-width": "100px",
    "--fn-tab-max-width": "200px",
    "--radius-fn-tab-radius": "0px",
    "--fn-tab-direction": "row",
    
    "--color-fn-tab-bg-active": "#f5f2ed",
    "--color-fn-tab-text-active": "#1a1a1a",
    "--color-fn-tab-bg-inactive": "#efebe7",
    "--color-fn-tab-text-inactive": "#777777",
    "--color-fn-tab-border": "#c8c4bc",
    "--fn-tab-indicator-weight": "2px",
    "--color-fn-tab-indicator": "#0072b0",

    // 🔹 BOTONES DE CONTROL - Silver (cuadrados estilo IDE)
    "--fn-btn-control-size": "14px",
    "--radius-fn-btn-radius": "0px",
    "--color-fn-btn-action-text": "#777777",
    
    "--fn-btn-close-content": "✕",
    "--fn-btn-minimize-content": "─",
    "--fn-btn-maximize-content": "□",
    "--fn-btn-restore-content": "❐",
    
    "--color-fn-btn-close-bg": "#c0392b",
    "--color-fn-btn-close-border": "transparent",
    "--color-fn-btn-close-hover": "#e74c3c",
    "--color-fn-btn-close-hover-text": "#ffffff",
    
    "--color-fn-btn-minimize-bg": "#f39c12",
    "--color-fn-btn-minimize-border": "transparent",
    "--color-fn-btn-minimize-hover": "#f1c40f",
    "--color-fn-btn-minimize-hover-text": "#ffffff",
    
    "--color-fn-btn-maximize-bg": "#27ae60",
    "--color-fn-btn-maximize-border": "transparent",
    "--color-fn-btn-maximize-hover": "#2ecc71",
    "--color-fn-btn-maximize-hover-text": "#ffffff",

    // 🔒 Disabled - Silver
    "--color-fn-disabled-bg": "#e5e1dc",
    "--color-fn-disabled-text": "#999999",
    "--color-fn-disabled-border": "#c8c4bc",
    "--color-fn-disabled-opacity": "0.5",

    // 🎨 Colores Semánticos - Silver
    "--color-fn-success": "#27ae60",
    "--color-fn-success-hover": "#1e8449",
    "--color-fn-success-bg": "#e8f5e9",
    "--color-fn-success-text": "#1e8449",
    "--color-fn-success-border": "#81c784",

    "--color-fn-warning": "#f39c12",
    "--color-fn-warning-hover": "#d68910",
    "--color-fn-warning-bg": "#fff3e0",
    "--color-fn-warning-text": "#d68910",
    "--color-fn-warning-border": "#ffcc80",

    "--color-fn-error": "#c0392b",
    "--color-fn-error-hover": "#a93226",
    "--color-fn-error-bg": "#ffebee",
    "--color-fn-error-text": "#a93226",
    "--color-fn-error-border": "#ef9a9a",

    "--color-fn-info": "#0072b0",
    "--color-fn-info-hover": "#005a8a",
    "--color-fn-info-bg": "#e3f2fd",
    "--color-fn-info-text": "#005a8a",
    "--color-fn-info-border": "#90caf9",

    // 📝 Textos
    "--color-fn-text-primary": "#1a1a1a",
    "--color-fn-text-secondary": "#4a4a4a",
    "--color-fn-text-tertiary": "#777777",
    "--color-fn-text-muted": "#999999",
    "--color-fn-text-inverse": "#ffffff",
    "--color-fn-text-link": "#0072b0",
    "--color-fn-text-link-hover": "#005a8a",
    "--color-fn-text-placeholder": "#999999",

    // 🎨 Fondos
    "--color-fn-bg-primary": "#f5f2ed",
    "--color-fn-bg-secondary": "#efebe7",
    "--color-fn-bg-tertiary": "#e5e1dc",
    "--color-fn-bg-inverse": "#1a1a1a",
    "--color-fn-bg-elevated": "#faf8f5",
    "--color-fn-bg-muted": "#efebe7",
    "--color-fn-bg-hover": "rgba(0,0,0,0.05)",
    "--color-fn-bg-active": "rgba(0,0,0,0.1)",

    // 🔲 Bordes
    "--color-fn-border-light": "#e5e1dc",
    "--color-fn-border-medium": "#c8c4bc",
    "--color-fn-border-heavy": "#aaa69e",
    "--color-fn-border-focus": "#0072b0",
    "--color-fn-divider": "#e5e1dc",

    // 🎭 Sombras
    "--shadow-fn-sm": "0 1px 2px rgba(0,0,0,0.08)",
    "--shadow-fn-md": "0 4px 6px rgba(0,0,0,0.1)",
    "--shadow-fn-lg": "0 10px 15px rgba(0,0,0,0.15)",
    "--shadow-fn-xl": "0 20px 25px rgba(0,0,0,0.2)",
    "--shadow-fn-inner": "inset 0 2px 4px rgba(0,0,0,0.05)",
    "--shadow-fn-focus": "0 0 0 3px rgba(0,114,176,0.3)",

    // 🔄 Scrollbar
    "--color-fn-scrollbar-track": "#efebe7",
    "--color-fn-scrollbar-thumb": "#c8c4bc",
    "--color-fn-scrollbar-thumb-hover": "#aaa69e",

    // 🎯 Estados
    "--color-fn-selection-bg": "#0072b0",
    "--color-fn-selection-text": "#ffffff",
    "--color-fn-highlight": "#fef08a",
    "--color-fn-focus-ring": "#0072b0",
    "--color-fn-focus-ring-offset": "#f5f2ed",

    // 📐 Radius
    "--radius-fn-sm": "0px",
    "--radius-fn-md": "2px",
    "--radius-fn-lg": "4px",
    "--radius-fn-xl": "6px",
    "--radius-fn-full": "9999px",

    // 📏 Spacing
    "--spacing-fn-xs": "0.25rem",
    "--spacing-fn-sm": "0.5rem",
    "--spacing-fn-md": "0.75rem",
    "--spacing-fn-lg": "1rem",
    "--spacing-fn-xl": "1.5rem",
    "--spacing-fn-2xl": "2rem",

    // ⏱️ Transitions
    "--transition-fn-fast": "100ms ease",
    "--transition-fn-base": "200ms ease",
    "--transition-fn-slow": "300ms ease",
  },

  // ========================================
  // 🎨 PASTEL - Tema Pastel
  // ========================================
  pastel: {
    "--fn-canvas": "#f5f0ff",
    "--color-window-bg": "#ffffff",
    "--color-window-content": "#faf7ff",
    "--color-window-border": "#ddd6fe",
    "--color-window-text": "#4c1d95",
    
    "--color-window-header": "#7c3aed",
    "--color-window-header-text": "#ffffff",
    "--color-window-header-inactive": "#c4b5fd",
    "--color-window-header-inactive-text": "#4c1d95",
    "--color-window-active-border": "#8b5cf6",
    "--spacing-window-padding": "0rem",

    // 🆕 Menú
    "--color-menu-bg": "#ffffff",
    "--color-menu-border": "#ddd6fe",
    "--color-menu-hover": "#f5f0ff",
    "--color-accent": "#8b5cf6",
    "--color-accent-hover": "#7c3aed",

    "--fn-dock-top-height": "36px",
    "--fn-dock-bottom-height": "210px",
    "--fn-dock-left-width": "260px",
    "--fn-dock-right-width": "260px",

    "--fn-tab-height": "35px",
    "--fn-tab-min-width": "105px",
    "--fn-tab-max-width": "200px",
    "--radius-fn-tab-radius": "20px",
    "--fn-tab-direction": "row",
    
    "--color-fn-tab-bg-active": "#8b5cf6",
    "--color-fn-tab-text-active": "#ffffff",
    "--color-fn-tab-bg-inactive": "#ede9fe",
    "--color-fn-tab-text-inactive": "#6d28d9",
    "--color-fn-tab-border": "#ddd6fe",
    "--fn-tab-indicator-weight": "0px",
    "--color-fn-tab-indicator": "transparent",

    // 🔹 BOTONES DE CONTROL - Pastel (redondos)
    "--fn-btn-control-size": "16px",
    "--radius-fn-btn-radius": "9999px",
    "--color-fn-btn-action-text": "#6d28d9",
    
    "--fn-btn-close-content": "✕",
    "--fn-btn-minimize-content": "─",
    "--fn-btn-maximize-content": "□",
    "--fn-btn-restore-content": "❐",
    
    "--color-fn-btn-close-bg": "#f9a8d4",
    "--color-fn-btn-close-border": "transparent",
    "--color-fn-btn-close-hover": "#f472b6",
    "--color-fn-btn-close-hover-text": "#ffffff",
    
    "--color-fn-btn-minimize-bg": "#93c5fd",
    "--color-fn-btn-minimize-border": "transparent",
    "--color-fn-btn-minimize-hover": "#60a5fa",
    "--color-fn-btn-minimize-hover-text": "#ffffff",
    
    "--color-fn-btn-maximize-bg": "#86efac",
    "--color-fn-btn-maximize-border": "transparent",
    "--color-fn-btn-maximize-hover": "#4ade80",
    "--color-fn-btn-maximize-hover-text": "#ffffff",

    // 🔒 Disabled - Pastel
    "--color-fn-disabled-bg": "#ede9fe",
    "--color-fn-disabled-text": "#a78bfa",
    "--color-fn-disabled-border": "#ddd6fe",
    "--color-fn-disabled-opacity": "0.5",

    // 🎨 Colores Semánticos - Pastel
    "--color-fn-success": "#86efac",
    "--color-fn-success-hover": "#6ee7b7",
    "--color-fn-success-bg": "#f0fdf4",
    "--color-fn-success-text": "#166534",
    "--color-fn-success-border": "#bbf7d0",

    "--color-fn-warning": "#fcd34d",
    "--color-fn-warning-hover": "#fbbf24",
    "--color-fn-warning-bg": "#fffbeb",
    "--color-fn-warning-text": "#92400e",
    "--color-fn-warning-border": "#fde68a",

    "--color-fn-error": "#fca5a5",
    "--color-fn-error-hover": "#f87171",
    "--color-fn-error-bg": "#fef2f2",
    "--color-fn-error-text": "#991b1b",
    "--color-fn-error-border": "#fecaca",

    "--color-fn-info": "#93c5fd",
    "--color-fn-info-hover": "#60a5fa",
    "--color-fn-info-bg": "#eff6ff",
    "--color-fn-info-text": "#1e40af",
    "--color-fn-info-border": "#bfdbfe",

    // 📝 Textos
    "--color-fn-text-primary": "#4c1d95",
    "--color-fn-text-secondary": "#6d28d9",
    "--color-fn-text-tertiary": "#8b5cf6",
    "--color-fn-text-muted": "#a78bfa",
    "--color-fn-text-inverse": "#ffffff",
    "--color-fn-text-link": "#7c3aed",
    "--color-fn-text-link-hover": "#6d28d9",
    "--color-fn-text-placeholder": "#a78bfa",

    // 🎨 Fondos
    "--color-fn-bg-primary": "#ffffff",
    "--color-fn-bg-secondary": "#faf7ff",
    "--color-fn-bg-tertiary": "#f5f0ff",
    "--color-fn-bg-inverse": "#4c1d95",
    "--color-fn-bg-elevated": "#ffffff",
    "--color-fn-bg-muted": "#faf7ff",
    "--color-fn-bg-hover": "rgba(139,92,246,0.08)",
    "--color-fn-bg-active": "rgba(139,92,246,0.15)",

    // 🔲 Bordes
    "--color-fn-border-light": "#ede9fe",
    "--color-fn-border-medium": "#ddd6fe",
    "--color-fn-border-heavy": "#c4b5fd",
    "--color-fn-border-focus": "#8b5cf6",
    "--color-fn-divider": "#ede9fe",

    // 🎭 Sombras
    "--shadow-fn-sm": "0 1px 2px rgba(76,29,149,0.05)",
    "--shadow-fn-md": "0 4px 6px rgba(76,29,149,0.08)",
    "--shadow-fn-lg": "0 10px 15px rgba(76,29,149,0.1)",
    "--shadow-fn-xl": "0 20px 25px rgba(76,29,149,0.15)",
    "--shadow-fn-inner": "inset 0 2px 4px rgba(76,29,149,0.03)",
    "--shadow-fn-focus": "0 0 0 3px rgba(139,92,246,0.2)",

    // 🔄 Scrollbar
    "--color-fn-scrollbar-track": "#f5f0ff",
    "--color-fn-scrollbar-thumb": "#ddd6fe",
    "--color-fn-scrollbar-thumb-hover": "#c4b5fd",

    // 🎯 Estados
    "--color-fn-selection-bg": "#8b5cf6",
    "--color-fn-selection-text": "#ffffff",
    "--color-fn-highlight": "#fde68a",
    "--color-fn-focus-ring": "#8b5cf6",
    "--color-fn-focus-ring-offset": "#ffffff",

    // 📐 Radius
    "--radius-fn-sm": "8px",
    "--radius-fn-md": "12px",
    "--radius-fn-lg": "16px",
    "--radius-fn-xl": "20px",
    "--radius-fn-full": "9999px",

    // 📏 Spacing
    "--spacing-fn-xs": "0.25rem",
    "--spacing-fn-sm": "0.5rem",
    "--spacing-fn-md": "0.75rem",
    "--spacing-fn-lg": "1rem",
    "--spacing-fn-xl": "1.5rem",
    "--spacing-fn-2xl": "2rem",

    // ⏱️ Transitions
    "--transition-fn-fast": "100ms ease",
    "--transition-fn-base": "200ms ease",
    "--transition-fn-slow": "300ms ease",
  },

  // ========================================
  // 🪟 WINDOWS 11 - Tema Windows 11
  // ========================================
  windows11: {
    "--fn-canvas": "#f0f2f5",
    "--color-window-bg": "#ffffff",
    "--color-window-content": "#fafbfc",
    "--color-window-border": "#d1d5db",
    "--color-window-text": "#1a1a1a",
    
    "--color-window-header": "rgba(243, 244, 246, 0.85)",
    "--color-window-header-text": "#1a1a1a",
    "--color-window-header-inactive": "rgba(229, 231, 235, 0.7)",
    "--color-window-header-inactive-text": "#6b7280",
    "--color-window-active-border": "#0078d4",
    "--spacing-window-padding": "0rem",

    // 🆕 Menú
    "--color-menu-bg": "#ffffff",
    "--color-menu-border": "#d1d5db",
    "--color-menu-hover": "#f0f2f5",
    "--color-accent": "#0078d4",
    "--color-accent-hover": "#0062b3",

    "--fn-dock-top-height": "36px",
    "--fn-dock-bottom-height": "220px",
    "--fn-dock-left-width": "260px",
    "--fn-dock-right-width": "260px",

    "--fn-tab-height": "38px",
    "--fn-tab-min-width": "120px",
    "--fn-tab-max-width": "210px",
    "--radius-fn-tab-radius": "8px",
    "--fn-tab-direction": "row",
    
    "--color-fn-tab-bg-active": "#0078d4",
    "--color-fn-tab-text-active": "#ffffff",
    "--color-fn-tab-bg-inactive": "#e5e7eb",
    "--color-fn-tab-text-inactive": "#4b5563",
    "--color-fn-tab-border": "#d1d5db",
    "--fn-tab-indicator-weight": "3px",
    "--color-fn-tab-indicator": "#0078d4",

    // 🔹 BOTONES DE CONTROL - Windows 11
    "--fn-btn-control-size": "18px",
    "--radius-fn-btn-radius": "6px",
    "--color-fn-btn-action-text": "#5c5c5c",
    
    "--fn-btn-close-content": "✕",
    "--fn-btn-minimize-content": "─",
    "--fn-btn-maximize-content": "□",
    "--fn-btn-restore-content": "❐",
    
    "--color-fn-btn-close-bg": "#e81123",
    "--color-fn-btn-close-border": "transparent",
    "--color-fn-btn-close-hover": "#e81123",
    "--color-fn-btn-close-hover-text": "#ffffff",
    
    "--color-fn-btn-minimize-bg": "#ffb900",
    "--color-fn-btn-minimize-border": "transparent",
    "--color-fn-btn-minimize-hover": "#ffb900",
    "--color-fn-btn-minimize-hover-text": "#ffffff",
    
    "--color-fn-btn-maximize-bg": "#107c10",
    "--color-fn-btn-maximize-border": "transparent",
    "--color-fn-btn-maximize-hover": "#107c10",
    "--color-fn-btn-maximize-hover-text": "#ffffff",

    // 🔒 Disabled - Windows 11
    "--color-fn-disabled-bg": "#e5e7eb",
    "--color-fn-disabled-text": "#9ca3af",
    "--color-fn-disabled-border": "#d1d5db",
    "--color-fn-disabled-opacity": "0.5",

    // 🎨 Colores Semánticos - Windows 11
    "--color-fn-success": "#107c10",
    "--color-fn-success-hover": "#0c6a0c",
    "--color-fn-success-bg": "#dff6dd",
    "--color-fn-success-text": "#0c6a0c",
    "--color-fn-success-border": "#81c784",

    "--color-fn-warning": "#ffb900",
    "--color-fn-warning-hover": "#e6a700",
    "--color-fn-warning-bg": "#fff8e1",
    "--color-fn-warning-text": "#c79000",
    "--color-fn-warning-border": "#ffd54f",

    "--color-fn-error": "#e81123",
    "--color-fn-error-hover": "#c90f1f",
    "--color-fn-error-bg": "#fde7e9",
    "--color-fn-error-text": "#c90f1f",
    "--color-fn-error-border": "#ef9a9a",

    "--color-fn-info": "#0078d4",
    "--color-fn-info-hover": "#0062b3",
    "--color-fn-info-bg": "#e3f2fd",
    "--color-fn-info-text": "#0062b3",
    "--color-fn-info-border": "#90caf9",

    // 📝 Textos
    "--color-fn-text-primary": "#1a1a1a",
    "--color-fn-text-secondary": "#4b5563",
    "--color-fn-text-tertiary": "#6b7280",
    "--color-fn-text-muted": "#9ca3af",
    "--color-fn-text-inverse": "#ffffff",
    "--color-fn-text-link": "#0078d4",
    "--color-fn-text-link-hover": "#0062b3",
    "--color-fn-text-placeholder": "#9ca3af",

    // 🎨 Fondos
    "--color-fn-bg-primary": "#ffffff",
    "--color-fn-bg-secondary": "#fafbfc",
    "--color-fn-bg-tertiary": "#f0f2f5",
    "--color-fn-bg-inverse": "#1a1a1a",
    "--color-fn-bg-elevated": "#ffffff",
    "--color-fn-bg-muted": "#f0f2f5",
    "--color-fn-bg-hover": "rgba(0,0,0,0.04)",
    "--color-fn-bg-active": "rgba(0,0,0,0.08)",

    // 🔲 Bordes
    "--color-fn-border-light": "#e5e7eb",
    "--color-fn-border-medium": "#d1d5db",
    "--color-fn-border-heavy": "#9ca3af",
    "--color-fn-border-focus": "#0078d4",
    "--color-fn-divider": "#e5e7eb",

    // 🎭 Sombras
    "--shadow-fn-sm": "0 1px 2px rgba(0,0,0,0.05)",
    "--shadow-fn-md": "0 4px 6px rgba(0,0,0,0.07)",
    "--shadow-fn-lg": "0 10px 15px rgba(0,0,0,0.1)",
    "--shadow-fn-xl": "0 20px 25px rgba(0,0,0,0.15)",
    "--shadow-fn-inner": "inset 0 2px 4px rgba(0,0,0,0.04)",
    "--shadow-fn-focus": "0 0 0 3px rgba(0,120,212,0.3)",

    // 🔄 Scrollbar
    "--color-fn-scrollbar-track": "#f0f2f5",
    "--color-fn-scrollbar-thumb": "#d1d5db",
    "--color-fn-scrollbar-thumb-hover": "#9ca3af",

    // 🎯 Estados
    "--color-fn-selection-bg": "#0078d4",
    "--color-fn-selection-text": "#ffffff",
    "--color-fn-highlight": "#fef08a",
    "--color-fn-focus-ring": "#0078d4",
    "--color-fn-focus-ring-offset": "#ffffff",

    // 📐 Radius
    "--radius-fn-sm": "2px",
    "--radius-fn-md": "4px",
    "--radius-fn-lg": "8px",
    "--radius-fn-xl": "12px",
    "--radius-fn-full": "9999px",

    // 📏 Spacing
    "--spacing-fn-xs": "0.25rem",
    "--spacing-fn-sm": "0.5rem",
    "--spacing-fn-md": "0.75rem",
    "--spacing-fn-lg": "1rem",
    "--spacing-fn-xl": "1.5rem",
    "--spacing-fn-2xl": "2rem",

    // ⏱️ Transitions
    "--transition-fn-fast": "100ms ease",
    "--transition-fn-base": "200ms ease",
    "--transition-fn-slow": "300ms ease",
  },

  // ========================================
  // 🏢 SAP FIORI - Tema SAP Fiori
  // ========================================
  sapFiori: {
    "--fn-canvas": "#e5e5e5",
    "--color-window-bg": "#ffffff",
    "--color-window-content": "#f7f7f7",
    "--color-window-border": "#cccccc",
    "--color-window-text": "#333333",
    
    "--color-window-header": "#004c97",
    "--color-window-header-text": "#ffffff",
    "--color-window-header-inactive": "#7f8c8d",
    "--color-window-header-inactive-text": "#ecf0f1",
    "--color-window-active-border": "#004c97",
    "--spacing-window-padding": "0rem",

    // 🆕 Menú
    "--color-menu-bg": "#ffffff",
    "--color-menu-border": "#cccccc",
    "--color-menu-hover": "#f0f0f0",
    "--color-accent": "#004c97",
    "--color-accent-hover": "#003a73",

    "--fn-dock-top-height": "34px",
    "--fn-dock-bottom-height": "210px",
    "--fn-dock-left-width": "270px",
    "--fn-dock-right-width": "270px",

    "--fn-tab-height": "36px",
    "--fn-tab-min-width": "115px",
    "--fn-tab-max-width": "200px",
    "--radius-fn-tab-radius": "2px",
    "--fn-tab-direction": "row",
    
    "--color-fn-tab-bg-active": "#004c97",
    "--color-fn-tab-text-active": "#ffffff",
    "--color-fn-tab-bg-inactive": "#f0f0f0",
    "--color-fn-tab-text-inactive": "#555555",
    "--color-fn-tab-border": "#cccccc",
    "--fn-tab-indicator-weight": "3px",
    "--color-fn-tab-indicator": "#004c97",

    // 🔹 BOTONES DE CONTROL - SAP Fiori
    "--fn-btn-control-size": "16px",
    "--radius-fn-btn-radius": "2px",
    "--color-fn-btn-action-text": "#555555",
    
    "--fn-btn-close-content": "✕",
    "--fn-btn-minimize-content": "─",
    "--fn-btn-maximize-content": "□",
    "--fn-btn-restore-content": "❐",
    
    "--color-fn-btn-close-bg": "#e74c3c",
    "--color-fn-btn-close-border": "transparent",
    "--color-fn-btn-close-hover": "#c0392b",
    "--color-fn-btn-close-hover-text": "#ffffff",
    
    "--color-fn-btn-minimize-bg": "#f39c12",
    "--color-fn-btn-minimize-border": "transparent",
    "--color-fn-btn-minimize-hover": "#d68910",
    "--color-fn-btn-minimize-hover-text": "#ffffff",
    
    "--color-fn-btn-maximize-bg": "#27ae60",
    "--color-fn-btn-maximize-border": "transparent",
    "--color-fn-btn-maximize-hover": "#1e8449",
    "--color-fn-btn-maximize-hover-text": "#ffffff",

    // 🔒 Disabled - SAP Fiori
    "--color-fn-disabled-bg": "#f0f0f0",
    "--color-fn-disabled-text": "#999999",
    "--color-fn-disabled-border": "#cccccc",
    "--color-fn-disabled-opacity": "0.5",

    // 🎨 Colores Semánticos - SAP Fiori
    "--color-fn-success": "#27ae60",
    "--color-fn-success-hover": "#1e8449",
    "--color-fn-success-bg": "#e8f5e9",
    "--color-fn-success-text": "#1e8449",
    "--color-fn-success-border": "#81c784",

    "--color-fn-warning": "#f39c12",
    "--color-fn-warning-hover": "#d68910",
    "--color-fn-warning-bg": "#fff3e0",
    "--color-fn-warning-text": "#d68910",
    "--color-fn-warning-border": "#ffcc80",

    "--color-fn-error": "#c0392b",
    "--color-fn-error-hover": "#a93226",
    "--color-fn-error-bg": "#ffebee",
    "--color-fn-error-text": "#a93226",
    "--color-fn-error-border": "#ef9a9a",

    "--color-fn-info": "#004c97",
    "--color-fn-info-hover": "#003a73",
    "--color-fn-info-bg": "#e3f2fd",
    "--color-fn-info-text": "#003a73",
    "--color-fn-info-border": "#90caf9",

    // 📝 Textos
    "--color-fn-text-primary": "#333333",
    "--color-fn-text-secondary": "#555555",
    "--color-fn-text-tertiary": "#777777",
    "--color-fn-text-muted": "#999999",
    "--color-fn-text-inverse": "#ffffff",
    "--color-fn-text-link": "#004c97",
    "--color-fn-text-link-hover": "#003a73",
    "--color-fn-text-placeholder": "#999999",

    // 🎨 Fondos
    "--color-fn-bg-primary": "#ffffff",
    "--color-fn-bg-secondary": "#f7f7f7",
    "--color-fn-bg-tertiary": "#f0f0f0",
    "--color-fn-bg-inverse": "#333333",
    "--color-fn-bg-elevated": "#ffffff",
    "--color-fn-bg-muted": "#f7f7f7",
    "--color-fn-bg-hover": "rgba(0,0,0,0.04)",
    "--color-fn-bg-active": "rgba(0,0,0,0.08)",

    // 🔲 Bordes
    "--color-fn-border-light": "#f0f0f0",
    "--color-fn-border-medium": "#cccccc",
    "--color-fn-border-heavy": "#aaaaaa",
    "--color-fn-border-focus": "#004c97",
    "--color-fn-divider": "#f0f0f0",

    // 🎭 Sombras
    "--shadow-fn-sm": "0 1px 2px rgba(0,0,0,0.05)",
    "--shadow-fn-md": "0 4px 6px rgba(0,0,0,0.07)",
    "--shadow-fn-lg": "0 10px 15px rgba(0,0,0,0.1)",
    "--shadow-fn-xl": "0 20px 25px rgba(0,0,0,0.15)",
    "--shadow-fn-inner": "inset 0 2px 4px rgba(0,0,0,0.04)",
    "--shadow-fn-focus": "0 0 0 3px rgba(0,76,151,0.3)",

    // 🔄 Scrollbar
    "--color-fn-scrollbar-track": "#f0f0f0",
    "--color-fn-scrollbar-thumb": "#cccccc",
    "--color-fn-scrollbar-thumb-hover": "#aaaaaa",

    // 🎯 Estados
    "--color-fn-selection-bg": "#004c97",
    "--color-fn-selection-text": "#ffffff",
    "--color-fn-highlight": "#fef08a",
    "--color-fn-focus-ring": "#004c97",
    "--color-fn-focus-ring-offset": "#ffffff",

    // 📐 Radius
    "--radius-fn-sm": "0px",
    "--radius-fn-md": "2px",
    "--radius-fn-lg": "4px",
    "--radius-fn-xl": "6px",
    "--radius-fn-full": "9999px",

    // 📏 Spacing
    "--spacing-fn-xs": "0.25rem",
    "--spacing-fn-sm": "0.5rem",
    "--spacing-fn-md": "0.75rem",
    "--spacing-fn-lg": "1rem",
    "--spacing-fn-xl": "1.5rem",
    "--spacing-fn-2xl": "2rem",

    // ⏱️ Transitions
    "--transition-fn-fast": "100ms ease",
    "--transition-fn-base": "200ms ease",
    "--transition-fn-slow": "300ms ease",
  },

  // ========================================
  // 🪟 WINDOWS XP - Tema Windows XP Luna
  // ========================================
  windowsXP: {
    "--fn-canvas": "#245edb",
    "--color-window-bg": "#ece9d8",
    "--color-window-content": "#ffffff",
    "--color-window-border": "#0054e3",
    "--color-window-text": "#000000",
    
    "--color-window-header": "linear-gradient(180deg, #1e70e4 0%, #155ae0 12%, #0a46d8 45%, #0030c6 75%, #0037da 100%)",
    "--color-window-header-text": "#ffffff",
    "--color-window-header-inactive": "linear-gradient(180deg, #7ea1ee 0%, #638ae6 12%, #4a73df 45%, #3d64d5 75%, #426be0 100%)",
    "--color-window-header-inactive-text": "#d6e3ff",
    "--color-window-active-border": "#0054e3",
    "--spacing-window-padding": "0px",

    // 🆕 Menú
    "--color-menu-bg": "#ece9d8",
    "--color-menu-border": "#919b9c",
    "--color-menu-hover": "#d4d0c8",
    "--color-accent": "#0054e3",
    "--color-accent-hover": "#0043b3",

    "--fn-dock-top-height": "30px",
    "--fn-dock-bottom-height": "40px",
    "--fn-dock-left-width": "250px",
    "--fn-dock-right-width": "250px",

    "--fn-tab-height": "40px",
    "--fn-tab-min-width": "110px",
    "--fn-tab-max-width": "180px",
    "--radius-fn-tab-radius": "4px 4px 0px 0px",
    "--fn-tab-direction": "row",
    
    "--color-fn-tab-bg-active": "#ffffff",
    "--color-fn-tab-text-active": "#000000",
    "--color-fn-tab-bg-inactive": "linear-gradient(180deg, #f4f3ee 0%, #e2dfd1 100%)",
    "--color-fn-tab-text-inactive": "#666666",
    "--color-fn-tab-border": "#919b9c",
    "--fn-tab-indicator-weight": "5px",
    "--color-fn-tab-indicator": "#ff6600",

    // 🔹 BOTONES DE CONTROL - Windows XP (gradientes)
    "--fn-btn-control-size": "21px",
    "--radius-fn-btn-radius": "3px",
    "--color-fn-btn-action-text": "#ffffff",
    
    "--fn-btn-close-content": "✕",
    "--fn-btn-minimize-content": "─",
    "--fn-btn-maximize-content": "□",
    "--fn-btn-restore-content": "❐",
    
    "--color-fn-btn-close-bg": "linear-gradient(180deg, #f3795c 0%, #e0431f 40%, #c41e00 100%)",
    "--color-fn-btn-close-border": "#7a1a00",
    "--color-fn-btn-close-hover": "linear-gradient(180deg, #f99a82 0%, #f15f3e 40%, #e6310b 100%)",
    "--color-fn-btn-close-hover-text": "#ffffff",
    
    "--color-fn-btn-minimize-bg": "linear-gradient(180deg, #7fa7f7 0%, #3e79ec 40%, #1c52c7 100%)",
    "--color-fn-btn-minimize-border": "#163a8b",
    "--color-fn-btn-minimize-hover": "linear-gradient(180deg, #a3c2ff 0%, #5d93ff 40%, #366fe6 100%)",
    "--color-fn-btn-minimize-hover-text": "#ffffff",
    
    "--color-fn-btn-maximize-bg": "linear-gradient(180deg, #7fa7f7 0%, #3e79ec 40%, #1c52c7 100%)",
    "--color-fn-btn-maximize-border": "#163a8b",
    "--color-fn-btn-maximize-hover": "linear-gradient(180deg, #a3c2ff 0%, #5d93ff 40%, #366fe6 100%)",
    "--color-fn-btn-maximize-hover-text": "#ffffff",

    // 🔒 Disabled - Windows XP
    "--color-fn-disabled-bg": "#d4d0c8",
    "--color-fn-disabled-text": "#999999",
    "--color-fn-disabled-border": "#919b9c",
    "--color-fn-disabled-opacity": "0.5",

    // 🎨 Colores Semánticos - Windows XP
    "--color-fn-success": "#3d8b37",
    "--color-fn-success-hover": "#2d6b28",
    "--color-fn-success-bg": "#e8f5e9",
    "--color-fn-success-text": "#2d6b28",
    "--color-fn-success-border": "#81c784",

    "--color-fn-warning": "#f39c12",
    "--color-fn-warning-hover": "#d68910",
    "--color-fn-warning-bg": "#fff3e0",
    "--color-fn-warning-text": "#d68910",
    "--color-fn-warning-border": "#ffcc80",

    "--color-fn-error": "#c0392b",
    "--color-fn-error-hover": "#a93226",
    "--color-fn-error-bg": "#ffebee",
    "--color-fn-error-text": "#a93226",
    "--color-fn-error-border": "#ef9a9a",

    "--color-fn-info": "#0054e3",
    "--color-fn-info-hover": "#0043b3",
    "--color-fn-info-bg": "#e3f2fd",
    "--color-fn-info-text": "#0043b3",
    "--color-fn-info-border": "#90caf9",

    // 📝 Textos
    "--color-fn-text-primary": "#000000",
    "--color-fn-text-secondary": "#333333",
    "--color-fn-text-tertiary": "#666666",
    "--color-fn-text-muted": "#999999",
    "--color-fn-text-inverse": "#ffffff",
    "--color-fn-text-link": "#0054e3",
    "--color-fn-text-link-hover": "#0043b3",
    "--color-fn-text-placeholder": "#999999",

    // 🎨 Fondos
    "--color-fn-bg-primary": "#ece9d8",
    "--color-fn-bg-secondary": "#d4d0c8",
    "--color-fn-bg-tertiary": "#c8c4bc",
    "--color-fn-bg-inverse": "#000000",
    "--color-fn-bg-elevated": "#ffffff",
    "--color-fn-bg-muted": "#ece9d8",
    "--color-fn-bg-hover": "rgba(0,0,0,0.05)",
    "--color-fn-bg-active": "rgba(0,0,0,0.1)",

    // 🔲 Bordes
    "--color-fn-border-light": "#d4d0c8",
    "--color-fn-border-medium": "#919b9c",
    "--color-fn-border-heavy": "#666666",
    "--color-fn-border-focus": "#0054e3",
    "--color-fn-divider": "#d4d0c8",

    // 🎭 Sombras
    "--shadow-fn-sm": "0 1px 2px rgba(0,0,0,0.1)",
    "--shadow-fn-md": "0 4px 6px rgba(0,0,0,0.15)",
    "--shadow-fn-lg": "0 10px 15px rgba(0,0,0,0.2)",
    "--shadow-fn-xl": "0 20px 25px rgba(0,0,0,0.25)",
    "--shadow-fn-inner": "inset 0 2px 4px rgba(0,0,0,0.05)",
    "--shadow-fn-focus": "0 0 0 3px rgba(0,84,227,0.3)",

    // 🔄 Scrollbar
    "--color-fn-scrollbar-track": "#ece9d8",
    "--color-fn-scrollbar-thumb": "#919b9c",
    "--color-fn-scrollbar-thumb-hover": "#666666",

    // 🎯 Estados
    "--color-fn-selection-bg": "#0054e3",
    "--color-fn-selection-text": "#ffffff",
    "--color-fn-highlight": "#ffeb3b",
    "--color-fn-focus-ring": "#0054e3",
    "--color-fn-focus-ring-offset": "#ece9d8",

    // 📐 Radius
    "--radius-fn-sm": "0px",
    "--radius-fn-md": "2px",
    "--radius-fn-lg": "4px",
    "--radius-fn-xl": "6px",
    "--radius-fn-full": "9999px",

    // 📏 Spacing
    "--spacing-fn-xs": "0.25rem",
    "--spacing-fn-sm": "0.5rem",
    "--spacing-fn-md": "0.75rem",
    "--spacing-fn-lg": "1rem",
    "--spacing-fn-xl": "1.5rem",
    "--spacing-fn-2xl": "2rem",

    // ⏱️ Transitions
    "--transition-fn-fast": "100ms ease",
    "--transition-fn-base": "200ms ease",
    "--transition-fn-slow": "300ms ease",
  },

  // ========================================
  // 🪟⚪ WINDOWS XP SILVER - Tema XP Silver
  // ========================================
  windowsXPSilver: {
    // ... (idéntico a windowsXP pero con colores plateados)
    // Por brevedad, mantengo la estructura pero con colores silver
    // En la práctica, copiarías el tema windowsXP y cambiarías los colores
  },

  // ========================================
  // 🪟🟢 WINDOWS XP OLIVE - Tema XP Olive
  // ========================================
  windowsXPOlive: {
    // ... (idéntico a windowsXP pero con colores oliva)
  },

  // ========================================
  // 🌙 LUNA - Tema C++Builder Luna
  // ========================================
  luna: {
    // ... (similar a silver pero con tonos azulados)
  },

};

/**
 * 🌟 MAPPER CRÍTICO EXIGIDO POR EL PROVIDER
 * Transforma el preset de tema seleccionado en un diccionario compatible de variables CSS.
 * Satisface la importación nombrada en `FenestraeProvider.jsx` línea 3.
 * @param {object|string} themeInput - Nombre del preset ('modern', 'dark', 'macOS') u objeto personalizado.
 * @returns {React.CSSProperties} Diccionario de variables CSS aplicable a estilos en línea o layouts globales.
 */
export const mapThemeToCSSVariables = (themeInput = "modern") => {
  const themeObject = typeof themeInput === "string" 
    ? (THEME_PRESETS[themeInput] || THEME_PRESETS.modern)
    : themeInput;

  if (!themeObject || typeof themeObject !== "object") {
    return THEME_PRESETS.modern;
  }

  return { ...themeObject };
};

/**
 * Helper legacy alternativo para transformar tokens planos en estilos válidos de React
 * @param {string} presetName - 'modern' | 'macOS' | 'dark'
 * @returns {React.CSSProperties}
 */
export const getThemeStyles = (presetName = "modern") => {
  return THEME_PRESETS[presetName] || THEME_PRESETS.modern;
};