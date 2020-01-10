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
    $topic_hooks['dripcart.updated'] = array(
        'drip_woocommerce_cart_event',
    );
    return $topic_hooks;
}
add_filter('woocommerce_webhook_topic_hooks', 'drip_woocommerce_filter_woocommerce_webhook_topic_hooks');

/**
 * add_new_topic_events will add new events for topic resources.
 * @param array $topic_events Existing valid events for resources.
 */
function drip_woocommerce_add_new_topic_events( $topic_events ) {
    // New events to be used for resources.
    $new_events = array(
        'event',
    );
    return array_merge( $topic_events, $new_events );
}
add_filter( 'woocommerce_valid_webhook_events', 'drip_woocommerce_add_new_topic_events' );

/**
 * add_new_webhook_topics adds the new webhook to the dropdown list on the Webhook page.
 * @param array $topics Array of topics with the i18n proper name.
 */
function drip_woocommerce_add_new_webhook_topics( $topics ) {
    // New topic array to add to the list, must match hooks being created.
    $new_topics = array(
        'dripcart.updated' => __( 'Drip Cart Event', 'woocommerce' ),
    );
    return array_merge( $topics, $new_topics );
}
add_filter( 'woocommerce_webhook_topics', 'drip_woocommerce_add_new_webhook_topics' );

function drip_woocommerce_filter_woocommerce_valid_webhook_resources($resources) {
    array_push($resources, 'dripcart');
    return $resources;
}
add_filter( 'woocommerce_valid_webhook_resources', 'drip_woocommerce_filter_woocommerce_valid_webhook_resources' );


// do_action( 'woocommerce_add_to_cart', $cart_item_key, $product_id, $quantity, $variation_id, $variation, $cart_item_data );
// do_action( 'woocommerce_remove_cart_item', $cart_item_key, $this );
// do_action( 'woocommerce_cart_item_restored', $cart_item_key, $this );
