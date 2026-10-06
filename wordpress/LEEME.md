# SIREVE · CSUCA — tema estático para WordPress

Réplica estática de la SPA React. **No usa React ni Gravity UI en producción**:
son 17 vistas HTML + una hoja de estilos + un script, empaquetados en el tema de
WordPress `wordpress/sireve-theme/`.

Todo se genera con `node wordpress/build.mjs`. **No edites los `.html` ni nada
dentro de `sireve-theme/` a mano**: se sobreescribe al recompilar. Los originales
son `src/` (React) y `wordpress/build.mjs`.

---

## 1. Contenido de esta carpeta

| Archivo | Qué es |
|---|---|
| `build.mjs` | Generador: escribe los 17 fragmentos, `sireve-theme/` (vistas + assets + imágenes) y `sireve.css`/`sireve.js` que viven en la raíz de `wordpress/`. |
| `header-src.php` | Fuente del `header.php` con SEO (descriptions, breadcrumbs, OG, JSON-LD). `build.mjs` lo copia al tema tal cual; ver §8. |
| `sync-check.mjs` | Comprueba que local y servidor están iguales (SHA-1 de archivos + SEO por ruta). Ver §8. |
| `sireve.css` · `sireve.js` | Fuentes de los dos assets (se copian al tema). `sireve.css` va prefijado con `.sireve`, así que no pisa el resto del sitio. |
| `inicio.html` … `programa-voluntariado.html` | Los 17 fragmentos (header + contenido + footer dentro de `<div class="sireve">`). Alimentan el preview. |
| `sireve-theme/` | **Generado, no está en git.** Es lo que se sube a `wp-content/themes/`. |
| `sireve-pages.xml` | Importable de páginas (ver paso 4). |
| `preview.mjs` · `.preview-server.mjs` | Sitio de prueba local en `http://localhost:8099`. |
| `verify.mjs` `box-diff.mjs` `scale-diff.mjs` `css-diff.mjs` `interact.mjs` | Harness de verificación (ver §5). |
| `LEEME.md` | Este archivo. |

---

## 2. Regenerar

```bash
node wordpress/build.mjs     # fragmentos + tema (17 vistas, 119 imágenes) + ZIP (~14 MB)
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
  un archivo de `views/` con el mapa `views/index.php`. Además lleva tres
  parches que hay que conservar al recompilar:
  1. **`pre_wp_unique_post_slug`**: deja pasar los slugs numéricos
     `2017/2018/2019` al importar (WordPress los renombraría a `2017-2`).
  2. **`add_rewrite_rule` de `galeria/<año>`**: sin esa regla, la regla de
     paginación de páginas interpreta el año como `page=2017` y
     `redirect_canonical` manda `/galeria/2017/` a `/galeria/`.
  3. **Intercept de `template_redirect` (prioridad 0)** para los años **sin
     página en la BD** (los del Premio Rubén Darío: `2020/2023/2024/2025`;
     los otros 3 sí tienen página importada). Si la ruta es `/galeria/<año>/`
     y existe en el mapa `views/`, pinta la vista con 200, fija el `<title>`
     ("Galería 2025") y su propio `rel="canonical"`, y anula `is_404`. Va en
     prioridad 0 para ganarle a `redirect_canonical` y `wp_old_slug_redirect`
     (prioridad 10), que si no mandan la ruta a `/galeria/` con 301. Verificado
     contra las fuentes de WP (`default-filters.php`, `rel_canonical()`,
     `wp_get_document_title()`). **Gracias a este intercept no hace falta crear
     páginas nuevas en wp-admin para esos años.**
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
   asigna `admin` a tu usuario. **`/galeria/2020|2023|2024|2025/` NO son
   páginas**: las pinta el intercept del `functions.php` (§3.3), así que no
   aparecen en el XML y no hay que crearlas a mano.
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

Estado al cierre de esta versión: `css-diff` **0/0**, `box-diff` **0 de 3277
elementos** (17 rutas), `scale-diff` **0 de 282**, `verify` sin errores nuevos
en las 17 rutas — las filas de `/galeria/2017/` y `/galeria/2018/` reportan sus
fotos rotas porque siguen apuntando a las URLs muertas de `cache/widgetkit/`
(ver pendiente §7), no por CSS —, `interact` **ok** en los 5 escenarios. Quedan
como artefacto conocido los 2+6 elementos de *Contacto* que `box-diff` reporta
como exclusivos de cada lado: React usa los inputs de Gravity (`.g-input`) y la
réplica usa `.contacto-input`/`.contacto-textarea` con la misma caja.

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
- **Imágenes.** Las 119 imágenes viajan dentro del tema
  (`assets/images/…`); si alguna salta rota tras subir, revisa permisos/`MEDIA_BASE`
  en `build.mjs` (por defecto `https://sireve.csuca.org/wp-content/themes/sireve-theme/assets/images/`).

---

## 7. Estado del despliegue

### Actual (2026-10): tema FUERA del servidor — toca subir

- **`sireve-theme` ya no está en el servidor**: el usuario lo borró desde
  wp-admin (pasos 1-2 de la subida) pero **no llegó a subir el ZIP nuevo**, así
  que `sireve.csuca.org` está sirviendo el tema por defecto (Twenty Twenty-Five)
  y todas las rutas/assets del tema dan 404 (comprobado con `sync-check.mjs`:
  160 divergencias, todas "en vivo: HTTP 404" + "HTTP 301" en las galerías).
- **`wordpress/sireve-theme.zip` regenerado en local** con todos los cambios de
  esta versión: **17 vistas, 119 imágenes, 139 archivos públicos + 7 `.php`,
  13 766 KB (~13.4 MB)**, e incluye las galerías del Premio Rubén Darío
  (`/galeria/2020|2023|2024|2025/`, 92 fotos en `assets/images/gallery/premio/`)
  y el intercept de `functions.php` (§3.3).
- **Subir (mismos 5 pasos de §8):** en *Apariencia → Temas → Añadir nuevo →
  Subir tema* **comprueba antes el límite de subida que muestra esa pantalla**;
  si es menor que ~14 MB, recomprimir las fotos (~q75) y regenerar. Luego:
  activar otro tema (ya lo está el por defecto) → no hay nada que borrar →
  subir ZIP → activar SIREVE → *Ajustes → Enlaces permanentes → Guardar*.
- **Verificar en vivo tras subir:** `node wordpress/sync-check.mjs` en verde
  (18 rutas); en particular `/galeria/2025/` → **200 sin 301**, exactamente
  `1 × rel="canonical"`, `<title>` "Galería 2025 – SIREVE", y las 4 tarjetas de
  `/programas/premio-ruben-dario/` navegando a su galería.

### Histórico (2026-10-05/06): primera publicación

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
    (`Organization`, `WebSite`, `BreadcrumbList`). **Persistido (2026-10-05):
    vive en `header-src.php` y `build.mjs` lo copia al tema**, así que un
    recompilar + re-subir el tema ya no lo pisa. Si se edita en Theme File
    Editor, hay que backportearlo a `header-src.php`. Fallback: rutas sin
    entrada usan el tagline.
  - Verificado por HTTP en las 14 rutas: `meta description` (14/14), `og:*`,
    `twitter:card`, 3 bloques JSON-LD parseando, `og:image` 200, canonical y
    sin avisos PHP. Ya funcionaban de serie: sitemap `/wp-sitemap.xml`,
    `robots.txt`, indexación activa, 1 `<h1>` por página.

**Pendientes:**

1. **Subir el tema** (ver "Actual" arriba): el servidor sigue sin
   `sireve-theme` hasta que se suba el ZIP.
2. **Fotos reales de las galerías.** Las 205 fotos de 2017/2018 apuntan a
   `…/cache/widgetkit/…` (404 desde que cambió el WordPress) y se muestran con
   `placeholder.jpg`. Wayback solo conserva 31 imágenes de otras carpetas
   (55/56), así que no hay recuperación automática: si se quieren las fotos
   originales, hay que conseguirlas (backup del sitio anterior / originales
   del usuario) y reemplazarlas. **Las galerías del Premio (2020/2023/2024/2025)
   no dependen de esto: sus 92 fotos son locales y viajan en el ZIP.**

---

## 8. Sincronía local ↔ servidor (concordancia total)

Objetivo: **que lo local sea copia exacta del servidor** para poder reconstruir
todo el front-end si se pierde el hosting, y detectar si alguien toca el
servidor "por fuera".

### Regla de oro

**Todo cambio empieza en local** → `node wordpress/build.mjs` → subir al
servidor → `node wordpress/sync-check.mjs` en verde. Nunca editar en el servidor
sin backportear a local **el mismo día**.

| Si el cambio fue… | Hacer |
|---|---|
| En local (`src/`, `build.mjs`, `sireve.css/js`, imágenes) | build → subir → sync-check |
| En wp-admin (Theme File Editor, ajustes, páginas) | **Backport inmediato a local** (pegar en el archivo fuente correspondiente) → sync-check |

### Fuentes locales que no genera `build.mjs`

- **`header-src.php`** → es el `header.php` con SEO; el build lo copia al tema.
  Si se edita en Theme File Editor: copiar el contenido nuevo aquí.
- **`sireve-pages.xml`** → export de *Herramientas → Exportar* tras cualquier
  cambio de páginas (slugs, jerarquía, padres).
- **Ajustes de WordPress** (no viven en archivos): título `SIREVE`, tagline
  `Sistema Regional de Vida Estudiantil del CSUCA`, portada = *Inicio*,
  permalinks = *Nombre de la entrada*. Anotados en §4/§7; si cambian, actualizar
  esas secciones.

### Cómo subir con solo wp-admin

Theme File Editor **solo edita `.php`/`.css`/`.js`**; las vistas son `.html`
(viven en `views/`) y no aparecen en el editor. Por eso:

- **Cambio grande (vistas HTML, imágenes, varios archivos): ZIP completo.**
  1. Apariencia → Temas → activar otro tema (p. ej. el por defecto).
  2. Eliminar `sireve-theme`.
  3. Subir `wordpress/sireve-theme.zip` (lo regenera `node wordpress/build.mjs`
     al final, con `tar`; **no** uses `Compress-Archive` de PowerShell 5.1, que
     escribe las rutas con barra invertida y WordPress no las extrae bien en Linux).
  4. Activar SIREVE.
  5. Ajustes → Enlaces permanentes → Guardar (hace el flush de la regla de
     `/galeria/<año>/`).
  - La BD (páginas, ajustes) **no se toca**: el tema es solo front-end.
  - El ZIP regenerado = copia de seguridad completa del front-end en local.
- **Cambio solo-PHP** (`functions.php`, `footer.php`…): Theme File Editor, y
  luego backport a la fuente local correspondiente.

### `sync-check.mjs`

```bash
node wordpress/sync-check.mjs    # sale con código 1 si hay divergencia
```

Comprueba: (1) SHA-1 de los 139 archivos públicos del tema (vistas, CSS, JS,
imágenes) local vs vivo; (2) SEO renderizado en las 18 rutas (description exacta
de `header-src.php`, OG, Twitter, canonical, 3 JSON-LD); (3) comportamiento
(`/galeria/2017/` y `/galeria/2025/` sin 301 — esta última es la prueba del
intercept de `functions.php` (§3.3) —, 404 de rutas inexistentes, sitemap,
robots). Los `.php` no son descargables (WordPress los ejecuta): se validan por
su salida.

Uso: antes de regenerar el ZIP, después de subir, y como chequeo periódico de
que el servidor no se ha tocado por fuera.

### Recuperación ante pérdida del servidor

1. **Código/fuentes:** repo git (incluye `src/`, `build.mjs`, `header-src.php`,
   `sireve-pages.xml`, `LEEME.md`, el tema y el ZIP).
2. **Tema vivo:** subir el último `sireve-theme.zip`.
3. **Páginas:** *Herramientas → Importar* con `sireve-pages.xml`.
4. **Ajustes:** §4 de este archivo (permalinks → título → portada).
5. Verificar con `node wordpress/sync-check.mjs`.
