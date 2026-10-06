/* ============================================================================
   SIREVE · CSUCA — comportamiento del sitio estatico
   ----------------------------------------------------------------------------
   JavaScript plano, sin dependencias. Ponerlo UNA SOLA VEZ en el area global de
   scripts del tema, despues de sireve.css.

   Los iconos ya vienen como <svg> reales en el HTML (se generan al compilar),
   asi que este archivo no dibuja nada: solo mueve, abre y cierra.

   Todo se engancha por data-attribute, de modo que si falta un elemento en una
   pagina el script simplemente no hace nada en esa parte.

   data-nav="/actas/"                 ->  marca el enlace de navegacion activo
   data-images='["url1","url2"]'       ->  album de galeria
   data-title="Titulo"                ->  titulo del album (lightbox)
   data-target="#id"                  ->  scroll suave con offset del header
   data-year                          ->  ano del footer
   ============================================================================ */

(function () {
  'use strict';

  var root = document.querySelector('.sireve');
  if (!root) return;

  var PLACEHOLDER = 'https://sireve.csuca.org/wp-content/themes/sireve-theme/assets/images/placeholder.jpg';
  var HEADER_OFFSET = 88; /* alto del header sticky (72) + margen de respiro */
  var CAROUSEL_MS = 6000;

  /* --------------------------------------------------- Fallback de imagenes */
  /* Las galerias de 2017/2018 apuntan a sireve.csuca.org/cache/widgetkit/... y
     hoy devuelven 404; en ese caso se muestra placeholder.jpg, igual que en
     la replica React (utils/imageFallback.js). */
  function watchImage(img) {
    if (!img || img.dataset.imgWatched) return;
    img.dataset.imgWatched = 'true';

    function applyFallback() {
      if (img.dataset.fallbackApplied === 'true') return;
      img.dataset.fallbackApplied = 'true';
      img.src = PLACEHOLDER;
    }

    img.addEventListener('error', applyFallback);
    /* Si la imagen ya fallo antes de que se conectara este manejador (error ya
       cacheado, o src muerto en el HTML), el evento 'error' no vuelve a
       dispararse: hay que comprobar el estado al momento. Sin esto, algunas
       miniaturas de 2017/2018 se quedaban en blanco. */
    if (img.complete && img.naturalWidth === 0) applyFallback();
  }

  function watchImages(scope) {
    var imgs = (scope || root).querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) watchImage(imgs[i]);
  }

  /* ------------------------------------------------------------ Anio footer */
  function initYear() {
    var nodes = root.querySelectorAll('[data-year]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = String(new Date().getFullYear());
    }
  }

  /* ------------------------------------------------------- Enlaces activos */
  function initActiveNav() {
    var path = window.location.pathname.replace(/\/+$/, '') || '/';
    var links = root.querySelectorAll('[data-nav]');
    for (var i = 0; i < links.length; i++) {
      var target = links[i].getAttribute('data-nav').replace(/\/+$/, '') || '/';
      var active = target === '/' ? path === '/' : path.indexOf(target) === 0;
      links[i].classList.toggle('active', active);
    }
  }

  /* ----------------------------------------------------------------- Header */
  var nav = root.querySelector('.header-nav');
  var mobileToggle = root.querySelector('.header-mobile-toggle');

  function setMobile(open) {
    if (!nav || !mobileToggle) return;
    nav.classList.toggle('open', open);
    /* La clase va en el boton Y en el nav: los dos iconos (hamburguesa y X) se
       emiten dentro del boton, asi que un selector `.header-nav.open .ico-*`
       nunca los alcanzaria y el menu abriria sin cambiar de icono. */
    mobileToggle.classList.toggle('open', open);
    mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) closeDropdowns(null);
  }

  function initMobile() {
    if (!nav || !mobileToggle) return;
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.addEventListener('click', function () {
      setMobile(!nav.classList.contains('open'));
    });
    /* Al pulsar cualquier enlace del panel movil se cierra antes de navegar. */
    nav.addEventListener('click', function (event) {
      if (event.target.closest && event.target.closest('a')) setMobile(false);
    });
  }

  var dropdowns = root.querySelectorAll('.header-dropdown');

  function closeDropdowns(except) {
    for (var i = 0; i < dropdowns.length; i++) {
      if (dropdowns[i] === except) continue;
      var toggle = dropdowns[i].querySelector('.header-dropdown-toggle');
      var menu = dropdowns[i].querySelector('.header-dropdown-menu');
      if (!toggle || !menu) continue;
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    }
  }

  function initDropdowns() {
    if (!dropdowns.length) return;

    for (var i = 0; i < dropdowns.length; i++) {
      (function (dd) {
        var toggle = dd.querySelector('.header-dropdown-toggle');
        var menu = dd.querySelector('.header-dropdown-menu');
        if (!toggle || !menu) return;
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', function (event) {
          event.preventDefault();
          var willOpen = menu.hidden;
          closeDropdowns(dd);
          menu.hidden = !willOpen;
          toggle.classList.toggle('open', willOpen);
          toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });
      })(dropdowns[i]);
    }

    document.addEventListener('click', function (event) {
      var inside = event.target.closest && event.target.closest('.header-dropdown');
      if (!inside) closeDropdowns(null);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      closeDropdowns(null);
      if (nav && nav.classList.contains('open')) setMobile(false);
    });
  }

  /* ------------------------------------------ Scroll suave con offset fixed */
  function scrollToTarget(el) {
    var top = el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function initAnchors() {
    var anchors = root.querySelectorAll('a[data-target]');
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', function (event) {
        var el = this.getAttribute('data-target') && document.querySelector(this.getAttribute('data-target'));
        if (!el) return;
        event.preventDefault();
        scrollToTarget(el);
      });
    }

    /* Al entrar con /#sireve o /#programas desde otra pagina el navegador no
       alcanza a hacer scroll: el id no existia todavia. Se repite al cargar. */
    var hash = window.location.hash;
    var target = hash.length > 1 ? document.querySelector(hash) : null;
    if (target) window.setTimeout(function () { scrollToTarget(target); }, 120);
  }

  /* ------------------------------------------- Reveal al hacer scroll (fade) */
  /* El CSS muestra siempre .fade-section; el JS anade .reveal-ready al
     contenedor solo cuando ya tiene el observer montado. Si el JS no corre, el
     contenido sigue visible. */
  function initReveal() {
    var sections = root.querySelectorAll('.fade-section');
    if (!sections.length || !('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) continue;
        entries[i].target.classList.add('visible');
        observer.unobserve(entries[i].target);
      }
    }, { threshold: 0.1 });

    root.classList.add('reveal-ready');
    for (var s = 0; s < sections.length; s++) observer.observe(sections[s]);
  }

  /* --------------------------------------- Carrusel de la portada (hero) */
  function initLandingCarousel() {
    var box = root.querySelector('.carousel-container');
    if (!box) return;

    var slides = box.querySelectorAll('.carousel-slide');
    var dots = root.querySelectorAll('.carousel-dot');
    var prev = box.querySelector('.carousel-btn-left');
    var next = box.querySelector('.carousel-btn-right');
    if (slides.length < 2) return;

    var index = 0;
    var timer = null;

    function show(i) {
      index = (i + slides.length) % slides.length;
      for (var s = 0; s < slides.length; s++) slides[s].classList.toggle('active', s === index);
      for (var d = 0; d < dots.length; d++) dots[d].classList.toggle('active', d === index);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    function start() {
      stop();
      timer = window.setInterval(function () { show(index + 1); }, CAROUSEL_MS);
    }

    if (prev) prev.addEventListener('click', function () { show(index - 1); start(); });
    if (next) next.addEventListener('click', function () { show(index + 1); start(); });
    for (var d = 0; d < dots.length; d++) {
      (function (dotIndex) {
        dots[d].addEventListener('click', function () { show(dotIndex); start(); });
      })(d);
    }

    box.addEventListener('mouseenter', stop);
    box.addEventListener('mouseleave', start);

    show(0);
    start();
  }

  /* ------------------------------------- Albumes de galeria + lightbox ---- */
  /* El lightbox ya viene marcado (oculto) en las paginas de galeria, asi que
     aqui solo se cablean los controles. */
  var lightbox = null;
  var lightboxState = null;

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.box.hidden = true;
    document.body.style.overflow = '';
    lightboxState = null;
  }

  function renderLightbox() {
    if (!lightbox || !lightboxState) return;
    var images = lightboxState.images;
    var i = lightboxState.index;
    lightbox.img.src = images[i];
    lightbox.img.alt = lightboxState.title + ' — imagen ' + (i + 1);
    watchImage(lightbox.img);
    lightbox.title.textContent = lightboxState.title;
    lightbox.counter.textContent = (i + 1) + ' / ' + images.length;
    var single = images.length < 2;
    lightbox.prev.hidden = single;
    lightbox.next.hidden = single;
    lightbox.box.setAttribute('aria-label', lightboxState.title);
  }

  function stepLightbox(delta) {
    if (!lightboxState) return;
    var n = lightboxState.images.length;
    lightboxState.index = (lightboxState.index + delta + n) % n;
    renderLightbox();
  }

  function openLightbox(album, startIndex) {
    if (!lightbox) return;
    lightboxState = { images: album.images, index: startIndex, title: album.title };
    renderLightbox();
    lightbox.box.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.closeBtn.focus();
  }

  function initAlbums() {
    var albums = root.querySelectorAll('.gallery-album[data-images]');
    var box = root.querySelector('.gallery-lightbox');
    if (box) {
      lightbox = {
        box: box,
        img: box.querySelector('.gallery-lightbox-img'),
        title: box.querySelector('.gallery-lightbox-title'),
        counter: box.querySelector('.gallery-lightbox-counter'),
        prev: box.querySelector('.gallery-lightbox-nav--prev'),
        next: box.querySelector('.gallery-lightbox-nav--next'),
        closeBtn: box.querySelector('.gallery-lightbox-close'),
      };
    }

    for (var a = 0; a < albums.length; a++) {
      (function (el) {
        var images;
        try {
          images = JSON.parse(el.getAttribute('data-images'));
        } catch {
          images = [];
        }
        if (!images.length) return;

        var album = { images: images, title: el.getAttribute('data-title') || '', index: 0 };
        var imgBtn = el.querySelector('.gallery-album-img-btn');
        var img = el.querySelector('.gallery-album-img-btn img');
        var counter = el.querySelector('.gallery-album-counter');
        var dots = el.querySelectorAll('.gallery-album-dot');
        var multi = images.length > 1;

        function show(i) {
          album.index = (i + images.length) % images.length;
          if (img) {
            img.src = images[album.index];
            img.alt = album.title + ' — imagen ' + (album.index + 1);
          }
          if (counter) counter.textContent = (album.index + 1) + ' / ' + images.length;
          for (var d = 0; d < dots.length; d++) dots[d].classList.toggle('active', d === album.index);
        }

        var prev = el.querySelector('.gallery-album-nav--prev');
        var next = el.querySelector('.gallery-album-nav--next');
        if (prev) prev.addEventListener('click', function () { show(album.index - 1); });
        if (next) next.addEventListener('click', function () { show(album.index + 1); });

        for (var d = 0; d < dots.length; d++) {
          (function (dotIndex) {
            dots[d].addEventListener('click', function () { show(dotIndex); });
          })(d);
        }

        if (imgBtn) imgBtn.addEventListener('click', function () {
          openLightbox(album, album.index);
        });

        if (multi) show(0);
      })(albums[a]);
    }

    if (!lightbox) return;

    lightbox.box.addEventListener('click', function (event) {
      if (event.target === lightbox.box) closeLightbox();
    });
    lightbox.closeBtn.addEventListener('click', closeLightbox);
    lightbox.prev.addEventListener('click', function () { stepLightbox(-1); });
    lightbox.next.addEventListener('click', function () { stepLightbox(1); });

    document.addEventListener('keydown', function (event) {
      if (lightbox.box.hidden) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') stepLightbox(-1);
      if (event.key === 'ArrowRight') stepLightbox(1);
    });
  }

  /* ------------------------------------------------- Formulario de contacto */
  /* El envio se SIMULA: la validacion nativa del navegador (required +
     type=email) impide el submit con campos vacios o correo invalido, y este
     listener solo se dispara con datos validos: muestra el mensaje de
     confirmacion y limpia el formulario. Cuando haya destinatario real, poner
     el action del <form> (FormSubmit.co o Formspree) y quitar el
     preventDefault. Ver LEEME.md. */
  function initForm() {
    var form = root.querySelector('.contacto-form');
    if (!form) return;
    var success = form.querySelector('.contacto-form-success');
    if (!success) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      success.classList.add('show');
      form.reset();
    });
  }

  /* ------------------------------------------------------------------ Init */
  function init() {
    watchImages(root);
    initYear();
    initActiveNav();
    initMobile();
    initDropdowns();
    initAnchors();
    initReveal();
    initLandingCarousel();
    initAlbums();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
