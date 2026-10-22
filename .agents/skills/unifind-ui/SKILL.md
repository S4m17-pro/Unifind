---
name: unifind-ui
description: "Skill de diseño UI para UniFind — Sistema de objetos perdidos de la Universidad Libre Seccional Barranquilla. Úsalo cuando quieras diseñar, rediseñar, auditar, pulir, animar, o mejorar cualquier interfaz del aplicativo: catálogo público, panel de vigilancia (/admin/dashboard), panel de bienestar (/bienestar), flujo de login, formularios de reclamo, componentes, estados vacíos, o el sistema de diseño completo. Respeta siempre la identidad institucional: rojo #C8102E y oro #B89600. Basado en la metodología impeccable (https://github.com/pbakaus/impeccable)."
argument-hint: "[comando] [target]"
user-invocable: true
license: Apache 2.0
---

# Skill: UniFind UI

Este skill te da las herramientas y el permiso para hacer diseño UI de producción para **UniFind**, respetando la identidad institucional de la **Universidad Libre Seccional Barranquilla**.

Trabaja como un director de diseño senior: código de producción, un punto de vista claro, comprensión profunda de los usuarios (vigilantes, estudiantes, bienestar universitario) y artesanía excepcional.

## Principios Fundamentales

- **Termina el trabajo.** Sin atajos: el entregable es completo salvo assets que el usuario debe proveer.
- **La identidad institucional gana.** El rojo `#C8102E` y el oro `#B89600` son sagrados. No los reemplaces con tus preferencias personales.
- **Modo Operate primero.** UniFind es una herramienta de trabajo (vigilantes, estudiantes que reclaman). La escaneabilidad, consistencia y expectativas nativas superan a la expresión. La marca vive en detalles precisos.
- **Verifica mirando el resultado renderizado** a los tamaños en que se despliega, y agrupa las correcciones: arregla lo que muestra una revisión antes de revisar de nuevo.

---

## Setup (antes de cualquier edición de UI)

1. **Lee el contexto del producto:** consulta `PRODUCT.md` en la raíz del proyecto para entender roles, flujos y restricciones de privacidad.
2. **Lee el sistema de diseño:** consulta `DESIGN.md` en la raíz del proyecto para los tokens de color, tipografía y componentes actuales.
3. **Lee el código real:** inspecciona el componente o página target antes de editar. Nunca inventes estilos que no existen.
4. **Lee Craft Floor** (sección abajo) antes de cualquier edición de UI, incluso refinamientos pequeños.

---

## Sistema de Diseño UniFind

### Stack
- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Estilos:** Tailwind CSS 4 (tokens via `@theme` en `globals.css`)
- **Componentes:** shadcn/ui
- **Fuentes:** Inter (sans), Source Serif 4 (serif) via `next/font`

### Paleta Institucional

| Token | Valor | Uso |
|---|---|---|
| `--color-brand` | `#C8102E` | Rojo Unilibre — CTAs primarios, foco, badge de marca |
| `--color-brand-hover` | `#A50D26` | Hover/pressed del rojo |
| `--color-brand-soft` | `#F8E8EB` | Fondos suaves de estados de error/marca |
| `--color-gold` | `#B89600` | Oro Unilibre — acento secundario, iconos activos |
| `--color-gold-ink` | `#6E5600` | Texto dorado legible sobre papel |
| `--color-gold-soft` | `#F7F1D4` | Fondos suaves dorados |
| `--color-canvas` | `#F4F4F2` | Fondo de página |
| `--color-paper` | `#FFFFFF` | Fondo de tarjetas y modales |
| `--color-bar` | `#F2F2F2` | Barras y superficies secundarias |
| `--color-ink` | `#1A1A1A` | Texto principal |
| `--color-ink-muted` | `#4A4A4A` | Texto secundario |
| `--color-ink-subtle` | `#6B6B6B` | Texto de apoyo |
| `--color-line` | `#E2E2E0` | Bordes y separadores |
| `--color-success` | `#1B6B3A` | Estado entregado |
| `--color-warning` | `#8A6400` | Estado por vencer |
| `--color-danger` | `#9B1C1C` | Errores |

### Tipografía

- **Sans (UI y cuerpo):** `var(--font-inter)` — Inter, ui-sans-serif
- **Serif (display y headings principales):** `var(--font-source-serif)` — Source Serif 4, Georgia

### Radio de bordes
- **Por defecto:** `0.375rem` (`--radius`)
- **sm:** `calc(var(--radius) - 2px)`
- **lg:** `calc(var(--radius) + 2px)`

### Reglas de Color

**La Marca Lleva el Rojo.** El rojo `#C8102E` es la señal primaria de la Universidad Libre. Siempre en CTAs primarios, indicadores activos, y la barra de navegación.

**El Oro Es Acento.** El dorado `#B89600` es secundario: íconos activos, badges de categoría, detalles de calidad institucional.

**Sin Modo Oscuro por Defecto.** El sistema actual es light-mode. No implementes dark mode sin confirmación explícita del usuario.

**Sin Glassmorfismo.** Transparencias decorativas con blur no son parte de este sistema.

**Sin Neon ni Gradientes Genéricos de IA.** Evita los tropos de diseño de producto de IA (gradientes cyan-purple-magenta) — UniFind es una herramienta institucional sobria.

---

## Modos de Uso

### Modo Operate (principal)
Las interfaces `/admin/dashboard` y `/bienestar` son **Operate**: el vigilante completa una tarea, el personal de bienestar revisa métricas. Aquí:
- Escaneabilidad y consistencia mandan
- La marca vive en detalles precisos, no en héroes visuales
- Patrones conocidos (tabla, formulario, sidebar) ganan frente a expresión

### Modo Persuade (catálogo público `/`, `/objetos`)
El catálogo público y la landing son **Persuade**: el estudiante llega, descubre, y reclama. Aquí:
- El hero institucional puede ser más expresivo
- Las CTAs deben ser claras y urgentes
- Los slots de imagen (`NEXT_PUBLIC_BRAND_*`) deben usarse si están disponibles

### Modo Read (formularios de reclamo, instrucciones)
Los formularios y flujos de reclamación son **Read**: el estudiante entiende qué hacer. Aquí:
- Estructura para comprensión primero
- Copy de UX claro, directo, en español colombiano

---

## Privacidad y Restricciones de Diseño

> **CRITICO:** Nunca diseñes componentes que expongan:
> - Fotos de objetos en el catálogo público (las fotos son solo para vigilancia autenticada)
> - URLs de Cloudinary firmadas o sin firmar en UI pública
> - Códigos QR o ubicaciones de estante en UI pública
> - Información personal de reclamantes en UI pública

El catálogo público solo muestra: categoría genérica, fecha/hora, bloque/salón, portería de custodia.

---

## Comandos

| Comando | Categoría | Descripción |
|---|---|---|
| `shape [feature]` | Construir | Planea UX/UI antes de escribir código |
| `critique [target]` | Evaluar | Revisión de diseño UX con scoring heurístico |
| `audit [target]` | Evaluar | Checks técnicos (a11y, perf, responsive) |
| `polish [target]` | Refinar | Pase final de calidad antes de desplegar |
| `bolder [target]` | Refinar | Amplifica diseños seguros o sosos |
| `harden [target]` | Refinar | Producción: errores, edge cases, i18n |
| `animate [target]` | Mejorar | Agrega animaciones con propósito |
| `typeset [target]` | Mejorar | Mejora jerarquía tipográfica |
| `layout [target]` | Mejorar | Arregla espaciado, ritmo y jerarquía visual |
| `clarify [target]` | Arreglar | Mejora copy de UX, labels, mensajes de error |
| `adapt [target]` | Arreglar | Adapta para diferentes dispositivos |

### Cómo usar los comandos
- **Sin argumento:** analiza el contexto y presenta opciones de mejora disponibles.
- **Con target explícito** (ej. `audit /admin/dashboard`): ejecuta el análisis sobre ese target.
- **Con un verbo claro** (ej. `polish ItemCard`): refina ese componente específico.

---

## Craft Floor (piso mínimo de calidad)

Antes de cualquier edición de UI, verifica:

### Siempre
- [ ] Los colores institucionales (`#C8102E`, `#B89600`) son exactos — sin variaciones no autorizadas
- [ ] Todo texto tiene contraste WCAG AA mínimo (4.5:1 para texto normal, 3:1 para texto grande)
- [ ] Los estados de hover, focus, active y disabled están implementados
- [ ] Los formularios tienen labels visibles (no solo placeholders)
- [ ] Los mensajes de error son específicos y accionables, en español colombiano
- [ ] Los estados de carga (skeleton, spinner) están implementados para async
- [ ] Los estados vacíos tienen copy útil y una acción

### En Operate (dashboards, admin)
- [ ] Las tablas tienen encabezados descriptivos
- [ ] Los modales tienen un título claro y botón de cierre
- [ ] Las acciones destructivas (eliminar, donar) tienen confirmación
- [ ] Los formularios preservan el estado si hay error de validación

### En Persuade (catálogo público)
- [ ] El hero funciona sin `NEXT_PUBLIC_BRAND_HERO_URL` (degradé fallback)
- [ ] Las tarjetas del catálogo no exponen información privada
- [ ] El flujo de reclamo es claro desde la primera vista

### Bans absolutos
- No uses `!important` en Tailwind sin justificación documentada
- No hardcodees colores fuera del sistema de tokens
- No quites el `outline: 2px solid var(--color-brand)` del `:focus-visible`
- No expongas datos de objetos (fotos, QR, estante) en UI pública
- No uses emojis en UI institucional
- No pongas texto sobre gradientes sin overlay que garantice contraste

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── (public)/          # Catalogo publico — Modo Persuade/Read
│   ├── admin/dashboard/   # Panel vigilancia — Modo Operate
│   ├── bienestar/         # Panel bienestar — Modo Operate
│   ├── login/             # Autenticacion
│   └── globals.css        # Tokens de diseno (@theme)
├── components/
│   ├── public/            # Componentes del catalogo (ItemCard, ClaimForm, etc.)
│   ├── admin/             # Componentes de vigilancia (NewItemForm, etc.)
│   ├── brand/             # Identidad visual (slots de imagen)
│   ├── layout/            # Layout global (Header, Footer)
│   └── ui/                # shadcn/ui primitivos
└── lib/
    └── brand.ts           # Config de variables de marca
```

---

## Tokens de Animacion Recomendados

```css
/* Transiciones estandar — precisas, no juguetonas */
transition: all 150ms ease-in-out;  /* controles */
transition: all 200ms ease-out;     /* modales y overlays */
transition: all 100ms ease-in;      /* dismissals */
```

Evita `bounce`, `elastic`, o animaciones que superen 400ms en UI de produccion.

---

## Referencias Utiles

- **Sistema de marca:** `src/lib/brand.ts`
- **Tokens de diseno:** `src/app/globals.css` (seccion `@theme`)
- **Tailwind config:** `tailwind.config.js`
- **Contexto del producto:** `PRODUCT.md` (raiz del proyecto)
- **Sistema de diseno:** `DESIGN.md` (raiz del proyecto)
- **Impeccable (metodologia base):** https://github.com/pbakaus/impeccable
