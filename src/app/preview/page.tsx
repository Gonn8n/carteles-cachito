"use client";

import { useState } from "react";
import { Cartel } from "@/components/Cartel";

const DEMO = {
  id: 37,
  descripcion: "AGUA MIN. MARINARO 6 X 2,25LT.",
  unidades_por_bulto: 6,
  precio_sur: 3990,
  precio_unidad_sur: 665,
};

export default function PreviewA4() {
  const [formato, setFormato] = useState<"a4" | "2x">("a4");
  const [scale, setScale] = useState(0.65);

  return (
    <div className="min-h-screen bg-[#2b2b2b] p-4">
      {/* Controles no-print — pensados para usarse teniendo Open Design al lado */}
      <div className="max-w-[1200px] mx-auto mb-4 flex flex-wrap gap-3 items-center bg-white rounded-xl p-3 border no-print">
        <span className="text-xs font-bold tracking-widest text-neutral-500">PREVIEW A4 — EDITABLE EN VIVO</span>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setFormato("a4")}
            className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${formato === "a4" ? "bg-black text-white border-black" : "bg-white"}`}
          >
            A4 horizontal (1)
          </button>
          <button
            onClick={() => setFormato("2x")}
            className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${formato === "2x" ? "bg-black text-white border-black" : "bg-white"}`}
          >
            2×A5 horizontales (2 por A4)
          </button>
          <button onClick={() => window.print()} className="px-4 py-2 rounded-full text-sm font-bold text-white" style={{ background: "#E31E24" }}>
            Imprimir esta vista
          </button>
        </div>
        <label className="flex items-center gap-2 text-xs ml-2">
          Zoom
          <input type="range" min={0.4} max={1} step={0.05} value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} />
          <span className="font-mono w-8">{Math.round(scale * 100)}%</span>
        </label>
        <a href="/" className="text-xs underline ml-2">
          ← Volver a buscador
        </a>
      </div>

      <p className="max-w-[1200px] mx-auto text-xs text-neutral-400 mb-2 no-print">
        Tip: Abre <b>http://localhost:5555</b> en otra pestaña y editalo ahí. Esta vista está a escala A4 real (297×210 / 210×297). Usa <b>Ctrl+P</b> para validar el calce a borde. Cambia los valores en{" "}
        <code>src/components/Cartel.tsx</code> y el preview se actualiza en vivo (HMR).
      </p>

      {/* Stage centrado — escala para que quepa en pantalla pero en print es 100% */}
      <div className="flex justify-center">
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}>
          {/* Página A4 1 por hoja */}
          {formato === "a4" && (
            <div
              className="bg-white shadow-2xl"
              style={{ width: "297mm", height: "210mm", padding: "6mm", boxSizing: "border-box", display: "flex" }}
            >
              <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
                <Cartel id={DEMO.id} descripcion={DEMO.descripcion} unidadesPorBulto={DEMO.unidades_por_bulto} precioSur={DEMO.precio_sur} precioUnidadSur={DEMO.precio_unidad_sur} fullHeight />
              </div>
            </div>
          )}

          {/* Página A4 2×A5 horizontales */}
          {formato === "2x" && (
            <div className="bg-white shadow-2xl" style={{ width: "210mm", height: "297mm", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
              <div style={{ height: "148.5mm", padding: "6mm", boxSizing: "border-box", display: "flex", flexDirection: "column", borderBottom: "1.5px dashed #888" }}>
                <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
                  <Cartel id={DEMO.id} descripcion={DEMO.descripcion} unidadesPorBulto={DEMO.unidades_por_bulto} precioSur={DEMO.precio_sur} precioUnidadSur={DEMO.precio_unidad_sur} compact fullHeight />
                </div>
              </div>
              <div style={{ height: "148.5mm", padding: "6mm", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
                  <Cartel id={1465} descripcion="FERNET-COLA CLASICO 6*1LT" unidadesPorBulto={6} precioSur={5100} precioUnidadSur={850} compact fullHeight />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print oculto — mismo que page.tsx pero para Ctrl+P desde esta ruta */}
      <div className="hidden print:block">
        <style>{`
          @media print {
            @page { size: ${formato === "a4" ? "A4 landscape" : "A4 portrait"}; margin: 0; }
            body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}</style>
      </div>
    </div>
  );
}
