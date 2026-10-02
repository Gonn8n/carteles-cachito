export type CartelTheme = {
  titulo: number; // px
  precioUnit: number;
  precioBulto: number;
  padding: number;
  espacioMedioPy: number;
  bloqueRojoPy: number;
  gap: number;
  footerMt: number;
  pillPx: number;
  pillPy: number;
  pillFont: number;
  unitLabelFont: number;
  unitLabelMt: number;
  redRadius: number;
  promoGap: number;
};

export const THEME_A4: CartelTheme = {
  "titulo": 52,
  "precioUnit": 140,
  "precioBulto": 42,
  "padding": 35,
  "espacioMedioPy": 33,
  "bloqueRojoPy": 14,
  "gap": 18,
  "footerMt": 26,
  "pillPx": 25,
  "pillPy": 12,
  "pillFont": 18,
  "unitLabelFont": 28,
  "unitLabelMt": 0,
  "redRadius": 28,
  "promoGap": 0
};

export const THEME_2X: CartelTheme = {
  "titulo": 38,
  "precioUnit": 84,
  "precioBulto": 38,
  "padding": 20,
  "espacioMedioPy": 6,
  "bloqueRojoPy": 10,
  "gap": 4,
  "footerMt": 12,
  "pillPx": 22,
  "pillPy": 11,
  "pillFont": 13,
  "unitLabelFont": 21,
  "unitLabelMt": 5,
  "redRadius": 28,
  "promoGap": 0
};

export const THEME_4X: CartelTheme = {
  "titulo": 25,
  "precioUnit": 60,
  "precioBulto": 26,
  "padding": 14,
  "espacioMedioPy": 6,
  "bloqueRojoPy": 10,
  "gap": 4,
  "footerMt": 6,
  "pillPx": 12,
  "pillPy": 7,
  "pillFont": 11,
  "unitLabelFont": 13,
  "unitLabelMt": 0,
  "redRadius": 15,
  "promoGap": 0
};

export const STORAGE_A4 = "cartel-theme-a4";
export const STORAGE_2X = "cartel-theme-2x";
export const STORAGE_4X = "cartel-theme-4x";

export function loadThemeA4(): CartelTheme {
  if (typeof window === "undefined") return THEME_A4;
  try {
    const raw = localStorage.getItem(STORAGE_A4);
    if (raw) return { ...THEME_A4, ...JSON.parse(raw) };
  } catch {}
  return THEME_A4;
}
export function loadTheme2x(): CartelTheme {
  if (typeof window === "undefined") return THEME_2X;
  try {
    const raw = localStorage.getItem(STORAGE_2X);
    if (raw) return { ...THEME_2X, ...JSON.parse(raw) };
  } catch {}
  return THEME_2X;
}
export function loadTheme4x(): CartelTheme {
  if (typeof window === "undefined") return THEME_4X;
  try {
    const raw = localStorage.getItem(STORAGE_4X);
    if (raw) return { ...THEME_4X, ...JSON.parse(raw) };
  } catch {}
  return THEME_4X;
}
