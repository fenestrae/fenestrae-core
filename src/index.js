/**
 * Fenestrae v1.0.0
 * React Window Manager for Enterprise Web Applications
 * * Copyright 2026 Toni Raventós
 * Licensed under the Apache License, Version 2.0
 * * https://github.com/toniraventos/fenestrae
 */

// 🚀 1. Inyectamos los estilos de Tailwind v4 en el empaquetado
import './index.css'; 

// 🧠 2. Exportamos el store y la API global imperativa
export { winStore, win } from './core';

// 🧱 3. Exportamos los componentes estructurales obligatorios
export { default as FenestraeProvider } from './components/FenestraeProvider';
export { default as FenestraeContainer } from './components/FenestraeContainer';

// 🔄 4. Exportación por defecto del objeto 'win' para máxima compatibilidad
import { win } from './core';

// --------------------------------------------------------------------------
// EXPORTACIONES PARA CONSUMIDORES AVANZADOS
// --------------------------------------------------------------------------


// Alias oficiales (named exports REALES)

export const ae = win;             // técnico elegante
export const fenestrae = win;      // API pública oficial

// Default export
export default fenestrae;



export { version, author, license } from './version';