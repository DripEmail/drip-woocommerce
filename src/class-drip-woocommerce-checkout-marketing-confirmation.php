<?php
/**
 * Insert checkbox on checkout
 *
 * @package Drip_Woocommerce
 */

defined( 'ABSPATH' ) || die( 'Executing outside of the WordPress context.' );

/**
 * Insert checkbox on checkout
 */
class Drip_Woocommerce_Checkout_Marketing_Confirmation {
	const FIELD_NAME = 'drip_woocommerce_accepts_marketing';

	/**
	 * Set up component
	 */
	public static function init() {
		$marketing_confirmation = new self();
		$marketing_confirmation->setup_actions();
	}

	/**
	 * See if the account id is preesent from the woocommerce settings
	 */
	private function drip_not_integrated() {
		return ! (bool) WC_Admin_Settings::get_option( Drip_Woocommerce_Settings::ACCOUNT_ID_KEY );
	}

	/**
	 * Initialize actions/filters
	 */
	public function setup_actions() {
		add_action( 'woocommerce_review_order_before_submit', array( $this, 'callback_review_order' ), 10, 0 );
		add_action( 'woocommerce_checkout_order_processed', array( $this, 'callback_checkout_order_processed' ), 10, 3 );
	}

	/**
	 * Callback for woocommerce_review_order_before_submit
	 */
	public function callback_review_order() {
		if( $this->drip_not_integrated() ) {
			return;
		}

		woocommerce_form_field(
			self::FIELD_NAME,
			array(
				'type'  => 'checkbox',
				// TODO: Make this configurable.
				'label' => 'Subscribe to newsletter',
			)
		);
	}

	/**
	 * Callback for woocommerce_checkout_process
	 *
	 * @param int      $order_id The ID of the generated order.
	 * @param array    $posted_data The data posted to the form.
	 * @param WC_Order $order The order object.
	 */
	public function callback_checkout_order_processed( $order_id, $posted_data, $order ) {
		if( $this->drip_not_integrated() ) {
			return;
		}

		// Ignoring nonce since it was checked earlier.
		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		if ( isset( $_POST[ self::FIELD_NAME ] ) && '1' === $_POST[ self::FIELD_NAME ] ) {
			do_action(
				// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
				'wc_drip_woocommerce_subscriber_updated',
				array(
					'email'  => $order->get_billing_email(),
					'status' => 'active',
				)
			);
		}
	}
}
