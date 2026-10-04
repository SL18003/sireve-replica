# SIREVE Replica — Contexto del proyecto

Documento para agentes de IA y desarrolladores. Léelo **antes** de explorar el código completo. Evita releer todo el historial de chat o escanear el repo entero si este archivo responde la duda.

**Sitio de referencia oficial:** https://sireve.csuca.org/index.php  
**Referencia de estilo institucional:** https://bienal.csuca.org/ (CSUCA, no copiar paleta teal de otras ramas)

---

## Qué es este proyecto

Réplica frontend del **Sistema Regional de Vida Estudiantil (SIREVE)** del **CSUCA** (Consejo Superior Universitario Centroamericano). Es una SPA en React que refleja el contenido y la navegación del sitio oficial, con un rediseño más moderno pero identidad institucional (azul + dorado).

No hay backend. El formulario de contacto está preparado para Formspree en el futuro (comentario en el código), pero hoy solo muestra feedback de demostración.

---

## Stack técnico

| Tecnología | Uso |
|---|---|
| React 19 + Vite 8 | App y build |
| React Router 7 | Rutas |
| **Gravity UI** (`@gravity-ui/uikit`, `@gravity-ui/icons`) | Botones, cards, inputs, texto, skeletons, iconos |
| CSS propio (archivos `.css` por página/componente) | Layout, paleta, hero, cards custom |
| **No usa Tailwind** | Decisión explícita; no migrar a Tailwind salvo que el usuario lo pida |

Estilos: tokens en `src/index.css` + CSS por página. Gravity UI aporta controles; el look CSUCA es custom.

---

## Ramas y deploy (historial)

- Trabajo reciente en rama tipo `David-main` (puede variar).
- Otras ramas del repo (`main`, `richard`, etc.) pueden tener diseños distintos (p. ej. teal/slate). **No copiar paletas de otras ramas** sin pedirlo.
- Deploy histórico: `richard` → GitHub Pages; `main` / Netlify con `npm run build` y publish `dist`.

Comandos habituales:

```bash
npm run dev
npm run build
```

---

## Estructura relevante

```
src/
  App.jsx                 # Rutas
  index.css               # Tokens globales, tema claro/oscuro, page-hero, .btn-ver
  data/
    programs.js            # Data central de los 5 programas + ediciones (historial)
    galleryData.json      # Álbumes reales 2017/2018 (URLs del sitio oficial)
    galleryData.js        # Export + fallback 2019
    presidents.js         # Presidentes del CONREVE: lista `presidents` + helpers de la línea de tiempo (vacía hoy)
  utils/imageFallback.js  # onError → /images/placeholder.jpg
  components/
    Layout/               # Header, Footer, PageHeader, SocialLinks, Layout
    Gallery/GalleryAlbum  # Carrusel por álbum + lightbox
  pages/
    LandingPage.jsx       # Inicio (hero, acceso rápido, carrusel, programas)
    Programa.jsx          # /programas/:slug (detalle + historial de ediciones)
    Actas.jsx
    GaleriaIndex.jsx      # /galeria (línea de tiempo + años)
    Galeria.jsx           # /galeria/:year
    Reglamentos.jsx
    Contacto.jsx
public/images/            # Logos y assets locales (no depender solo de Unsplash)
```

`Sidebar.jsx` existe pero el layout activo usa **Header horizontal**, no sidebar.

---

## Rutas

| Ruta | Página |
|---|---|
| `/` | Landing |
| `/actas` | Actas SIREVE |
| `/galeria` | Índice: línea de tiempo de presidentes + años |
| `/galeria/:year` | Galería por año (`2017`, `2018`, `2019`) |
| `/reglamentos` | Reglamento general |
| `/contacto` | Formulario + info |
| `/programas/:slug` | Página de programa (`ficcua`, `juduca`, `premio-ruben-dario`, `promotoras-salud`, `voluntariado`; slug inválido → aviso con enlace al inicio) |

**Programas:** cada uno tiene **página propia** en `/programas/:slug` (leer `src/data/programs.js`). El dropdown "Programas" del header y la columna Programas del footer **enlazan esas páginas**. En la landing siguen existiendo las anclas `#ficcua`, `#juduca`, `#premio-ruben-dario`, `#promotoras-salud`, `#voluntariado` (ids de las cards) y `#sireve` / `#programas` (el botón "Ver programa" navega a la página; no hay rutas `/ficcua` etc.).

---

## Identidad visual (obligatorio)

### Paleta CSUCA (manual de identidad)

Definida en `src/index.css`. Rampa azul oficial, de **oscuro a claro** (p.75 del manual):

| Token | Hex | Nombre en el manual |
|---|---|---|
| `--sireve-primary` | `#1366af` | GREEN BLUE — **color principal, límite oscuro** |
| `--sireve-blue-200` | `#1e71b6` | SPANISH BLUE |
| `--sireve-blue-300` | `#297bbd` | STEEL BLUE |
| `--sireve-blue-400` | `#2f85c3` | GREEN BLUE CRAYOLA |
| `--sireve-blue-500` | `#3b90c9` | GREEN BLUE CRAYOLA |
| `--sireve-primary-light` | `#429ad0` | CAROLINA BLUE — **límite claro** |

Alias: `--sireve-primary-mid: #297bbd`. **`--sireve-primary-dark` resuelve a `#1366af`** porque el manual *no define ningún azul más oscuro* que GREEN BLUE; no inventar un tono "dark".

**El manual invierte la rampa:** GREEN BLUE `#1366af` es el más oscuro y CAROLINA BLUE `#429ad0` el más claro. No usar un azul marino profundo como primario (error previo, ya corregido).

Neutros, solo los tres oficiales:

- `--sireve-ink: #000000` (Black), `--sireve-white: #ffffff` (White), `--sireve-grey: #878787` (Battleship Grey)
- Derivados por alpha, no colores nuevos: `--sireve-muted: rgba(0,0,0,0.68)`, `--sireve-surface: rgba(135,135,135,0.08)`, `--sireve-border: rgba(135,135,135,0.32)`
- El texto secundario usa **Black con alpha** y no Battleship `#878787`, porque sobre blanco ese gris queda en 3.3:1 y no pasa AA.

**Android Green `#47ac34` y Battleship Grey `#878787` se usan única y exclusivamente en el isologo.** El logo oficial ya incorpora el verde en su PNG, así que **no existe ningún token de verde en el CSS**: botones, badges, reglas, iconos y hover van en la rampa azul o en blanco/negro. No reintroducir la paleta dorada anterior (`#c9a227`) ni acentos por card.

### Tipografía y formas

- **Montserrat** vía Google Fonts (pesos 100/300/400/600/700), fallback a system stack.
- Se sobrescriben las variables `--g-font-family-sans` y `--g-text-*-font-family` para Gravity UI.
- **Títulos Thin/light: `font-weight: 300`** (csuca.org usa weight 100 en sus h1–h6). Texto en 400, títulos de card chica en 600.
- **Radios:** `--sireve-radius: 4px`, `--sireve-radius-sm: 3px`, `--sireve-radius-input: 7px`. El manual prescribe 3-5px, esquinas casi rectas. **No** usar `999px` (pills) ni radios grandes.
- Sin formas curvas decorativas: se eliminaron blobs, ondas y gradientes radiales del hero.

### Tema oscuro

Fondo página: **`#000000` (Black)**. Superficies y bordes con Battleship Grey en alpha, nunca azul marino inventado:

- Superficie de card: `rgba(135,135,135,0.14)`
- Hover: `rgba(135,135,135,0.22)`
- Bordes: `rgba(135,135,135,0.3)` / hover `var(--sireve-primary-light)`
- Texto: blanco, secundario `rgba(255,255,255,0.72)`

**Tema oscuro — ELIMINADO por petición del usuario (2026-10).** `App.jsx` usa `<ThemeProvider theme="light">` fijo, ya no hay estado de tema, `Layout`/`Header` no reciben props de tema y **se quitó el botón de tema** de la barra. Las ~62 reglas `.g-root_theme_dark` **permanecen en el CSS como código inerte** (decisión del usuario: "quitar toggle, dejar CSS inerte") por si algún día se quiere recuperar; si se decide borrarlas, hay que editarlos en `index.css`, `LandingPage.css`, `Programa.css`, `Actas.css`, `Galeria.css`, `Contacto.css`, `GalleryAlbum.css` y `Sidebar.css`.

**Importante (histórico):** en la versión oscura las cards no deben verse gris cálido/marrón. La base negra + gris neutro lo resolvía; no volver a inventar azules (`#0d1b26`, `#152633`, `#1b3041` ya no se usan).

### Contraste

- Texto sobre fondos oscuros: **blanco o claro**, nunca azul oscuro sobre azul oscuro.
- **REGLA CENTRAL: el azul es CROMO, no superficie de contenido.** Verificado en el CSS real de csuca.org: los únicos fondos institutionales son `.top-head`, `header.site-header`, los submenús y `.site-footer`, todos `#429ad0`; **todo el contenido es blanco** y las fotos van a sangre (SmartSlider, sin overlay azul). Antes esta réplica pintaba de `#1366af` el hero, la sección SIREVE y el `page-hero` de las 4 páginas internas, y el usuario reportó "se ve demasiado azul toda la página".
  - **Header y footer en CAROLINA BLUE `#429ad0` con texto BLANCO.** El usuario descartó el texto negro ("se ve feo") y pidió blanco como en csuca.org. Nota: blanco sobre `#429ad0` da 3.1:1, lo mismo que el sitio oficial; se compensa con `font-weight: 600` en la navegación y con chips `#1366af` (5.9:1) en hover/activo.
  - **Contenido (hero, sección SIREVE, `page-hero`, cards) sobre `var(--g-color-base-background)` = blanco.** El azul queda como color de título, ícono, botón y filete.
  - Filetes que mantienen la estructura: `border-bottom: 4px solid #1366af` en la franja inferior del footer; `border-top: 4px solid #1366af` en `.page-hero`. El hero **no** tiene filete inferior (blanco puro hasta SIREVE).
- **Prohibido el negro como fondo en modo claro.** Solo existe `#000000` de fondo en el tema oscuro. Eliminadas la top bar negra del header y la franja negra de "derechos reservados". El único texto negro restante está dentro de superficies blancas (menús desplegables y panel móvil), que es donde corresponde.
- **Hover/activo de navegación:** chip `#1366af` con texto blanco. El enlace CTA "Contacto" es blanco con texto `#1366af` y se invierte al hover.
- **Zona de menús siempre clara:** `.header-dropdown-menu` y el panel móvil son blancos con texto negro en ambos temas (se quitaron sus overrides de dark mode). En el panel móvil los enlaces, el botón de tema y los íconos sociales vuelven a `#000` para no perderse sobre el blanco.
- **Enlaces del footer:** hover con subrayado + `font-weight:600`, **no** con `#1366af` (ese azul sobre CAROLINA solo da 1.7:1).
- **Hero en blanco, centrado, SIN imágenes:** `.landing-hero` es flex centrado (`max-width: 1280px`, `text-align: center`) — **el usuario no quiere imágenes en el hero** (ni fondo, ni franja, ni foto lateral). Estructura: logo oficial ampliado sobre placa blanca que **hace de título** (envuelto en `<h1 class="landing-hero-h1">`, `.landing-hero-logo` a **120px**, móvil 88px; siguiendo `csuca.org/es/sireve`, donde el logo va grande como encabezado), subtítulo "Consejo Superior Universitario Centroamericano" en `--sireve-muted`, stats en 3 tarjetas con iconos, CTAs centrados (primario azul con texto blanco). Sin filete inferior. **Prohibido cualquier imagen en el hero**: la foto como fondo con overlay dejaba parches celestes; la franja `.landing-hero-media` (260px) fue eliminada por petición; y el panel lateral `.landing-hero-figure` (`programs/sireve.jpg`) se quitó por petición — `hero.jpg` y `programs/sireve.jpg` siguen en disco **sin uso**. La placa del logo es blanca con borde `1px solid var(--sireve-border)` para leerse sobre blanco.
- **Botones sobre fondo blanco:** `.landing-btn-primary` = relleno `#1366af` con texto blanco (5.9:1) y `.landing-btn-secondary` = blanco con borde/texto `#1366af`. Antes iban invertidos porque el hero era azul; ya no aplica el CTA de "relleno blanco con texto azul" salvo sobre superficies oscuras.
- Títulos azules sobre negro (dark mode) → **CAROLINA `#429ad0`** (8.6:1), porque `#1366af` sobre `#000` solo da 3.9:1. Aplica a `.page-hero-title`, `.page-hero-icon`, `.landing-hero-stat-value`, `.sireve-title`, `.sireve-eyebrow` y `.sireve-rule`.
- Botones `view="action"` de Gravity: forzar texto **blanco** sobre azul (reglas en `index.css`).
- Hover de botones: no hay azul más oscuro, así que sube a **STEEL BLUE `#297bbd`**.
- Header: barra `#429ad0` con texto blanco y nav en `font-weight:600`, filete inferior `#1366af`. **Sin top bar negra**: `.header-brand` = logo + `.header-brand-title` **"Consejo Superior Universitario Centroamericano" en DOS renglones** (2026-10, petición del usuario: se quitó "Sistema Regional de Vida Estudiantil" de la navbar, ese nombre vive en el hero). El corte es **explícito con `<br />`** y cada renglón va en `white-space: nowrap`, así que el texto **nunca puede partirse en 3+ líneas** (el usuario reportó que salía en 3). Medido en Chrome headless con Montserrat 600: "Consejo Superior Universitario" = **206.3px** y "Centroamericano" = 118.7px a 13px. Como el nav de escritorio completo + logo + redes necesita **~1261px** de viewport, el nombre **solo se muestra desde 1300px** (`@media (max-width: 1300px) { .header-brand-text { display: none } }`): por debajo queda solo el logo con el nav intacto, sin texto aplastado ni desborde. Antes el umbral era 1080px y entre 1081-1299px el flex aplastaba el bloque (a 1200px quedaba en 115px → 3-5 renglones ilegibles; a 1081px en 0px). Verificado con un iframe de probe servido desde `public/` (mismo origen que el dev server) a 1600/1440/1408/1360/1320/1301px: `overflow=0`, `lines=2`, hueco real 34-108px. **Nunca se recorta con ellipsis.** El dropdown **Programas enlaza las páginas** `/programas/:slug` (no anclas) y hay un enlace externo **"CSUCA ↗"** (`https://csuca.org/`, pestaña nueva, `.header-link--external`) después de Contacto — pedido del usuario ("deja en un lugar estratégico el sitio de csuca"). **Sin botón de tema** (dark mode eliminado).
- **Cómo medir anchos reales del navbar** (no hay Playwright/Puppeteer y no se deben instalar): Chrome headless con `--dump-dom` sobre una página que espere `document.fonts.ready` y lea `getBoundingClientRect`; para probar varios breakpoints, un iframe de probe servido desde `public/` y redimensionado en bucle (los media queries del iframe responden a su propio ancho). Chrome queda en `C:\Program Files\Google\Chrome\Application\chrome.exe`. Los archivos de probe son temporales: borrarlos al terminar.
- Footer: bloque `#429ad0` con texto y enlaces blancos + franja inferior `#1366af` con texto blanco. Columna Programas → páginas `/programas/:slug`; columna Recursos incluye **"Sitio oficial CSUCA"** (externo, pestaña nueva).
- Logo en hero y en header/footer: el logo oficial es negro + azul `#1066B0` y **no admite filtros**. Va sobre una **placa blanca** (`.header-brand-logo`, `.footer-brand-row`, `landing-hero-logo-plate`) respetando su área de protección. **No** invertir el logo a blanco. **No** reemplazarlo por un bloque de marca grande/rediseñado (el usuario lo descartó).

### Logos y redes

- Logo único: `public/images/logo-csuca.png`, tomado de `https://csuca.org/wp-content/uploads/2026/05/Mesa-de-trabajo-1-1024x323.png` (original PNG 1024×323, transparente). **Recortado al bbox del contenido → 675×188**: el original tenía márgenes transparentes de 186/163 px a los lados y 68 arriba/abajo, lo que hacía que el logo se viera pequeño dentro de su caja (el usuario lo reportó). Si se necesita el original, descargarlo de la URL. `logo-sireve.png` y `logo-csuca.svg` fueron eliminados.
- Header y Footer muestran logos + redes:
  - Facebook: https://www.facebook.com/csuca/
  - X: https://x.com/SGCSUCA
- Componente: `SocialLinks.jsx`.

---

## Responsive (celular, tablet y táctil)

Alcance acordado con el usuario (2026-10): **celular + tablet + táctil, solo CSS**. No se agreed gestos swipe por JS ni reescribir `.jsx`; la navegación, rutas y enlaces quedan intactos. Escritorio no cambia.

- **Breakpoints**: se conservan los existentes (`1280` header, `1080` header, `960` header/redes, `900`, `768`, `600`) y se agregan `1100` (solo lightbox), `480` (solo hero) y `380` (ajuste de padding). En el build, Lightning CSS los minifica a sintaxis de rango (`width <= 1100px`); es intencional, no editar el bundle.
- **Nunca usar `overflow-x: hidden` en `html`/`body`**: rompe `position: sticky`. El recorte global es `overflow-x: clip` en `index.css`, junto con `-webkit-text-size-adjust: 100%` (evita el zoom de iOS al rotar).
- **Objetivo táctil**: ~40–44px de alto en lo que se pulsa con el dedo (`.btn-ver` 42px, toggle del header 44px, redes 40px, flechas de galería 44px, botón Consultar 44px, links de correo/teléfono y del footer con `padding` vertical).
- **`:hover` no existe en táctil**: donde el hover era la única forma de ver un control, se añade `@media (hover: none)` para mostrarlo siempre (flechas del carrusel de galería).
- **Hero**: el logo de la placa mide `height: min(88px, 21vw)` en ≤480px y la placa tiene `max-width: 100%`; así nunca se recorta (a 320px el logo queda en ~241px dentro de una placa de 288px). Se calculó el ancho para 320/375/430/480/600px.
- **Grids**: `minmax(min(300px, 100%), 1fr)` en Actas y Galería, para que una columna no desborde en horizontal.
- **Textos chicos**: se elevaron a 11–13px los que estaban en 10–12px (`.program-meta-label`, `.program-edition-logo span`, `.footer-csuca`, `.footer-col-title`, botón de Reglamentos).
- **`.program-other-sub`** ya no usa `nowrap` + ellipsis (truncaba "Premio Rubén Darío" en móvil); ahora `-webkit-line-clamp: 2`.
- **Lightbox**: entre 769 y 1100px las flechas (`left/right: -64px`) y el botón de cerrar (`top: -48px`) quedaban **fuera de la pantalla**; el arreglo de ancho del `@media` pasó de 768 a **1100px** (iPad 810–1024px, Kindle, netbooks). Además el overlay es `overflow-y: auto` y el pie hace `flex-wrap` para landscape de celular.
- **Orden de reglas**: en `Contacto.css` los overrides móviles van **dentro** del `@media` que ya existía, no al final del archivo, porque las reglas `.g-root_theme_dark` posteriores tienen la misma especificidad y ganarían.
- **Pendiente de validación humana**: no hay navegador headless en el entorno, así que el ajuste fino visual en un celular real lo confirma el usuario.

---

## Comportamiento por sección

### Landing (`LandingPage.jsx`)

- Hero **blanco centrado, sin imágenes**: logo oficial ampliado (`.landing-hero-logo` a **120px**, móvil **88px**) sobre placa blanca con borde, envuelto en `<h1 class="landing-hero-h1">` con alt "SIREVE — Sistema Regional de Vida Estudiantil (CSUCA)" — el logo **hace de título** (no hay `<Text>` de título de texto; igual que `csuca.org/es/sireve`); subtítulo **"Consejo Superior Universitario Centroamericano" (se mantiene, pedido del usuario)**, stats y CTAs (primario azul con texto blanco) centrados. **Sin foto lateral** (`.landing-hero-figure` eliminada por petición: "yo no quiero usar imagenes").
- **Stats en 3 tarjetas con iconos:** `.landing-hero-stats` = fila centrada (`gap: 16px`, `width: fit-content`) de **3 tarjetas independientes** con `--sireve-surface` + borde `--sireve-border` + radio (en dark suben a superficie `rgba(135,135,135,0.14)`). Cada tarjeta: **icono Gravity** (`GraduationCap` = universidades, `BookOpen` = programas, `Globe` = países) de 26px en `--sireve-primary`, cifra **36px** (móvil 22px) y etiqueta en versalitas `--sireve-muted`; icono y cifra pasan a CAROLINA en dark. Antes era un panel único con divisores y antes aún 3 cajas grises sueltas; la estructura de tarjetas fue la corrección pedida ("dale buena estructura a las cajas o quítalas pero conserva el contenido").
- **Espaciado compacto entre secciones:** hueco hero → "¿Qué es SIREVE?" = **88px** (`.landing-hero` `padding-bottom: 40px` + `.sireve-section` `padding-top: 48px`; antes eran 152px + `min-height` y el usuario lo reportó como "demasiado espacio entre los botones y Qué es SIREVE"). `.sireve-section` = `48px 24px 40px`, `.quick-section` = `40px 24px 72px` → **80px** entre SIREVE y Acceso rápido; móvil 72px. Filete de títulos `.section-title::after` en `#1366af` (un solo azul de acento, igual que `.sireve-rule`), en CAROLINA sobre dark.
- **SIREVE es el programa marco**: sección propia `id="sireve"` (fondo blanco, título/regla/CTA en `#1366af`, mosaico de 5 fotos de programas). Va antes de Acceso rápido.
- Acceso rápido: Actas, Galería, Reglamentos.
- Carrusel “Vida estudiantil”: **3 fotos reales** del media de csuca.org (tabla abajo), recortadas a **1400×600**, con alts descriptivos en español.
- Programas: **5 cards** (FICCUA, JUDUCA, Excelencia Académica/Premio Rubén Darío, Promotoras de Salud, Voluntariado) — SIREVE ya **no** es una card. Cada card muestra solo el `excerpt` y un botón **"Ver programa →"** (`.program-card-cta`, relleno `#1366af`) que **navega a `/programas/<slug>`**. Se eliminó el expand "Leer más/Leer menos" (el texto completo vive en la página del programa). Las cards se pintan desde `src/data/programs.js` (mismo origen que las páginas).
- Sin acento por color: todas las cards comparten la misma rampa azul.
- Fotos de programas son **reales del media de csuca.org** (ver abajo); `onError` → placeholder.

### Programas — página por programa (`/programas/:slug`)

- **Una sola página genérica** `src/pages/Programa.jsx` + `Programa.css` lee `useParams().slug` en `src/data/programs.js` (los textos salen de ahí; landing y páginas comparten data). Slug inválido → `PageHeader` "Programa no encontrado" + botón de vuelta (sin crash).
- **Estructura de la página:** `PageHeader` estándar (blanco, filete `#1366af`, ícono por programa: `MusicNote` FICCUA, `Cup` JUDUCA, `Medal` Excelencia, `HeartPulse` Promotoras, `Person` Voluntariado) → **tira de ficha rápida** (3 chips: `Globe` Ámbito "Regional centroamericano", `CircleInfo` Órgano "SIREVE · CONREVE", `Book` Cobertura "30+ universidades del CSUCA"; son los únicos datos que se afirman, no hay info inventada) → bloque "El programa" (descripción oficial en 2 columnas + foto real enmarcada) → **"Historial de ediciones"** → **"Otros programas"** (4 mini-cards con imagen e ícono hacia los demás) → botón "← Volver a programas" (`to="/#programas"`).
- **Sin sección "Enlaces del programa"** (el usuario la quitó, 2026-10): no se muestran las cards de Drive/Galería/Reglamento dentro de las páginas de programa. El campo `resources` **se conserva en `src/data/programs.js`** (junto con la constante `DRIVE`) como datos disponibles, pero **no se renderiza**; las mismas URLs siguen accesibles desde `/actas` y el footer. Si se reimplanta la sección: `.program-links`, `.program-links-grid`, `.program-link-*` (esas reglas se borraron de `Programa.css`) y `resourceIcons = { Folders, Picture, Book }`.
- **Historial:** `editions: []` en los 5 programas — **no hay años confirmados**, así que la página muestra **un solo panel punteado** (`.program-editions-empty`): ícono + "Espacio reservado para las ediciones" + "Aquí se publicarán la gráfica o mascota, la sede y los documentos de cada edición". Nunca escribir años de ejemplo.
- **Cuando el usuario llene las ediciones**, cada fila = **slot de logo/mascota/flayer a la izquierda** (140×110, `border: 1px dashed`, ícono + rótulo del año; con `logo` cargado → imagen `object-fit: contain` y borde sólido) + derecha: título de edición (`title` o `año` automático), sede (`place`) y zona de documentos (`links`: cada chip es un `<a>`/`Link` que abre **cualquier URL** — Drive, PDF, `/galeria/2019` o sitio externo; vacía → nota "espacio reservado"). `year` es opcional.
- **Para rellenar más adelante (el usuario no tiene la info todavía):** todo se edita en `src/data/programs.js` — `logo` (imagen subida a `public/images/programs/editions/<slug>-<año>.png`), `year`, `place`, `links`. El archivo tiene comentarios con un ejemplo completo. **No tocar componentes para agregar contenido.**
- Dark mode: reglas `.g-root_theme_dark` **inertes** (el sitio es solo claro; ver "Tema oscuro" arriba).

### Fotos de programas (origen verificado)

Las URLs en `galleryData.json` (`sireve.csuca.org/cache/widgetkit/...`) están **muertas**: el sitio responde con HTML, no con la imagen. Por eso las fotos de `public/images/programs/` se descargaron del **media de csuca.org** (WordPress REST API, `csuca.org/wp-json/wp/v2/media`):

| Archivo | Álbum / medio |
|---|---|
| `ficcua.jpg` | FICCUA1 (2026/08) |
| `juduca.jpg` | congresillomarzo2023 |
| `excelencia.jpg` | PORTADA-SITIO-WEB-RUBEN-DARIO |
| `salud.jpg` | V Encuentro Red CCCUPS |
| `voluntariado.jpg` | DIA-DEL-VOLUNTARIADO-CSUCA-WEB |
| `sireve.jpg` | (ya no es card ni foto del hero; **sin uso**, conservar) |

### Fotos del carrusel (origen verificado)

`public/images/carousel/1–3.jpg` son **fotos reales** descargadas del media de csuca.org (método que con `programs/`), recortadas a 1400×600:

| Archivo | URL original | Contenido |
|---|---|---|
| `carousel/1.jpg` | `2026/08/IMG_0618.JPG-scaled.jpeg` (2560×1707) | Autoridades con las banderas centroamericanas |
| `carousel/2.jpg` | `2026/10/SIREICU1.jpeg` (1500×1000) | Plenaria del 5.º SICEVAES (UNED Costa Rica) |
| `carousel/3.jpg` | `2026/09/SICEVAES4.jpeg` (1600×921) | Comité frente al Auditorio Cora Ferro Calabrese (UNA) |

**Ojo:** los nombres de archivo del media **no describen el contenido** (`SIREICU1` es la plenaria SICEVAES y `SICEVAES4` es la foto de la UNA) y `wp/v2/media?search=...` devuelve el primer homónimo, que puede ser de otro mes. Verificar siempre el contenido visual antes de instalar.

### Actas

- 5 categorías; botón **Consultar** abre Google Drive en pestaña nueva (`target="_blank"`), igual que el sitio oficial.
- **No** usar modales, listas falsas ni `alert()` para actas.

Enlaces oficiales:

| Categoría | URL Drive |
|---|---|
| CONSEJO DIRECTIVO CONREVE | https://drive.google.com/drive/folders/1lOTQdIyd4qffetTIOtlz5vlaYvx2aE_h |
| FICCUA | https://drive.google.com/drive/folders/1DfOaQ_DFvqHXgVvk5X19PlLu44JK_Hc4 |
| JUDUCA | https://drive.google.com/drive/folders/1Wfw6WwTzJWllWrIAGM6qs_hnoNc3Q35g |
| PROMOTORAS DE LA SALUD | https://drive.google.com/drive/folders/1-y2M78ic5uRzOBZKeAF08BqGEkYb1E_W |
| SESIONES CONREVE | https://drive.google.com/drive/folders/1rx_yImAJi__RcTDTp6Mv61FYJ0hc5h1Q |

Fuente: https://sireve.csuca.org/index.php/actas

### Reglamentos

- **Sin modal.** “Consultar” abre el PDF de Drive directamente.
- URL: https://drive.google.com/file/d/10Xzi970AWcU-wtjjToGSosP54_dXWo-M/view?usp=sharing  
- Fuente: https://sireve.csuca.org/index.php/reglamentos

### Galería

- Datos reales de 2017 y 2018 scrapeados del oficial (Widgetkit slideshows) en `galleryData.json`.
- Cada álbum tiene **varias imágenes** (carrusel en la card: flechas, dots, contador).
- Clic en la miniatura abre **lightbox** a pantalla completa.
- Cursor sobre la miniatura: **`pointer` (manita)**, no `zoom-in` ni icono de lupa con “+”.
- 2019: el oficial no tiene galería publicada; hay fallback local en `galleryData.js`. **Sin aviso de "contenido de demostración"** (el usuario lo quitó por petición el 2026-10: `demoYearNotes` y las reglas `.galeria-demo-note` / `.galeria-year-note` se eliminaron). Las fotos de 2019 son locales de relleno, no del sitio oficial: no inventar albums reales para ese año.
- Imágenes del oficial suelen ser **600×300** (caché Widgetkit). En lightbox se ven “pequeñas” por resolución, no por bug de CSS. No inventar upscale agresivo.
- La lista de años de `/galeria` sale de `Object.keys(galleryByYear)` (no de un array aparte): una sola fuente de verdad.

#### Línea de tiempo de presidentes (CONREVE) — `/galeria`

- **Decisión de estructura (2026-10): el eje es el MANDATO, no el año.** El CONREVE elige Comité Directivo en sesión ordinaria, los mandatos duran 2 años y **las elecciones caen a mitad de año** (julio 2019, julio 2021, julio 2023, mayo 2025). Por eso un mismo año puede tocar a **dos** presidentes y agrupar por año mentiría.
- **Datos en `src/data/presidents.js` con `presidents: []`** (el usuario todavía no tiene la información). Mismo patrón que `editions: []` de los programas: vacío = panel punteado. **Se llena solo editando ese archivo**, sin tocar componentes.
- El archivo trae ejemplos comentados y **desactivados** con datos verificados en csuca.org (Jorge Cortez Martínez, Universidad de El Salvador, 2023–2025, reelegido en la LIII Sesión Ordinaria —UNAH, mayo 2025— para 2025–2027). No hay que publicarlos sin que el usuario confirme.
- `termFrom`/`termTo` aceptan `"2021"` o `"2021-07"`. Un bloque **por mandato** (si hubo reelección, van dos bloques del mismo presidente).
- `getTimeline()` asigna cada año con galería al presidente con **más meses** de ese año; en empate (año de transición, p.ej. julio 2019) gana el que entró después, que es el vigente al cierre. El año con menos de 12 meses se marca como `parcial`.
- Solo se generan chips para años que **existen en `galleryByYear`** → la línea de tiempo nunca produce enlaces rotos. Un mandato sin años muestra “Sin galerías publicadas de este periodo”.
- `getPresidentForYear(year)` alimenta el chip de `/galeria/:año`: “Presidente del CONREVE en 2019: Nombre · Universidad · mandato 2017 - 2019 (año de transición)”. Con `presidents: []` el chip no se renderiza.
- Foto opcional por presidente en `public/images/presidents/<id>.jpg` (sin foto, la ficha es solo texto).
- **Orden en la página:** con datos la línea de tiempo va arriba (es el eje de lectura); **vacía va debajo** de las tarjetas de año, para no tapar el contenido real (en celular el panel reservado empujaba las galerías ~600px). Se resuelve con `order: 2` de `.galeria-sections--timeline-last`.
- Verificado con datos de prueba (ya revertidos a `[]`): timeline de 2 mandatos, 3 chips, año 2019 marcado `parcial`, sin overflow a 320/375/480/600/768/1024/1280px.

Referencia: https://sireve.csuca.org/index.php/2017

### Contacto

- Formulario + tarjeta de información. **El formulario NO envía nada**: es demostración (el botón solo dispara un `alert("Mensaje enviado (demostración)...")`) y no hay backend. El usuario lo dejó así a propósito (2026-10); cuando quiera envío real: **FormSubmit.co** (`action="https://formsubmit.co/<correo>"`, sin cuenta) o **Formspree** (requiere cuenta + ID). Ya hay un comentario en `Contacto.jsx` con la línea a activar.
- **Datos reales de la Secretaría General del CSUCA** (verificados en `csuca.org/es`, footer "¡Encuéntranos aquí!"): Av. Las Américas 1-03, Zona 14, interior Club Deportivo Los Arcos, Ciudad de Guatemala, Guatemala · **+(502) 2502-7500** · **sg@csuca.org**. `info@sireve.csuca.org` y `+503 2222-2222` eran inventados y se eliminaron. Correo y teléfono son enlaces `mailto:` / `tel:` (`.contacto-info-link`, `.footer-link-inline`).
- Nota: `sireve.csuca.org` hoy es un WordPress de ejemplo (sin datos de contacto); el SIREVE se comunica por el CSUCA, de ahí que la página apunte a la Secretaría General.

---

## Preferencias y consideraciones del usuario (no ignorar)

1. **Contenido alineado al oficial** cuando existan enlaces reales (Drive de actas/reglamentos, galerías).
2. **Secciones no vacías:** si falta contenido, usar placeholders genéricos funcionales (imágenes locales, listas demo solo donde no haya URL real).
3. **No modales innecesarios** en Reglamentos (abrir Drive directo). Actas tampoco usa modal.
4. **UI rica pero no recargada:** cards de programas/actas con overlays y hover; hero con stats y animaciones, pero el logo del hero debe seguir siendo el oficial legible (sobre placa blanca), no un rediseño grande. **El hero no lleva imágenes** y el título de texto fue sustituido por el logo ampliado (pedido explícito).
5. **Contraste** es prioritario; el sitio es **solo tema claro** (el modo oscuro fue eliminado por petición del usuario, 2026-10). El usuario reportó gris “raro” en cards oscuras y botones ilegibles.
6. **Programas con página propia** en `/programas/:slug` (dropdown del header y footer enlazan esas páginas); el menú mantiene **SIREVE** como ancla propia (con separador) y **“Programas”** con los 5 dependientes. Enlace a **csuca.org** en header ("CSUCA ↗") y footer ("Sitio oficial CSUCA").
7. **No Tailwind** salvo petición explícita.
8. **No commitear/pushear** salvo que el usuario lo pida.
9. Preferir cambios **mínimos y enfocados**; no refactors masivos no pedidos.
10. Textos e idioma de la UI en **español**.

---

## Assets locales

```
public/images/
  logo-csuca.png   (logo oficial CSUCA, único logo del sitio; 675×188 recortado)
  hero.jpg         (sin uso desde que se quitó la franja del hero; conservar)
  placeholder.jpg
  programs/   (sireve SIN USO, ficcua, juduca, excelencia, salud, voluntariado)
  programs/editions/  (futura: logos/mascotas/flayers por edición; el usuario la llenará)
  quick/      (actas, galeria, reglamentos)
  carousel/   (1–3)
  gallery/    (1–6, fallbacks)
```

Evitar hotlinks frágiles a Unsplash como única fuente (ya fallaron, p. ej. JUDUCA). Usar locales + `handleImageError`. Las fotos de programas vienen del media de csuca.org; ver tabla arriba.

---

## Decisiones descartadas (no reintroducir)

- Paleta teal/slate de la rama `richard`.
- **Paleta dorada anterior (`#c9a227`) y acentos por card.** Las cards comparten una sola rampa azul; el verde queda reservado al isologo.
- **Paleta de azul marino inventada** (`#0f66b0`, `#247abd`, `#0a4c86`, `#0d1b26`, `#152633`, `#1b3041`) y el verde como acento de UI (`#46ac34`). Todo eso salió del manual; se corrigió a la rampa de la p.75.
- Modal de reglamentos con “Descargar PDF” + alert.
- Listas falsas de PDFs en Actas con `alert("Vista previa de demostración...")`.
- Logo del hero como bloque tipográfico grande separado del logo oficial.
- Invertir **todo** el PNG del logo a blanco (desaparece el emblema).
- Blobs, ondas y gradientes radiales en el hero (el manual usa formas planas, esquinas 3-5px).
- **Superficies azules de contenido** (hero `#1366af`, sección SIREVE `#1366af`, `page-hero` `#1366af`, foto del hero al 12% como fondo). El usuario reportó "se ve demasiado azul toda la página". Ahora el azul es solo cromo (barras) + color de título, ícono y botón, como en csuca.org. Ni como fondo con overlay ni en franja: el hero no lleva foto.
- Icono de lupa/`zoom-in` en miniaturas de galería.
- Un solo “Leer más” abierto a la vez en programas (ahora son independientes).
- **Expand "Leer más/Leer menos" en las cards de la landing:** eliminado; la card muestra el `excerpt` y el botón "Ver programa" navega a la página `/programas/:slug`, donde vive el texto completo.
- **Franja de foto en el hero** (`.landing-hero-media`, 260px a sangre): eliminada por petición del usuario; `hero.jpg` queda sin uso. No reintroducirla.
- **Cualquier imagen en el hero** (fondo con overlay, franja a sangre o panel lateral `.landing-hero-figure`): el usuario lo excluyó con "yo no quiero usar imagenes". `programs/sireve.jpg` quedó sin uso. No reintroducirla sin pedirlo.
- **Título de texto "Sistema Regional de Vida Estudiantil" en el hero** (`.landing-hero-title`): eliminado; el logo ampliado (120px, dentro de `<h1>`) hace de título, como `csuca.org/es/sireve`. No volver a poner un título de texto separado.
- **Stats del hero:** ni 3 cajas grises sueltas ni el panel único con divisores — ahora son **3 tarjetas independientes** con superficie, borde, icono, cifra y etiqueta.
- **Navbar con "Sistema Regional de Vida Estudiantil" como título, y el nombre del CSUCA como subtítulo** (`.header-brand-sub`): el orden se invirtió (2026-10). Ahora `.header-brand-title` dice "Consejo Superior Universitario Centroamericano" en 2 renglones y "Sistema Regional de Vida Estudiantil" ya no está en la navbar (vive en el hero).
- **Botón de cambio de tema** y estado de tema en `App.jsx`: eliminados (2026-10); el sitio es solo claro.
- **Años de ejemplo en el historial de ediciones** (2026→2021): eliminados; el usuario no tiene esa información. Se muestra un panel "espacio reservado" hasta que se llene `editions` en `src/data/programs.js`.
- **Datos de contacto inventados** (`info@sireve.csuca.org`, `+503 2222-2222`, "San Salvador"): eliminados; se usan los datos reales de la Secretaría General del CSUCA.

---

## Cómo extender sin romper contexto

1. Leer este archivo y el archivo CSS/JSX de la sección afectada.
2. Mantener paleta y patrones dark-mode de Actas.
3. Si el oficial tiene URL (Drive, PDF), enlazarla; no inventar modales.
4. Verificar `npm run build` y `npm run lint` tras cambios estructurales.
5. No añadir dependencias (Tailwind, etc.) sin acuerdo del usuario.
6. Si `npm run lint` reporta errores, distinguir los **preexistentes** (5: 4 `react-hooks/set-state-in-effect` en `Galeria.jsx`, `LandingPage.jsx`, `Header.jsx`, `Sidebar.jsx`, y `ThemeProvider` sin usar en `main.jsx`) de los nuevos.

---

## Contacto de demo (placeholder)

- Av. Las Américas 1-03, Zona 14, interior Club Deportivo Los Arcos, Ciudad de Guatemala, Guatemala
- +(502) 2502-7500
- sg@csuca.org

(Datos de la Secretaría General del CSUCA, verificados en csuca.org/es. **No inventar correo ni teléfono del SIREVE**: el SIREVE se comunica a través del CSUCA.)
