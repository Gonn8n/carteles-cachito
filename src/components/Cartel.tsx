"use client";
import type { CartelTheme } from "@/lib/cartel-theme";

export interface CartelPromo {
  minQty: number;
  unitPrice: number;
}

interface CartelProps {
  id: number;
  descripcion: string;
  unidadesPorBulto: number;
  precioSur: number;
  precioUnidadSur: number | null;
  compact?: boolean;
  fullHeight?: boolean;
  theme?: CartelTheme;
  promo?: CartelPromo | null;
}

function fmt(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  })
    .format(n)
    .replace(/\u00A0/g, "")
    .replace(/\s/g, "");
}

export function Cartel({ id, descripcion, unidadesPorBulto, precioSur, precioUnidadSur, compact, fullHeight, theme, promo }: CartelProps) {
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
      {/* Header — logo agrandado como header */}
      <div className="flex justify-between items-start gap-4 shrink-0 pb-3">
        <div className="flex items-center gap-4">
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src="/cachitologo.png"
            alt="Cachito y Jose"
            className={`object-contain shrink-0 ${compact ? "h-14" : "h-[68px] md:h-[78px]"}`}
            style={compact ? { height: "calc(var(--spacing) * 14)" } : undefined}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="flex flex-col leading-none">
            <span className={`font-black tracking-wider text-black uppercase ${compact ? "text-[13px] md:text-[14px]" : "text-[15px] md:text-[17px]"}`}>Cachito y Jose</span>
            <span className={`text-neutral-500 uppercase tracking-widest ${compact ? "text-[10px] md:text-[11px]" : "text-[11px] md:text-[12px]"}`}>Distribuidora</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`bg-black text-white font-bold tracking-wider rounded-[3px] ${compact ? "text-[12px] px-2.5 py-1" : "text-[14px] px-3 py-1.5"}`}>ID: {id}</span>
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

      {/* Promo por cantidad (opcional, solo impresión) */}
      {promo && (
        <div
          className="text-center shrink-0"
          style={{
            backgroundColor: "#111111",
            borderRadius: t ? `${Math.max(8, Math.round(t.redRadius * 0.8))}px` : 12,
            paddingTop: t ? `${Math.max(6, Math.round(t.bloqueRojoPy * 0.35))}px` : undefined,
            paddingBottom: t ? `${Math.max(6, Math.round(t.bloqueRojoPy * 0.35))}px` : undefined,
            paddingLeft: "12px",
            paddingRight: "12px",
            marginTop: t ? `${Math.max(6, Math.round(t.gap * 0.8))}px` : undefined,
          }}
        >
          <div
            className="font-black tracking-[0.18em] text-white uppercase"
            style={t ? { fontSize: `${Math.max(9, Math.round(t.unitLabelFont * 0.85))}px` } : undefined}
          >
            Llevando {promo.minQty} o más
          </div>
          <div className="flex justify-center items-center" style={{ marginTop: "4px" }}>
            <span className="font-black leading-none text-white" style={t ? { fontSize: `${Math.round(t.precioUnit * 0.55)}px` } : undefined}>
              {fmt(promo.unitPrice)}
            </span>
          </div>
        </div>
      )}

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
