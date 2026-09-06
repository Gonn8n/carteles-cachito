"use client";

interface CartelProps {
  id: number;
  descripcion: string;
  unidadesPorBulto: number;
  precioSur: number;
  precioUnidadSur: number | null;
  compact?: boolean;
  fullHeight?: boolean;
}

function fmt(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(n);
}

export function Cartel({ id, descripcion, unidadesPorBulto, precioSur, precioUnidadSur, compact, fullHeight }: CartelProps) {
  const ub = unidadesPorBulto && unidadesPorBulto > 0 ? unidadesPorBulto : 1;
  const precioUnit = precioUnidadSur != null ? precioUnidadSur : precioSur / ub;
  const rojo = "#E31E24";

  return (
    <div
      className={`bg-white border-2 border-black flex flex-col justify-between overflow-hidden ${compact ? "p-4 md:p-5" : "p-5 md:p-7"} ${fullHeight ? "h-full w-full min-h-0" : ""}`}
      style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
    >
      {/* Header: logo + marca + Precio Sur + ID */}
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

      {/* Medio: descripción + unidades x bulto + precio bulto */}
      <div className={`flex-1 flex flex-col justify-center text-center min-h-0 ${compact ? "py-2" : "py-4"}`}>
        <h2 className={`cartel-title font-black uppercase leading-[1.1] tracking-tight text-black ${compact ? "text-[20px] md:text-[24px]" : "text-[28px] md:text-[34px] lg:text-[38px]"}`}>
          {descripcion}
        </h2>
        <div className={`flex justify-center items-center gap-2 md:gap-3 flex-wrap ${compact ? "mt-2" : "mt-4"}`}>
          <span
            className={`font-bold text-white uppercase tracking-wider rounded-full ${compact ? "text-[10px] px-2 py-1" : "text-xs px-3 py-1.5"}`}
            style={{ backgroundColor: rojo }}
          >
            {ub} UNIDADES x BULTO
          </span>
          <span className={`font-black ${compact ? "text-lg md:text-xl" : "text-2xl md:text-3xl"}`} style={{ color: rojo }}>
            {fmt(precioSur)}
          </span>
        </div>
      </div>

      {/* Bloque rojo: precio por unidad */}
      <div
        className={`cartel-red-block rounded-[12px] md:rounded-[16px] text-center shrink-0 ${compact ? "px-3 py-3" : "px-4 py-5 md:py-6"}`}
        style={{ backgroundColor: rojo }}
      >
        <div className={`cartel-unit-price font-black leading-none tracking-tight text-white ${compact ? "text-[40px] md:text-[48px]" : "text-[52px] md:text-[64px] lg:text-[72px]"}`}>
          {fmt(precioUnit)}
        </div>
        <div className={`font-black tracking-[0.2em] text-black uppercase ${compact ? "text-[10px] mt-1" : "text-xs md:text-sm mt-2"}`}>Precio por Unidad</div>
      </div>

      {/* Footer */}
      <div className={`flex justify-between items-center font-medium tracking-wide uppercase text-neutral-400 shrink-0 ${compact ? "text-[7px] mt-2" : "text-[8px] md:text-[9px] mt-3"}`}>
        <span>Precios IVA incluido · Sujeto a stock</span>
        <span>{new Date().toLocaleDateString("es-AR")}</span>
      </div>
    </div>
  );
}
