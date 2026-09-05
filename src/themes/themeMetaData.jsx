/**
 * Metadatos completos de todos los temas disponibles en Fenestrae
 * Cada tema incluye: nombre, icono, descripción, categoría, etiquetas y orden
 */
export const THEME_METADATA = {
  modern: {
    id: 'modern',
    name: 'Modern',
    icon: '🌐',
    description: 'Diseño contemporáneo y minimalista',
    category: 'light',
    tags: ['moderno', 'minimalista', 'corporativo'],
    order: 1,
    author: 'Fenestrae Team',
    version: '1.0.0',
    year: 2024,
    features: ['responsive', 'accesible', 'ligero'],
    preview: 'https://via.placeholder.com/300x200/1e293b/ffffff?text=Modern'
  },

  macOS: {
    id: 'macOS',
    name: 'macOS',
    icon: '🍎',
    description: 'Estilo inspirado en Apple con botones de tráfico',
    category: 'light',
    tags: ['apple', 'mac', 'clean', 'elegante'],
    order: 2,
    author: 'Fenestrae Team',
    version: '1.0.0',
    year: 2024,
    features: ['botones-trafico', 'glassmorphism', 'tipografia-san-francisco'],
    preview: 'https://via.placeholder.com/300x200/e8eaed/1d1d1f?text=macOS'
  },

  dark: {
    id: 'dark',
    name: 'Dark Mode',
    icon: '🌙',
    description: 'Modo oscuro para trabajar de noche o reducir fatiga visual',
    category: 'dark',
    tags: ['oscuro', 'noche', 'bajo-consumo', 'accesible'],
    order: 3,
    author: 'Fenestrae Team',
    version: '1.0.0',
    year: 2024,
    features: ['bajo-consumo', 'contraste-optimo', 'eye-care'],
    preview: 'https://via.placeholder.com/300x200/111827/f9fafb?text=Dark'
  },

  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    icon: '🎮',
    description: 'Estilo neon futurista inspirado en el cyberpunk',
    category: 'dark',
    tags: ['neon', 'futurista', 'gaming', 'vibrante'],
    order: 4,
    author: 'Fenestrae Team',
    version: '1.0.0',
    year: 2024,
    features: ['neon-glow', 'efectos-psicodelicos', 'alto-contraste'],
    preview: 'https://via.placeholder.com/300x200/0a0a0f/bf7aff?text=Cyberpunk'
  },

  tropical: {
    id: 'tropical',
    name: 'Tropical',
    icon: '🌺',
    description: 'Colores cálidos y vibrantes inspirados en el trópico',
    category: 'colorful',
    tags: ['cálido', 'playa', 'verano', 'alegre'],
    order: 5,
    author: 'Fenestrae Team',
    version: '1.0.0',
    year: 2024,
    features: ['colores-cálidos', 'vibrante', 'positivo'],
    preview: 'https://via.placeholder.com/300x200/fef3c7/78350f?text=Tropical'
  },

  silver: {
    id: 'silver',
    name: 'Silver',
    icon: '🥈',
    description: 'Tema plata clásico inspirado en C++Builder',
    category: 'light',
    tags: ['clásico', 'plata', 'ide', 'c++builder'],
    order: 6,
    author: 'Fenestrae Team',
    version: '1.0.0',
    year: 2024,
    features: ['clásico', 'profesional', 'estilo-ide'],
    preview: 'https://via.placeholder.com/300x200/efebe7/1a1a1a?text=Silver'
  },

  pastel: {
    id: 'pastel',
    name: 'Pastel',
    icon: '🎨',
    description: 'Paleta de colores suaves y relajantes estilo pastel',
    category: 'colorful',
    tags: ['suave', 'relajante', 'dulce', 'armonioso'],
    order: 7,
    author: 'Fenestrae Team',
    version: '1.0.0',
    year: 2024,
    features: ['colores-suaves', 'relajante', 'armonioso'],
    preview: 'https://via.placeholder.com/300x200/f5f0ff/7c3aed?text=Pastel'
  },

  windows11: {
    id: 'windows11',
    name: 'Windows 11',
    icon: '🪟',
    description: 'Estilo Fluent Design de Microsoft con efecto Mica',
    category: 'light',
    tags: ['windows', 'microsoft', 'fluent', 'moderno'],
    order: 8,
    author: 'Fenestrae Team',
    version: '1.0.0',
    year: 2024,
    features: ['mica-effect', 'fluent-design', 'redondeado'],
    preview: 'https://via.placeholder.com/300x200/f0f2f5/0078d4?text=Windows11'
  },

  sapFiori: {
    id: 'sapFiori',
    name: 'SAP Fiori',
    icon: '🏢',
    description: 'Estilo corporativo SAP Fiori, limpio y funcional',
    category: 'enterprise',
    tags: ['sap', 'empresarial', 'fiori', 'corporativo'],
    order: 9,
    author: 'Fenestrae Team',
    version: '1.0.0',
    year: 2024,
    features: ['corporativo', 'funcional', 'accesible'],
    preview: 'https://via.placeholder.com/300x200/e5e5e5/004c97?text=SAP+Fiori'
  },

  windowsXP: {
    id: 'windowsXP',
    name: 'Windows XP',
    icon: '🪟',
    description: 'El clásico tema Luna de Windows XP con degradados satinados',
    category: 'retro',
    tags: ['retro', 'windows', 'xp', 'nostalgia'],
    order: 10,
    author: 'Fenestrae Team',
    version: '1.0.0',
    year: 2024,
    features: ['retro', 'degradados', 'botones-estilo-xp', 'nostalgico'],
    preview: 'https://via.placeholder.com/300x200/245edb/ffffff?text=Windows+XP'
  },

  windowsXPSilver: {
    id: 'windowsXPSilver',
    name: 'XP Silver',
    icon: '🪟',
    description: 'Variante plateada del clásico tema Windows XP',
    category: 'retro',
    tags: ['retro', 'windows', 'xp', 'plata'],
    order: 11,
    author: 'Fenestrae Team',
    version: '1.0.0',
    year: 2024,
    features: ['retro', 'plateado', 'xp'],
    preview: 'https://via.placeholder.com/300x200/8a9aa0/d4d0c8?text=XP+Silver'
  },

  windowsXPOlive: {
    id: 'windowsXPOlive',
    name: 'XP Olive',
    icon: '🪟',
    description: 'Variante verde oliva del clásico tema Windows XP',
    category: 'retro',
    tags: ['retro', 'windows', 'xp', 'oliva'],
    order: 12,
    author: 'Fenestrae Team',
    version: '1.0.0',
    year: 2024,
    features: ['retro', 'verde', 'xp'],
    preview: 'https://via.placeholder.com/300x200/6a7a5a/d4d0c8?text=XP+Olive'
  },

  luna: {
    id: 'luna',
    name: 'Luna',
    icon: '🌙',
    description: 'Tema azulado claro de C++Builder con toques nostálgicos',
    category: 'retro',
    tags: ['c++builder', 'ide', 'luna', 'desarrollo'],
    order: 13,
    author: 'Fenestrae Team',
    version: '1.0.0',
    year: 2024,
    features: ['clásico', 'azulado', 'ide'],
    preview: 'https://via.placeholder.com/300x200/d6dce5/1a1a2e?text=Luna'
  }
};

/**
 * Categorías de temas con sus respectivos iconos y descripciones
 */
export const THEME_CATEGORIES = {
  light: {
    id: 'light',
    name: 'Claros',
    icon: '☀️',
    description: 'Temas con fondo claro para trabajar durante el día'
  },
  dark: {
    id: 'dark',
    name: 'Oscuros',
    icon: '🌙',
    description: 'Temas con fondo oscuro para reducir la fatiga visual'
  },
  colorful: {
    id: 'colorful',
    name: 'Coloridos',
    icon: '🌈',
    description: 'Temas con paletas de colores vibrantes y creativas'
  },
  retro: {
    id: 'retro',
    name: 'Retro',
    icon: '📼',
    description: 'Temas nostálgicos inspirados en sistemas operativos clásicos'
  },
  enterprise: {
    id: 'enterprise',
    name: 'Empresariales',
    icon: '💼',
    description: 'Temas corporativos y profesionales para entornos de trabajo'
  }
};
