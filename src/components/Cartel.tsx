"use client";
import type { CartelTheme } from "@/lib/cartel-theme";

interface CartelProps {
  id: number;
  descripcion: string;
  unidadesPorBulto: number;
  precioSur: number;
  precioUnidadSur: number | null;
  compact?: boolean;
  fullHeight?: boolean;
  theme?: CartelTheme;
}

function fmt(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(n);
}

export function Cartel({ id, descripcion, unidadesPorBulto, precioSur, precioUnidadSur, compact, fullHeight, theme }: CartelProps) {
  const ub = unidadesPorBulto && unidadesPorBulto > 0 ? unidadesPorBulto : 1;
  const precioUnit = precioUnidadSur != null ? precioUnidadSur : precioSur / ub;
  const rojo = "#E31E24";

  // si hay theme, usamos valores exactos (preview editor); si no, fallback a diseño previo
  const t = theme;

  return (
    <div
      className={`bg-white border-2 border-black flex flex-col justify-between overflow-hidden ${fullHeight ? "h-full w-full min-h-0" : ""}`}
      style={{
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        padding: t ? `${t.padding}px` : undefined,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-4 shrink-0">
        <div className="flex items-center gap-3">
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src="/cachitologo.png"
            alt="Cachito y Jose"
            className={`object-contain shrink-0 ${compact ? "h-10 md:h-12" : "h-14 md:h-16"}`}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="flex flex-col leading-none">
            <span className={`font-black tracking-wider text-black uppercase ${compact ? "text-sm md:text-base" : "text-base md:text-lg"}`}>Cachito y Jose</span>
            <span className={`text-neutral-500 uppercase tracking-widest ${compact ? "text-[10px] md:text-xs" : "text-xs md:text-sm"}`}>Distribuidora</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`bg-black text-white font-bold uppercase tracking-wider ${compact ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-1"}`}>Precio Sur</span>
          <span className={`text-neutral-400 font-medium ${compact ? "text-[9px]" : "text-[10px]"}`}>ID {id}</span>
        </div>
      </div>

      {/* Medio */}
      <div className="flex-1 flex flex-col justify-center text-center min-h-0" style={{ paddingTop: t ? `${t.espacioMedioPy}px` : undefined, paddingBottom: t ? `${t.espacioMedioPy}px` : undefined }}>
        <h2
          className="cartel-title font-black uppercase leading-[1.1] tracking-tight text-black"
          style={t ? { fontSize: `${t.titulo}px`, lineHeight: 1.1 } : undefined}
        >
          {descripcion}
        </h2>
        <div className="flex justify-center items-center gap-2 md:gap-3 flex-wrap" style={{ marginTop: t ? `${t.gap}px` : undefined }}>
          <span
            className="font-bold text-white uppercase tracking-wider rounded-full"
            style={{
              backgroundColor: rojo,
              paddingLeft: t ? `${t.pillPx}px` : undefined,
              paddingRight: t ? `${t.pillPx}px` : undefined,
              paddingTop: t ? `${t.pillPy}px` : undefined,
              paddingBottom: t ? `${t.pillPy}px` : undefined,
              fontSize: t ? `${t.pillFont}px` : undefined,
            }}
          >
            {ub} UNIDADES x BULTO
          </span>
          <span className="font-black" style={{ color: rojo, fontSize: t ? `${t.precioBulto}px` : undefined }}>
            {fmt(precioSur)}
          </span>
        </div>
      </div>

      {/* Bloque rojo */}
      <div
        className="cartel-red-block text-center shrink-0"
        style={{
          backgroundColor: rojo,
          borderRadius: t ? `${t.redRadius}px` : undefined,
          paddingTop: t ? `${t.bloqueRojoPy}px` : undefined,
          paddingBottom: t ? `${t.bloqueRojoPy}px` : undefined,
          paddingLeft: t ? "16px" : undefined,
          paddingRight: t ? "16px" : undefined,
        }}
      >
        <div className="cartel-unit-price font-black leading-none tracking-tight text-white" style={t ? { fontSize: `${t.precioUnit}px` } : undefined}>
          {fmt(precioUnit)}
        </div>
        <div
          className="font-black tracking-[0.2em] text-black uppercase"
          style={t ? { fontSize: `${t.unitLabelFont}px`, marginTop: `${t.unitLabelMt}px` } : undefined}
        >
          Precio por Unidad
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex justify-between items-center font-medium tracking-wide uppercase text-neutral-400 shrink-0"
        style={t ? { marginTop: `${t.footerMt}px`, fontSize: "9px" } : undefined}
      >
        <span>Precios IVA incluido · Sujeto a stock</span>
        <span>{new Date().toLocaleDateString("es-AR")}</span>
      </div>
    </div>
  );
}
