# Carteles Cachito y Jose

Generador de carteles de precios para impresión — 1 bloque para cargar código(s) y traer datos desde Supabase `catalogo`.

## Características
- Input único: código(s) separados por coma (soporta ID con/sin ceros, o código de barras)
- Trae: `descripcion`, `unidades_por_bulto`, `precio_sur` (referencia), calcula `precio por unidad = precio_sur / unidades_por_bulto`
- 2 formatos de impresión:
  - **A4 horizontal (1 por hoja)** — cartel grande full
  - **2 por A4 horizontal (arriba/abajo)** — dos carteles por hoja con línea punteada para cortar
- PIN 4 dígitos (default `2580`, configurable en `.env`)
- Batch: hasta 20 códigos por tanda (`37, 110, 119`)

## Stack
Next.js 16.3 + React 19 + Tailwind 4 + Supabase JS. Usa tabla `catalogo` (1265 productos) en `wgaspejdsjcspmlwvvzq.supabase.co`.

## Setup local
```bash
cd carteles-cachito
npm install
# .env.local ya configurado (ver .env.example)
# Reemplazar public/cachitologo.png por el logo real (ya hay placeholder)
npm run dev    # http://localhost:3001
npm run build && npm run start # prod
```

## Variables de entorno (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://wgaspejdsjcspmlwvvzq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
CARTEL_PIN=2580
NEXT_PUBLIC_CARTEL_PIN=2580
```

## Deploy Vercel
1. `git init` + push a GitHub `carteles-cachito`
2. Vercel → Import Project → set env vars
3. Deploy. No requiere configuración extra (standalone).

## Uso
1. Abrir `http://localhost:3001` o URL de Vercel
2. Ingresar PIN 2580 → Desbloquea
3. Cargar códigos: `37, 0110, 7795176000307` → Buscar
4. Elegir formato A4 o 2x
5. Imprimir (Ctrl+P) — en vista impresión solo aparecen los carteles, con @page A4 landscape.
6. Bloquear si se deja la PC compartida.

## Logo
Colocar archivo `public/cachitologo.png` (recomendado 400x200px PNG transparente). El componente hace fallback si falta.

## API
`GET /api/productos?codigos=37,110`
→ `{ results: [{ input, found, item: { id, descripcion, unidades_por_bulto, precio_sur, precio_unidad_sur } }] }`

## Notas
- Precio de referencia: SUR (norte casi idéntico, diff 0.01 en algunos).
- Tolerancia: trim + strip leading zeros + match id numérico o codigo_barra exacto.
- `unidades_por_bulto` nulo/0 → fallback 1.
