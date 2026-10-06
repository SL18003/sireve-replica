# SIREVE · CSUCA — tema estático para WordPress

Réplica estática de la SPA React. **No usa React ni Gravity UI en producción**:
son 13 vistas HTML + una hoja de estilos + un script, empaquetados en el tema de
WordPress `wordpress/sireve-theme/`.

Todo se genera con `node wordpress/build.mjs`. **No edites los `.html` ni nada
dentro de `sireve-theme/` a mano**: se sobreescribe al recompilar. Los originales
son `src/` (React) y `wordpress/build.mjs`.

---

## 1. Contenido de esta carpeta

| Archivo | Qué es |
|---|---|
| `build.mjs` | Generador: escribe los 13 fragmentos, `sireve-theme/` (vistas + assets + imágenes) y `sireve.css`/`sireve.js` que viven en la raíz de `wordpress/`. |
| `sireve.css` · `sireve.js` | Fuentes de los dos assets (se copian al tema). `sireve.css` va prefijado con `.sireve`, así que no pisa el resto del sitio. |
| `inicio.html` … `programa-voluntariado.html` | Los 13 fragmentos (header + contenido + footer dentro de `<div class="sireve">`). Alimentan el preview. |
| `sireve-theme/` | **Generado, no está en git.** Es lo que se sube a `wp-content/themes/`. |
| `sireve-pages.xml` | Importable de páginas (ver paso 4). |
| `preview.mjs` · `.preview-server.mjs` | Sitio de prueba local en `http://localhost:8099`. |
| `verify.mjs` `box-diff.mjs` `scale-diff.mjs` `css-diff.mjs` `interact.mjs` | Harness de verificación (ver §5). |
| `LEEME.md` | Este archivo. |

---

## 2. Regenerar

```bash
node wordpress/build.mjs     # fragmentos + tema (13 vistas, 23 imágenes)
node wordpress/preview.mjs   # reconstruye wordpress/.preview/
```

El servidor local (si no está corriendo): `node wordpress/.preview-server.mjs`.

---

## 2b. Qué es fuente única y qué hay que tocar en los dos lados

React (`src/`) es el lado de referencia y la réplica estática lo copia, pero
**no todo se genera automáticamente**:

| Qué cambiar | Dónde se toca | Cómo se propaga y se comprueba |
|---|---|---|
| Textos/datos (programas, galerías, presidentes) | `src/data/*` (fuente única) | `build.mjs` → subir `sireve-theme/` |
| Imágenes | Reemplazar el archivo en `public/images/…` | `build.mjs` (las copia al tema; `--media=` cambia la URL) |
| Estilos | **dos sitios**: `src/**/*.css` **y** `wordpress/sireve.css` | `css-diff.mjs` debe dar 0/0 |
| Comportamiento (carruseles, menús…) | **dos sitios**: efectos en `.jsx` **y** `sireve.js` | `interact.mjs` |
| Estructura HTML | **dos sitios**: `.jsx` **y** las plantillas de `build.mjs` | `box-diff.mjs` / `verify.mjs` |

El harness **detecta** la divergencia, pero no la evita: si tocas solo un lado
y no corres los chequeos, hay *drift* silencioso. Caso real ocurrido: los
`@keyframes` se renombraron a `sireve-*` y dos usos quedaron con el nombre
viejo (`heroFadeUp`, `fadeIn`) → la animación se ignoraba y el héroe de la
portada se quedó en `opacity: 0`. `css-diff.mjs` ya valida que **cada
`animation-name` exista como `@keyframes` en su propio archivo** (sale con
código 1 si no) y canoniza los nombres para compararlos entre lados.

---

## 3. Cómo pinta el tema las páginas

- `header.php` / `footer.php` solo abren y cierran el documento; la barra, la
  navegación y el pie de SIREVE viven **dentro de cada vista**.
- `functions.php` normaliza la ruta del navegador (`/galeria/2017/`) y la mapea a
  un archivo de `views/` con el mapa `views/index.php`. Además lleva dos
  parches que hay que conservar al recompilar:
  1. **`pre_wp_unique_post_slug`**: deja pasar los slugs numéricos
     `2017/2018/2019` al importar (WordPress los renombraría a `2017-2`).
  2. **`add_rewrite_rule` de `galeria/<año>`**: sin esa regla, la regla de
     paginación de páginas interpreta el año como `page=2017` y
     `redirect_canonical` manda `/galeria/2017/` a `/galeria/`.
- `page.php` (y `front-page.php`) pinta la vista de la ruta actual; **si la ruta
  no tiene vista**, cae en el contenido de la página del editor.
- Consecuencia: **los permalinks tienen que estar en "Nombre de la entrada"**,
  porque las vistas se resuelven por la URL, no por el ID de la página. El
  *guardar* los permalinks también hace el flush que registra la regla 2.

---

## 4. Subir a WordPress (el orden importa)

1. **Tema.** Sube `wordpress/sireve-theme/` a `wp-content/themes/sireve-theme/`
   por FTP/SFTP, o comprímelo en un ZIP (con `style.css` en la raíz del ZIP o
   dentro de una única carpeta `sireve-theme/`) y súbelo en
   *Apariencia → Temas → Añadir nuevo → Subir tema*. Actívalo.
2. **Enlaces permanentes.** *Ajustes → Enlaces permanentes → Nombre de la
   entrada* → Guardar. (Sin esto, todas las rutas pintan la portada.)
3. **Páginas.** *Herramientas → Importar → WordPress* → `sireve-pages.xml`.
   Crea **14 páginas**: las 13 rutas del sitio más la puente `programas`
   (WordPress exige el padre para servir `/programas/<slug>/`; esa ruta no tiene
   vista, así que se pinta el contenido de esa página). En el mapeo de autores,
   asigna `admin` a tu usuario.
4. **Portada.** *Ajustes → Lectura → Tu página de inicio* → **Inicio**.
5. **Ajustes → Generales.** Título `SIREVE`; descripción
   `Sistema Regional de Vida Estudiantil del CSUCA`.
6. **Limpiar la demo.** Borra la página *Página de ejemplo* y la entrada
   *¡Hola mundo!*.

Los editores de las páginas importadas quedan **vacíos a propósito**: el contenido
real es `sireve-theme/views/*.html`. Si cambias un texto ahí, hay que recompilar
y volver a subir el tema (§2).

---

## 5. Verificar antes de publicar

Con el preview local y el dev server de React (`npm run dev`) corriendo:

```bash
node wordpress/verify.mjs 1280 375   # overflow, logos, imágenes rotas, /images/
node wordpress/css-diff.mjs          # CSS declarativo React vs estático
node wordpress/box-diff.mjs          # paridad de cajas a 1280px
node wordpress/scale-diff.mjs        # paridad tipográfica, 6 rutas
node wordpress/interact.mjs          # dropdowns, móvil, carrusel, lightbox, formulario
npm run lint                         # baseline: 5 errores preexistentes en src/
npm run build                        # build de producción de React
```

Estado al cierre de esta versión: `css-diff` **0/0**, `box-diff` **0 de 2537
elementos**, `scale-diff` **0 de 282**, `verify` **"Todo limpio"** en las 13
rutas, `interact` **ok** en los 5 escenarios. Quedan como artefacto conocido los
2+6 elementos de *Contacto* que `box-diff` reporta como exclusivos de cada lado:
React usa los inputs de Gravity (`.g-input`) y la réplica usa
`.contacto-input`/`.contacto-textarea` con la misma caja.

Se necesita Chrome headless
(`C:\Program Files\Google\Chrome\Application\chrome.exe`); no hay Playwright ni
Puppeteer instalados a propósito. Los `*-probe.html` de `public/` y de
`wordpress/` son fixtures del harness: no borrarlos.

---

## 6. Avisos honestos

- **Rutas relativas a la raíz.** Los enlaces internos son `/`, `/actas/`,
  `/galeria/…`, `/programas/…`. Si el sitio **no** vive en la raíz del dominio
  (p. ej. `ejemplo.org/sireve/`), hay que ajustar las rutas en `build.mjs` y
  recompilar; no basta con buscar-reemplazar en el HTML.
- **Formulario sin envío real.** El envío se **simula**: la validación nativa
  (`required` + `type="email"`) bloquea campos vacíos y correos inválidos, y
  con datos válidos `sireve.js` muestra el mensaje "¡Gracias por contactarnos!…"
  y limpia el formulario. Para envío real, apunta el `action` del `<form>` a
  Formspree o FormSubmit (basta con `action` + `method="POST"`; no hay PHP
  propio) y quita el `preventDefault` de `initForm()` en `sireve.js`.
- **Contenido estático.** Nada se actualiza desde el panel: editar → `src/` →
  `build.mjs` → volver a subir `sireve-theme/`.
- **Imágenes.** Las 23 imágenes viajan dentro del tema
  (`assets/images/…`); si alguna salta rota tras subir, revisa permisos/`MEDIA_BASE`
  en `build.mjs` (por defecto `https://sireve.csuca.org/wp-content/themes/sireve-theme/assets/images/`).

---

## 7. Estado del despliegue (2026-10-05)

Publicado en `https://sireve.csuca.org/` y verificado por HTTP:

- Tema `sireve-theme` subido (ZIP con barras `/`) y activo; 14 páginas
  importadas de `sireve-pages.xml` con los **14 slugs correctos**
  (`actas`, `galeria`, `reglamentos`, los 3 años y los 5 programas);
  jerarquía intacta (años → `galeria`, programas → `programas`).
- Permalinks "Nombre de la entrada"; portada estática = **Inicio**; demo de
  WordPress vaciada; Medios vacío (el tema no referencia `wp-content/uploads`).
- Los dos parches de `functions.php` (§3) estaban pegados en vivo vía
  Theme File Editor y ahora **viven en el template de `build.mjs`**: un
  recompilar + re-subir el tema no los pierde.
- Smoke test: las **14 rutas en 200** (incluidas `/galeria/2017|2018|2019/`
  pintando su vista, no un 301), los 7 assets clave en 200, home y
  `/programas/ficcua/` con todas sus secciones, formulario de contacto con
  `required` + `type="email"` + banner de éxito, rutas inexistentes en 404.
- **Fallback de galería corregido en vivo**: `assets/sireve.js` línea 26
  apunta ahora al placeholder del tema (`…/themes/sireve-theme/assets/images/placeholder.jpg`,
  200); el de Medios (`wp-content/uploads/…`) murió al vaciar la biblioteca.
- **SEO (2026-10-06, todo por wp-admin, sin cambios locales):**
  - *Ajustes → Generales*: título `SIREVE`, descripción
    `Sistema Regional de Vida Estudiantil del CSUCA` → los `<title>` ya salen
    "Actas SIREVE – SIREVE" y el home "SIREVE – Sistema Regional…".
  - **`header.php` reescrito a mano** (Theme File Editor): mapa de descriptions
    + breadcrumbs por las 14 rutas, Open Graph + Twitter card y JSON-LD
    (`Organization`, `WebSite`, `BreadcrumbList`). Ese mapa de descriptions y
    crumb **no** está en `build.mjs`: si se recompila y se re-sube el tema,
    `header.php` se pisa y hay que volver a pegarlo (el archivo lleva el aviso
    en su comentario). Fallback: rutas sin entrada usan el tagline.
  - Verificado por HTTP en las 14 rutas: `meta description` (14/14), `og:*`,
    `twitter:card`, 3 bloques JSON-LD parseando, `og:image` 200, canonical y
    sin avisos PHP. Ya funcionaban de serie: sitemap `/wp-sitemap.xml`,
    `robots.txt`, indexación activa, 1 `<h1>` por página.

**Pendientes:**

1. **Fotos reales de las galerías.** Las 205 fotos de 2017/2018 apuntan a
   `…/cache/widgetkit/…` (404 desde que cambió el WordPress) y se muestran con
   `placeholder.jpg`. Wayback solo conserva 31 imágenes de otras carpetas
   (55/56), así que no hay recuperación automática: si se quieren las fotos
   originales, hay que conseguirlas (backup del sitio anterior / originales
   del usuario) y reemplazarlas.
