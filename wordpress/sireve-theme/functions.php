<?php
/**
 * SIREVE · CSUCA — functions del tema.
 * Generado por wordpress/build.mjs: no editar a mano (se sobreescribe al recompilar).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
} );

/** Mapa ruta canonica => archivo de vista (lo escribe build.mjs). */
function sireve_views() {
	static $views = null;
	if ( null === $views ) {
		$file = get_template_directory() . '/views/index.php';
		$views = file_exists( $file ) ? require $file : array();
	}
	return $views;
}

/** Ruta pedida por el navegador, normalizada con barra final: "/galeria/2017/". */
function sireve_route() {
	$uri  = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '/';
	$path = wp_parse_url( $uri, PHP_URL_PATH );
	if ( ! $path ) {
		$path = '/';
	}
	$home = wp_parse_url( home_url( '/' ), PHP_URL_PATH );
	if ( $home && '/' !== $home && 0 === strpos( $path, $home ) ) {
		$path = substr( $path, strlen( rtrim( $home, '/' ) ) );
		if ( false === $path || '' === $path ) {
			$path = '/';
		}
	}
	$path = untrailingslashit( $path );
	return '' === $path ? '/' : $path . '/';
}

/** true si la ruta pedida tiene vista generada. */
function sireve_is_view() {
	$views = sireve_views();
	$route = sireve_route();
	return isset( $views[ $route ] );
}

/** Pinta la vista de la ruta actual. Devuelve false si no hay vista. */
function sireve_render() {
	$views = sireve_views();
	$route = sireve_route();
	if ( ! isset( $views[ $route ] ) ) {
		return false;
	}
	$file = basename( $views[ $route ] );
	if ( ! preg_match( '/^[a-z0-9-]+\.html$/', $file ) ) {
		return false;
	}
	include get_template_directory() . '/views/' . $file;
	return true;
}

/* Slugs numericos: WordPress renombra "2017" a "2017-2" al importar (los anos
   de la galeria, sireve-pages.xml). Devolver algo distinto de null corta el
   calculo de unicidad. El tema tiene que estar activo ANTES de importar. */
add_filter( 'pre_wp_unique_post_slug', function ( $override, $slug, $post_id, $post_status, $post_type, $post_parent ) {
	if ( 'page' === $post_type && in_array( $slug, array( '2017', '2018', '2019' ), true ) ) {
		return $slug;
	}
	return $override;
}, 10, 6 );

/* /galeria/2017/ la captura la regla de paginacion de paginas
   (pagename=galeria + page=2017) y redirect_canonical lo manda a /galeria/.
   Esta regla ("top") resuelve la pagina hija antes que esa regla generica;
   hace falta un flush de permalinks (Guardar enlaces permanentes) al activar. */
add_action( 'init', function () {
	add_rewrite_rule( '^galeria/([0-9]{4})/?$', 'index.php?pagename=galeria/$matches[1]', 'top' );
} );

/* /galeria/<anio>/ se pinta desde la vista SIN que exista una pagina hija en la
   base de datos (solo 2017-2019 la tienen; los anos del Premio Ruben Dario no
   se crean paginas). Sin esto, la regla generica de paginas resuelve
   /galeria/2025/ como la pagina "galeria" paginada y redirect_canonical lo manda
   a /galeria/ con 301. Prioridad 0: gana a redirect_canonical y
   wp_old_slug_redirect (prioridad 10). Ademas fijamos titulo y canonical aqui,
   porque WP no tiene pagina de la cual calcularlos (rel_canonical solo actua en
   consultas singulares). Verificado contra wp-includes/default-filters.php y
   las fuentes de rel_canonical()/wp_get_document_title(). */
add_action( 'template_redirect', function () {
	$route = sireve_route();
	if ( ! preg_match( '#^/galeria/[0-9]{4}/$#', $route ) ) {
		return;
	}
	$views = sireve_views();
	if ( ! isset( $views[ $route ] ) ) {
		return; /* anio sin galeria generada: sigue el 404 normal de WordPress */
	}
	global $wp_query;
	$wp_query->is_404 = false;
	status_header( 200 );
	add_filter( 'document_title_parts', function ( $parts ) use ( $route ) {
		preg_match( '#^/galeria/([0-9]{4})/$#', $route, $m );
		$parts['title'] = 'Galería ' . $m[1];
		return $parts;
	} );
	remove_action( 'wp_head', 'rel_canonical' );
	add_action( 'wp_head', function () use ( $route ) {
		echo '<link rel="canonical" href="' . esc_url( home_url( $route ) ) . '" />' . "
";
	}, 5 );
	get_header();
	sireve_render();
	get_footer();
	exit;
}, 0 );

/* Un solo juego de assets para todo el sitio. La hoja va en prioridad 999 para
   cargar despues de cualquier CSS del tema y poder pisar lo que haga. */
add_action( 'wp_enqueue_scripts', function () {
	$uri = get_template_directory_uri();
	wp_enqueue_style(
		'sireve-fonts',
		'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;600;700&display=swap',
		array(),
		null
	);
	wp_enqueue_style( 'sireve', $uri . '/assets/sireve.css', array( 'sireve-fonts' ), '1.0', 'all' );
	wp_enqueue_script( 'sireve', $uri . '/assets/sireve.js', array(), '1.0', true );
}, 999 );

/* En las vistas no hay contenido de bloques: sin el CSS global de WordPress su
   tipografia (Manrope) no se come la nuestra. El resto del sitio no se toca. */
add_action( 'wp_enqueue_scripts', function () {
	if ( ! sireve_is_view() ) {
		return;
	}
	wp_dequeue_style( 'global-styles' );
	wp_dequeue_style( 'wp-block-library' );
}, 20 );
