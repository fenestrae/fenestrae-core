/**
 * Fenestrae v1.0.0
 * React Window Manager for Enterprise Web Applications
 * * Copyright 2026 Toni Raventós
 * Licensed under the Apache License, Version 2.0
 * * https://github.com/toniraventos/fenestrae
 */

// 🚀 1. Inyectamos los estilos de Tailwind v4 en el empaquetado
import './index.css';



// 🧱 3. Exportamos los componentes estructurales obligatorios
export { default as FenestraeProvider } from './windows/FenestraeProvider';
export { default as FenestraeContainer } from './windows/FenestraeContainer';


// 🔄 4. Exportación por defecto del objeto 'win' para máxima compatibilidad
import { winStore, win, context } from './core';
import {
    init,
    getSessionsByUserId,
    getSessionsByUserAndWorkspace,
    getSessions,
    createNewSession,
    activateSession,
    setSession,
    closeSession,
    delSession,
    clearSessions,
    restoreWindows
} from './database/persistence'

// 🧠 2. Exportamos el store y la API global imperativa

export { winStore, win, context } from './core';


export {
    init,
    getSessionsByUserId,
    getSessionsByUserAndWorkspace,
    getSessions,
    createNewSession,
    activateSession,
    setSession,
    closeSession,
    delSession,
    clearSessions,
    restoreWindows
} from './database/persistence'

// --------------------------------------------------------------------------
// EXPORTACIONES PARA CONSUMIDORES AVANZADOS
// --------------------------------------------------------------------------


// Alias oficiales (named exports REALES)

// técnico ae
export const ae = {
    ...win,
    context,
    init,
    getSessionsByUserId,
    getSessionsByUserAndWorkspace,
    getSessions,
    createNewSession,
    activateSession,
    setSession,
    closeSession,
    delSession,
    clearSessions,
    restoreWindows
};

// API pública enriquecida
export const fenestrae = {
    ...win,
    context,
    init,
    getSessionsByUserId,
    getSessionsByUserAndWorkspace,
    getSessions,
    createNewSession,
    activateSession,
    setSession,
    closeSession,
    delSession,
    clearSessions,
    restoreWindows
};

// Default export
export default fenestrae;



export { version, author, license } from './version';