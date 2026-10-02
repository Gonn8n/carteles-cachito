import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const themePath = path.join(process.cwd(), "src/lib/cartel-theme.ts");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { themeA4, theme2x } = body as {
      themeA4: Record<string, number>;
      theme2x: Record<string, number>;
    };
    if (!themeA4 || !theme2x) return NextResponse.json({ error: "Faltan themes" }, { status: 400 });

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
