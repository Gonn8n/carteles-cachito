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
};

export const THEME_A4: CartelTheme = {
  "titulo": 52,
  "precioUnit": 139,
  "precioBulto": 42,
  "padding": 36,
  "espacioMedioPy": 30,
  "bloqueRojoPy": 25,
  "gap": 10,
  "footerMt": 26,
  "pillPx": 25,
  "pillPy": 13,
  "pillFont": 17,
  "unitLabelFont": 25,
  "unitLabelMt": 0,
  "redRadius": 28
};

export const THEME_2X: CartelTheme = {
  "titulo": 38,
  "precioUnit": 85,
  "precioBulto": 38,
  "padding": 20,
  "espacioMedioPy": 26,
  "bloqueRojoPy": 10,
  "gap": 4,
  "footerMt": 19,
  "pillPx": 23,
  "pillPy": 11,
  "pillFont": 14,
  "unitLabelFont": 21,
  "unitLabelMt": 5,
  "redRadius": 28
};

export const THEME_4X: CartelTheme = {
  "titulo": 25,
  "precioUnit": 55,
  "precioBulto": 28,
  "padding": 13,
  "espacioMedioPy": 8,
  "bloqueRojoPy": 10,
  "gap": 4,
  "footerMt": 9,
  "pillPx": 14,
  "pillPy": 7,
  "pillFont": 11,
  "unitLabelFont": 13,
  "unitLabelMt": 0,
  "redRadius": 15
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
