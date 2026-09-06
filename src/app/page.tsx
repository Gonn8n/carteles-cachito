"use client";

import { useEffect, useState, useRef } from "react";
import { Cartel } from "@/components/Cartel";
import { THEME_A4, THEME_2X, type CartelTheme } from "@/lib/cartel-theme";

type Producto = {
  id: number;
  descripcion: string;
  descripcion_detallada: string;
  codigo_barra: string;
  codigo_barra_unidad: string;
  unidades_por_bulto: number;
  precio_sur: number;
  precio_norte: number;
  precio_unidad_sur: number | null;
  precio_unidad_norte: number | null;
};

type EditableProducto = {
  id: number;
  descripcion: string;
  unidades_por_bulto: number;
  precio_sur: number;
  precio_unidad_sur: number | null;
  editing: boolean;
};

type SearchHit = { id: number; descripcion: string; unidades_por_bulto: number; precio_sur: number; precio_unidad_sur: number | null };

export default function Home() {
  const [pinInput, setPinInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState("");

  const [input, setInput] = useState("");
  const [items, setItems] = useState<EditableProducto[]>([]);
  const [notFoundMsg, setNotFoundMsg] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [formato, setFormato] = useState<"a4" | "2x">("a4");

  const [searchResults, setSearchResults] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [themeA4, setThemeA4] = useState<CartelTheme>(THEME_A4);
  const [theme2x, setTheme2x] = useState<CartelTheme>(THEME_2X);

  const PIN = process.env.NEXT_PUBLIC_CARTEL_PIN || "2580";

  useEffect(() => {
    const saved = localStorage.getItem("carteles_pin_ok");
    if (saved === "1") setUnlocked(true);
    try {
      const a4Raw = localStorage.getItem("cartel-theme-a4");
      const x2Raw = localStorage.getItem("cartel-theme-2x");
      if (a4Raw) setThemeA4({ ...THEME_A4, ...JSON.parse(a4Raw) });
      if (x2Raw) setTheme2x({ ...THEME_2X, ...JSON.parse(x2Raw) });
    } catch {}
    const onFocus = () => {
      try {
        const a4Raw = localStorage.getItem("cartel-theme-a4");
        const x2Raw = localStorage.getItem("cartel-theme-2x");
        if (a4Raw) setThemeA4({ ...THEME_A4, ...JSON.parse(a4Raw) });
        if (x2Raw) setTheme2x({ ...THEME_2X, ...JSON.parse(x2Raw) });
      } catch {}
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (pinInput === PIN) {
      setUnlocked(true);
      localStorage.setItem("carteles_pin_ok", "1");
      setPinError("");
    } else setPinError("PIN incorrecto");
  }
  function handleLock() {
    setUnlocked(false);
    localStorage.removeItem("carteles_pin_ok");
    setPinInput("");
  }

  function toEditable(p: Producto): EditableProducto {
    return {
      id: p.id,
      descripcion: p.descripcion,
      unidades_por_bulto: p.unidades_por_bulto,
      precio_sur: p.precio_sur,
      precio_unidad_sur: p.precio_unidad_sur,
      editing: false,
    };
  }

  async function fetchByCodigos(codigosStr: string) {
    const trimmed = codigosStr.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/productos?codigos=${encodeURIComponent(trimmed)}`);
      const json = await res.json();
      const results: Array<{ input: string; found: boolean; item?: Producto; error?: string }> = json.results || [];
      const found = results.filter((r) => r.found && r.item).map((r) => toEditable(r.item!));
      const notFound = results.filter((r) => !r.found).map((r) => r.input);
      setItems((prev) => {
        const existing = new Set(prev.map((p) => p.id));
        const merged = [...prev];
        for (const f of found) if (!existing.has(f.id)) merged.push(f);
        return merged;
      });
      setNotFoundMsg(notFound);
      return found.length;
    } catch {
      setNotFoundMsg(["Error de red"]);
      return 0;
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const val = input.trim();
    if (!val) return;
    // Si tiene coma → lote directo
    if (val.includes(",")) {
      const added = await fetchByCodigos(val);
      if (added && added > 0) {
        setInput("");
        setShowDropdown(false);
      }
      return;
    }
    // Si es texto con letras, intentar vía dropdown ya; si no hay dropdown, forzar fetch exacto
    // Intentamos primero como código, si no encuentra probamos como búsqueda y tomamos primer hit
    const added = await fetchByCodigos(val);
    if (added && added > 0) {
      setInput("");
      setShowDropdown(false);
      setSearchResults([]);
    } else {
      // si no encontró por código, dejar que el dropdown de nombre quede visible para elegir
      // no limpiamos input para que el usuario elija
    }
  }

  // Autocomplete unificado
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const val = input.trim();
    // no mostrar si es lote con coma (el usuario está pegando varios)
    if (val.includes(",") || val.length < 1) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    // debounce 300ms
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/productos/search?q=${encodeURIComponent(val)}`);
        const json = await res.json();
        const hits: SearchHit[] = json.results || [];
        setSearchResults(hits);
        setShowDropdown(hits.length > 0);
      } catch {
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  async function selectSearch(id: number) {
    setShowDropdown(false);
    setSearchResults([]);
    setInput("");
    try {
      const res = await fetch(`/api/productos?codigos=${id}`);
      const json = await res.json();
      const r = json.results?.[0];
      if (r?.found && r.item) {
        setItems((prev) => (prev.some((p) => p.id === r.item.id) ? prev : [...prev, toEditable(r.item)]));
        setNotFoundMsg([]);
      }
    } catch {}
  }

  function updateItem(id: number, patch: Partial<EditableProducto>) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }
  function recalcUnidad(p: EditableProducto, nuevoPrecioSur?: number, nuevoUb?: number) {
    const precio = nuevoPrecioSur ?? p.precio_sur;
    const ub = nuevoUb ?? p.unidades_por_bulto;
    const safeUb = ub && ub > 0 ? ub : 1;
    return precio != null ? Math.round((precio / safeUb) * 100) / 100 : null;
  }
  function removeItem(id: number) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="min-h-screen">
      <header className="no-print bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/cachitologo.png" alt="Cachito y Jose" className="h-9 object-contain" onError={(e) => (e.currentTarget.style.display = "none")} />
            <div>
              <h1 className="font-black leading-none text-[15px] tracking-tight">CACHITO Y JOSE</h1>
              <p className="text-[11px] text-neutral-500 tracking-widest font-bold -mt-0.5">CARTELES DE PRECIOS</p>
            </div>
          </div>
          {unlocked && (
            <button onClick={handleLock} className="text-xs bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full font-medium">
              Bloquear
            </button>
          )}
        </div>
      </header>

      {!unlocked ? (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-2xl shadow-lg border no-print">
          <h2 className="font-bold text-lg">Ingresá el PIN</h2>
          <p className="text-sm text-neutral-500 mt-1">PIN de 4 dígitos para generar carteles.</p>
          <form onSubmit={handleUnlock} className="mt-5 flex gap-2">
            <input
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="••••"
              inputMode="numeric"
              className="flex-1 border-2 rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] font-black focus:outline-none focus:border-black"
              autoFocus
            />
            <button type="submit" className="bg-black text-white font-bold px-6 rounded-xl hover:bg-neutral-800">
              Entrar
            </button>
          </form>
          {pinError && <p className="text-sm text-red-600 mt-3 font-medium">{pinError}</p>}
        </div>
      ) : (
        <>
          <div className="max-w-6xl mx-auto px-4 py-6 no-print">
            <div className="bg-white rounded-2xl shadow-sm border p-5">
              {/* Buscador único — Opción A: label arriba, fila input+botones centrada */}
              <label className="text-xs font-bold tracking-widest text-neutral-500">BUSCADOR (código o nombre) — pegá varios separados por coma</label>
              <form onSubmit={handleSubmit} className="mt-1 flex flex-col md:flex-row gap-3 md:items-center">
                <div className="flex-1 relative min-w-0">
                  <div className="relative">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onFocus={() => {
                        if (searchResults.length > 0) setShowDropdown(true);
                      }}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                      placeholder="Ej: 37 · 7795176000307 · MARINARO · 37, 110, 119"
                      className="w-full border-2 rounded-xl px-4 py-3 text-base font-medium focus:outline-none focus:border-black pr-10"
                      autoComplete="off"
                    />
                    {searching && <span className="absolute right-3 top-3.5 text-xs text-neutral-400">buscando...</span>}
                  </div>
                  {/* Dropdown */}
                  {showDropdown && searchResults.length > 0 && (
                    <div className="absolute z-10 left-0 right-0 mt-1 bg-white border-2 border-black rounded-xl shadow-xl max-h-[320px] overflow-auto">
                      {searchResults.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onMouseDown={() => selectSearch(r.id)}
                          className="w-full text-left px-4 py-2.5 hover:bg-neutral-100 border-b last:border-0 flex justify-between items-center gap-3"
                        >
                          <span className="font-medium text-sm leading-tight">{r.descripcion}</span>
                          <span className="text-xs text-neutral-500 font-mono shrink-0">ID {r.id} · ${r.precio_sur?.toLocaleString("es-AR")}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button type="submit" disabled={loading} className="bg-black text-white font-black px-6 md:px-8 h-[46px] rounded-xl hover:bg-neutral-800 disabled:opacity-50 whitespace-nowrap">
                    {loading ? "Buscando..." : "Agregar"}
                  </button>
                  {items.length > 0 && (
                    <button type="button" onClick={() => window.print()} className="text-white font-black px-6 md:px-8 h-[46px] rounded-xl hover:brightness-90 whitespace-nowrap" style={{ backgroundColor: "#E31E24" }}>
                      Imprimir {items.length}
                    </button>
                  )}
                </div>
              </form>
              <p className="text-xs text-neutral-400 mt-1.5">Escribí <b>código</b> (con/sin ceros, barra) o <b>parte del nombre</b> y elegí. Para lote, pegá <b>37, 110, 119</b> y Enter.</p>

              <div className="flex gap-2 mt-3 flex-wrap items-center">
                <button onClick={() => setFormato("a4")} className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${formato === "a4" ? "bg-black text-white border-black" : "bg-white border-neutral-200"}`}>
                  A4 horizontal (1 por hoja)
                </button>
                <button onClick={() => setFormato("2x")} className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${formato === "2x" ? "bg-black text-white border-black" : "bg-white border-neutral-200"}`}>
                  2 por A4 (2 A5 horizontales)
                </button>
                {items.length > 0 && (
                  <button onClick={() => setItems([])} className="ml-auto text-xs bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-full font-medium">
                    Limpiar todo
                  </button>
                )}
              </div>

              {notFoundMsg.length > 0 && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-sm font-bold text-red-700">No encontrados:</p>
                  <ul className="text-sm text-red-600 list-disc ml-5">
                    {notFoundMsg.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}
              {items.length > 0 && <p className="text-xs text-neutral-500 mt-3">{items.length} producto(s) listos · editalos abajo antes de imprimir.</p>}
            </div>

            {items.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs font-bold tracking-widest text-neutral-500 mb-3">VISTA PREVIA — EDITABLE</h3>
                <div className="grid gap-6">
                  {items.map((it) => (
                    <div key={it.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                      <Cartel
                        id={it.id}
                        descripcion={it.descripcion}
                        unidadesPorBulto={it.unidades_por_bulto}
                        precioSur={it.precio_sur}
                        precioUnidadSur={it.precio_unidad_sur}
                        theme={formato === "a4" ? themeA4 : theme2x}
                        compact={formato === "2x"}
                        fullHeight={false}
                      />
                      <div className="border-t bg-neutral-50 px-4 py-3 flex flex-wrap gap-2 items-center justify-between">
                        <span className="text-xs font-bold tracking-widest text-neutral-500">EDITAR (solo impresión)</span>
                        <div className="flex gap-2">
                          <button onClick={() => updateItem(it.id, { editing: !it.editing })} className="text-xs bg-white border px-3 py-1.5 rounded-full font-bold hover:bg-neutral-100">
                            {it.editing ? "Cerrar" : "Editar"}
                          </button>
                          <button onClick={() => removeItem(it.id)} className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-full font-bold hover:bg-red-100">
                            Quitar
                          </button>
                        </div>
                      </div>
                      {it.editing && (
                        <div className="px-4 py-4 bg-neutral-50 border-t grid md:grid-cols-2 gap-4">
                          <label className="md:col-span-2">
                            <span className="text-xs font-bold text-neutral-600">Nombre / Descripción</span>
                            <input value={it.descripcion} onChange={(e) => updateItem(it.id, { descripcion: e.target.value.toUpperCase() })} className="mt-1 w-full border rounded-lg px-3 py-2 font-medium" />
                          </label>
                          <label>
                            <span className="text-xs font-bold text-neutral-600">Unidades por bulto</span>
                            <input
                              type="number"
                              min={1}
                              value={it.unidades_por_bulto}
                              onChange={(e) => {
                                const ub = parseInt(e.target.value || "1", 10);
                                const nuevo = Math.max(1, isNaN(ub) ? 1 : ub);
                                const nuevoUnidad = recalcUnidad(it, undefined, nuevo);
                                updateItem(it.id, { unidades_por_bulto: nuevo, precio_unidad_sur: nuevoUnidad });
                              }}
                              className="mt-1 w-full border rounded-lg px-3 py-2 font-medium"
                            />
                          </label>
                          <label>
                            <span className="text-xs font-bold text-neutral-600">Precio por bulto (SUR)</span>
                            <input
                              type="number"
                              step="0.01"
                              value={it.precio_sur}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value || "0");
                                const nuevo = isNaN(val) ? 0 : val;
                                const nuevoUnidad = recalcUnidad({ ...it, precio_sur: nuevo }, nuevo, undefined);
                                updateItem(it.id, { precio_sur: nuevo, precio_unidad_sur: nuevoUnidad });
                              }}
                              className="mt-1 w-full border rounded-lg px-3 py-2 font-medium"
                            />
                          </label>
                          <label className="md:col-span-2">
                            <span className="text-xs font-bold text-neutral-600">Precio por unidad (editable manual)</span>
                            <input
                              type="number"
                              step="0.01"
                              value={it.precio_unidad_sur ?? 0}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value || "0");
                                updateItem(it.id, { precio_unidad_sur: isNaN(val) ? 0 : Math.round(val * 100) / 100 });
                              }}
                              className="mt-1 w-full border rounded-lg px-3 py-2 font-medium"
                            />
                            <span className="text-[11px] text-neutral-400">Si cambiás bulto o unidades se recalcula; luego podés pisarlo.</span>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Área impresión — usa el theme guardado desde /preview */}
          <div className="print-area hidden">
            {formato === "a4" &&
              items.map((it) => (
                <div key={`p-a4-${it.id}`} className="print-page-a4">
                  <div className="print-cartel-wrapper">
                    <Cartel
                      id={it.id}
                      descripcion={it.descripcion}
                      unidadesPorBulto={it.unidades_por_bulto}
                      precioSur={it.precio_sur}
                      precioUnidadSur={it.precio_unidad_sur}
                      fullHeight
                      theme={themeA4}
                    />
                  </div>
                </div>
              ))}
            {formato === "2x" &&
              (() => {
                const pages: EditableProducto[][] = [];
                for (let i = 0; i < items.length; i += 2) pages.push(items.slice(i, i + 2));
                return pages.map((pageItems, pi) => (
                  <div key={`p-2x-${pi}`} className="print-page-2x">
                    {pageItems.map((it, idx) => (
                      <div key={it.id} className={`print-half ${idx === 0 ? "print-half-top" : ""}`}>
                        <div className="print-cartel-wrapper">
                          <Cartel
                            id={it.id}
                            descripcion={it.descripcion}
                            unidadesPorBulto={it.unidades_por_bulto}
                            precioSur={it.precio_sur}
                            precioUnidadSur={it.precio_unidad_sur}
                            compact
                            fullHeight
                            theme={theme2x}
                          />
                        </div>
                      </div>
                    ))}
                    {pageItems.length === 1 && <div className="print-half print-half-empty" />}
                  </div>
                ));
              })()}
          </div>

          <style>{`
            @media print {
              @page { size: ${formato === "a4" ? "A4 landscape" : "A4 portrait"}; margin: 0; }
              body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .no-print { display: none !important; }
              .print-area { display: block !important; }
              .print-page-a4 {
                width: 297mm; height: 210mm;
                padding: 6mm;
                box-sizing: border-box;
                break-after: page;
                display: flex;
                flex-direction: column;
              }
              .print-page-a4:last-child { break-after: auto; }
              .print-page-2x {
                width: 210mm; height: 297mm;
                box-sizing: border-box;
                break-after: page;
                display: flex;
                flex-direction: column;
                padding: 0;
              }
              .print-half {
                height: 148.5mm;
                padding: 6mm;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
              }
              .print-half-top { border-bottom: 1.5px dashed #888; }
              .print-half-empty { border-top: 1.5px dashed #ccc; }
              .print-cartel-wrapper { flex: 1; display: flex; min-height: 0; }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
