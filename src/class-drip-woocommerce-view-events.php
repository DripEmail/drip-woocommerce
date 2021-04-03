<?php
/**
 * Manage viewed a product events
 *
 * @package Drip_Woocommerce
 */

defined( 'ABSPATH' ) || die( 'Executing outside of the WordPress context.' );

/**
 * Manage viewed a product events
 */
class Drip_Woocommerce_View_Events {
	/**
	 * Set up component
	 */
	public static function init() {
		$view_events = new Drip_Woocommerce_View_Events();
		$view_events->setup_view_actions();
	}

	/**
	 * Start processing view actions
	 */
	public function setup_view_actions() {
		add_action( 'woocommerce_after_single_product', array( $this, 'drip_woocommerce_viewed_product' ), 10 );
	}

	/**
	 * Handler for woocommerce_after_single_product action
	 */
	public function drip_woocommerce_viewed_product() {
		wp_register_script( 'Drip product view tracking', plugin_dir_url( __FILE__ ) . 'product_view_tracking.js', array(), '1', true );
		$product            = wc_get_product();
		$image_id           = $product->get_image_id();
		$product_attributes = array(
			'product_id'         => $product->get_id(),
			'product_variant_id' => $product->get_id(),
			'sku'                => $product->get_sku( 'drip_woocommerce' ),
			'name'               => $product->get_name( 'drip_woocommerce' ),
			'price'              => $product->get_price( 'drip_woocommerce' ) * 100,
			'product_url'        => $product->get_permalink(),
			'currency'           => get_option( 'woocommerce_currency' ),
			'categories'         => $this->product_categories( $product ),
			'image_id'           => $image_id,
			'image_url'          => wp_get_attachment_image_url( $image_id ),
		);

		wp_localize_script( 'Drip product view tracking', 'product', $product_attributes );
		wp_enqueue_script( 'Drip product view tracking', plugin_dir_url( __FILE__ ) . 'product_view_tracking.js', array(), 1.0, true );
	}

	/**
	 * Get the categories for a product
	 *
	 * @param WC_Product $product A WooCommerce product.
	 */
	private function product_categories( $product ) {
		$categories = array();
		foreach ( $product->get_category_ids() as $cid ) {
			$woo_category = get_term_by( 'id', absint( $cid ), 'product_cat' );
			array_push( $categories, $woo_category->name );
		}
		return join( ',', $categories );
	}
}
