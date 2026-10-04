# SIREVE · CSUCA — paquete estático para WordPress

Réplica estática de la SPA React. **No usa React ni Gravity UI en producción**:
son 13 fragmentos HTML + una hoja de estilos + un script, pensados para pegarse
en un tema de WordPress existente.

Todo se genera con `node build.mjs`. **No edites los `.html` a mano**: sus cambios
se pierden al recompilar. Los originales son `src/` (React) y `build.mjs`.

---

## 1. Contenido del paquete

| Archivo | Qué es |
|---|---|
| `sireve.css` | Todos los estilos (62 KB). Va **después** del CSS del tema. |
| `sireve.js` | Interacciones (14 KB): dropdowns, menú móvil, carruseles, lightbox, reveal, scroll suave, fallback de imágenes, año del footer y formulario demo. |
| `inicio.html` | Portada |
| `actas.html` | Actas SIREVE |
| `galeria.html` | Índice de galería |
| `galeria-2017.html` · `galeria-2018.html` · `galeria-2019.html` | Años de galería |
| `reglamentos.html` | Reglamento general |
| `contacto.html` | Formulario e información |
| `programa-ficcua.html` · `programa-juduca.html` · `programa-premio-ruben-dario.html` · `programa-promotoras-salud.html` · `programa-voluntariado.html` | Una por programa |

Cada fragmento es un bloque autónomo que empieza con `<!-- ... -->` y envuelve
todo en `<div class="sireve">` (header + contenido + footer). **No incluye `<link>`
ni `<script>`**: los assets se cargan una sola vez por página (paso 2).

---

## 2. Subir los dos assets

Sube `sireve.css` y `sireve.js` a la **raíz del tema activo**:

```
wp-content/themes/<tu-tema>/sireve.css
wp-content/themes/<tu-tema>/sireve.js
```

## 3. Encolarlos una sola vez

Añade esto al `functions.php` del tema (o a un plugin propio, lo que sea más
cómodo). El `999` es importante: obliga a que la hoja se cargue **después** del
CSS del tema, que es el requisito de aislamiento.

```php
add_action('wp_enqueue_scripts', function () {
    $base = get_template_directory_uri();
    wp_enqueue_style('sireve', $base . '/sireve.css', array(), null, 'all');
    wp_enqueue_script('sireve', $base . '/sireve.js', array(), null, true);
}, 999);
```

Los fragmentos se pueden pegar en cualquier página (incluso en el mismo orden en
todos): los selectores están todos prefijados con `.sireve`, así que no pisan el
resto del tema.

---

## 4. Crear las 13 páginas y pegar el fragmento

Crea una página por cada archivo, con estos **slugs** (WordPress permite barras en
el slug para el anidado):

| Slug de la página | Archivo a pegar |
|---|---|
| *(la portada del sitio)* | `inicio.html` |
| `actas` | `actas.html` |
| `galeria` | `galeria.html` |
| `galeria/2017` | `galeria-2017.html` |
| `galeria/2018` | `galeria-2018.html` |
| `galeria/2019` | `galeria-2019.html` |
| `reglamentos` | `reglamentos.html` |
| `contacto` | `contacto.html` |
| `programas/ficcua` | `programa-ficcua.html` |
| `programas/juduca` | `programa-juduca.html` |
| `programas/premio-ruben-dario` | `programa-premio-ruben-dario.html` |
| `programas/promotoras-salud` | `programa-promotoras-salud.html` |
| `programas/voluntariado` | `programa-voluntariado.html` |

En el editor: **bloque de código personalizado** (o "HTML personalizado"), sin
interpretar el estilo. Pega el contenido **sin** la primera línea `<!--` si el
editor te la escapa.

**Permalinks**: activa *Ajustes → Enlaces permanentes → Nombre de la entrada*
para que `/galeria/2017/` y los slugs con barra funcionen como enlaces.

---

## 5. Antes de publicar — avisos honestos

- **Rutas relativas a la raíz.** Los enlaces internos son `/`, `/actas/`,
  `/galeria/…`, `/programas/…`. Si el sitio **no** está en la raíz del dominio
  (p. ej. `ejemplo.org/sireve/`), hay que prefixedlos en `build.mjs` y
  recompilar; no basta con buscar-reemplazar en el HTML pegado.
- **Tres imágenes de respaldo.** `galeria-2019` y algunas miniaturas usan
  `/images/gallery/1.jpg` … `3.jpg` (fallback local, porque las fotos reales de
  2019 no están publicadas en el sitio oficial). Si al publicar saltan rotas,
  sube esas tres imágenes a la raíz del sitio o cambia el `src` por la URL que
  uses. El resto de las 104 imágenes apunta a `sireve.csuca.org`.
- **Formulario sin envío real.** Muestra el aviso de demostración y no manda
  nada. Para envío real, apunta el `action` del `<form>` a Formspree o FormSubmit
  (basta con el `action` + `method="POST"`; no hay PHP propio).
- **Todo el contenido es estático.** Si el sitio crece, estos fragmentos no se
  actualizan solos desde el panel: hay que recompilar y volver a pegar.

---

## 6. Verificar antes de publicar

Con el preview estático corriendo (`node preview.mjs`, `http://localhost:8099`):

```bash
node verify.mjs 1280 375     # overflow, logos, imágenes rotas, enlaces
node box-diff.mjs            # paridad de cajas contra React, 1280px
node interact.mjs            # dropdowns, móvil, carrusel, lightbox, formulario
node scale-diff.mjs          # paridad tipográfica
node css-diff.mjs            # diferencias declarativas de CSS
```

`box-diff` deja 2 diferencias esperadas: el `<button>` nativo de React no lleva la
normalización a Montserrat que la réplica sí aplica (`.carousel-btn`). El resto de
botones coincide.

Chrome headless es lo único que se necesita: `C:\Program Files\Google\Chrome\
Application\chrome.exe`. No hay Playwright ni Puppeteer instalados a propósito.