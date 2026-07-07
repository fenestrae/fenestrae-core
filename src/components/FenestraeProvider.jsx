import React, { useEffect, createContext, useContext, useState, useMemo } from 'react'
import { win } from '../core'
import { mapThemeToCSSVariables } from '../core/themeMapper' // El mapper que creamos antes

import FenestraeWinRenderer from "../windows/FenestraeWinRenderer";

// Exponerlo al entorno global para el ecosistema multi-ventana de Fenestrae
window.__FenestraeRendererComponent__ = FenestraeWinRenderer;


// 🌟 Creamos el contexto para los temas
const FenestraeThemeContext = createContext(null)

/**
 * FenestraeProvider
 * Componente raíz de Fenestrae.
 * Registra los componentes, prepara el runtime y gestiona los temas visuales.
 * * Uso:
 * <FenestraeProvider components={myComponents} themes={myThemes} defaultTheme="sapBase">
 * <FenestraeContainer />
 * <MyApp />
 * </FenestraeProvider>
 * * @param {Object} components - Mapa de nombre → componente React
 * @param {Object} themes - Catálogo de temas JSON personalizados por el cliente
 * @param {string} defaultTheme - Nombre del tema inicial
 * @param {React.ReactNode} children - Contenido de la aplicación
 */
const FenestraeProvider = ({ 
  components = {}, 
  themes = {}, // El programador puede pasar temas custom aquí
  defaultTheme = "modern", // Tema inicial seguro por defecto
  children 
}) => {

  useEffect(() => {
    win.register(components)
  }, [components])

  // 1. Gestión del estado usando la prop defaultTheme directamente
  const [currentThemeName, setCurrentThemeName] = useState(defaultTheme)

  // 2. Resolvemos las variables CSS enviando al mapper el string actual del tema Y el catálogo extendido
  const activeCSSVariables = useMemo(() => {
    // Si el tema actual existe en los personalizados del usuario, le pasamos ese objeto custom.
    // Si no existe, pasamos el string ("macOS", "modern") para que themeMapper use sus presets nativos.
    const activeThemeInput = themes[currentThemeName] || currentThemeName;
    return mapThemeToCSSVariables(activeThemeInput)
  }, [themes, currentThemeName])

  // 3. Exponemos los nombres disponibles combinando presets fijos conocidos y los del usuario
  const themeContextValue = useMemo(() => ({
    currentTheme: currentThemeName,
    setTheme: setCurrentThemeName,
    availableThemes: ["modern", "macOS", "dark", ...Object.keys(themes)]
  }), [currentThemeName, themes])

  return (
    <FenestraeThemeContext.Provider value={themeContextValue}>
      <div 
        id="fenestrae-runtime-root" 
        style={activeCSSVariables} 
        className="w-full h-full min-h-screen"
      >
        {children}
      </div>
    </FenestraeThemeContext.Provider>
  )
}

//  Exportamos el hook para que el LaunchPad o el Navbar cambien de tema
export const useFenestraeTheme = () => {
  const context = useContext(FenestraeThemeContext)
  if (!context) {
    throw new Error("useFenestraeTheme debe usarse dentro de un FenestraeProvider")
  }
  return context
}

export { FenestraeProvider }
export default FenestraeProvider