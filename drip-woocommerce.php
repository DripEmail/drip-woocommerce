<?php
/**
 * Plugin Name: Drip WooCommerce
 *
 * @package Drip_Woocommerce
 */

defined( 'ABSPATH' ) || die( 'Executing outside of the WordPress context.' );

// Make sure that woocommerce is enabled
if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {
    (new drip_woocommerce_cart_events())->setup_cart_actions();
}

class drip_woocommerce_cart_events
{
    const CART_UPDATED_ACTION = 'updated';

    public function setup_cart_actions()
    {
// do_action( 'woocommerce_cart_item_restored', $cart_item_key, $this );
// do_action( 'woocommerce_after_cart_item_quantity_update', $cart_item_key, $quantity, $old_quantity, $this );
// do_action( 'woocommerce_before_cart_emptied' );
// do_action( 'woocommerce_cart_emptied' );
        add_action( 'woocommerce_cart_item_removed', array($this, 'drip_woocommerce_cart_updated'), 10, 2 );
        add_action( 'woocommerce_add_to_cart', array($this, 'drip_woocommerce_cart_updated'), 10, 6 );
    }

    public function drip_woocommerce_cart_updated($current_user, $cart) {
        $event_data = array(
            'event_action' => self::CART_UPDATED_ACTION,
            'customer_email' => $user->user_email ?? 'nobody@example.com',
            'cart_data' => array()
        );

        foreach( WC()->cart->get_cart() as $product_id => $cart_product_info ) {
            $product_key = $this->product_key($cart_product_info);
            $product_data = WC()->product_factory->get_product( $product_key );
            if($product_data) {
                $event_data['cart_data'][$product_id] = array(
                    "product_id" => (string)$cart_product_info['product_id'],
                    "product_variant_id" => (string)$product_key,
                    "sku" => $product_data->get_sku(),
                    "name" => $this->product_name($product_data),
                    "price" => (float)$product_data->get_price(),
                    "taxes" => (float)($cart_product['line_tax'] ?? 0.0),
                    "total" => (float)$cart_product_info['line_total'],
                    "quantity" => (int)($cart_product_info['quantity'] ?? 0),
                    "product_url" => $product_data->get_permalink(),
                    "image_url" => $this->product_image($product_data),
                    "categories" => $this->product_categories($product_data)
                );
            }
        }

        do_action( 'wc_drip_woocommerce_cart_event', $event_data );
    }

    private function product_key($cart_product_info) {
        return empty($cart_product_info['variation_id'])? $cart_product_info['product_id'] : $cart_product_info['variation_id'];
    }

    private function product_name($product_data) {
        return empty($product_data->get_name()) ? $product_data->get_short_description() : $product_data->get_name();
    }

    private function product_image($product_data) {
        $image = $product_data->get_image('woocommerce_single', array(), true);
        if(substr($image, 0, 4) === 'http') {
            return $image;
        }
        // if I read the woocommerce code correctly, sometimes we can get just a url, most times
        // we'll get a full <img...> tag that can be embedded in a document.
        $d = new DOMDocument( '1.0' );
        $d->loadXML($image);
        return $d->getElementsByTagName('img')[0]->getAttribute("src");
    }

    private function product_categories($product_data) {
        $categories = array();
        foreach($product_data->get_category_ids() as $cid) {
            $woo_category = get_term_by( 'id', absint( $cid ), 'product_cat' );
            array_push($categories, $woo_category->name);
        }
        return $categories;
    }
}

include('drip-woocommerce-settings.php');
