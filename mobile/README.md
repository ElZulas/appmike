# Club Peninsular Express (Flutter)

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
2. (Opcional) Copia `dart_defines/prod.json.example` → `dart_defines/prod.json` si quieres otra URL.
3. Por defecto el APK usa `https://super-socio-api.onrender.com` (Render).
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
- **Bienvenida** (`/`) — landing, CTA al catálogo e **Iniciar sesión** (Firebase nativo).
- **Auth** (`/auth`) — correo/contraseña, registro con celular (misma API que la web).
- **Perfil** (`/profile`) — datos de `GET /v1/users/me`, cerrar sesión, enlace a pedidos en la web.
- **Catálogo** (`/catalog`) — `GET /v1/catalog/products`, carrito en `shared_preferences`.

**Firebase Android:** `android/app/google-services.json` y `lib/firebase_options.dart` (generados con FlutterFire). Si cambias el proyecto, ejecuta:

```powershell
dart pub global run flutterfire_cli:flutterfire configure --project=appmike --platforms=android
```

El catálogo no requiere sesión. Pagar y confirmar pedidos sigue en la web con la misma cuenta.
