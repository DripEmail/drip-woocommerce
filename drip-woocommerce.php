<?php
/**
 * Plugin Name: Drip WooCommerce
 *
 * @package Drip_Woocommerce
 */

defined( 'ABSPATH' ) || die( 'Executing outside of the WordPress context.' );

// TODO: Make sure that woocommerce is enabled.

function drip_woocommerce_filter_woocommerce_webhook_topic_hooks($topic_hooks)
{
    $topic_hooks['cart.drip_event'] = array(
        'something_relevant',
    );
    return $topic_hooks;
}
add_filter('woocommerce_webhook_topic_hooks', 'drip_woocommerce_filter_woocommerce_webhook_topic_hooks');







/**
 * add_new_webhook_topics adds the new webhook to the dropdown list on the Webhook page.
 * @param array $topics Array of topics with the i18n proper name.
 */
function add_new_webhook_topics( $topics ) {
    // New topic array to add to the list, must match hooks being created.
    $new_topics = array(
        'cart.drip_event' => __( 'Drip Cart Event', 'woocommerce' ),
    );
    return array_merge( $topics, $new_topics );
}
add_filter( 'woocommerce_webhook_topics', 'add_new_webhook_topics' );


// do_action( 'woocommerce_add_to_cart', $cart_item_key, $product_id, $quantity, $variation_id, $variation, $cart_item_data );
// do_action( 'woocommerce_remove_cart_item', $cart_item_key, $this );
// do_action( 'woocommerce_cart_item_restored', $cart_item_key, $this );
