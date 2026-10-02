import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

function normalizeCode(raw: string): string {
  return raw.trim().replace(/^0+/, "") || "0";
}

export async function GET(req: NextRequest) {
  const codigosParam = req.nextUrl.searchParams.get("codigos") || req.nextUrl.searchParams.get("codigo") || "";
  if (!codigosParam.trim()) {
    return NextResponse.json({ error: "Falta parámetro codigos" }, { status: 400 });
  }

  const rawCodes = codigosParam
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean)
    .slice(0, 20); // límite 20 carteles por tanda

  const supabase = getServiceSupabase();
  const results: Array<{
    input: string;
    found: boolean;
    item?: {
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
    error?: string;
  }> = [];

  for (const raw of rawCodes) {
    const normalized = normalizeCode(raw);
    const asNumber = Number.parseInt(normalized, 10);
    const isNumeric = !Number.isNaN(asNumber);

    let data: unknown = null;
    let fetchError: string | null = null;

    // Estrategia: 1) id exacto, 2) id normalizado, 3) codigo_barra, 4) codigo_barra_unidad, 5) ilike descripcion si no es numérico
    if (isNumeric) {
      // id exacto
      const { data: byId, error } = await supabase
        .from("catalogo")
        .select("id, descripcion, descripcion_detallada, codigo_barra, codigo_barra_unidad, unidades_por_bulto, precio_sur, precio_norte")
        .eq("id", asNumber)
        .maybeSingle();

      if (byId) {
        data = byId;
      } else if (error) {
        fetchError = error.message;
      } else {
        // probar codigo_barra
        const { data: byBarra } = await supabase
          .from("catalogo")
          .select("id, descripcion, descripcion_detallada, codigo_barra, codigo_barra_unidad, unidades_por_bulto, precio_sur, precio_norte")
          .or(`codigo_barra.eq.${raw.trim()},codigo_barra_unidad.eq.${raw.trim()}`)
          .maybeSingle();
        if (byBarra) data = byBarra;
      }
    } else {
      // no numérico: buscar por código de barras literal
      const { data: byBarra } = await supabase
        .from("catalogo")
        .select("id, descripcion, descripcion_detallada, codigo_barra, codigo_barra_unidad, unidades_por_bulto, precio_sur, precio_norte")
        .or(`codigo_barra.eq.${raw.trim()},codigo_barra_unidad.eq.${raw.trim()}`)
        .maybeSingle();
      if (byBarra) data = byBarra;
    }

    // Fallback: tolerancia con ilike por si id viene con caracteres raros -> buscar últimos dígitos
    if (!data && isNumeric) {
      // buscar por id con like sin ceros (por si el supabase id tiene formato distinto)
      const { data: byLike } = await supabase
        .from("catalogo")
        .select("id, descripcion, descripcion_detallada, codigo_barra, codigo_barra_unidad, unidades_por_bulto, precio_sur, precio_norte")
        .eq("id", asNumber)
        .maybeSingle();
      if (byLike) data = byLike;
    }

    if (data) {
      const row = data as {
        id: number;
        descripcion: string;
        descripcion_detallada: string;
        codigo_barra: string;
        codigo_barra_unidad: string;
        unidades_por_bulto: number;
        precio_sur: number;
        precio_norte: number;
      };
      const ub = row.unidades_por_bulto && row.unidades_por_bulto > 0 ? row.unidades_por_bulto : 1;
      results.push({
        input: raw,
        found: true,
        item: {
          ...row,
          precio_unidad_sur: row.precio_sur != null ? Math.round((row.precio_sur / ub) * 100) / 100 : null,
          precio_unidad_norte: row.precio_norte != null ? Math.round((row.precio_norte / ub) * 100) / 100 : null,
        },
      });
    } else {
      results.push({
        input: raw,
        found: false,
        error: fetchError || `No se encontró producto para "${raw}"`,
      });
    }
  }

  return NextResponse.json({ results });
}
