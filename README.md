# UniFind

Sistema de objetos perdidos de **Universidad Libre Seccional Barranquilla**.

Los estudiantes consultan un catálogo genérico (sin fotos) y reclaman por correo. La portería/vigilancia registra objetos, genera QR, revisa reclamos y entrega con firma digital. Bienestar Universitario (SUPERUSER) consulta métricas y el reporte de donación.

## Roles

| Rol | Quién | Acceso |
| --- | --- | --- |
| `STUDENT` | Comunidad universitaria | Catálogo público y formulario de reclamo |
| `ADMIN` | Vigilante / portería | `/admin/dashboard`: registro, QR, estante, reclamos, entrega + firma |
| `SUPERUSER` | Bienestar Universitario | `/bienestar`: métricas y objetos listos para donación |

## Privacidad del catálogo público

El listado público solo expone:

- categoría genérica
- fecha y hora del hallazgo
- bloque / salón
- portería de custodia

No se envían fotos, URLs de Cloudinary, código QR ni ubicación de estante. Las imágenes se cargan como `authenticated` y, en el panel de vigilancia, se firman solo en el servidor.

## Ciclo de vida

`EN_BODEGA` → `ENTREGADO` (entrega presencial con firma) o `LISTO_PARA_DONACION` (cron tras 30 días de custodia).

## Stack

Next.js 15 (App Router), React 19, TypeScript, Prisma, PostgreSQL, Auth.js v5, Tailwind CSS 4, Cloudinary, Resend.

## Requisitos

- Node.js 20+
- Docker (PostgreSQL local) o una URL de Postgres
- Cuentas opcionales de Cloudinary y Resend para fotos y correo

## Arranque local

```bash
cp .env.example .env
# Genera un secreto: openssl rand -base64 32
# Usa el mismo valor en AUTH_SECRET y NEXTAUTH_SECRET
```

Levanta Postgres:

```bash
docker compose up -d
```

Instala, migra y siembra usuarios de demo:

```bash
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

La app queda en [http://localhost:3000](http://localhost:3000).

### Usuarios de desarrollo (solo seed)

| Correo | Contraseña | Rol |
| --- | --- | --- |
| `vigilancia@unilibre.edu.co` | `UniFindAdmin123!` | ADMIN |
| `bienestar@unilibre.edu.co` | `UniFindBienestar123!` | SUPERUSER |

Cambia estas claves antes de cualquier despliegue real.

## Scripts

| Script | Uso |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Servidor de producción |
| `npm run db:migrate` | Migraciones en desarrollo |
| `npm run db:seed` | Usuarios e ítem de ejemplo |
| `npm run db:studio` | Prisma Studio |

`postinstall` ejecuta `prisma generate`.

## Variables de entorno

Copia `.env.example`. Las únicas obligatorias para correr autenticación y el catálogo son:

- `DATABASE_URL`
- `AUTH_SECRET` (y `NEXTAUTH_SECRET` con el mismo valor)

Bloqueos solo por entorno:

- Sin Cloudinary, el registro de objetos funciona y la foto se omite.
- Sin Resend, el reclamo se guarda y el correo se omite (queda en logs).
- Sin `CRON_SECRET`, la ruta `/api/cron/check-expiration` responde 401.

### Cloudinary (fotos privadas)

Opcional. Si configuras las tres variables, vigilancia puede adjuntar una foto al registrar un objeto:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Las fotos se suben con tipo `authenticated` a la carpeta `unifind_private_items`. El catálogo público nunca selecciona ni renderiza esas URLs. En `/admin/dashboard` el servidor firma un enlace temporal (`getSignedPrivateImageUrl`) solo para el personal autenticado.

Si las variables faltan, son placeholders de `.env.example` o están incompletas, el objeto se guarda igual y aparece un aviso. Credenciales inválidas no impiden el registro: la foto se omite con un error claro.

## Cron de retención

`GET /api/cron/check-expiration` con `Authorization: Bearer $CRON_SECRET` pasa a `LISTO_PARA_DONACION` los objetos en bodega con más de 30 días.

En Vercel, `vercel.json` programa esa ruta a las 06:00 UTC. Configura `CRON_SECRET` en el proyecto.

## Rutas

- `/` catálogo público
- `/login` y `/unauthorized`
- `/api/auth/[...nextauth]` Auth.js
- `/dashboard` redirige según rol
- `/admin/dashboard` vigilancia
- `/bienestar` métricas SUPERUSER
- `/api/cron/check-expiration` retención

## Docker (solo base de datos)

Ver también `DOCKER_INSTRUCTIONS.md`.

```bash
docker compose up -d      # postgres:16 en el puerto 5432
docker compose down       # detener
docker compose down -v    # borrar volumen
```
