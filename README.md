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

## Rama de trabajo

El clon por defecto cae en `main`, que está **desactualizado**: no trae `README.md`, ni `prisma/migrations`, ni el script `db:seed`. Arrancar desde ahí deja Postgres vacío y termina en errores tipo Prisma `P2021` (tabla `items` inexistente).

**Desarrolla y arranca siempre desde `Develop`:**

```bash
git checkout Develop && git pull
```

Política de ramas: las features aterrizan en `Develop`; se promueven a `main` solo después de revisión.

## Requisitos

- Node.js 20+
- Docker (PostgreSQL local) o una URL de Postgres
- Cuentas opcionales de Cloudinary y Resend para fotos y correo (la app corre sin ellas)

## Arranque local

1. Checkout de `Develop` (si acabas de clonar, GitHub te deja en `main`):

```bash
git checkout Develop && git pull
```

2. Copia `.env.example` → `.env`. Genera un secreto y usa **el mismo valor** en `AUTH_SECRET` y `NEXTAUTH_SECRET`:

```bash
cp .env.example .env
# Genera un secreto: openssl rand -base64 32
# Usa el mismo valor en AUTH_SECRET y NEXTAUTH_SECRET
```

3. Levanta Postgres:

```bash
docker compose up -d
```

4. Instala dependencias, **crea las tablas** y siembra usuarios/ítem de demo:

```bash
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

- `npx prisma migrate deploy` debe crear las tablas (`User`, `Item`, etc.). Si ves `No migration found` o no existe la carpeta `prisma/migrations`, estás en una rama vieja: `git checkout Develop && git pull`.
- `npm run db:seed` es obligatorio en el primer arranque. Sin seed, Postgres queda vacío (sin cuentas de vigilancia/Bienestar ni ítem de ejemplo).
- Un `P2021` (tabla `items` no existe) significa que no corriste `migrate deploy` o que tu checkout no trae migraciones.

La app queda en [http://localhost:3000](http://localhost:3000).

**No ejecutes `npm audit fix --force` por costumbre.** Los avisos de `npm audit` no bloquean el arranque; `--force` puede romper Next.js, Auth.js u otras dependencias.

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
