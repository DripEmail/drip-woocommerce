<?php
/**
 * @package Drip_Woocommerce
 */
/*
Plugin Name: Drip WooCommerce
Plugin URI: https://github.com/DripEmail/drip-woocommerce
Description: A Wordpress plugin to connect to Drip's WooCommerce integration
Version: 0.0.1
Author: DripEmail
Author URI: https://github.com/DripEmail/
License: GPLv2
*/

defined( 'ABSPATH' ) || die( 'Executing outside of the WordPress context.' );

if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ), true ) ) {
    require_once(__DIR__ . '/src/class-drip-woocommerce-settings.php');
    require_once(__DIR__ . '/src/class-drip-woocommerce-snippet.php');
    require_once(__DIR__ . '/src/class-drip-woocommerce-cart-events.php');
    require_once(__DIR__ . '/src/class-drip-woocommerce-version.php');

    Drip_Woocommerce_Settings::init();
    Drip_Woocommerce_Snippet::init();
    Drip_Woocommerce_Cart_Events::init();
    Drip_Woocommerce_Version::init();
}
