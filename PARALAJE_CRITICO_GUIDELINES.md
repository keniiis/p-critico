# CINEPHILE - Proyecto & Guías de Diseño Oficiales

> **ATENCIÓN PARA CUALQUIER IA / DESARROLLADOR FUTURO:** 
> Este documento contiene las reglas intocables de arquitectura y diseño del portal "Cinephile". Bajo NINGÚN CONCEPTO se deben alterar estas convenciones, paletas o estructuras de datos sin el permiso expreso y directo del usuario. El diseño actual es definitivo, minimalista y cuidadosamente curado.

---

## 1. Arquitectura del CMS (El "Backend" Sin Backend)
Cinephile **no utiliza** una base de datos tradicional (ni SQL, ni Firebase, ni Supabase) ni tampoco Colecciones de Contenido nativas de Astro (`src/content`).
*   **Fuente de la verdad:** Todos los datos residen exclusivamente en `src/data/reviews.json` y `src/data/news.json`.
*   **Panel de Administración Local:** El frontend del CMS se encuentra en `src/pages/admin.astro` y `src/pages/admin/news.astro`. Solo es accesible en entorno de desarrollo (`npm run dev`).
*   **Guardado de datos:** La persistencia se logra a través de un middleware inyectado en `astro.config.mjs` que escucha los endpoints `/api/save-review` y `/api/save-news` y reescribe los archivos JSON locales en disco usando `fs`. NUNCA modifiques esto para requerir un backend externo.

## 2. Reglas Estrictas de Diseño y UI
El diseño visual es brutalista, minimalista y cinematográfico. No agregues colores estridentes ni sombras que no estén documentadas aquí.

### Paleta de Colores
*   **Fondo principal (`bg-background`):** `#09090b` (Zinc 950 ultra oscuro).
*   **Paneles y Tarjetas (Glassmorphism / `glass-panel`):** Utilizan bordes sutiles `border-white/10` y fondos semitransparentes (ej. `#18181b` o gradientes de negro a transparente).
*   **Texto principal (`text-on-surface`):** Blanco puro o casi puro para máxima legibilidad de los títulos.
*   **Texto secundario (`text-tertiary` / `text-zinc-500`):** Grises pálidos para metadatos, descripciones y el footer.
*   **Acentos:** Colores muy controlados (ej. amarillo `#facc15` para las estrellas de puntuación, azul `#3b82f6` para destacar bordes del admin).

### Tipografía
*   **Display / Títulos:** `Outfit` (font-display-lg, font-headline-md).
*   **Cuerpo de Texto:** `Inter` (font-body-lg).
*   **Metadatos, Botones y Etiquetas:** `Roboto Mono` o variaciones en mayúsculas con tracking ancho (`tracking-widest`, `uppercase`, `text-[10px]` o `text-xs`).

### Imágenes (Regla Crítica)
*   **`heroImage` (Panorámicas 16:9):** Se usan en las cuadrículas estilo Bento ("Recent Reviews"), en los encabezados de los artículos y en la portada principal. Nunca se deben usar pósters verticales en contenedores anchos.
*   **`posterImage` (Verticales 2:3):** Se utilizan ESTRICTAMENTE para la sección de cuadrícula de "Trending Films". 

## 3. Comportamiento y Componentes
*   **Logos de Plataformas de Streaming:** En `reviews.json`, los logos de disponibilidad (Netflix, Cines, Max, etc.) usan **imágenes en Base64 incrustadas** (SVG de un icono de TV con botón de play o el ticket nativo). Está PROHIBIDO usar URLs de Wikipedia o servicios externos que puedan sufrir bloqueos por "hotlinking".
*   **Footer:** Se mantiene extremadamente minimalista. Solo contiene el logo "CINEPHILE" hipervinculado a `/` y el copyright "© 2026 CINEPHILE. ALL RIGHTS RESERVED." No se deben añadir columnas de navegación.
*   **Filtros y Paginación:** Están ocultos o capados en las páginas principales (`/reviews` y `/news`) hasta que haya un volumen de contenido real que lo justifique (más de 9 reseñas). En la página de inicio, "Recent Reviews" se limita a `.slice(0, 4)` y "News" a `.slice(0, 3)`.

## 4. Estructura de Rutas
*   `/` -> Portada. Consume listas invertidas (`.reverse()`) para mostrar lo más nuevo.
*   `/reviews` -> Lista general de reseñas.
*   `/reviews/[slug]` -> Renderizado dinámico de reseñas individuales basándose en las claves de `reviews.json`.
*   `/news` -> Lista general de noticias.
*   `/news/[slug]` -> Renderizado dinámico de noticias individuales basándose en `news.json`.

> **Firma:** Antigravity (IA), documentado a petición del Creador de Cinephile. Mayo de 2026.
