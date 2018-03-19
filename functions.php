<?php
/*
 *  Author:
 *  URL:
 *  Custom functions, support, custom post types and more.
 */

/*------------------------------------*\
	Enque Scripts & Styles
\*------------------------------------*/

//Styles
//wp_enqueue_script( $handle, $source, $dependencies, $version, $in_footer );

//Scripts
//wp_enqueue_style( $handle, $source, $dependencies, $version, $media );

function my_assets() {
    
    //Link to style.css
    wp_enqueue_style( 'main_css', get_template_directory_uri() . '/style.css' );
    
    //Link to main.js
     wp_enqueue_script( 'main_js', get_theme_file_uri( '/js/main.js' ), array( 'jquery' ), '2.1.2', true );
        
}

add_action( 'wp_enqueue_scripts', 'my_assets' );

/*------------------------------------*\
	Functions
\*------------------------------------*/

?>