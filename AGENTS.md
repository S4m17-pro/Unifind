# AGENTS.md — Constitución de UniFind

Este archivo define las reglas del proyecto para cualquier asistente de IA (y para el equipo).
Léelo completo antes de escribir código. Si una instrucción del usuario contradice una regla
marcada como **INNEGOCIABLE**, avisa y pide confirmación antes de proceder.

## 1. Qué es UniFind

Sistema web de gestión y trazabilidad de objetos perdidos de la **Universidad Libre Seccional
Barranquilla**. Proyecto de aula (Programación Web, Ingeniería de Sistemas).

Flujo resumido:

1. Vigilancia/portería registra un objeto hallado (categoría, lugar, foto privada) y se genera un QR.
2. El estudiante consulta un catálogo público **genérico (sin fotos)** y envía un reclamo con
   descripción detallada (color, marca, seriales).
3. El admin recibe el reclamo por correo, lo compara con el objeto físico y autoriza o rechaza.
4. La entrega es presencial: se escanea el QR, el estudiante firma en pantalla y el objeto pasa a `ENTREGADO`.
5. Si nadie lo reclama en 30 días, un cron lo pasa a `LISTO_PARA_DONACION` para Bienestar.

## 2. Fuente de verdad (orden de prioridad)

1. Este archivo.
2. `README.md` (estado actual y comandos).
3. Documento SRS (requerimientos RF/RNF).
4. Documento de idea del proyecto.

Si el SRS y el código/README difieren, **manda el README y el código actual**. No "corrijas" el
código para que coincida con el SRS sin preguntar.

## 3. Stack (no cambiar sin aprobación)

- Next.js 15 (App Router), React 19, TypeScript
- Prisma + PostgreSQL
- Auth.js v5 (JWT en cookies HTTPOnly)
- Tailwind CSS 4
- Cloudinary (fotos privadas), Resend (correo)
- QR: `qrcode.react` (generar) y `html5-qrcode` (escanear)
- Firma: `react-signature-canvas`
- Cron: Vercel Cron Jobs
- Node.js 20+

**No agregues dependencias nuevas sin justificarlo y preguntar.** Prefiere lo que ya existe en el proyecto.

## 4. Roles y permisos

| Rol | Quién | Rutas | Puede |
| --- | --- | --- | --- |
| `STUDENT` | Comunidad universitaria | `/`, formulario de reclamo | Ver catálogo público y enviar reclamos |
| `ADMIN` | Vigilante / portería | `/admin/dashboard` | Registrar objetos, generar QR, gestionar estante, revisar reclamos, entregar con firma |
| `SUPERUSER` | Bienestar Universitario | `/bienestar` | Ver métricas, objetos listos para donación y reporte |

Reglas:

- La autorización se valida **siempre en el servidor** (Server Actions, Route Handlers, Server
  Components). El middleware o ocultar botones en la UI **no** es suficiente.
- Cada Server Action o endpoint protegido debe verificar sesión **y** rol al inicio.
- Por defecto, una ruta nueva es privada. Solo `/`, `/login` y `/unauthorized` son públicas.

## 5. Reglas INNEGOCIABLES

### Privacidad del catálogo público
El catálogo público **solo** expone: categoría genérica, fecha y hora del hallazgo, bloque/salón y
portería de custodia.

**Nunca** enviar al cliente público: fotos, URLs de Cloudinary, código QR, ubicación de estante,
marca, color exacto, ni datos de quien reclamó.

- En consultas Prisma públicas usa `select` explícito con lista blanca. Nunca `findMany()` sin
  `select` ni `include` que arrastre campos sensibles.
- Si agregas un campo al modelo `Item`, asume que es **privado** hasta decidir lo contrario.

### Fotos
- Se suben a Cloudinary con tipo `authenticated`, carpeta `unifind_private_items`.
- Solo se firman URLs temporales **en el servidor** (`getSignedPrivateImageUrl`) y solo para
  personal autenticado con rol `ADMIN`.
- Nunca guardar ni devolver URLs públicas permanentes.

### Datos personales (Ley 1581 de 2012)
- Correos institucionales y firmas digitales son datos personales: no los registres en logs, no
  los expongas en el catálogo y no los devuelvas a roles que no los necesitan.
- No hagas `console.log` de firmas, tokens, secretos ni correos completos.

### Secretos
- Nunca hardcodear claves. Todo va en variables de entorno y `.env.example` solo lleva placeholders.
- Las credenciales de seed son **solo desarrollo**. No las repitas en código de producción.

## 6. Ciclo de vida del objeto

```
EN_BODEGA ──(entrega presencial + firma)──> ENTREGADO
EN_BODEGA ──(cron: >30 días de custodia)──> LISTO_PARA_DONACION
```

- Las transiciones válidas son solo esas. Cualquier otra transición es un bug.
- `ENTREGADO` requiere: QR validado, firma capturada, fecha/hora, estudiante y celador responsable.
- La lógica de transición vive en una función/servicio central, **no** repartida por componentes.
- El cron (`GET /api/cron/check-expiration`) exige `Authorization: Bearer $CRON_SECRET`.
  Sin `CRON_SECRET` responde 401. No relajes esto.

## 7. Convenciones de código

**General**
- TypeScript estricto. Prohibido `any`; usa `unknown` y estrecha el tipo.
- Prefiere Server Components; usa `"use client"` solo donde haga falta (cámara QR, canvas de
  firma, interactividad).
- Mutaciones con Server Actions o Route Handlers, nunca desde el cliente directo a la BD.
- Valida **toda** entrada del usuario en el servidor (formularios, params, query). Si el proyecto
  ya usa Zod, úsalo; si no, pregunta antes de añadirlo.
- Un archivo = una responsabilidad. Si pasa de ~200 líneas, evalúa dividirlo.

**Nombres**
- Código (variables, funciones, tipos, archivos): inglés.
- Texto visible al usuario, mensajes de error y correos: **español**.
- Estados y roles en `MAYÚSCULAS_CON_GUION_BAJO` tal como están en Prisma.

**Base de datos**
- Todo cambio de esquema pasa por migración (`prisma migrate`). Nunca editar la BD a mano.
- No borres migraciones ya aplicadas.

**UI**
- Mobile-First con Tailwind. El catálogo debe verse bien en celular.
- El panel de portería debe ser táctil y usable en tablet (botones grandes, firma cómoda).
- Accesibilidad básica: labels en formularios, contraste suficiente, foco visible.

**Errores**
- Falla con mensajes claros al usuario y detalles técnicos solo en logs del servidor.
- No tragues errores con `catch {}` vacíos.

## 8. Degradación elegante (comportamiento sin servicios externos)

Esto es intencional; mantenlo:

- Sin Cloudinary (o con placeholders/credenciales inválidas): el objeto **se guarda igual**, la
  foto se omite y se muestra un aviso.
- Sin Resend: el reclamo **se guarda**, el correo se omite y queda registrado en logs (sin datos sensibles).
- Obligatorias para correr: `DATABASE_URL` y `AUTH_SECRET` (con el mismo valor en `NEXTAUTH_SECRET`).

## 9. Comandos

```bash
docker compose up -d        # Postgres local
npm install
npx prisma migrate deploy
npm run db:seed             # usuarios de demo
npm run dev                 # http://localhost:3000
npm run build               # debe pasar sin errores antes de dar algo por terminado
npm run db:migrate          # migraciones en desarrollo
npm run db:studio           # Prisma Studio
npm run lint                # ESLint (Next.js + TypeScript), debe pasar sin errores
```

## 10. Mapa de requerimientos (SRS)

Marca `[x]` cuando esté implementado y verificado.

> Última verificación: 2026-11-08 — `npm run build` y `npm run lint` en verde,
> más pruebas de humo en local de login, catálogo, reclamo y cron. Los flujos que
> dependen de cámara, firma o servicios externos siguen pendientes de prueba manual.

**Usuarios y autenticación**
- [x] RF-USR-01 Login seguro por roles
- [x] RF-USR-02 Rutas administrativas protegidas (JWT + validación en servidor)

**Recepción y etiquetado**
- [ ] RF-REC-01 Registro: categoría, fecha, ubicación, descripción
- [ ] RF-REC-02 1–2 fotos privadas
- [x] RF-QRG-01 QR único por objeto

**Catálogo y reclamos**
- [x] RF-CAT-01 Catálogo público sin fotos
- [x] RF-CAT-02 Filtros por fecha, categoría y estado
- [x] RF-RCL-01 Formulario de reclamo (correo institucional + descripción)
- [ ] RF-RCL-02 Correo automático al admin

**Entrega segura**
- [ ] RF-ENT-01 Escaneo de QR con cámara
- [ ] RF-ENT-02 Firma digital en canvas
- [ ] RF-ENT-03 Cambio a `ENTREGADO` tras validar firma

**Ciclo de vida y analítica**
- [x] RF-DON-01 Cron a `LISTO_PARA_DONACION`
- [x] RF-DSH-01 KPIs: tasa de devolución, objetos ingresados, tiempo de permanencia
- [x] Reporte de donación para Bienestar (PDF)

**No funcionales**
- RNF-01 Portería optimizada para tablet
- RNF-02 Catálogo Mobile-First
- RNF-03 Seguridad y Ley 1581 (ver sección 5)
- RNF-04 Generación de QR < 2 s
- RNF-05 Despliegue en Vercel (objetivo 99% uptime)
- Catálogo público responde en < 1.5 s

## 11. Cómo trabajar con la IA en este repo

1. **Antes de codificar algo no trivial**, propón un plan corto (archivos a tocar, modelo de datos,
   riesgos) y espera confirmación.
2. **Cambios pequeños y revisables**: una funcionalidad o un RF por vez. No refactorices código no relacionado.
3. **No inventes** APIs, variables de entorno ni campos del esquema. Si falta algo, pregunta.
4. Al terminar una tarea:
   - `npm run build` y el linter pasan.
   - Revisaste la regla de privacidad (sección 5) si tocaste catálogo, fotos o reclamos.
   - Verificaste rol y sesión en cualquier endpoint o acción nueva.
   - Actualizaste el README o este archivo si cambió el comportamiento.
5. Si algo del SRS es ambiguo, **pregunta** en lugar de suponer.

## 12. Fuera de alcance (por ahora)

No implementar sin que se pida explícitamente: SSO/LDAP institucional, lector de código de
barras del carnet, notificaciones push/SMS, publicación de fotos en el catálogo público, registro
de objetos por parte de estudiantes (solo portería registra).