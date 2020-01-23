<?php
/**
 * Plugin Name: Drip WooCommerce
 *
 * @package Drip_Woocommerce
 */

defined( 'ABSPATH' ) || die( 'Executing outside of the WordPress context.' );

// TODO: Make sure that woocommerce is enabled.

function drip_woocommerce_action_add_to_cart($cart_item_key, $product_id, $quantity, $variation_id, $variation, $cart_item_data) {
    do_action( 'wc_drip_woocommerce_cart_event', 'blah de blah' );
}
add_action( 'woocommerce_add_to_cart', 'drip_woocommerce_action_add_to_cart', 10, 6 );

// do_action( 'woocommerce_add_to_cart', $cart_item_key, $product_id, $quantity, $variation_id, $variation, $cart_item_data );
// do_action( 'woocommerce_remove_cart_item', $cart_item_key, $this );
// do_action( 'woocommerce_cart_item_restored', $cart_item_key, $this );
