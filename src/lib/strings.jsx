// 🔹 Número formateado
export function trans  ( value, dec=2 ) {
  const i = Number(
  typeof value === "string" ? value.replace(",", ".") : value
);
  if (i ===0)  return "";
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: dec ?? 2,
    maximumFractionDigits: dec ?? 2,
    useGrouping: true,
  }).format(i);
};


/**
 * Formatea un número añadiendo ceros a la izquierda hasta alcanzar la longitud deseada.
 * @param {number|string} num - El valor a formatear.
 * @param {number} len - La longitud total del string resultante.
 * @returns {string} - El string formateado con ceros.
 */
export const codi = (num, len) => {
  // Convertimos a string y usamos padStart
  // Si num es null o undefined, tratamos como ""
  return String(num ?? "").padStart(len, "0");
};


// utils/stringUtils.js
export class TextFormatter {
  static capitalize(text, options = {}) {
    if (!text || typeof text !== 'string') return '';
    
    const {
      allWords = false,
      preserveCaseFor = ['II', 'III', 'IV', 'VIP', 'CEO', 'ERP', 'CFO', 'CTO', 'UI', 'UX'],
      lowercaseWords = ['de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'o', 'u', 'a', 'al', 'con', 'en', 'por', 'para', 'sin', 'sobre'],
      forceFirstUppercase = true,
      locale = 'es'
    } = options;
    
    // Si es un acrónimo preservado, devolver tal cual
    if (preserveCaseFor.includes(text.toUpperCase())) {
      return text;
    }
    
    if (allWords) {
      return text
        .toLocaleLowerCase(locale)
        .split(/(\s+)/) // Mantener múltiples espacios
        .map((word, index, array) => {
          // Si es espacio, devolver tal cual
          if (/^\s+$/.test(word)) return word;
          
          const wordLower = word.toLocaleLowerCase(locale);
          
          // 1. Palabras que deben mantenerse en mayúsculas (acrónimos)
          if (preserveCaseFor.includes(word.toUpperCase())) {
            return word.toUpperCase();
          }
          
          // 2. Palabras que deben estar en minúscula (artículos/preposiciones)
          // Excepto si son la primera o última palabra
          if (lowercaseWords.includes(wordLower) && 
              index > 0 && 
              index < array.length - 1 &&
              !/^\s+$/.test(array[index - 1])) {
            return wordLower;
          }
          
          // 3. Capitalizar otras palabras
          return wordLower.charAt(0).toLocaleUpperCase(locale) + 
                 wordLower.slice(1);
        })
        .join('');
    }
    
    // Para single word o first word only
    return text.charAt(0).toLocaleUpperCase(locale) + 
           text.slice(1).toLocaleLowerCase(locale);
  }
  
  static capitalizeTitle(text, options = {}) {
    // Alias específico para títulos
    return this.capitalize(text, { 
      allWords: true, 
      forceFirstUppercase: true,
      ...options 
    });
  }
  
  static capitalizeName(fullName, options = {}) {
    if (!fullName) return '';
    
    // Para nombres propios, reglas especiales
    const nameOptions = {
      allWords: true,
      lowercaseWords: ['y', 'e'], // Solo mantener estas en minúscula para nombres
      preserveCaseFor: ['II', 'III', 'IV', 'Jr.', 'Sr.', 'Sra.', 'Dr.', 'Dra.'],
      ...options
    };
    
    return this.capitalize(fullName, nameOptions);
  }
  
  static capitalizeFieldNames(obj, options = {}) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const {
      skipKeys = ['id', '_id', 'uuid', 'createdAt', 'updatedAt']
    } = options;
    
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];
      
      // Saltar ciertas keys
      if (skipKeys.includes(key)) {
        acc[key] = value;
        return acc;
      }
      
      // Capitalizar nombres de campos: "nombre_cliente" → "NombreCliente"
      const newKey = this.capitalize(key.replace(/[_-]+/g, ' '), { allWords: true })
        .replace(/\s+/g, '');
      
      acc[newKey] = value;
      return acc;
    }, {});
  }
  
  // Nuevo método: Capitalizar manteniendo ciertas palabras en minúscula
  static capitalizeSmart(text, options = {}) {
    const defaultLowercaseWords = {
      es: ['de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'o', 'u', 'a', 'al', 'con', 'en', 'por', 'para', 'sin', 'sobre', 'entre', 'hacia', 'hasta', 'durante', 'mediante', 'versus', 'vía', 'so'],
      en: ['the', 'a', 'an', 'and', 'or', 'but', 'nor', 'for', 'so', 'yet', 'with', 'at', 'by', 'to', 'of', 'in', 'on']
    };
    
    const defaultOptions = {
      language: 'es',
      lowercaseWords: defaultLowercaseWords.es,
      alwaysUppercaseFirst: true,
      alwaysUppercaseLast: false,
      preserveCaseFor: ['II', 'III', 'IV', 'ERP', 'API', 'SQL', 'PDF', 'XML', 'JSON']
    };
    
    const opts = { ...defaultOptions, ...options };
    
    if (!text) return '';
    
    // Usar lista de palabras según idioma
    const lowercaseList = Array.isArray(opts.lowercaseWords) 
      ? opts.lowercaseWords 
      : defaultLowercaseWords[opts.language] || defaultLowercaseWords.es;
    
    return text
      .toLocaleLowerCase(opts.locale || opts.language)
      .split(/(\s+)/)
      .map((word, index, array) => {
        // Mantener espacios
        if (/^\s+$/.test(word)) return word;
        
        const isFirstWord = index === 0;
        const isLastWord = index === array.length - 1 || /^\s+$/.test(array[index + 1]);
        
        // 1. Palabras que deben mantenerse en mayúsculas
        if (opts.preserveCaseFor.includes(word.toUpperCase())) {
          return word.toUpperCase();
        }
        
        // 2. Determinar si debe capitalizarse
        let shouldCapitalize = true;
        
        // Primera palabra siempre en mayúscula (si se especifica)
        if (isFirstWord && opts.alwaysUppercaseFirst) {
          shouldCapitalize = true;
        }
        // Última palabra en mayúscula (si se especifica)
        else if (isLastWord && opts.alwaysUppercaseLast) {
          shouldCapitalize = true;
        }
        // Palabras en la lista de minúsculas
        else if (lowercaseList.includes(word.toLowerCase())) {
          shouldCapitalize = false;
        }
        
        // 3. Aplicar transformación
        if (shouldCapitalize) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        } else {
          return word.toLowerCase();
        }
      })
      .join('');
  }
}
/*
// Ejemplos de uso:
console.log(TextFormatter.capitalizeSmart('el señor de los anillos'));
// → "El Señor de los Anillos"

console.log(TextFormatter.capitalizeSmart('dirección de facturación y envío'));
// → "Dirección de Facturación y Envío"

console.log(TextFormatter.capitalizeSmart('informe de ventas por región'));
// → "Informe de Ventas por Región"

console.log(TextFormatter.capitalizeSmart('maría de los ángeles y josé', { 
  lowercaseWords: ['de', 'y'] 
}));
// → "María de los Ángeles y José"

console.log(TextFormatter.capitalizeSmart('the lord of the rings', { 
  language: 'en' 
}));
// → "The Lord of the Rings"

console.log(TextFormatter.capitalizeSmart('sistema erp de gestión', {
  preserveCaseFor: ['ERP']
}));
// → "Sistema ERP de Gestión"
*/