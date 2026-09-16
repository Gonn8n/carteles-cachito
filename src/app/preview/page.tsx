"use client";

import { useEffect, useState } from "react";
import { Cartel } from "@/components/Cartel";
import { THEME_A4, THEME_2X, THEME_4X, loadThemeA4, loadTheme2x, loadTheme4x, STORAGE_A4, STORAGE_2X, STORAGE_4X, type CartelTheme } from "@/lib/cartel-theme";

const DEMO = {
  id: 37,
  descripcion: "AGUA MIN. MARINARO 6 X 2,25LT.",
  unidades_por_bulto: 6,
  precio_sur: 3990,
  precio_unidad_sur: 665,
};
const DEMO2 = {
  id: 1465,
  descripcion: "FERNET-COLA CLASICO 6*1LT",
  unidades_por_bulto: 6,
  precio_sur: 5100,
  precio_unidad_sur: 850,
};
const DEMO3 = {
  id: 765,
  descripcion: "PEPSI LATA 24*354CC",
  unidades_por_bulto: 24,
  precio_sur: 14400,
  precio_unidad_sur: 600,
};
const DEMO4 = {
  id: 193,
  descripcion: "BRANCA 12*450",
  unidades_por_bulto: 12,
  precio_sur: 144000,
  precio_unidad_sur: 12000,
};

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-bold tracking-wide text-neutral-700">{label}</span>
        <span className="text-[11px] font-mono bg-neutral-100 px-1.5 py-0.5 rounded">{value}px</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(parseInt(e.target.value, 10))} className="w-full accent-[#2563EB] h-2" />
    </div>
  );
}

export default function PreviewA4() {
  const [formato, setFormato] = useState<"a4" | "2x" | "4x">("a4");
  const [scale, setScale] = useState(0.6);
  const [themeA4, setThemeA4] = useState<CartelTheme>(THEME_A4);
  const [theme2x, setTheme2x] = useState<CartelTheme>(THEME_2X);
  const [theme4x, setTheme4x] = useState<CartelTheme>(THEME_4X);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setThemeA4(loadThemeA4());
    setTheme2x(loadTheme2x());
    setTheme4x(loadTheme4x());
  }, []);

  const theme = formato === "a4" ? themeA4 : formato === "2x" ? theme2x : theme4x;
  const setTheme = formato === "a4" ? setThemeA4 : formato === "2x" ? setTheme2x : setTheme4x;

  function update<K extends keyof CartelTheme>(key: K, val: number) {
    setTheme((prev) => ({ ...prev, [key]: val } as CartelTheme));
    setSaved(false);
  }

  async function handleSave() {
    localStorage.setItem(STORAGE_A4, JSON.stringify(themeA4));
    localStorage.setItem(STORAGE_2X, JSON.stringify(theme2x));
    localStorage.setItem(STORAGE_4X, JSON.stringify(theme4x));
    try {
      await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeA4, theme2x, theme4x }),
      });
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }
  function handleReset() {
    if (formato === "a4") setThemeA4({ ...THEME_A4 });
    else if (formato === "2x") setTheme2x({ ...THEME_2X });
    else setTheme4x({ ...THEME_4X });
  }

  return (
    <div className="min-h-screen bg-[#2b2b2b] flex">
      <aside className="w-[300px] shrink-0 bg-white h-screen sticky top-0 overflow-y-auto border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 text-sm font-black">
            <span className="text-[#E31E24]">🎨</span> Editor de Cartel
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button onClick={() => setFormato("a4")} className={`py-2 rounded-lg text-xs font-bold border ${formato === "a4" ? "bg-black text-white border-black" : "bg-white border-neutral-200"}`}>
              A4 Horizontal
            </button>
            <button onClick={() => setFormato("2x")} className={`py-2 rounded-lg text-xs font-bold border ${formato === "2x" ? "bg-black text-white border-black" : "bg-white border-neutral-200"}`}>
              A4 Vertical (2x)
            </button>
            <button onClick={() => setFormato("4x")} className={`col-span-2 py-2 rounded-lg text-xs font-bold border ${formato === "4x" ? "bg-black text-white border-black" : "bg-white border-neutral-200"}`}>
              A4 Horizontal (4x 2×2)
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 space-y-4">
          <Slider label="Título" value={theme.titulo} min={16} max={70} onChange={(v) => update("titulo", v)} />
          <Slider label="Precio Unitario" value={theme.precioUnit} min={30} max={160} onChange={(v) => update("precioUnit", v)} />
          <Slider label="Precio Bulto" value={theme.precioBulto} min={12} max={60} onChange={(v) => update("precioBulto", v)} />
          <Slider label="Padding Cartel" value={theme.padding} min={10} max={64} onChange={(v) => update("padding", v)} />
          <Slider label="Espacio Medio (py)" value={theme.espacioMedioPy} min={6} max={48} onChange={(v) => update("espacioMedioPy", v)} />
          <Slider label="Bloque Rojo (py)" value={theme.bloqueRojoPy} min={10} max={72} onChange={(v) => update("bloqueRojoPy", v)} />
          <Slider label="Gap Título→Sub" value={theme.gap} min={4} max={24} onChange={(v) => update("gap", v)} />
          <Slider label="Footer mt" value={theme.footerMt} min={4} max={32} onChange={(v) => update("footerMt", v)} />
          <Slider label="Pill px" value={theme.pillPx} min={8} max={40} onChange={(v) => update("pillPx", v)} />
          <Slider label="Pill py" value={theme.pillPy} min={4} max={20} onChange={(v) => update("pillPy", v)} />
          <Slider label="Pill font" value={theme.pillFont} min={8} max={20} onChange={(v) => update("pillFont", v)} />
          <Slider label="Unit label font" value={theme.unitLabelFont} min={8} max={28} onChange={(v) => update("unitLabelFont", v)} />
          <Slider label="Unit label mt" value={theme.unitLabelMt} min={0} max={16} onChange={(v) => update("unitLabelMt", v)} />
          <Slider label="Red block radius" value={theme.redRadius} min={8} max={28} onChange={(v) => update("redRadius", v)} />
        </div>

        <div className="p-3 border-t bg-neutral-50 flex gap-2 sticky bottom-0">
          <button onClick={handleReset} className="flex-1 py-2 rounded-lg text-xs font-bold border bg-white">
            Reset
          </button>
          <button onClick={handleSave} className="flex-1 py-2 rounded-lg text-xs font-black text-white" style={{ background: saved ? "#16a34a" : "#E31E24" }}>
            {saved ? "¡Guardado!" : "Guardar"}
          </button>
        </div>
      </aside>

      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center gap-3 mb-4 text-white">
          <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full">
            Vista 1:1 — A4 real {formato === "4x" ? "297×210mm 2×2" : formato === "a4" ? "297×210mm" : "210×297mm"}
          </span>
          <label className="flex items-center gap-2 text-xs ml-auto">
            Zoom
            <input type="range" min={0.35} max={1} step={0.05} value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="accent-white" />
            <span className="font-mono w-10">{Math.round(scale * 100)}%</span>
          </label>
          <button onClick={() => window.print()} className="px-4 py-1.5 rounded-full text-xs font-black text-white" style={{ background: "#E31E24" }}>
            Imprimir
          </button>
          <a href="/" className="text-xs underline">
            ← Buscador
          </a>
        </div>

        <div className="flex justify-center items-start">
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}>
            {formato === "a4" && (
              <div className="bg-white shadow-2xl" style={{ width: "297mm", height: "210mm", padding: "6mm", boxSizing: "border-box", display: "flex" }}>
                <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
                  <Cartel id={DEMO.id} descripcion={DEMO.descripcion} unidadesPorBulto={DEMO.unidades_por_bulto} precioSur={DEMO.precio_sur} precioUnidadSur={DEMO.precio_unidad_sur} fullHeight theme={themeA4} />
                </div>
              </div>
            )}
            {formato === "2x" && (
              <div className="bg-white shadow-2xl" style={{ width: "210mm", height: "297mm", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                <div style={{ height: "148.5mm", padding: "6mm", boxSizing: "border-box", display: "flex", flexDirection: "column", borderBottom: "1.5px dashed #888" }}>
                  <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
                    <Cartel id={DEMO.id} descripcion={DEMO.descripcion} unidadesPorBulto={DEMO.unidades_por_bulto} precioSur={DEMO.precio_sur} precioUnidadSur={DEMO.precio_unidad_sur} compact fullHeight theme={theme2x} />
                  </div>
                </div>
                <div style={{ height: "148.5mm", padding: "6mm", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                  <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
                    <Cartel id={DEMO2.id} descripcion={DEMO2.descripcion} unidadesPorBulto={DEMO2.unidades_por_bulto} precioSur={DEMO2.precio_sur} precioUnidadSur={DEMO2.precio_unidad_sur} compact fullHeight theme={theme2x} />
                  </div>
                </div>
              </div>
            )}
            {formato === "4x" && (
              <div className="bg-white shadow-2xl" style={{ width: "297mm", height: "210mm", boxSizing: "border-box", display: "grid", gridTemplateColumns: "148.5mm 148.5mm", gridTemplateRows: "105mm 105mm" }}>
                {[DEMO, DEMO2, DEMO3, DEMO4].map((d, idx) => (
                  <div
                    key={d.id}
                    style={{
                      padding: "5mm",
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                      borderRight: idx % 2 === 0 ? "1.5px dashed #888" : undefined,
                      borderBottom: idx < 2 ? "1.5px dashed #888" : undefined,
                    }}
                  >
                    <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
                      <Cartel id={d.id} descripcion={d.descripcion} unidadesPorBulto={d.unidades_por_bulto} precioSur={d.precio_sur} precioUnidadSur={d.precio_unidad_sur} compact fullHeight theme={theme4x} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-[10px] text-white/40 mt-6 no-print">
          Guardar persiste en <code>localStorage</code>. Defaults A4 51/120, 2x 35/90 y 4x 24/60 (compact) — ajustalos y Guardar.
        </p>
      </div>

      <style>{`
        @media print {
          @page { size: ${formato === "4x" ? "A4 landscape" : formato === "a4" ? "A4 landscape" : "A4 portrait"}; margin: 0; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          aside, .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
