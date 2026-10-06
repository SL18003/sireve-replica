<?php
/**
 * Plantilla de las vistas SIREVE: si la ruta tiene vista generada se pinta esa
 * vista; si no, se pinta lo que tenga la pagina en el editor.
 * Generado por wordpress/build.mjs.
 */
get_header();

if ( ! sireve_render() ) {
	?>
	<div class="page-wrap">
		<div class="page-body">
			<h1 class="page-hero-title"><?php the_title(); ?></h1>
			<?php the_content(); ?>
		</div>
	</div>
	<?php
}

get_footer();
