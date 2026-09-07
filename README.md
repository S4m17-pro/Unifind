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

## Organización del backend

| Área | Dónde |
| --- | --- |
| Auth.js (Node: Credentials + Entra opcional) | `src/auth.ts` |
| Auth edge-safe (middleware, sin Prisma) | `src/auth.config.ts` |
| Server actions (entrada UI) | `src/actions/*.actions.ts` |
| Resultado uniforme `{ error }` / `{ success: true }` | `src/lib/action-result.ts` |
| Authz (`requireSession`, `requireRole`, `requireStaffSession`) | `src/lib/auth/guards.ts` |
| Microsoft Entra (env, issuer, allowlist, provider) | `src/lib/auth/microsoft.ts` |
| Usuarios (upsert comunidad / vínculo Microsoft) | `src/lib/domain/users.ts` |
| Catálogo público (sin fotos ni QR) | `src/lib/public-catalog.ts` |

Las sesiones siguen en JWT. No hay adapter Prisma de Account/Session: el vínculo OAuth se guarda en `User.microsoftOid`.

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

## Identidad visual (hero, logo, ilustraciones)

El tema Libre (rojo `#C8102E`, oro `#B89600`) ya está en tokens. Encima hay **slots de imagen** para que Samuel suelte fotos institucionales del campus sin rediseñar.

1. Coloca el archivo en `public/brand/` (la carpeta ya existe), **o** usa una URL https pública (CDN / Cloudinary **pública** de marca).
2. Apunta la variable `NEXT_PUBLIC_*` correspondiente. Reinicia `next dev` / redespliega.

| Variable | Dónde se ve | Ejemplo |
| --- | --- | --- |
| `NEXT_PUBLIC_BRAND_HERO_URL` | Hero de inicio y panel de `/login` | `/brand/hero.jpg` |
| `NEXT_PUBLIC_BRAND_LOGO_URL` | Marca del header y footer (si falta, queda el monograma `UF`) | `/brand/logo.png` |
| `NEXT_PUBLIC_BRAND_HOW_IT_WORKS_URL` | Bloque “Cómo funciona” | `/brand/porteria.jpg` |
| `NEXT_PUBLIC_BRAND_CATALOG_URL` | Banner del catálogo `/objetos` | `/brand/catalogo.jpg` |
| `NEXT_PUBLIC_BRAND_EMPTY_URL` | Vacío del listado | `/brand/vacio.svg` |
| `NEXT_PUBLIC_BRAND_HERO_ALT` / `NEXT_PUBLIC_BRAND_LOGO_ALT` | Texto alternativo | `Campus Unilibre Barranquilla` |

Si la variable está vacía, el slot muestra un degradé papel/rojo/oro, un croquis del campus y el texto **«Aquí va la foto del campus»** (no un ícono de imagen rota).

**No uses fotos privadas de objetos** ni URLs firmadas de Cloudinary (`unifind_private_items`). Esos archivos son de vigilancia. El catálogo público sigue sin fotos de objetos.

La config vive en `src/lib/brand.ts`.

## Variables de entorno

Copia `.env.example`. Las únicas obligatorias para correr autenticación y el catálogo son:

- `DATABASE_URL`
- `AUTH_SECRET` (y `NEXTAUTH_SECRET` con el mismo valor)

Bloqueos solo por entorno:

- Sin Cloudinary, el registro de objetos funciona y la foto se omite.
- Sin Resend, el reclamo se guarda y el correo se omite (queda en logs).
- Sin `CRON_SECRET`, la ruta `/api/cron/check-expiration` responde 401.
- Sin Microsoft Entra, el login por correo/contraseña sigue igual y no se muestra «Continuar con Microsoft».

### Microsoft Entra ID (estudiantes y personal, opt-in)

Opcional. Credentials (cuentas sembradas de vigilancia/Bienestar) no cambia. Si configuras Entra, el primer login Microsoft hace upsert por correo: rol `STUDENT` salvo que el correo ya exista (se conserva ADMIN/SUPERUSER).

| Variable | Uso |
| --- | --- |
| `AUTH_MICROSOFT_ENTRA_ID_ID` | Application (client) ID |
| `AUTH_MICROSOFT_ENTRA_ID_SECRET` | Client secret |
| `AUTH_MICROSOFT_ENTRA_ID_ISSUER` | `https://login.microsoftonline.com/<tenant-id>/v2.0` **o** solo el tenant (`guid`, `common`, `organizations`) |
| `AUTH_MICROSOFT_ENTRA_ID_TENANT_ID` | Alternativa al issuer: Directory (tenant) ID |
| `AUTH_MICROSOFT_ALLOWED_DOMAIN` | Opcional. Ej. `unilibre.edu.co` (varios, separados por coma) |

Registro de la app en Entra (M365 Educación):

1. Entra admin center → Identity → Applications → App registrations → New registration.
2. Account type: single tenant de la universidad (issuer con el Directory ID).
3. Plataforma **Web**, Redirect URI: `{AUTH_URL}/api/auth/callback/microsoft-entra-id` (local: `http://localhost:3000/api/auth/callback/microsoft-entra-id`).
4. Certificates & secrets → client secret. API permissions: `openid`, `profile`, `email`, `User.Read`.
5. Copia client ID, secret e issuer. No subas secretos al repo.

**Hook para Front**

- Provider id: `microsoft-entra-id` (`MICROSOFT_ENTRA_PROVIDER_ID` en `src/lib/auth/constants.ts`)
- Server action: `microsoftSignInAction` en `@/actions/auth.actions` (campo `callbackUrl`)
- Flag server-only: `isMicrosoftEntraConfigured()` — no usar en Client Components (las env no son `NEXT_PUBLIC_`)
- Componente mínimo: `MicrosoftSignInButton` (`callbackUrl`). Front puede restylearlo.

Tras Microsoft, `/dashboard` envía ADMIN → vigilancia, SUPERUSER → Bienestar y STUDENT → catálogo.

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
