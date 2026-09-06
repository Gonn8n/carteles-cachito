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
  titulo: 51,
  precioUnit: 120,
  precioBulto: 42,
  padding: 40,
  espacioMedioPy: 28,
  bloqueRojoPy: 48,
  gap: 10,
  footerMt: 18,
  pillPx: 24,
  pillPy: 12,
  pillFont: 15,
  unitLabelFont: 20,
  unitLabelMt: 2,
  redRadius: 18,
};

export const THEME_2X: CartelTheme = {
  titulo: 35,
  precioUnit: 90,
  precioBulto: 30,
  padding: 30,
  espacioMedioPy: 23,
  bloqueRojoPy: 36,
  gap: 8,
  footerMt: 16,
  pillPx: 20,
  pillPy: 9,
  pillFont: 12,
  unitLabelFont: 16,
  unitLabelMt: 8,
  redRadius: 20,
};

export const STORAGE_A4 = "cartel-theme-a4";
export const STORAGE_2X = "cartel-theme-2x";

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
