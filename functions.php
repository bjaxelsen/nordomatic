<?php
/**
 * GeneratePress child theme functions and definitions.
 *
 * Add your custom PHP in this file.
 * Only edit this file if you have direct access to it on your server (to fix errors if they happen).
 */

// Get rid of theme templat button.
add_filter( 'ast_block_templates_disable', '__return_true' );

// Avoid secondary menu as hamburger on mobile.
add_action( 'wp_enqueue_scripts', 'generate_dequeue_secondary_nav_mobile', 999 );
function generate_dequeue_secondary_nav_mobile() {
    wp_dequeue_style( 'generate-secondary-nav-mobile' );
}

// Add deferred script (browser warning)
function nordomatic_add_script() {
  wp_enqueue_script( 'nordomatic-defer', get_stylesheet_directory_uri() . '/defer.js', [], FALSE, TRUE );
}
add_action( 'wp_enqueue_scripts', 'nordomatic_add_script' );

// Tweak mobile menu query rule
add_filter( 'generate_mobile_menu_media_query', function() {
    return '(max-width: 1000px)';
} );
add_filter( 'generate_not_mobile_menu_media_query', function() {
    return '(min-width: 1001px)';
} );

// Add block styles
function nordomatic_register_block_styles() {
  if ( function_exists( 'register_block_style' ) ) {
    register_block_style(
      'core/image',
      [
        'name'  => 'light-border',
	'label' => __( 'Light border', 'rich' ),
      ]
    );
  }
}
add_action( 'after_setup_theme', 'nordomatic_register_block_styles' );

// Make sure styles load for substheme in editor
add_action( 'enqueue_block_editor_assets', function() {
   wp_enqueue_style(
     'nordomatic-style',
     get_theme_file_uri( "/style.css" ),
     false
  );
});

// Define new widget area
function nordomatic_widgets_init() {
  register_sidebar( array(
    'name'          => __( 'Sub footer', 'nordomatic' ),
    'id'            => 'subfooter',
    'description'   => __( 'Extra area below ordinary footer area.', 'nordomatic' ),
    'before_widget' => '<footer id="%1$s" class="site-info site-info--sub %2$s">',
    'after_widget'  => '</footer>',
    'before_title'  => '<h2 class="widget-title">',
    'after_title'   => '</h2>',
  ) );
}
add_action( 'widgets_init', 'nordomatic_widgets_init' );


// Add to footer
add_action( 'generate_footer', function() {
  dynamic_sidebar( 'subfooter' );
}, 100);

