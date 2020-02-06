<?php

class Drip_Woocommerce_Cart_Events
{
    const CART_UPDATED_ACTION = 'updated';

    public function setup_cart_actions()
    {
        add_action( 'woocommerce_after_cart_item_quantity_update', array($this, 'drip_woocommerce_cart_updated'), 10, 0 );
        add_action( 'woocommerce_cart_item_removed', array($this, 'drip_woocommerce_cart_updated'), 10, 0 );
        add_action( 'woocommerce_add_to_cart', array($this, 'drip_woocommerce_cart_updated'), 10, 0 );
        add_action( 'woocommerce_cart_item_restored', array($this, 'drip_woocommerce_cart_updated'), 10, 0 );
        add_action( 'woocommerce_cart_emptied', array($this, 'drip_woocommerce_cart_updated'), 10, 0  ); // no way to get this from the UI without plugins
    }
    
    public function drip_woocommerce_cart_updated() {
        $current_user = wp_get_current_user();
        if( ! $current_user || empty($current_user->user_email) ) { return; } // no way to identify this user

        WC()->cart->calculate_totals();
        $cart = WC()->cart->get_cart();

        $event_data = $this->base_event($current_user);
        foreach( $cart as $product_id => $cart_item_info ) {
            $product_event_data = $this->product_event_data($cart_item_info);
            if($product_event_data) {
                $event_data['cart_data'][$product_id] = $product_event_data;
            }
        }
        
        do_action( 'wc_drip_woocommerce_cart_event', $event_data );
    }

    private function base_event($user) {
        return array(
            'event_action' => self::CART_UPDATED_ACTION,
            'customer_email' => $user->user_email,
            'cart_data' => array()
        );
    }

    private function product_event_data($cart_item_info) {
        $product_key = $this->product_key($cart_item_info);
        $product_data = WC()->product_factory->get_product( $product_key );

        if( ! $product_data ) { return false; }

        return array(
            "product_id" => $cart_item_info['product_id'],
            "product_variant_id" => $product_key,
            "sku" => $product_data->get_sku(),
            "name" => $product_data->get_name(),
            "short_description" => $product_data->get_short_description(),
            "price" => $product_data->get_price(),
            "taxes" => $cart_item_info['line_tax'],
            "total" => $cart_item_info['line_total'],
            "quantity" => $cart_item_info['quantity'],
            "product_url" => $product_data->get_permalink(),
            "image_url" => $product_data->get_image('woocommerce_single', array(), true),
            "categories" => $this->product_categories($product_data)
        );
    }

    private function product_key($cart_product_info) {
        return empty($cart_product_info['variation_id'])? $cart_product_info['product_id'] : $cart_product_info['variation_id'];
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
