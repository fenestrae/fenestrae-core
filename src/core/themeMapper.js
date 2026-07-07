// ============================================================================
// FENESTRAE - Fenestrae Theme Mapper & Default Configurations (core/themeMapper.js)
// Centraliza los diccionarios de tokens anatómicos y visuales para el lienzo MDI.
// Soluciona el error de exportación faltante exigido por Rollup/Vite.
// ============================================================================

export const THEME_PRESETS = {

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

    "--fn-btn-control-size": "18px",
    "--radius-fn-btn-radius": "4px",
    "--color-fn-btn-close-hover": "#ef4444",
    "--color-fn-btn-close-hover-text": "#ffffff",
    "--color-fn-btn-action-text": "inherit",
  },

  // 🍏 DISEÑO INSPIRADO EN macOS
  macOS: {
    "--fn-canvas": "#e8eaed",
    "--color-window-bg": "#f8fafc",
    "--color-window-content": "#ffffff",
    "--color-window-border": "#cbd5e1",
    "--color-window-text": "#1d1d1f",
    
    // Títulos unificados - Header gris claro con texto oscuro (estilo macOS)
    "--color-window-header": "#e8eaed",
    "--color-window-header-text": "#1d1d1f",
    "--color-window-header-inactive": "#f1f3f5",
    "--color-window-header-inactive-text": "#6e6e73",
    "--color-window-active-border": "#007aff",
    "--spacing-window-padding": "0rem",

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

    "--fn-btn-control-size": "14px",
    "--radius-fn-btn-radius": "9999px",
    "--color-fn-btn-close-hover": "#ff5f57",
    "--color-fn-btn-close-hover-text": "#ffffff",
    "--color-fn-btn-action-text": "inherit",
    "--color-fn-btn-close-bg": "#fe5f55",
    "--color-fn-btn-minimize-bg": "#ffbd2e",
    "--color-fn-btn-maximize-bg": "#28c840",
  },

  // 🕶️ PRESET DARK MODE GLOBAL
  dark: {
    "--fn-canvas": "#111827",
    "--color-window-bg": "#1f2937",
    "--color-window-content": "#111827",
    "--color-window-border": "#374151",
    "--color-window-text": "#f9fafb",
    
    // Títulos unificados - Header oscuro con texto claro
    "--color-window-header": "#1f2937",
    "--color-window-header-text": "#f9fafb",
    "--color-window-header-inactive": "#374151",
    "--color-window-header-inactive-text": "#9ca3af",
    "--color-window-active-border": "#3b82f6",
    "--spacing-window-padding": "0rem",

    "--fn-dock-top-height": "32px",
    "--fn-dock-bottom-height": "200px",
    "--fn-dock-left-width": "250px",
    "--fn-dock-right-width": "250px",

    "--fn-tab-height": "40px",
    "--fn-tab-min-width": "120px",
    "--fn-tab-max-width": "220px",
    "--radius-fn-tab-radius": "8px",
    "--fn-tab-direction": "row",
    
    "--color-fn-tab-bg-active": "#111827", 
    "--color-fn-tab-text-active": "#3b82f6",
    "--color-fn-tab-bg-inactive": "#1f2937",
    "--color-fn-tab-text-inactive": "#9ca3af",
    "--color-fn-tab-border": "#374151",
    "--fn-tab-indicator-weight": "2px",
    "--color-fn-tab-indicator": "#3b82f6",

    "--fn-btn-control-size": "18px",
    "--radius-fn-btn-radius": "4px",
    "--color-fn-btn-close-hover": "#dc2626",
    "--color-fn-btn-close-hover-text": "#ffffff",
    "--color-fn-btn-action-text": "#9ca3af",
  },

  // 🎮 CYBERPUNK
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

    "--fn-btn-control-size": "16px",
    "--radius-fn-btn-radius": "4px",
    "--color-fn-btn-close-hover": "#ff2d55",
    "--color-fn-btn-close-hover-text": "#ffffff",
    "--color-fn-btn-action-text": "#6b5b8a",
  },

  // 🌊 TROPICAL
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

    "--fn-btn-control-size": "20px",
    "--radius-fn-btn-radius": "50%",
    "--color-fn-btn-close-hover": "#ef4444",
    "--color-fn-btn-close-hover-text": "#ffffff",
    "--color-fn-btn-action-text": "#78350f",
    "--color-fn-btn-close-bg": "#fca5a5",
    "--color-fn-btn-minimize-bg": "#fcd34d",
    "--color-fn-btn-maximize-bg": "#6ee7b7",
  },

  // 🥈 SILVER - Tema claro clásico de C++Builder
  silver: {
    // Canvas & Workspace - Fondo gris claro característico de C++Builder
    "--fn-canvas": "#efebe7",
    "--color-window-bg": "#f5f2ed",
    "--color-window-content": "#faf8f5",
    "--color-window-border": "#c8c4bc",
    "--color-window-text": "#1a1a1a",
    
    // Títulos unificados - Header gris plata con texto oscuro
    "--color-window-header": "#efebe7",
    "--color-window-header-text": "#1a1a1a",
    "--color-window-header-inactive": "#e5e1dc",
    "--color-window-header-inactive-text": "#888888",
    "--color-window-active-border": "#0072b0",
    "--spacing-window-padding": "0rem",

    // Docking Zones - Estilo IDE clásico
    "--fn-dock-top-height": "30px",
    "--fn-dock-bottom-height": "200px",
    "--fn-dock-left-width": "240px",
    "--fn-dock-right-width": "240px",

    // Tabs - Estilo clásico de C++Builder Silver
    "--fn-tab-height": "28px",
    "--fn-tab-min-width": "100px",
    "--fn-tab-max-width": "200px",
    "--radius-fn-tab-radius": "0px",
    "--fn-tab-direction": "row",
    
    // Estados de las Pestañas - Colores característicos Silver
    "--color-fn-tab-bg-active": "#f5f2ed",
    "--color-fn-tab-text-active": "#1a1a1a",
    "--color-fn-tab-bg-inactive": "#efebe7",
    "--color-fn-tab-text-inactive": "#777777",
    "--color-fn-tab-border": "#c8c4bc",
    "--fn-tab-indicator-weight": "2px",
    "--color-fn-tab-indicator": "#0072b0",

    // Botones de Control - Estilo C++Builder Silver
    "--fn-btn-control-size": "14px",
    "--radius-fn-btn-radius": "0px",
    "--color-fn-btn-close-hover": "#c0392b",
    "--color-fn-btn-close-hover-text": "#ffffff",
    "--color-fn-btn-action-text": "#777777",
    
    // Colores específicos para botones (estilo IDE)
    "--color-fn-btn-close-bg": "#c0392b",
    "--color-fn-btn-minimize-bg": "#f39c12",
    "--color-fn-btn-maximize-bg": "#27ae60",
    
    // Colores de hover para acciones
    "--color-fn-btn-close-hover-bg": "#e74c3c",
    "--color-fn-btn-minimize-hover-bg": "#f1c40f",
    "--color-fn-btn-maximize-hover-bg": "#2ecc71",
  },

  // 🎨 PASTEL
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

    "--fn-btn-control-size": "16px",
    "--radius-fn-btn-radius": "9999px",
    "--color-fn-btn-close-hover": "#f472b6",
    "--color-fn-btn-close-hover-text": "#ffffff",
    "--color-fn-btn-action-text": "#6d28d9",
    "--color-fn-btn-close-bg": "#f9a8d4",
    "--color-fn-btn-minimize-bg": "#93c5fd",
    "--color-fn-btn-maximize-bg": "#86efac",
  },

  // 🪟 DISEÑO WINDOWS 11 (Moderno, fluido, con vidrio esmerilado)
  windows11: {
    // Canvas & Workspace - Fondo con efecto Mica
    "--fn-canvas": "#f0f2f5",
    "--color-window-bg": "#ffffff",
    "--color-window-content": "#fafbfc",
    "--color-window-border": "#d1d5db",
    "--color-window-text": "#1a1a1a",
    
    // Títulos unificados - Header con efecto Mica (vidrio esmerilado)
    "--color-window-header": "rgba(243, 244, 246, 0.85)",
    "--color-window-header-text": "#1a1a1a",
    "--color-window-header-inactive": "rgba(229, 231, 235, 0.7)",
    "--color-window-header-inactive-text": "#6b7280",
    "--color-window-active-border": "#0078d4", // Azul Windows 11
    "--spacing-window-padding": "0rem",

    // Docking Zones - Más espaciosas como Windows 11
    "--fn-dock-top-height": "36px",
    "--fn-dock-bottom-height": "220px",
    "--fn-dock-left-width": "260px",
    "--fn-dock-right-width": "260px",

    // Tabs - Estilo fluido y redondeado
    "--fn-tab-height": "38px",
    "--fn-tab-min-width": "120px",
    "--fn-tab-max-width": "210px",
    "--radius-fn-tab-radius": "8px",
    "--fn-tab-direction": "row",
    
    // Estados de las Pestañas - Con acentos de Windows 11
    "--color-fn-tab-bg-active": "#0078d4",
    "--color-fn-tab-text-active": "#ffffff",
    "--color-fn-tab-bg-inactive": "#e5e7eb",
    "--color-fn-tab-text-inactive": "#4b5563",
    "--color-fn-tab-border": "#d1d5db",
    "--fn-tab-indicator-weight": "3px",
    "--color-fn-tab-indicator": "#0078d4",

    // Botones de Control - Estilo Windows 11 con hover suave
    "--fn-btn-control-size": "18px",
    "--radius-fn-btn-radius": "6px",
    "--color-fn-btn-close-hover": "#e81123",
    "--color-fn-btn-close-hover-text": "#ffffff",
    "--color-fn-btn-action-text": "#5c5c5c",
    "--color-fn-btn-close-bg": "#e81123",
    "--color-fn-btn-minimize-bg": "#ffb900",
    "--color-fn-btn-maximize-bg": "#107c10",
  },

  // 🏢 DISEÑO SAP FIORI (Estilo empresarial, limpio y funcional)
  sapFiori: {
    // Canvas & Workspace - Colores corporativos SAP
    "--fn-canvas": "#e5e5e5",
    "--color-window-bg": "#ffffff",
    "--color-window-content": "#f7f7f7",
    "--color-window-border": "#cccccc",
    "--color-window-text": "#333333",
    
    // Títulos unificados - Header azul SAP con texto blanco
    "--color-window-header": "#004c97", // Azul corporativo SAP
    "--color-window-header-text": "#ffffff",
    "--color-window-header-inactive": "#7f8c8d",
    "--color-window-header-inactive-text": "#ecf0f1",
    "--color-window-active-border": "#004c97",
    "--spacing-window-padding": "0rem",

    // Docking Zones - Estilo SAP Fiori
    "--fn-dock-top-height": "34px",
    "--fn-dock-bottom-height": "210px",
    "--fn-dock-left-width": "270px",
    "--fn-dock-right-width": "270px",

    // Tabs - Con bordes nítidos y colores planos
    "--fn-tab-height": "36px",
    "--fn-tab-min-width": "115px",
    "--fn-tab-max-width": "200px",
    "--radius-fn-tab-radius": "2px",
    "--fn-tab-direction": "row",
    
    // Estados de las Pestañas - Estilo Fiori
    "--color-fn-tab-bg-active": "#004c97",
    "--color-fn-tab-text-active": "#ffffff",
    "--color-fn-tab-bg-inactive": "#f0f0f0",
    "--color-fn-tab-text-inactive": "#555555",
    "--color-fn-tab-border": "#cccccc",
    "--fn-tab-indicator-weight": "3px",
    "--color-fn-tab-indicator": "#004c97",

    // Botones de Control - Minimalistas y funcionales
    "--fn-btn-control-size": "16px",
    "--radius-fn-btn-radius": "2px",
    "--color-fn-btn-close-hover": "#c0392b",
    "--color-fn-btn-close-hover-text": "#ffffff",
    "--color-fn-btn-action-text": "#555555",
    "--color-fn-btn-close-bg": "#e74c3c",
    "--color-fn-btn-minimize-bg": "#f39c12",
    "--color-fn-btn-maximize-bg": "#27ae60",
  },

 // 🪟🟦 WINDOWS XP - El auténtico estilo Luna (Azul) purificado
  windowsXP: {
    // Canvas & Workspace - El clásico fondo azul verdoso de escritorio XP (Bliss / Redondel)
    "--fn-canvas": "#245edb", // O el verde azulado plano clásico de carga: #008080
    "--color-window-bg": "#ece9d8", // Color beige/arena característico del marco y diálogos de XP
    "--color-window-content": "#ffffff", // El fondo blanco limpio de las áreas de trabajo de XP
    "--color-window-border": "#0054e3", // Azul XP Luna brillante para los bordes activos
    "--color-window-text": "#000000",
    
    // Títulos unificados - Header con el degradado satinado Luna exacto (brillante arriba, oscuro abajo)
    "--color-window-header": "linear-gradient(180deg, #1e70e4 0%, #155ae0 12%, #0a46d8 45%, #0030c6 75%, #0037da 100%)",
    "--color-window-header-text": "#ffffff",
    "--color-window-header-inactive": "linear-gradient(180deg, #7ea1ee 0%, #638ae6 12%, #4a73df 45%, #3d64d5 75%, #426be0 100%)", // El clásico gris azulado inactivo de XP
    "--color-window-header-inactive-text": "#d6e3ff",
    "--color-window-active-border": "#0054e3",
    "--spacing-window-padding": "0px", // XP tiene un marco grueso alrededor del contenido

    // Docking Zones - Estilo XP clásico (Barra de tareas / Luna Blue)
    "--fn-dock-top-height": "30px",
    "--fn-dock-bottom-height": "40px", // Altura típica de la barra de tareas de XP
    "--fn-dock-left-width": "250px", // Ancho ideal si imitas el panel de tareas lateral de las carpetas XP
    "--fn-dock-right-width": "250px",

    // Tabs - Estilo de pestañas nativas de las propiedades de sistema de XP
    "--fn-tab-height": "28px",
    "--fn-tab-min-width": "100px",
    "--fn-tab-max-width": "160px",
    "--radius-fn-tab-radius": "4px 4px 0px 0px",
    "--fn-tab-direction": "row",
    
    // Estados de las Pestañas - Colores de la pestaña nativa XP (Luna)
    "--color-fn-tab-bg-active": "#ffffff", // La pestaña activa se fusiona con el fondo blanco de XP
    "--color-fn-tab-text-active": "#000000",
    "--color-fn-tab-bg-inactive": "linear-gradient(180deg, #f4f3ee 0%, #e2dfd1 100%)", // Pestaña apagada con relieve suave
    "--color-fn-tab-text-inactive": "#666666",
    "--color-fn-tab-border": "#919b9c", // Gris-azul del borde de pestañas nativas
    "--fn-tab-indicator-weight": "3px",
    "--color-fn-tab-indicator": "#ff6600", // El naranja característico de XP para focus/selección (estilo instalador o selección activa)

    // Botones de Control - Fieles al set de botones ovalados de la esquina superior derecha
    "--fn-btn-control-size": "21px", // Los botones de XP son notablemente más altos y rectangulares-redondeados
    "--radius-fn-btn-radius": "3px",
    "--color-fn-btn-action-text": "#ffffff",
    
    // Botón Cerrar (El icónico botón rojo-naranja ovalado con degradado y sombra interna)
    "--color-fn-btn-close-bg": "linear-gradient(180deg, #f3795c 0%, #e0431f 40%, #c41e00 100%)",
    "--fn-btn-close-border": "#7a1a00",
    "--color-fn-btn-close-hover-bg": "linear-gradient(180deg, #f99a82 0%, #f15f3e 40%, #e6310b 100%)", // Brillo extra al hacer hover
    "--color-fn-btn-close-hover-text": "#ffffff",
    
    // Botón Minimizar y Maximizar (Las características esferas/cápsulas azules con degradado Luna)
    "--color-fn-btn-minimize-bg": "linear-gradient(180deg, #7fa7f7 0%, #3e79ec 40%, #1c52c7 100%)",
    "--fn-btn-minimize-border": "#163a8b",
    "--color-fn-btn-minimize-hover-bg": "linear-gradient(180deg, #a3c2ff 0%, #5d93ff 40%, #366fe6 100%)",

    "--color-fn-btn-maximize-bg": "linear-gradient(180deg, #7fa7f7 0%, #3e79ec 40%, #1c52c7 100%)",
    "--fn-btn-maximize-border": "#163a8b",
    "--color-fn-btn-maximize-hover-bg": "linear-gradient(180deg, #a3c2ff 0%, #5d93ff 40%, #366fe6 100%)",
  },
  
  // 🪟⚪ WINDOWS XP SILVER - Variante plateada
  windowsXPSilver: {
    // Canvas & Workspace - Fondo gris plata
    "--fn-canvas": "#8a9aa0",
    "--color-window-bg": "#d4d0c8",
    "--color-window-content": "#ece9d8",
    "--color-window-border": "#5a6a70",
    "--color-window-text": "#1a1a1a",
    
    // Títulos unificados - Header con gradiente plateado XP
    "--color-window-header": "linear-gradient(180deg, #b8c4cc 0%, #a0acb4 50%, #88949c 100%)",
    "--color-window-header-text": "#1a1a1a",
    "--color-window-header-inactive": "linear-gradient(180deg, #c8d0d4 0%, #b0b8bc 50%, #98a0a4 100%)",
    "--color-window-header-inactive-text": "#5a6a70",
    "--color-window-active-border": "#5a6a70",
    "--spacing-window-padding": "0rem",

    // Docking Zones - Estilo XP clásico
    "--fn-dock-top-height": "28px",
    "--fn-dock-bottom-height": "190px",
    "--fn-dock-left-width": "230px",
    "--fn-dock-right-width": "230px",

    // Tabs - Estilo XP con bordes redondeados
    "--fn-tab-height": "26px",
    "--fn-tab-min-width": "90px",
    "--fn-tab-max-width": "180px",
    "--radius-fn-tab-radius": "6px 6px 0px 0px",
    "--fn-tab-direction": "row",
    
    // Estados de las Pestañas - Colores XP Silver
    "--color-fn-tab-bg-active": "#d4d0c8",
    "--color-fn-tab-text-active": "#1a1a1a",
    "--color-fn-tab-bg-inactive": "#b8b4ac",
    "--color-fn-tab-text-inactive": "#4a4a4a",
    "--color-fn-tab-border": "#5a6a70",
    "--fn-tab-indicator-weight": "2px",
    "--color-fn-tab-indicator": "#8a9aa0",

    // Botones de Control - Estilo XP Silver
    "--fn-btn-control-size": "16px",
    "--radius-fn-btn-radius": "2px",
    "--color-fn-btn-close-hover": "#c0392b",
    "--color-fn-btn-close-hover-text": "#ffffff",
    "--color-fn-btn-action-text": "#1a1a1a",
    
    "--color-fn-btn-close-bg": "#e74c3c",
    "--color-fn-btn-minimize-bg": "#f39c12",
    "--color-fn-btn-maximize-bg": "#27ae60",
    
    "--color-fn-btn-close-hover-bg": "#c0392b",
    "--color-fn-btn-minimize-hover-bg": "#d68910",
    "--color-fn-btn-maximize-hover-bg": "#1e8449",
    
    "--fn-btn-close-border": "#8a2a1a",
    "--fn-btn-minimize-border": "#9a6a0a",
    "--fn-btn-maximize-border": "#1a5a2a",
  },

  // 🪟🟢 WINDOWS XP OLIVE - Variante verde oliva
  windowsXPOlive: {
    // Canvas & Workspace - Fondo verde oliva
    "--fn-canvas": "#6a7a5a",
    "--color-window-bg": "#d4d0c8",
    "--color-window-content": "#ece9d8",
    "--color-window-border": "#3a4a2a",
    "--color-window-text": "#1a1a1a",
    
    // Títulos unificados - Header con gradiente verde XP
    "--color-window-header": "linear-gradient(180deg, #8aaa6a 0%, #7a9a5a 50%, #6a8a4a 100%)",
    "--color-window-header-text": "#ffffff",
    "--color-window-header-inactive": "linear-gradient(180deg, #9aaa7a 0%, #8a9a6a 50%, #7a8a5a 100%)",
    "--color-window-header-inactive-text": "#c8d4b8",
    "--color-window-active-border": "#3a4a2a",
    "--spacing-window-padding": "0rem",

    // Docking Zones - Estilo XP clásico
    "--fn-dock-top-height": "28px",
    "--fn-dock-bottom-height": "190px",
    "--fn-dock-left-width": "230px",
    "--fn-dock-right-width": "230px",

    // Tabs - Estilo XP con bordes redondeados
    "--fn-tab-height": "26px",
    "--fn-tab-min-width": "90px",
    "--fn-tab-max-width": "180px",
    "--radius-fn-tab-radius": "6px 6px 0px 0px",
    "--fn-tab-direction": "row",
    
    // Estados de las Pestañas - Colores XP Olive
    "--color-fn-tab-bg-active": "#d4d0c8",
    "--color-fn-tab-text-active": "#1a1a1a",
    "--color-fn-tab-bg-inactive": "#b8b4ac",
    "--color-fn-tab-text-inactive": "#4a4a4a",
    "--color-fn-tab-border": "#3a4a2a",
    "--fn-tab-indicator-weight": "2px",
    "--color-fn-tab-indicator": "#6a7a5a",

    // Botones de Control - Estilo XP Olive
    "--fn-btn-control-size": "16px",
    "--radius-fn-btn-radius": "2px",
    "--color-fn-btn-close-hover": "#c0392b",
    "--color-fn-btn-close-hover-text": "#ffffff",
    "--color-fn-btn-action-text": "#1a1a1a",
    
    "--color-fn-btn-close-bg": "#e74c3c",
    "--color-fn-btn-minimize-bg": "#f39c12",
    "--color-fn-btn-maximize-bg": "#27ae60",
    
    "--color-fn-btn-close-hover-bg": "#c0392b",
    "--color-fn-btn-minimize-hover-bg": "#d68910",
    "--color-fn-btn-maximize-hover-bg": "#1e8449",
    
    "--fn-btn-close-border": "#8a2a1a",
    "--fn-btn-minimize-border": "#9a6a0a",
    "--fn-btn-maximize-border": "#1a5a2a",
  },

  // 🌙 LUNA - Tema azulado claro de C++Builder
  luna: {
    // Canvas & Workspace - Fondo azulado claro característico de Luna
    "--fn-canvas": "#d6dce5",
    "--color-window-bg": "#e4e9f0",
    "--color-window-content": "#eef2f7",
    "--color-window-border": "#b8c4d0",
    "--color-window-text": "#1a1a2e",
    
    // Títulos unificados - Header azulado claro con texto oscuro
    "--color-window-header": "#d6dce5",
    "--color-window-header-text": "#1a1a2e",
    "--color-window-header-inactive": "#c8d0da",
    "--color-window-header-inactive-text": "#666680",
    "--color-window-active-border": "#0072b0",
    "--spacing-window-padding": "0rem",

    // Docking Zones - Estilo IDE clásico
    "--fn-dock-top-height": "30px",
    "--fn-dock-bottom-height": "200px",
    "--fn-dock-left-width": "240px",
    "--fn-dock-right-width": "240px",

    // Tabs - Estilo clásico de C++Builder Luna
    "--fn-tab-height": "28px",
    "--fn-tab-min-width": "100px",
    "--fn-tab-max-width": "200px",
    "--radius-fn-tab-radius": "0px",
    "--fn-tab-direction": "row",
    
    // Estados de las Pestañas - Colores azulados característicos
    "--color-fn-tab-bg-active": "#e4e9f0",
    "--color-fn-tab-text-active": "#1a1a2e",
    "--color-fn-tab-bg-inactive": "#d6dce5",
    "--color-fn-tab-text-inactive": "#666680",
    "--color-fn-tab-border": "#b8c4d0",
    "--fn-tab-indicator-weight": "2px",
    "--color-fn-tab-indicator": "#0072b0",

    // Botones de Control - Estilo C++Builder Luna
    "--fn-btn-control-size": "14px",
    "--radius-fn-btn-radius": "0px",
    "--color-fn-btn-close-hover": "#c0392b",
    "--color-fn-btn-close-hover-text": "#ffffff",
    "--color-fn-btn-action-text": "#666680",
    
    // Colores específicos para botones (estilo IDE)
    "--color-fn-btn-close-bg": "#c0392b",
    "--color-fn-btn-minimize-bg": "#f39c12",
    "--color-fn-btn-maximize-bg": "#27ae60",
    
    // Colores de hover para acciones
    "--color-fn-btn-close-hover-bg": "#e74c3c",
    "--color-fn-btn-minimize-hover-bg": "#f1c40f",
    "--color-fn-btn-maximize-hover-bg": "#2ecc71",
  }


};

/**
 * 🌟 MAPPER CRÍTICO EXIGIDO POR EL PROVIDER
 * Transforma el preset de tema seleccionado en un diccionario compatible de variables CSS.
 * Satisface la importación nombrada en `FenestraeProvider.jsx` línea 3.
 * * @param {object|string} themeInput - Nombre del preset ('modern', 'dark', 'macOS') u objeto personalizado.
 * @returns {React.CSSProperties} Diccionario de variables CSS aplicable a estilos en línea o layouts globales.
 */
export const mapThemeToCSSVariables = (themeInput = "modern") => {
  // Si nos pasan un string, resolvemos el objeto plano desde el preset predefinido
  const themeObject = typeof themeInput === "string" 
    ? (THEME_PRESETS[themeInput] || THEME_PRESETS.modern)
    : themeInput;

  if (!themeObject || typeof themeObject !== "object") {
    return THEME_PRESETS.modern;
  }

  // Retorna el mapeo seguro garantizando que todas las propiedades anatómicas estén presentes
  return {
    ...themeObject
  };
};

/**
 * Helper legacy alternativo para transformar tokens planos en estilos válidos de React
 * @param {string} presetName - 'modern' | 'macOS' | 'dark'
 * @returns {React.CSSProperties}
 */
export const getThemeStyles = (presetName = "modern") => {
  return THEME_PRESETS[presetName] || THEME_PRESETS.modern;
};