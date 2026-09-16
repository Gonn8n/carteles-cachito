import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const themePath = path.join(process.cwd(), "src/lib/cartel-theme.ts");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { themeA4, theme2x, theme4x } = body as {
      themeA4: Record<string, number>;
      theme2x: Record<string, number>;
      theme4x?: Record<string, number>;
    };
    if (!themeA4 || !theme2x) return NextResponse.json({ error: "Faltan themes" }, { status: 400 });

    // mantener compat: si no viene 4x, leer el actual del archivo
    let final4x = theme4x;
    if (!final4x) {
      try {
        const cur = await fs.readFile(themePath, "utf-8");
        const m = cur.match(/export const THEME_4X[^=]*=\s*(\{[\s\S]*?\});/);
        if (m) final4x = JSON.parse(m[1].replace(/\/\/.*$/gm, ""));
      } catch {}
      if (!final4x) {
        final4x = {
          titulo: 24,
          precioUnit: 60,
          precioBulto: 20,
          padding: 16,
          espacioMedioPy: 10,
          bloqueRojoPy: 16,
          gap: 6,
          footerMt: 6,
          pillPx: 12,
          pillPy: 5,
          pillFont: 9,
          unitLabelFont: 10,
          unitLabelMt: 3,
          redRadius: 10,
        };
      }
    }

    const content = `export type CartelTheme = {
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

export const THEME_A4: CartelTheme = ${JSON.stringify(themeA4, null, 2)};

export const THEME_2X: CartelTheme = ${JSON.stringify(theme2x, null, 2)};

export const THEME_4X: CartelTheme = ${JSON.stringify(final4x, null, 2)};

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
`;
    await fs.writeFile(themePath, content, "utf-8");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const raw = await fs.readFile(themePath, "utf-8");
    return new NextResponse(raw, { headers: { "Content-Type": "text/plain" } });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
