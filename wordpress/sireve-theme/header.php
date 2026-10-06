<?php
/**
 * Apertura del documento. El header del SIREVE (barra, nav y redes) vive dentro
 * de cada vista, generado por build.mjs, para que el preview mida lo mismo que
 * se publica.
 */
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
