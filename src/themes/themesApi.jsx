// ============================================================================
// FENESTRAE - Theme Metadata & Configuration
// Centraliza todos los metadatos, descripciones y configuraciones de temas
// ============================================================================
import {THEME_METADATA} from "./themeMetaData"

/**
 * Obtiene metadatos de un tema específico
 * @param {string} themeId - ID del tema
 * @returns {Object|null} Metadatos del tema o null si no existe
 */
export const getThemeMetadata = (themeId) => {
  return THEME_METADATA[themeId] || null;
};

/**
 * Obtiene todos los temas disponibles ordenados
 * @param {string} category - Filtrar por categoría (opcional)
 * @returns {Object} Objeto con temas filtrados y ordenados
 */
export const getThemesByCategory = (category = null) => {
  let themes = THEME_METADATA;
  
  if (category) {
    themes = Object.fromEntries(
      Object.entries(THEME_METADATA).filter(([_, meta]) => meta.category === category)
    );
  }
  
  // Ordenar por orden
  return Object.fromEntries(
    Object.entries(themes).sort((a, b) => a[1].order - b[1].order)
  );
};

/**
 * Obtiene la lista de IDs de temas
 * @param {string} category - Filtrar por categoría (opcional)
 * @returns {string[]} Lista de IDs de temas
 */
export const getThemeList = (category = null) => {
  const themes = getThemesByCategory(category);
  return Object.keys(themes);
};

/**
 * Obtiene la categoría de un tema
 * @param {string} themeId - ID del tema
 * @returns {string|null} Categoría del tema o null
 */
export const getThemeCategory = (themeId) => {
  const metadata = getThemeMetadata(themeId);
  return metadata ? metadata.category : null;
};

/**
 * Obtiene temas por etiqueta
 * @param {string} tag - Etiqueta a buscar
 * @returns {Object} Temas que contienen la etiqueta
 */
export const getThemesByTag = (tag) => {
  return Object.fromEntries(
    Object.entries(THEME_METADATA).filter(([_, meta]) => 
      meta.tags && meta.tags.includes(tag)
    )
  );
};

/**
 * Obtiene temas populares (los primeros 5 por orden)
 * @returns {Object} Temas populares
 */
export const getPopularThemes = () => {
  const sorted = Object.entries(THEME_METADATA)
    .sort((a, b) => a[1].order - b[1].order)
    .slice(0, 5);
  return Object.fromEntries(sorted);
};

/**
 * Busca temas por nombre o descripción
 * @param {string} query - Texto a buscar
 * @returns {Object} Temas que coinciden con la búsqueda
 */
export const searchThemes = (query) => {
  const searchTerm = query.toLowerCase();
  return Object.fromEntries(
    Object.entries(THEME_METADATA).filter(([_, meta]) => 
      meta.name.toLowerCase().includes(searchTerm) ||
      meta.description.toLowerCase().includes(searchTerm) ||
      meta.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  );
};

/**
 * Obtiene estadísticas de temas
 * @returns {Object} Estadísticas de temas
 */
export const getThemeStats = () => {
  const categories = {};
  let total = 0;
  
  Object.values(THEME_METADATA).forEach(meta => {
    categories[meta.category] = (categories[meta.category] || 0) + 1;
    total++;
  });
  
  return {
    total,
    categories,
    lightCount: categories.light || 0,
    darkCount: categories.dark || 0,
    colorfulCount: categories.colorful || 0,
    retroCount: categories.retro || 0,
    enterpriseCount: categories.enterprise || 0
  };
};

/**
 * Exporta todos los metadatos como un array plano
 * @returns {Array} Array de metadatos
 */
export const getThemeMetadataArray = () => {
  return Object.values(THEME_METADATA);
};

/**
 * Valida si un tema existe
 * @param {string} themeId - ID del tema
 * @returns {boolean} True si el tema existe
 */
export const isValidTheme = (themeId) => {
  return themeId in THEME_METADATA;
};

// Export default para conveniencia
export default THEME_METADATA;