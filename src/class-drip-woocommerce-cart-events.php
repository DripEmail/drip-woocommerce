<?php

defined( 'ABSPATH' ) || die( 'Executing outside of the WordPress context.' );

class Drip_Woocommerce_Cart_Events
{
    const CART_SESSION_KEY = "drip_cart_session_id";
    const CART_UPDATED_ACTION = 'updated';

    public static function init()
    {
        $cart_events = new Drip_Woocommerce_Cart_Events();
        $cart_events->setup_cart_actions();
    }

    public function setup_cart_actions()
    {
        add_action( 'woocommerce_after_cart_item_quantity_update', array($this, 'drip_woocommerce_cart_updated'), 10, 0 );
        add_action( 'woocommerce_cart_item_removed', array($this, 'drip_woocommerce_cart_updated'), 10, 0 );
        add_action( 'woocommerce_add_to_cart', array($this, 'drip_woocommerce_cart_updated'), 10, 0 );
        add_action( 'woocommerce_cart_item_restored', array($this, 'drip_woocommerce_cart_updated'), 10, 0 );
        add_action( 'woocommerce_cart_emptied', array($this, 'drip_woocommerce_cart_updated'), 10, 0  ); // no way to get this from the UI without plugins
    }

    public function drip_woocommerce_cart_updated() {
        if( $this->user_invalid() ) { return; }

        $event = $this->base_event();

        $cart_contents = WC()->cart->get_cart();
        foreach( $cart_contents as $product_id => $cart_item_info ) {
            $product_event_data = $this->product_event_data($cart_item_info);
            if($product_event_data) {
                $event->cart_data[$product_id] = $product_event_data;
            }
        }
        do_action( 'wc_drip_woocommerce_cart_event', array($event) );

        if(WC()->cart->is_empty()) {
            $this->remove_drip_cart_session_id();
        }
    }

    private function base_event() {
        WC()->cart->calculate_totals();

        $event = new Drip_Woocommerce_Cart_Event();
        $event->event_action = self::CART_UPDATED_ACTION; // TODO: we can trap cart created events if we have to generate a new cart session id
        $event->customer_email = wp_get_current_user()->user_email;
        $event->session = $this->drip_cart_session_id();
        $event->grand_total = WC()->cart->get_total('drip_woocommerce');
        $event->total_discounts = WC()->cart->get_discount_total('drip_woocommerce');
        $event->total_taxes = WC()->cart->get_total_tax('drip_woocommerce');
        $event->total_fees = WC()->cart->get_fee_total('drip_woocommerce');
        $event->total_shipping = WC()->cart->get_shipping_total('drip_woocommerce');
        $event->currency = get_option('woocommerce_currency');
        return $event;
    }

    private function product_event_data($cart_item_info) {
        $product_key = $this->product_key($cart_item_info);
        $product_data = WC()->product_factory->get_product( $product_key );

        if( ! $product_data ) { return false; }

        $cart_event_product = new Drip_Woocommerce_Cart_Event_Product();
        $cart_event_product->product_id =$cart_item_info['product_id'];
        $cart_event_product->product_variant_id = $product_key;
        $cart_event_product->sku = $product_data->get_sku('drip_woocommerce');
        $cart_event_product->name = $product_data->get_name('drip_woocommerce');
        $cart_event_product->short_description = $product_data->get_short_description('drip_woocommerce');
        $cart_event_product->price = $product_data->get_price('drip_woocommerce');
        $cart_event_product->taxes = $cart_item_info['line_tax'];
        $cart_event_product->total = $cart_item_info['line_total'];
        $cart_event_product->quantity = $cart_item_info['quantity'];
        $cart_event_product->product_url = $product_data->get_permalink();
        $cart_event_product->image_url = $product_data->get_image('woocommerce_single', array(), true);
        $cart_event_product->categories = $this->product_categories($product_data);

        return $cart_event_product;
    }

    private function user_invalid() {
        $wp_user = wp_get_current_user();
        if( $wp_user && !empty($wp_user->user_email) ) {
            return false;
        }
        return true; // no way to identify a Drip person.
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

    private function drip_cart_session_id()
    {
        $cid = WC()->session->get( self::CART_SESSION_KEY, false);
        if($cid) { return $cid; }
        $cid = $this->generate_drip_cart_session_id();
        WC()->session->set( self::CART_SESSION_KEY, $cid);
        return $cid;
    }

    private function remove_drip_cart_session_id()
    {
        WC()->session->__unset( self::CART_SESSION_KEY );
    }

    private function generate_drip_cart_session_id()
    {
        $random_data = random_bytes(32); // as of php7, random_bytes is advertised as cryptographically secure
        return hash('sha256',  $random_data);
    }
}

//

class Drip_Woocommerce_Cart_Event
{
    public $event_action;
    public $customer_email;
    public $session;
    public $grand_total;
    public $total_discounts;
    public $total_taxes;
    public $total_fees;
    public $total_shipping;
    public $currency;
    public $cart_data = array();
}

class Drip_Woocommerce_Cart_Event_Product
{
    public $product_id;
    public $product_variant_id;
    public $sku;
    public $name;
    public $short_description;
    public $price;
    public $taxes;
    public $total;
    public $quantity;
    public $product_url;
    public $image_url;
    public $categories = array();
}
