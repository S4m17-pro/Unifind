# DESIGN.md — UniFind

Sistema visual vigente: **"Vitrina de aire"**. Rediseño de 2026-11-08.
Este archivo describe el mundo construido; no es una propuesta.

## Tesis

Los objetos perdidos descansan suspendidos en una vitrina de vidrio esmerilado.
La interfaz debe sentirse liviana, limpia y en calma: el estudiante no debe
estresarse buscando ni reclamando. La decoración flota; el contenido no se mueve
más de lo necesario.

## Paleta

| Rol | Valor | Uso |
| --- | --- | --- |
| Canvas | `#EEF3F9` | Fondo global (niebla azul-grisácea) |
| Superficie | `#FFFFFF` | Tarjetas, paneles, formularios |
| Tinta | `#0F172A` | Texto principal |
| Tinta secundaria | `#475569` / `#64748B` | Texto de apoyo |
| Primario | `#0F766E` (teal) | Acciones, enlaces, acentos de marca |
| Primario fuerte | `#115E59` | Hover y énfasis |
| Aviso | `#B45309` (ámbar) | Donación y advertencias |
| Éxito | `#047857` (esmeralda) | Confirmaciones y estados entregados |

Reglas:
- Un solo color de acción por vista: teal.
- Ámbar y esmeralda son semánticos, nunca decorativos.
- No se usa azul de marca; el azul solo aparece en estados del sistema.

## Tipografía

- **Display:** Schibsted Grotesk (títulos de página y secciones principales).
- **Cuerpo:** Inter.
- Jerarquía: título de página (3xl–6xl), título de sección (2xl), cuerpo (sm/base),
  etiquetas en mayúsculas con tracking amplio (11–12px).

## Superficies y elevación

- Tarjetas blancas sobre canvas, borde `slate-200` y **una sola capa** de sombra
  difusa (`0 18px 40px -32px`).
- El encabezado es una isla flotante: `sticky`, `rounded-2xl`, blanco al 80% con
  `backdrop-blur`.
- El hero del home es un panel de vidrio al 75%.
- Nada de bordes dobles ni sombras apiladas.

## Movimiento

- **Decoración flotante:** iconos de objetos (etiqueta, llave, teléfono, gafas,
  reloj, morral) en trazo fino al 5–8% de opacidad, con deriva vertical de 6–9 s y
  parallax leve al scroll. Solo en la vista pública.
- **Entrada:** fade-up de 480–520 ms con escalonado de 60 ms.
- **Hover:** elevación de 3 px en tarjetas, solo con puntero fino.
- **Carga:** spinner en botones; confirmaciones con check animado.
- Todo respeta `prefers-reduced-motion`: se elimina el movimiento, se conserva el
  fade.

## Componentes

- Botón primario: teal 700 → 600 en hover, texto blanco, radio `xl`.
- Botón secundario: borde `slate-300`, fondo blanco/70.
- Chips: píldoras blancas con borde teal suave.
- Badges de estado: azul-teal (en bodega), esmeralda (entregado), ámbar (donación).
- Formularios: fondo blanco, borde `slate-200`, foco teal; etiquetas en mayúsculas.
- Tablas: cabecera `slate-100`, bordes `slate-300` (reporte imprimible).

## Superficies

- **Público** (`/`, `/objetos`, ficha, reclamo): mundo completo con decoración flotante.
- **Paneles** (`/admin`, `/bienestar`): mismo sistema sin decoración flotante;
  densidad y elevación se reducen para uso prolongado en tablet.
- **Reporte PDF**: blanco puro, encabezado y pie de la app ocultos al imprimir.

## Accesibilidad

- Contraste mínimo 4.5:1 en texto normal.
- Foco visible teal en todos los controles.
- Decoración `aria-hidden`, `pointer-events-none`.
- Áreas táctiles ≥ 44 px en acciones principales.

## Anti-patrones

- Tableros corporativos grises y densos.
- Gamificación, neón, sombras duras, más de una capa de elevación.
- Mover contenido de lectura de forma continua.
- Mostrar jerga técnica (Cloudinary, estados internos, nombres de rol) al usuario.
