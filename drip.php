<?php
/**
 * The starting point for the Drip WooCommerce plugin.
 *
 * @package Drip_Woocommerce
 */

/*
Plugin Name: Drip for WooCommerce
Plugin URI: https://github.com/DripEmail/drip-woocommerce
Description: A WordPress plugin to connect to Drip's WooCommerce integration
Version: 1.1.2
Author: Drip
Author URI: https://www.drip.com/
License: GPLv2

WC requires at least: 3.0
WC tested up to: 7.0.1
*/

defined( 'ABSPATH' ) || die( 'Executing outside of the WordPress context.' );

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ), true ) ) {
	require_once __DIR__ . '/src/class-drip-woocommerce-settings.php';
	require_once __DIR__ . '/src/class-drip-woocommerce-snippet.php';
	require_once __DIR__ . '/src/class-drip-woocommerce-cart-events.php';
	require_once __DIR__ . '/src/class-drip-woocommerce-view-events.php';
	require_once __DIR__ . '/src/class-drip-woocommerce-version.php';
	require_once __DIR__ . '/src/class-drip-woocommerce-customer-identify.php';
	require_once __DIR__ . '/src/class-drip-woocommerce-checkout-marketing-confirmation.php';
	require_once __DIR__ . '/src/class-drip-woocommerce-plugin-view.php';

	Drip_Woocommerce_Settings::init();
	Drip_Woocommerce_Snippet::init();
	Drip_Woocommerce_Cart_Events::init();
	Drip_Woocommerce_View_Events::init();
	Drip_Woocommerce_Version::init();
	Drip_Woocommerce_Customer_Identify::init();
	Drip_Woocommerce_Checkout_Marketing_Confirmation::init();
	Drip_Woocommerce_Plugin_View::init();
}
