# SuperSocio (Flutter)

App móvil iOS/Android del mismo producto que `web/` y `api/`.

## Importante: celular ≠ PC

Un APK **no puede** hablar con `localhost` ni `10.0.2.2` (eso solo sirve en emulador o con la API en tu PC en la misma red). Para que funcione en **cualquier celular con internet**, la API debe estar **desplegada en internet** (Render, Railway, Fly.io, VPS, etc.).

## Desarrollo local

1. API en tu PC: `cd api && npm run dev` → `http://localhost:4000`
2. `flutter pub get`
3. Emulador Android:

```bash
flutter run --dart-define-from-file=dart_defines/dev.json
```

4. Dispositivo físico en la misma Wi‑Fi (solo pruebas): usa la IP de tu PC, no `10.0.2.2`:

```bash
flutter run --dart-define=API_BASE_URL=http://192.168.x.x:4000
```

## APK para cualquier celular

### Opción A — URL embebida al compilar (recomendado para distribución)

1. Despliega la API (ver `api/render.yaml` y variables en `api/.env.example`).
2. Copia `dart_defines/prod.json.example` → `dart_defines/prod.json`.
3. Pon tu URL pública, por ejemplo `https://super-socio-api.onrender.com`.
4. Compila:

```powershell
cd mobile
.\scripts\build-apk.ps1
```

APK: `build/app/outputs/flutter-apk/app-release.apk`

### Opción B — Primera apertura (sin recompilar)

Si instalas un APK **sin** `prod.json`, al abrir la app pide la URL pública de la API, la prueba con `GET /health` y la guarda en el teléfono. Mantén pulsado «App en beta · Mérida» en la bienvenida para cambiarla después.

## Pantallas

- **Configurar servidor** — solo si no hay URL guardada ni embebida.
- **Bienvenida** (`/`) — landing, CTA al catálogo.
- **Catálogo** (`/catalog`) — `GET /v1/catalog/products`, carrito en `shared_preferences`.

Auth y checkout contra la API (Firebase + pedidos) van en la siguiente iteración.
