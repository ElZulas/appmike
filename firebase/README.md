# Firestore — SuperSocio (proyecto `appmike`)

La API Node es la **única** que escribe en Firestore (Firebase Admin). Web y móvil usan **Firebase Auth** + la API REST.

## 1. Consola Firebase (una vez)

1. [Firebase Console](https://console.firebase.google.com/) → proyecto **appmike**.
2. **Firestore Database** → **Crear base de datos** → modo **Producción** (las reglas del repo bloquean acceso directo desde clientes).
3. Ubicación recomendada: `nam5` (multi-región) o la más cercana a Mérida.
4. **Authentication** → **Sign-in method** → activar **Correo/contraseña** (y Google si lo quieres después).
5. **Configuración del proyecto** → **Cuentas de servicio** → **Generar nueva clave privada** → guarda el JSON en `api/` (no lo subas a git).

## 2. Variables locales

**API** (`api/.env`):

```env
GOOGLE_APPLICATION_CREDENTIALS=./appmike-firebase-adminsdk-xxxxx.json
```

**Web** (`web/.env.local` desde `web/.env.example`):

- Copia las claves de **Configuración** → **Tus apps** → app web.

## 3. Reglas e índices (CLI opcional)

```bash
npm install -g firebase-tools
firebase login
cd AppMike
firebase deploy --only firestore
```

## 4. Poblar catálogo (seed)

```bash
cd api
npm install
npm run check:firestore   # prueba conexión
npm run seed              # 12 productos en colección `products`
```

## Colecciones

| Colección   | ID documento      | Quién escribe      |
|------------|-------------------|--------------------|
| `products` | id del producto   | Admin / `npm run seed` |
| `users`    | `uid` de Auth     | API al editar perfil |
| `orders`   | auto              | API al crear pedido |

### `products`

`name`, `shortDescription`, `categoryIcon`, `storePriceMxn`, `serviceFeeRate`, `available`, `highlightOffer`, `active`, `updatedAt`

### `users`

`email`, `phone`, `deliveryAddress`, `displayName`, `settings` (`theme`, `notificationsEnabled`), `createdAt`, `updatedAt`

### `orders`

`userId`, `customerEmail`, `customerPhone`, `deliveryAddress`, `items[]`, totales, `paymentStatus`, `fullyPaid`, PayPal, `delivered`, timestamps.

## Si falla el seed

| Error | Qué hacer |
|-------|-----------|
| `UNAUTHENTICATED` | Genera **nueva** clave de cuenta de servicio; la anterior pudo revocarse. |
| `NOT_FOUND` / API disabled | Crea Firestore en la consola (paso 1). |
| `PERMISSION_DENIED` | Cuenta de servicio debe tener rol **Firebase Admin SDK Administrator Service Agent** o **Editor** en IAM. |
