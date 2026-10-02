import { createClient } from "@supabase/supabase-js";

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anon);
}

export function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export interface CatalogoItem {
  id: number;
  descripcion: string;
  descripcion_detallada: string;
  codigo_barra: string;
  codigo_barra_unidad: string;
  unidades_por_bulto: number;
  bultos_por_pallet: number;
  precio_sur: number;
  precio_norte: number;
  updated_at: string;
}
