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
	const BLOCK_FIELD_ID = 'drip-woocommerce/accepts-marketing';
	const BLOCK_FIELD_META_PREFIX = '_wc_other/';

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
		add_action( 'woocommerce_init', array( $this, 'register_block_field' ) );
		add_filter( 'woocommerce_get_default_value_for_' . self::BLOCK_FIELD_ID, array( $this, 'block_field_default_value' ), 10, 3 );
		add_action( 'woocommerce_store_api_checkout_order_processed', array( $this, 'callback_store_api_order_processed' ), 10, 1 );
	}

	/**
	 * Whether the sign up option should be offered at all.
	 *
	 * @return bool
	 */
	private function signup_enabled() {
		if ( $this->drip_not_integrated() ) {
			return false;
		}

		return ! (
			WC_Admin_Settings::get_option( Drip_Woocommerce_Settings::MARKETING_CONFIG_KEY ) === 'no'
			&& WC_Admin_Settings::get_option( Drip_Woocommerce_Settings::DEFAULT_MARKETING_CONFIG_KEY ) === 'no'
		);
	}

	/**
	 * The text shown next to the sign up checkbox.
	 *
	 * @return string
	 */
	private function signup_label() {
		$configured = WC_Admin_Settings::get_option( Drip_Woocommerce_Settings::MARKETING_CONFIG_TEXT );
		if ( $configured ) {
			return $configured;
		}

		return Drip_Woocommerce_Settings::default_signup_text();
	}

	/**
	 * Whether the sign up checkbox starts out checked.
	 *
	 * @return bool
	 */
	private function signup_checked_by_default() {
		return WC_Admin_Settings::get_option( Drip_Woocommerce_Settings::DEFAULT_MARKETING_CONFIG_KEY ) === 'yes';
	}

	/**
	 * Announce that a shopper opted in.
	 *
	 * @param WC_Order $order The order the opt-in came from.
	 */
	private function announce_subscriber_updated( $order ) {
		do_action(
			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
			'wc_drip_woocommerce_subscriber_updated',
			array(
				'email'  => $order->get_billing_email(),
				'status' => 'active',
			)
		);
	}

	/**
	 * Callback for woocommerce_review_order_before_submit
	 */
	public function callback_review_order() {
		if ( ! $this->signup_enabled() ) {
			return;
		}

		woocommerce_form_field(
			self::FIELD_NAME,
			array(
				'type'  => 'checkbox',
				'label' => $this->signup_label(),
			),
			$this->signup_checked_by_default() ? 1 : 0
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
		if ( $this->drip_not_integrated() ) {
			return;
		}

		// Ignoring nonce since it was checked earlier.
		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		if ( isset( $_POST[ self::FIELD_NAME ] ) && '1' === $_POST[ self::FIELD_NAME ] ) {
			$this->announce_subscriber_updated( $order );
		}
	}

	/**
	 * Register the sign up checkbox with the block checkout.
	 *
	 * Callback for woocommerce_init.
	 */
	public function register_block_field() {
		if ( ! function_exists( 'woocommerce_register_additional_checkout_field' ) ) {
			return;
		}

		if ( ! $this->signup_enabled() ) {
			return;
		}

		$label = $this->signup_label();

		woocommerce_register_additional_checkout_field(
			array(
				'id'            => self::BLOCK_FIELD_ID,
				'label'         => $label,
				// Without this WooCommerce appends "(optional)" to the label.
				'optionalLabel' => $label,
				'location'      => 'contact',
				'type'          => 'checkbox',
				'required'      => false,
			)
		);
	}

	/**
	 * Pre-check the block checkout field when the merchant has opted into that.
	 *
	 * Callback for woocommerce_get_default_value_for_{$field_id}.
	 *
	 * @param mixed  $value The default value WooCommerce resolved.
	 * @param string $group The group the field is being read for.
	 * @param object $wc_object The order or customer the field is being read from.
	 * @return mixed
	 */
	public function block_field_default_value( $value, $group, $wc_object ) {
		return $this->signup_checked_by_default() ? '1' : $value;
	}

	/**
	 * Callback for woocommerce_store_api_checkout_order_processed, which is what the
	 * block checkout fires in place of woocommerce_checkout_order_processed.
	 *
	 * @param WC_Order $order The order object.
	 */
	public function callback_store_api_order_processed( $order ) {
		if ( $this->drip_not_integrated() ) {
			return;
		}

		if ( '1' !== (string) $order->get_meta( $this->block_field_meta_key(), true ) ) {
			return;
		}

		$this->announce_subscriber_updated( $order );
	}

	/**
	 * The order meta key the block checkout stores the sign up field under.
	 *
	 * @return string
	 */
	private function block_field_meta_key() {
		$checkout_fields = 'Automattic\WooCommerce\Blocks\Domain\Services\CheckoutFields';

		if ( class_exists( $checkout_fields ) && defined( $checkout_fields . '::OTHER_FIELDS_PREFIX' ) ) {
			return constant( $checkout_fields . '::OTHER_FIELDS_PREFIX' ) . self::BLOCK_FIELD_ID;
		}

		return self::BLOCK_FIELD_META_PREFIX . self::BLOCK_FIELD_ID;
	}
}
