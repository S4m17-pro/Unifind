# PRODUCT.md — UniFind

> Contexto durable del producto. Lee este archivo antes de cualquier trabajo de UI.

## ¿Qué es UniFind?

Sistema digital de gestión de objetos perdidos de la **Universidad Libre Seccional Barranquilla**. Reemplaza el proceso manual de la portería: papel, mensajes de WhatsApp, extravíos de registros.

## Usuarios

| Rol | Quién | Superficie principal |
|---|---|---|
| `STUDENT` | Comunidad universitaria (estudiantes, docentes, personal) | Catálogo público `/` y `/objetos`, formulario de reclamo |
| `ADMIN` | Vigilantes y personal de portería | `/admin/dashboard` |
| `SUPERUSER` | Personal de Bienestar Universitario | `/bienestar` |

## Flujo de vida de un objeto

```
Vigilante encuentra objeto
      ↓
Registra en /admin/dashboard (categoría, fecha, bloque, foto opcional)
      ↓
Sistema genera QR y asigna estante
      ↓
Objeto queda EN_BODEGA
      ↓
Estudiante busca en catálogo público (sin fotos, sin QR)
      ↓
Estudiante reclama por correo (formulario de reclamo)
      ↓
Vigilante recibe reclamo, verifica identidad presencialmente
      ↓
Vigilante registra entrega con firma digital → ENTREGADO
   O
Cron (30 días) → LISTO_PARA_DONACION
```

## Privacidad del catálogo público

**El catálogo público NO expone:**
- Fotos del objeto
- URL de Cloudinary
- Código QR
- Ubicación de estante
- Datos del reclamante

**El catálogo público SÍ expone:**
- Categoría genérica (ej. "Electrónico", "Ropa", "Accesorio")
- Fecha y hora del hallazgo
- Bloque / Salón donde se encontró
- Portería de custodia

## Identidad Visual

- **Rojo institucional:** `#C8102E` (Unilibre)
- **Oro institucional:** `#B89600` (Unilibre)
- **Modo:** Light-mode exclusivo (sin dark mode implementado)
- **Fuentes:** Inter (UI) + Source Serif 4 (display)

## Slots de Imagen de Marca

Los siguientes env vars controlan assets institucionales. Si están vacías, el sistema muestra fallbacks de degradé papel/rojo/oro:

| Variable | Dónde se ve |
|---|---|
| `NEXT_PUBLIC_BRAND_HERO_URL` | Hero de inicio y panel de login |
| `NEXT_PUBLIC_BRAND_LOGO_URL` | Header y footer |
| `NEXT_PUBLIC_BRAND_HOW_IT_WORKS_URL` | Bloque "Cómo funciona" |
| `NEXT_PUBLIC_BRAND_CATALOG_URL` | Banner del catálogo `/objetos` |
| `NEXT_PUBLIC_BRAND_EMPTY_URL` | Estado vacío del listado |

## Rutas Clave

| Ruta | Rol | Modo de diseño |
|---|---|---|
| `/` | Público | Persuade |
| `/objetos` | Público | Persuade |
| `/login` | Todos | Operate |
| `/admin/dashboard` | ADMIN | Operate |
| `/bienestar` | SUPERUSER | Operate |
| `/dashboard` | Todos (redirección) | — |
| `/unauthorized` | Todos | Read |

## Stack Técnico

- **Framework:** Next.js 15 (App Router)
- **Runtime:** React 19, TypeScript
- **ORM:** Prisma + PostgreSQL
- **Auth:** Auth.js v5 (Credentials + Microsoft Entra ID opcional)
- **Estilos:** Tailwind CSS 4
- **Componentes:** shadcn/ui
- **Almacenamiento de imágenes:** Cloudinary (fotos authenticated, solo vigilancia)
- **Correo:** Resend (notificaciones de reclamo)
- **Hosting:** Vercel

## Tono de Voz

- **Español colombiano formal**, no tuteante en mensajes institucionales
- **Directo y útil**: el vigilante está trabajando, el estudiante está buscando algo que perdió
- **Sin tecnicismos**: el sistema debe ser claro para cualquier usuario de la comunidad universitaria
- **Sin emojis** en UI de producción institucional

## Lo Que No Hacer

- No cambiar los colores institucionales `#C8102E` y `#B89600`
- No exponer información privada en el catálogo público
- No añadir dark mode sin aprobación del equipo
- No usar íconos que no pertenezcan al set de Lucide React (ya incluido en el proyecto)
- No reemplazar shadcn/ui por otra librería de componentes sin discusión previa
