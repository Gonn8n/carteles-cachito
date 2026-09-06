import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const qRaw = (req.nextUrl.searchParams.get("q") || "").trim();
  if (qRaw.length < 1) {
    return NextResponse.json({ results: [] });
  }

  const supabase = getServiceSupabase();

  // Si es lote con coma, no usamos autocomplete
  if (qRaw.includes(",")) {
    return NextResponse.json({ results: [] });
  }

  const q = qRaw;
  const isNumeric = /^\d+$/.test(q.replace(/^0+/, "") || "0") && /^\d+$/.test(q.trim());

  let exactMatches: Array<{ id: number; descripcion: string; unidades_por_bulto: number; precio_sur: number; precio_norte: number }> = [];

  if (isNumeric) {
    const normalized = q.replace(/^0+/, "") || "0";
    const asNum = Number.parseInt(normalized, 10);
    if (!Number.isNaN(asNum)) {
      const { data } = await supabase
        .from("catalogo")
        .select("id, descripcion, unidades_por_bulto, precio_sur, precio_norte")
        .or(`id.eq.${asNum},codigo_barra.eq.${q.trim()},codigo_barra_unidad.eq.${q.trim()}`)
        .limit(5);
      if (data) exactMatches = data as typeof exactMatches;
    }
  }

  // Búsqueda por descripcion (siempre, para texto y también para numéricos como fallback)
  const { data: likeData, error } = await supabase
    .from("catalogo")
    .select("id, descripcion, unidades_por_bulto, precio_sur, precio_norte")
    .ilike("descripcion", `%${q}%`)
    .order("descripcion", { ascending: true })
    .limit(15);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Merge exactos primero, sin duplicados
  const seen = new Set<number>();
  const merged: typeof likeData = [];
  for (const e of exactMatches) {
    if (!seen.has(e.id)) {
      seen.add(e.id);
      merged.push(e as unknown as (typeof likeData)[number]);
    }
  }
  for (const r of likeData || []) {
    const row = r as { id: number };
    if (!seen.has(row.id)) {
      seen.add(row.id);
      merged.push(r);
    }
  }

  const results = merged.slice(0, 15).map((row: { id: number; descripcion: string; unidades_por_bulto: number; precio_sur: number; precio_norte: number }) => {
    const ub = row.unidades_por_bulto && row.unidades_por_bulto > 0 ? row.unidades_por_bulto : 1;
    return {
      ...row,
      precio_unidad_sur: row.precio_sur != null ? Math.round((row.precio_sur / ub) * 100) / 100 : null,
    };
  });

  return NextResponse.json({ results });
}
