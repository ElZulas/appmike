# SuperSocio (nombre temporal)

## 1. Plataforma: Web y móvil **separados** (dos clientes)

El producto cubre **web** y **móvil** con **bases de código distintas**, compartiendo la misma **API Node** y reglas de negocio en servidor.

### Superficies

| Superficie | Stack | Carpeta |
|------------|--------|---------|
| **Web** | **Next.js** (React) + TypeScript + Tailwind | `web/` |
| **API** | **Node.js** + **Express** + TypeScript | `api/` |
| **Móvil** | **Flutter** solo **iOS / Android** (sin Flutter Web) | `mobile/` |

### Desarrollo local

1. **Firestore**: crea la BD y credenciales según `firebase/README.md`; luego `cd api && npm run check:firestore && npm run seed`.
2. API: `cd api && npm install && npm run dev` → `http://localhost:4000` (health: `GET /health`, catálogo: `GET /v1/catalog/products`).
3. Web: copia `web/.env.example` a `web/.env.local` y ajusta `API_BASE_URL` si hace falta → `cd web && npm install && npm run dev` → `http://localhost:3000` (landing `/`, tienda `/app`).
4. Móvil: `cd mobile && flutter pub get && flutter run` (dispositivo o emulador).

### Deploy (orientación)

Guía paso a paso (gratis): **`docs/DESPLIEGUE_RENDER_VERCEL.md`**

| Pieza | Opciones típicas |
|-------|------------------|
| **Next (web)** | **Vercel** (recomendado), Netlify, Cloudflare Pages |
| **API Express** | **Render** (recomendado), Railway, Fly.io, VPS |
| **Móvil** | Stores (Google Play / App Store) con builds `flutter build apk` / `ipa` |

Variables importantes: **`CORS_ORIGIN`** en la API (orígenes del front en producción, separados por coma); **`API_BASE_URL`** en el entorno de build/runtime de Next apuntando a la API pública.

### Alcance funcional (web y móvil)

- **Cliente**: catálogo textual (top sellers), carrito, pre-autorización de sustitutos, checkout, seguimiento de pedido.
- **Repartidor / socio**: aceptar órdenes, confirmar disponibilidad, **registrar precio final vía ticket** (foto o datos en MVP), actualizar estado del envío.
- **Admin** (opcional en MVP): alta manual de productos (~100 ítems), comisiones, geocercas básicas.

### Principios (todas las superficies)

- **Anti-scraping**: catálogo propio, descripciones e iconografía genérica; no HTML ni fotos de catálogos de terceros.
- **Mandado legal**: la app vende **servicio de compra y entrega**; contrato usuario–repartidor; precio de referencia vs **precio validado en caja** (ticket).
- **Transparencia**: precio base estimado + comisión de servicio **desglosada**; ajuste al confirmar ticket.
- **Sustitución**: el cliente pre-autoriza sustituto o cancelación del ítem ante falta de stock.
- **Geocercas**: disponibilidad y costo de envío según ubicación vs sucursal más cercana (Mérida y clubes de referencia en el brief).

---

## 2. Descripción general (plataforma)

Plataforma de logística de última milla y **Personal Shopping**: usuarios adquieren productos de clubes de precios (Costco, Sam's Club, City Market, etc.) **sin membresía propia** y sin ir a la sucursal. Especialización: eficiencia, transparencia de precios y velocidad de entrega.

### Propuesta de valor

- **Acceso universal**: el cliente compra vía la infraestructura del socio (repartidor).
- **Minimalismo eficiente**: catálogo basado en texto y datos precisos, carga rápida y bajo consumo de datos.
- **Sincronización inteligente (evolución)**: el MVP prioriza **datos de campo + ticket**, no scraping de sitios oficiales.

---

## 3. Reglas de negocio (backend)

1. **Transparencia de precios**: precio base (estimado de tienda) + comisión de servicio desglosada.
2. **Sustitución**: sin stock → cliente ya definió sustituto o cancelación del ítem.
3. **Geocercas**: productos disponibles y costo de envío según usuario vs sucursal más cercana.
4. **Catálogo independiente (MVP)**: productos manuales (top sellers), descripciones propias, iconos genéricos.
5. **Validación por ticket**: precio final al escanear / registrar ticket; el sistema ajusta diferencias entre estimado y real de caja.
6. **Membresía**: el repartidor usa su membresía (ideal negocio); reventa del producto físico ya adquirido según marco legal aplicable.

---

## 4. Identidad visual (UI)

- Estilo **data-driven**: tarjetas limpias, tipografía legible sans-serif, acentos para ofertas y disponibilidad.
- **Iconografía**: sistema de iconos (Material / Cupertino / Lucide en web) para categorías, evitando fotos de producto de terceros.

---

## 5. Estrategia de datos (“anti-scraping”)

- **MVP**: ~100 productos más comunes (ej. Costco Mérida).
- **Actualización**: tras cada orden, el repartidor confirma si el precio sigue igual → base de datos propia y defendible.

---

## 6. Glosario rápido

| Término | Significado |
|---------|-------------|
| Socio / repartidor | Quien compra con su membresía y entrega |
| Precio estimado | Del catálogo interno antes de caja |
| Precio validado | Derivado del ticket físico |
| Delta | Diferencia a cobrar o reembolsar tras validación |

---

*Web en `web/` + API en `api/` + app móvil en `mobile/`.*
