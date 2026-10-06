<?php
/**
 * Apertura del documento. El header del SIREVE (barra, nav y redes) vive dentro
 * de cada vista, generado por build.mjs, para que el preview mida lo mismo que
 * se publica.
 *
 * SEO (persistido desde el servidor, 2026-10): descriptions por ruta, Open
 * Graph, Twitter y JSON-LD (Organization, WebSite y miga de pan). Fuente local
 * en wordpress/header-src.php: build.mjs lo copia al tema tal cual. Si se cambia
 * en Theme File Editor, hay que pegarlo aquí (backport) para no perderlo.
 */

$sireve_seo = array(
	'/' => array(
		'description' => 'SIREVE, Sistema Regional de Vida Estudiantil del CSUCA. Conoce los programas, actas, reglamentos y galería para la vida estudiantil universitaria centroamericana.',
		'crumbs'      => array( array( 'Inicio', '/' ) ),
	),
	'/actas/' => array(
		'description' => 'Actas oficiales del SIREVE: Consejo Directivo CONREVE, FICCUA, JUDUCA, Promotoras de la Salud y sesiones del CONREVE. Consulta los documentos en línea.',
		'crumbs'      => array(
			array( 'Inicio', '/' ),
			array( 'Actas SIREVE', '/actas/' ),
		),
	),
	'/galeria/' => array(
		'description' => 'Galería fotográfica del SIREVE por año: sesiones, congresos, encuentros y actividades de la vida estudiantil universitaria en Centroamérica.',
		'crumbs'      => array(
			array( 'Inicio', '/' ),
			array( 'Galería', '/galeria/' ),
		),
	),
	'/galeria/2017/' => array(
		'description' => 'Fotografías de 2017: sesión del CONREVE en Panamá, Premio Rubén Darío, FICCUA, JUDUCA, voluntariado y encuentros universitarios del SIREVE.',
		'crumbs'      => array(
			array( 'Inicio', '/' ),
			array( 'Galería', '/galeria/' ),
			array( '2017', '/galeria/2017/' ),
		),
	),
	'/galeria/2018/' => array(
		'description' => 'Fotografías de 2018: sesiones del CONREVE, congresos, talleres y actividades de los programas regionales del SIREVE en Centroamérica.',
		'crumbs'      => array(
			array( 'Inicio', '/' ),
			array( 'Galería', '/galeria/' ),
			array( '2018', '/galeria/2018/' ),
		),
	),
	'/galeria/2019/' => array(
		'description' => 'Fotografías de 2019: sesiones y actividades de los programas del SIREVE: excelencia académica, salud, deporte y voluntariado universitario.',
		'crumbs'      => array(
			array( 'Inicio', '/' ),
			array( 'Galería', '/galeria/' ),
			array( '2019', '/galeria/2019/' ),
		),
	),
	'/galeria/2020/' => array(
		'description' => 'Fotografías de 2020: afiches oficiales y estudiantes galardonados del XV Premio a la Excelencia Académica Rubén Darío.',
		'crumbs'      => array(
			array( 'Inicio', '/' ),
			array( 'Galería', '/galeria/' ),
			array( '2020', '/galeria/2020/' ),
		),
	),
	'/galeria/2023/' => array(
		'description' => 'Fotografías de 2023: afiches, listado oficial y estudiantes galardonados del XVIII Premio a la Excelencia Académica Rubén Darío.',
		'crumbs'      => array(
			array( 'Inicio', '/' ),
			array( 'Galería', '/galeria/' ),
			array( '2023', '/galeria/2023/' ),
		),
	),
	'/galeria/2024/' => array(
		'description' => 'Fotografías de 2024: ceremonia de entrega y estudiantes galardonados del XIX Premio Regional a la Excelencia Académica Rubén Darío.',
		'crumbs'      => array(
			array( 'Inicio', '/' ),
			array( 'Galería', '/galeria/' ),
			array( '2024', '/galeria/2024/' ),
		),
	),
	'/galeria/2025/' => array(
		'description' => 'Fotografías de 2025: ceremonia, gráfica oficial y estudiantes galardonados del XX Premio Regional a la Excelencia Académica Rubén Darío.',
		'crumbs'      => array(
			array( 'Inicio', '/' ),
			array( 'Galería', '/galeria/' ),
			array( '2025', '/galeria/2025/' ),
		),
	),
	'/reglamentos/' => array(
		'description' => 'Reglamento General del Sistema Regional de Vida Estudiantil (SIREVE) del CSUCA. Consulta el documento oficial vigente en línea.',
		'crumbs'      => array(
			array( 'Inicio', '/' ),
			array( 'Reglamentos', '/reglamentos/' ),
		),
	),
	'/contacto/' => array(
		'description' => 'Contacto del SIREVE: Secretaría General del CSUCA en Guatemala. Teléfono, correo y formulario para comunicarte con el equipo.',
		'crumbs'      => array(
			array( 'Inicio', '/' ),
			array( 'Contacto', '/contacto/' ),
		),
	),
	'/programas/' => array(
		'description' => 'Los cinco programas regionales del SIREVE: FICCUA, JUDUCA, Premio Rubén Darío, Promotoras de Salud y Voluntariado universitario.',
		'crumbs'      => array(
			array( 'Inicio', '/' ),
			array( 'Programas', '/programas/' ),
		),
	),
	'/programas/ficcua/' => array(
		'description' => 'FICCUA: Festival de Arte y Cultura Universitaria Centroamericana, festival bienal e itinerante de artistas estudiantiles de la región.',
		'crumbs'      => array(
			array( 'Inicio', '/' ),
			array( 'Programas', '/programas/' ),
			array( 'FICCUA', '/programas/ficcua/' ),
		),
	),
	'/programas/juduca/' => array(
		'description' => 'JUDUCA: Juegos Deportivos Universitarios Centroamericanos, la justa deportiva universitaria que fortalece la integración regional.',
		'crumbs'      => array(
			array( 'Inicio', '/' ),
			array( 'Programas', '/programas/' ),
			array( 'JUDUCA', '/programas/juduca/' ),
		),
	),
	'/programas/premio-ruben-dario/' => array(
		'description' => 'Premio Regional a la Excelencia Académica Rubén Darío: reconoce a estudiantes universitarios destacados de Centroamérica y el Caribe.',
		'crumbs'      => array(
			array( 'Inicio', '/' ),
			array( 'Programas', '/programas/' ),
			array( 'Premio Rubén Darío', '/programas/premio-ruben-dario/' ),
		),
	),
	'/programas/promotoras-salud/' => array(
		'description' => 'Promotoras de la Salud: red de universidades promotoras de la salud en Centroamérica y el Caribe para la vida universitaria.',
		'crumbs'      => array(
			array( 'Inicio', '/' ),
			array( 'Programas', '/programas/' ),
			array( 'Promotoras de Salud', '/programas/promotoras-salud/' ),
		),
	),
	'/programas/voluntariado/' => array(
		'description' => 'Voluntariado universitario del SIREVE: compromiso social y solidaridad de los estudiantes de Centroamérica y el Caribe.',
		'crumbs'      => array(
			array( 'Inicio', '/' ),
			array( 'Programas', '/programas/' ),
			array( 'Voluntariado', '/programas/voluntariado/' ),
		),
	),
);


$sireve_route = function_exists( 'sireve_route' ) ? sireve_route() : '/';
$sireve_entry = isset( $sireve_seo[ $sireve_route ] ) ? $sireve_seo[ $sireve_route ] : null;
$sireve_desc  = $sireve_entry ? $sireve_entry['description'] : get_bloginfo( 'description' );
$sireve_url   = home_url( $sireve_route );
$sireve_title = wp_get_document_title();
$sireve_theme = get_template_directory_uri();


$sireve_org = array(
	'@context'          => 'https://schema.org',
	'@type'             => 'Organization',
	'name'              => 'SIREVE',
	'alternateName'     => 'Sistema Regional de Vida Estudiantil',
	'url'               => home_url( '/' ),
	'logo'              => $sireve_theme . '/assets/images/logo-csuca.png',
	'sameAs'            => array(
		'https://www.facebook.com/csuca/',
		'https://x.com/SGCSUCA',
	),
	'parentOrganization' => array(
		'@type' => 'Organization',
		'name'  => 'Consejo Superior Universitario Centroamericano',
		'url'   => 'https://csuca.org/',
	),
	'contactPoint'      => array(
		'@type'       => 'ContactPoint',
		'telephone'   => '+502-2502-7500',
		'email'       => 'sg@csuca.org',
		'contactType' => 'customer service',
	),
);


$sireve_website = array(
	'@context'      => 'https://schema.org',
	'@type'         => 'WebSite',
	'name'          => 'SIREVE',
	'alternateName' => 'Sistema Regional de Vida Estudiantil',
	'url'           => home_url( '/' ),
	'inLanguage'    => 'es',
);
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="<?php echo esc_attr( $sireve_desc ); ?>">
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="SIREVE">
	<meta property="og:locale" content="es_ES">
	<meta property="og:title" content="<?php echo esc_attr( $sireve_title ); ?>">
	<meta property="og:description" content="<?php echo esc_attr( $sireve_desc ); ?>">
	<meta property="og:url" content="<?php echo esc_url( $sireve_url ); ?>">
	<meta property="og:image" content="<?php echo esc_url( $sireve_theme . '/assets/images/hero-sicevaes.jpg' ); ?>">
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content="<?php echo esc_attr( $sireve_title ); ?>">
	<meta name="twitter:description" content="<?php echo esc_attr( $sireve_desc ); ?>">
	<meta name="twitter:image" content="<?php echo esc_url( $sireve_theme . '/assets/images/hero-sicevaes.jpg' ); ?>">
	<script type="application/ld+json"><?php echo wp_json_encode( $sireve_org, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ); ?></script>
	<script type="application/ld+json"><?php echo wp_json_encode( $sireve_website, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ); ?></script>
<?php if ( $sireve_entry && ! empty( $sireve_entry['crumbs'] ) ) : ?>
	<?php
	$sireve_items = array();
	foreach ( $sireve_entry['crumbs'] as $sireve_i => $sireve_crumb ) {
		$sireve_items[] = array(
			'@type'    => 'ListItem',
			'position' => $sireve_i + 1,
			'name'     => $sireve_crumb[0],
			'item'     => home_url( $sireve_crumb[1] ),
		);
	}
	?>
	<script type="application/ld+json"><?php echo wp_json_encode( array(
		'@context'        => 'https://schema.org',
		'@type'           => 'BreadcrumbList',
		'itemListElement' => $sireve_items,
	), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ); ?></script>
<?php endif; ?>
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
