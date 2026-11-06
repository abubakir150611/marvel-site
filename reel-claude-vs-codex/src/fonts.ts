import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Шрифты лежат в public/fonts (лицензия SIL OFL 1.1, тексты лицензий — рядом).
// Вариативные файлы разбиты на латиницу и кириллицу — диапазоны как у Fontsource.
const LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const CYRILLIC = "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116";

export const fontsReady = Promise.all([
  loadFont({ family: "Inter", url: staticFile("fonts/inter-latin-wght-normal.woff2"), weight: "100 900", unicodeRange: LATIN }),
  loadFont({ family: "Inter", url: staticFile("fonts/inter-cyrillic-wght-normal.woff2"), weight: "100 900", unicodeRange: CYRILLIC }),
  loadFont({ family: "Manrope", url: staticFile("fonts/manrope-latin-wght-normal.woff2"), weight: "200 800", unicodeRange: LATIN }),
  loadFont({ family: "Manrope", url: staticFile("fonts/manrope-cyrillic-wght-normal.woff2"), weight: "200 800", unicodeRange: CYRILLIC }),
  // Вертикальный ролик: крупные заголовки, курсив с засечками, моноширинный «интерфейс».
  loadFont({ family: "Unbounded", url: staticFile("fonts/unbounded-latin-wght-normal.woff2"), weight: "200 900", unicodeRange: LATIN }),
  loadFont({ family: "Unbounded", url: staticFile("fonts/unbounded-cyrillic-wght-normal.woff2"), weight: "200 900", unicodeRange: CYRILLIC }),
  loadFont({ family: "Playfair Display", url: staticFile("fonts/playfair-display-latin-500-italic.woff2"), weight: "500", style: "italic", unicodeRange: LATIN }),
  loadFont({ family: "Playfair Display", url: staticFile("fonts/playfair-display-cyrillic-500-italic.woff2"), weight: "500", style: "italic", unicodeRange: CYRILLIC }),
  loadFont({ family: "JetBrains Mono", url: staticFile("fonts/jetbrains-mono-latin-500-normal.woff2"), weight: "500", unicodeRange: LATIN }),
  loadFont({ family: "JetBrains Mono", url: staticFile("fonts/jetbrains-mono-cyrillic-500-normal.woff2"), weight: "500", unicodeRange: CYRILLIC }),
]);
