# Despliegue gratis: API en Render + Web en Vercel

SuperSocio tiene **tres piezas**:


| Pieza                  | Dónde vive                                     | Variables                       |
| ---------------------- | ---------------------------------------------- | ------------------------------- |
| **Catálogo y pedidos** | Firebase Firestore (insertas productos a mano) | Credenciales en la **API**      |
| **API** (`api/`)       | **Render** (gratis)                            | `api/.env` → panel Render       |
| **Web** (`web/`)       | **Vercel** (gratis)                            | `web/.env.local` → panel Vercel |
| **Móvil**              | APK en el teléfono                             | URL pública de la API en Render |


No subas `.env`, `.env.local` ni el JSON `*-firebase-adminsdk-*.json` a GitHub.

---

## 0. Archivos `.env` en tu PC

### API — `api/.env`

Si **ya tienes** `api/.env`, déjalo. Si no:

```bash
cd api
cp .env.example .env
```

Rellena según la tabla [Dónde encontrar cada variable](#dónde-encontrar-cada-variable).

### Web — `web/.env.local`

```bash
cd web
cp .env.local.example .env.local
```

Rellena Firebase web y (opcional) PayPal. Para desarrollo local, `API_BASE_URL=http://127.0.0.1:4000`.

### Catálogo (Firestore)

El catálogo **no** sale de Costco ni de la web: lo cargas tú.

```bash
cd api
npm install
npm run check:firestore
npm run seed
```

Después puedes editar productos en [Firebase Console](https://console.firebase.google.com/) → **appmike** → Firestore → colección `products`.

---

## Dónde encontrar cada variable

### Firebase (proyecto **appmike**)


| Variable                         | Dónde obtenerla                                                                                                                                                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GOOGLE_APPLICATION_CREDENTIALS` | [Firebase Console](https://console.firebase.google.com/) → **appmike** → ⚙ **Configuración del proyecto** → **Cuentas de servicio** → **Generar nueva clave privada** → guarda el `.json` en `api/` y pon la ruta en `.env` |
| `FIREBASE_PROJECT_ID`            | Dentro del JSON: campo `project_id` (o `appmike`)                                                                                                                                                                           |
| `FIREBASE_CLIENT_EMAIL`          | Dentro del JSON: `client_email`                                                                                                                                                                                             |
| `FIREBASE_PRIVATE_KEY`           | Dentro del JSON: `private_key` (en Render va en **una línea** con `\n`; usa `npm run env:firebase` en `api/`)                                                                                                               |
| `NEXT_PUBLIC_FIREBASE_`* (web)   | Misma consola → ⚙ → **Tus apps** → app **Web** → bloque `firebaseConfig` (apiKey, authDomain, etc.)                                                                                                                         |


Más detalle: `firebase/README.md`.

### PayPal (opcional, sandbox)


| Variable                                    | Dónde                                                                                                                       |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | [PayPal Developer](https://developer.paypal.com/dashboard/applications) → pestaña **Sandbox** → tu app → Client ID y Secret |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID`              | **El mismo** Client ID que en la API (es público en el navegador)                                                           |
| `PAYPAL_MODE` / `NEXT_PUBLIC_PAYPAL_MODE`   | `sandbox` mientras pruebas                                                                                                  |


### URLs (las defines **después** de crear Render y Vercel)


| Variable                                          | Valor local                                   | Valor producción                                  |
| ------------------------------------------------- | --------------------------------------------- | ------------------------------------------------- |
| `API_PUBLIC_URL`                                  | `http://localhost:4000`                       | `https://TU-SERVICIO.onrender.com`                |
| `WEB_PUBLIC_URL`                                  | `http://localhost:3000`                       | `https://TU-APP.vercel.app`                       |
| `CORS_ORIGIN`                                     | `http://localhost:3000,http://127.0.0.1:3000` | URL de Vercel + localhost si sigues desarrollando |
| `API_BASE_URL` / `NEXT_PUBLIC_API_BASE_URL` (web) | `http://127.0.0.1:4000`                       | Misma URL de Render que arriba                    |


---

## 1. Subir el repo a GitHub

Render y Vercel despliegan desde Git. Si aún no está en GitHub:

1. Crea un repositorio en GitHub.
2. Sube el monorepo **AppMike** (sin `api/.env`, sin `web/.env.local`, sin `*-firebase-adminsdk-*.json`).

---

## 2. API en Render (gratis)

### Crear el servicio

1. Entra en [render.com](https://render.com) → **Sign up** (cuenta gratis).
2. **New +** → **Web Service**.
3. Conecta tu repositorio de GitHub.
4. Configuración:


| Campo              | Valor                                |
| ------------------ | ------------------------------------ |
| **Name**           | `super-socio-api` (o el que quieras) |
| **Region**         | El más cercano (ej. Oregon)          |
| **Branch**         | `main`                               |
| **Root Directory** | `api`                                |
| **Runtime**        | Node                                 |
| **Build Command**  | `npm install && npm run build`       |
| **Start Command**  | `npm start`                          |
| **Instance Type**  | **Free**                             |


1. **Advanced** → **Health Check Path**: `/health`

También puedes usar el Blueprint: en el repo está `api/render.yaml` (Render → **New** → **Blueprint**).

### Variables de entorno en Render

En el servicio → **Environment** → añade (sustituye URLs cuando tengas Vercel):

```env
NODE_VERSION=20
PORT=10000

# Firebase: abre api/appmike-firebase-adminsdk-....json en tu PC, copia TODO el archivo
# y pégalo en una línea como valor de (en Render marca "Secret"):
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}

CORS_ORIGIN=https://TU-APP.vercel.app,http://localhost:3000
# (La API también acepta cualquier https://*.vercel.app automáticamente.)
WEB_PUBLIC_URL=https://TU-APP.vercel.app
API_PUBLIC_URL=https://TU-SERVICIO.onrender.com

PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox
```

**No** uses `GOOGLE_APPLICATION_CREDENTIALS` en Render. Copia el **JSON completo** de `api/appmike-firebase-adminsdk-....json` en la variable **`FIREBASE_SERVICE_ACCOUNT_JSON`** (todo en una línea, tipo Secret).

Alternativa: tres variables `FIREBASE_*` con `npm run env:firebase` en `api/`.

### Desplegar y probar

1. **Create Web Service** / **Deploy**.
2. Espera el build (varios minutos la primera vez).
3. Abre `https://TU-SERVICIO.onrender.com/health` → debe verse `{"ok":true,...}`.

**Nota:** el plan free **se duerme**; la primera petición tras inactividad puede tardar ~30–60 s.

### Seed en producción

Desde tu PC (con `api/.env` local apuntando al mismo Firebase):

```bash
cd api
npm run seed
```

Los productos quedan en Firestore; Render solo lee.

---

## 3. Web en Vercel (gratis)

### Crear el proyecto

1. [vercel.com](https://vercel.com) → **Sign up** → conectar GitHub.
2. **Add New…** → **Project** → importa el mismo repo.
3. Configuración:


| Campo                | Valor                      |
| -------------------- | -------------------------- |
| **Framework Preset** | Next.js                    |
| **Root Directory**   | `web`                      |
| **Build Command**    | (por defecto `next build`) |
| **Output**           | (automático)               |


### Variables en Vercel

**Settings** → **Environment Variables** (Production, Preview y Development si quieres):

```env
API_BASE_URL=https://TU-SERVICIO.onrender.com
NEXT_PUBLIC_API_BASE_URL=https://TU-SERVICIO.onrender.com

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=appmike.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=appmike
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=appmike.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
NEXT_PUBLIC_PAYPAL_MODE=sandbox
```

1. **Deploy**.
2. Copia la URL: `https://TU-APP.vercel.app`.

### Volver a Render y actualizar CORS

En Render → Environment:

- `CORS_ORIGIN` = `https://TU-APP.vercel.app,http://localhost:3000`
- `WEB_PUBLIC_URL` = `https://TU-APP.vercel.app`

Guarda y **Redeploy** la API si hace falta.

---

## 4. Móvil (APK)

Cuando la API en Render responda en `/health`:

**Opción A — URL al compilar**

```bash
cd mobile
# dart_defines/prod.json con: "API_BASE_URL": "https://TU-SERVICIO.onrender.com"
.\scripts\build-apk.ps1
```

**Opción B — Sin recompilar**

Instala el APK → pantalla **Conectar servidor** → pega `https://TU-SERVICIO.onrender.com`.

---

## 5. Checklist final

- Firestore creado en Firebase + reglas desplegadas (`firebase/README.md`)
- `api/.env` local con Firebase (y PayPal si aplica)
- `npm run seed` ejecutado (catálogo en `products`)
- Render: API en `/health` OK
- Vercel: web carga y catálogo en `/app` (llama a la API)
- `CORS_ORIGIN` en Render incluye la URL de Vercel
- Móvil apunta a la URL de Render

---

## Resumen de coste


| Servicio                    | Plan  | Coste                |
| --------------------------- | ----- | -------------------- |
| Render (API)                | Free  | $0                   |
| Vercel (web)                | Hobby | $0                   |
| Firebase (Firestore + Auth) | Spark | $0 dentro de límites |


---

## Problemas frecuentes


| Síntoma                    | Solución                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| Web sin productos          | Revisa `NEXT_PUBLIC_API_BASE_URL` en Vercel y que Render no esté dormido (espera y recarga) |
| Error CORS en el navegador | Añade la URL exacta de Vercel en `CORS_ORIGIN` de Render                                    |
| `UNAUTHENTICATED` en API   | Regenera clave Firebase o revisa `FIREBASE_`* en Render                                     |
| Catálogo vacío             | Ejecuta `npm run seed` y revisa colección `products` en Firestore                           |
| Móvil no conecta           | Usa `https://...onrender.com`, no `localhost` ni IP de tu PC                                |


