---
name: UniFind
description: "Sistema de diseño institucional de UniFind — Universidad Libre Seccional Barranquilla. Superficies claras sobre canvas papel, con el rojo institucional #C8102E como señal primaria y el oro #B89600 como acento de calidad. Tipografía con Inter para UI y Source Serif 4 para display. Modo light exclusivo."

colors:
  # Marca institucional Universidad Libre
  brand: "#C8102E"           # Rojo Unilibre — CTA primario, foco, navbar
  brand-hover: "#A50D26"     # Hover/pressed del rojo
  brand-soft: "#F8E8EB"      # Fondo suave de estados de marca/error

  gold: "#B89600"            # Oro Unilibre — acento secundario
  gold-ink: "#6E5600"        # Texto dorado legible sobre papel
  gold-soft: "#F7F1D4"       # Fondo suave dorado

  # Superficies
  canvas: "#F4F4F2"          # Fondo de página
  paper: "#FFFFFF"           # Fondo de tarjetas y modales
  bar: "#F2F2F2"             # Barras y superficies secundarias

  # Texto
  ink: "#1A1A1A"             # Texto principal
  ink-muted: "#4A4A4A"       # Texto secundario
  ink-subtle: "#6B6B6B"      # Texto de apoyo
  line: "#E2E2E0"            # Bordes y separadores

  # Estado
  success: "#1B6B3A"         # ENTREGADO
  success-soft: "#E6F4EA"
  warning: "#8A6400"         # Próximo a vencer
  warning-soft: "#F8F0D0"
  danger: "#9B1C1C"          # Error / ENTREGADO fallido
  danger-soft: "#FDECEC"

typography:
  scale:
    "12": "0.75rem"    # meta lines, badge text
    "13": "0.8125rem"  # secondary UI text, card meta
    "14": "0.875rem"   # dense body, list rows, controls
    "16": "1rem"       # default body
    "18": "1.125rem"   # lead paragraph, card heading
    "20": "1.25rem"    # card and panel titles
    "24": "1.5rem"     # subsection heads
    "30": "1.875rem"   # section heads
    "36": "2.25rem"    # large section heads
    "48": "3rem"       # display / hero

  display:
    fontFamily: "Source Serif 4, Georgia, Times New Roman, serif"
    fontSize: "clamp(2.25rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.15

  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 1.875rem)"
    fontWeight: 600
    lineHeight: 1.3

  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.35

  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65

  caption:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5

  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400

rounded:
  sm: "4px"
  md: "6px"    # default (--radius = 0.375rem)
  lg: "8px"
  xl: "12px"
  pill: "999px"

spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
  "2xl": "64px"
  "3xl": "96px"

components:
  button-primary:
    backgroundColor: "#C8102E"
    textColor: "#FFFFFF"
    rounded: "6px"
    padding: "10px 24px"
    fontWeight: 500
    fontSize: "0.875rem"
  button-primary-hover:
    backgroundColor: "#A50D26"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "#C8102E"
    borderColor: "#C8102E"
    rounded: "6px"
    padding: "10px 24px"
  input-text:
    backgroundColor: "#FFFFFF"
    textColor: "#1A1A1A"
    borderColor: "#E2E2E0"
    rounded: "6px"
    padding: "10px 14px"
    fontSize: "0.875rem"
  card:
    backgroundColor: "#FFFFFF"
    textColor: "#1A1A1A"
    borderColor: "#E2E2E0"
    rounded: "6px"
    padding: "24px"
    shadow: "0 1px 3px rgba(0,0,0,0.08)"
  badge-en-bodega:
    backgroundColor: "#F7F1D4"
    textColor: "#6E5600"
    rounded: "999px"
  badge-entregado:
    backgroundColor: "#E6F4EA"
    textColor: "#1B6B3A"
    rounded: "999px"
  badge-listo-donacion:
    backgroundColor: "#FDECEC"
    textColor: "#9B1C1C"
    rounded: "999px"
---

# Sistema de Diseño: UniFind

## 1. Visión: Institucional, Claro, Digno de Confianza

**Norte Creativo: "Rigor Universitario"**

UniFind debe sentirse como una herramienta oficial de la Universidad Libre: confiable, clara, y respetuosa de la identidad institucional. No es un producto de startup, ni una app de consumo. Es la cara digital de un proceso administrativo real que involucra la propiedad y la confianza de la comunidad universitaria.

**Características clave:**
- Superficies blancas y papel sobre canvas suave — nunca oscuro por defecto
- El rojo `#C8102E` como señal primaria inequívoca de la Universidad Libre
- El oro `#B89600` como detalle de calidad institucional, nunca como decoración genérica
- Tipografía limpia y legible: Inter para todo el UI, Source Serif 4 solo para heroes y headings principales
- Bordes pequeños (6px), sombras sutiles, y casi ninguna decoración visual
- Los datos del objeto (categoría, fecha, bloque, portería) siempre son el protagonista

## 2. Paleta de Color

### Superficies

- **Canvas** (`#F4F4F2`): Fondo general de página. Cálido y suave, no blanco puro.
- **Paper** (`#FFFFFF`): Tarjetas, modales, formularios. El elemento activo "flota" sobre el canvas.
- **Bar** (`#F2F2F2`): Barras de navegación secundaria, headers de tabla.
- **Line** (`#E2E2E0`): Bordes, separadores, líneas de tabla.

### Marca

- **Brand Rojo** (`#C8102E`): La señal primaria de UniFind y de la Universidad Libre. CTAs primarios, barra de navegación activa, focus outline, badges de marca.
- **Brand Hover** (`#A50D26`): Estado hover/pressed del rojo. No uses opacidad — usa este valor.
- **Brand Soft** (`#F8E8EB`): Fondos de estados de error o highlights de marca en contextos amplios.

### Acento Institucional

- **Gold** (`#B89600`): Acento secundario. Úsalo para íconos en estados activos, badges de categoría, detalles de calidad en el hero institucional. **No** en texto pequeño — falla contraste sobre papel.
- **Gold Ink** (`#6E5600`): Texto dorado legible. Úsalo cuando necesites texto en tono dorado sobre fondos claros.
- **Gold Soft** (`#F7F1D4`): Fondo suave para contextos de acento dorado.

### Texto

- **Ink** (`#1A1A1A`): Texto principal. Cálido y profundo, nunca puro negro.
- **Ink Muted** (`#4A4A4A`): Texto secundario, subtítulos, metadata.
- **Ink Subtle** (`#6B6B6B`): Texto de apoyo, hints, placeholders.

### Estado

- **Success** (`#1B6B3A`): Objeto entregado exitosamente.
- **Warning** (`#8A6400`): Advertencia (ej. próximo a 30 días).
- **Danger** (`#9B1C1C`): Error o acción destructiva.

### Reglas de Color

**El Rojo Es la Firma.** `#C8102E` es el color de la Universidad Libre. Úsalo en CTAs primarios y en el header. No dilutes su impacto usándolo en demasiados lugares.

**El Oro Es de Calidad, No Decoración.** `#B89600` marca distinción institucional. No lo uses como color de fondo de elementos interactivos ni para texto pequeño (falla contraste).

**Las Superficies Son Papel.** UniFind es light-mode. El canvas y el paper son los fondos primarios. No implementes dark mode sin aprobación explícita.

**Los Bordes Son Sutiles.** Usa `#E2E2E0` para bordes. Las tarjetas no necesitan sombras pesadas — una sombra de `0 1px 3px rgba(0,0,0,0.08)` es suficiente.

## 3. Tipografía

**Fuente Display (heroes, headings de sección):** Source Serif 4  
**Fuente UI (todo lo demás):** Inter  
**Fuente Mono (código, IDs técnicos):** Sistema monoespaciado

### Jerarquía

- **Display / h1:** Source Serif 4, `clamp(2.25rem, 5vw, 3rem)`, weight 700. Solo para heroes del catálogo y landing.
- **Headline / h2:** Inter, `1.5–1.875rem`, weight 600. Títulos de sección.
- **Title / h3:** Inter, `1.125rem`, weight 500. Encabezados de card o panel.
- **Body:** Inter, `1rem`, weight 400, line-height 1.65. Cuerpo de texto.
- **Caption:** Inter, `0.875rem`, weight 400. Metadata, fechas, labels secundarios.

### Reglas de Tipografía

**Inter Manda en UI.** Para controles, labels, formularios, tablas, y navegación, usa siempre Inter. Source Serif 4 es para display y heroes — no aparece en formularios ni tablas.

**Sin Texto Dorado Pequeño.** El oro `#B89600` falla contraste WCAG AA en texto bajo 24px sobre fondo blanco. Para texto dorado pequeño, usa `#6E5600` (gold-ink).

**Espaciado Generoso.** El body text usa line-height 1.65. El texto institucional necesita aire para transmitir seriedad.

## 4. Elevación y Material

El sistema es mayoritariamente plano. La profundidad viene del contraste de superficies y bordes sutiles.

### Sombras

- **Tarjeta estándar:** `0 1px 3px rgba(0,0,0,0.08)` — sutil, flotante.
- **Modal / Panel elevado:** `0 8px 24px rgba(0,0,0,0.12)` — claramente por encima.
- **Dropdown / Tooltip:** `0 4px 12px rgba(0,0,0,0.10)`.
- **Sin sombras decorativas de color:** nada de `box-shadow` en rojo o dorado.

### Reglas de Material

**Hairline Primero.** Usa bordes de 1px `#E2E2E0` antes de añadir sombra.

**Sin Glass.** Transparencias decorativas con blur no son parte de este sistema.

**Sin Gradientes de Marca en Fondos.** Los gradientes de rojo-dorado solo pueden aparecer en elements puntuales del hero (no como fondo de página ni de tarjetas).

## 5. Componentes Clave

### Botón Primario
Fondo `#C8102E`, texto blanco, 6px de radio, padding `10px 24px`, font-weight 500.  
Hover: fondo `#A50D26`. Focus: outline `2px solid #C8102E` con `outline-offset: 2px`.

### Botón Secundario
Borde `#C8102E`, texto `#C8102E`, fondo transparente. Mismo radio y padding que el primario.

### Tarjeta de Objeto (ItemCard)
Fondo paper `#FFFFFF`, borde `#E2E2E0`, radio 6px, sombra `0 1px 3px rgba(0,0,0,0.08)`.  
Muestra: **categoría** (badge dorado), **fecha**, **bloque**, **portería**. Nunca una foto.

### StatusBadge
- `EN_BODEGA`: fondo `#F7F1D4`, texto `#6E5600`
- `ENTREGADO`: fondo `#E6F4EA`, texto `#1B6B3A`
- `LISTO_PARA_DONACION`: fondo `#FDECEC`, texto `#9B1C1C`
- Radio pill `999px`, padding `2px 10px`, texto `0.75rem` weight 500.

### Formulario de Reclamo (ClaimForm)
Inputs con borde `#E2E2E0`, focus `#C8102E`. Labels siempre visibles. Mensajes de error en danger `#9B1C1C`. Submit en rojo primario.

### Header / Barra de Navegación
Fondo paper `#FFFFFF` con borde inferior `#E2E2E0`. Logo/monograma UF en rojo. Links en ink-muted, activo en brand rojo.

### Footer
Canvas `#F4F4F2` con separador superior en line. Texto en ink-subtle. Monograma UF en rojo.

## 6. Animación

Las animaciones son funcionales, no decorativas:

- **Controles (hover, focus):** `transition: all 150ms ease-in-out`
- **Modales y overlays (entrada):** `transition: all 200ms ease-out`
- **Dismissal (salida):** `transition: all 100ms ease-in`
- **Skeleton loading:** `animation: pulse 1.5s ease-in-out infinite`

Sin bounce, elastic, ni animaciones de más de 400ms en UI de producción.

## 7. Accesibilidad

- **Focus visible:** `outline: 2px solid #C8102E; outline-offset: 2px` en todos los elementos interactivos. **Nunca eliminarlo.**
- **Contraste mínimo:** WCAG AA — 4.5:1 para texto normal, 3:1 para texto grande y elementos de UI.
- **Labels en formularios:** Siempre visibles. Los placeholders no son sustitutos de labels.
- **ARIA:** Roles y atributos correctos en modales, dropdowns, y elementos custom.
- **Teclado:** Toda la UI debe ser navegable con Tab, Enter, y Escape.

## 8. Haz / No Hagas

### Haz
- Usa `#C8102E` como señal primaria inequívoca de la Universidad Libre
- Usa superficies claras (canvas + paper) para todo
- Mantén las tarjetas del catálogo sin fotos de objetos
- Usa Inter para UI y Source Serif 4 solo para display
- Usa sombras sutiles en tarjetas y nada más
- Mantén el `focus-visible` con `outline: 2px solid #C8102E`
- Escribe copy en español colombiano formal

### No Hagas
- No cambies `#C8102E` o `#B89600` sin aprobación del equipo
- No implementes dark mode sin solicitud explícita
- No expongas fotos de objetos, QR, ni ubicación de estante en UI pública
- No uses gradientes de marca en fondos generales
- No uses glassmorfismo ni blur decorativo
- No uses emojis en UI institucional
- No uses texto `#B89600` en tamaños pequeños (falla contraste)
- No uses sombras de color rojo o dorado
- No añadas decoraciones que distraigan de los datos del objeto
