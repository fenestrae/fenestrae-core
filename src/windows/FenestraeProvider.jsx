import { 
  useEffect, 
  createContext, 
  useState, 
  useMemo,
} from 'react'

import { win } from '../core'
import { mapThemeToCSSVariables } from '../themes/themeMapper'
import FenestraeWinRenderer from "./FenestraeWinRenderer"

// Exponerlo al entorno global para el ecosistema multi-ventana
window.__FenestraeRendererComponent__ = FenestraeWinRenderer

// 🌟 Contexto de temas
const FenestraeThemeContext = createContext(null)

const FenestraeProvider = ({ 
  components = {}, 
  themes = {},
  defaultTheme = "modern",
  children 
}) => {

  // Registrar componentes
  useEffect(() => {
    win.register(components)
  }, [components])

  // Estado del tema
  const [currentThemeName, setCurrentThemeName] = useState(defaultTheme)

  // Variables CSS del tema activo
  const activeCSSVariables = useMemo(() => {
    const activeThemeInput = themes[currentThemeName] || currentThemeName
    return mapThemeToCSSVariables(activeThemeInput)
  }, [themes, currentThemeName])

  // Contexto del tema
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
        className="w-full h-full min-h-screen relative"
      >
        {/* ⭐ Portal root integrado directamente en el JSX */}
        <div
          id="fenestrae-portal-root"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 999999,
            pointerEvents: "none"
          }}
        />

        {/* Contenido de la aplicación */}
        {children}
      </div>
    </FenestraeThemeContext.Provider>
  )
}

export { FenestraeProvider }
export default FenestraeProvider
