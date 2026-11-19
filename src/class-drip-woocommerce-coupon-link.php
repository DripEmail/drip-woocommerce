<?php
/**
 * Applies a coupon code passed in a link, e.g. from a Drip email's discount button.
 *
 * @package Drip_Woocommerce
 */

defined( 'ABSPATH' ) || die( 'Executing outside of the WordPress context.' );

/**
 * WooCommerce /discount/<code> links.
 *
 * Visiting any storefront URL with ?drip_coupon=<code> saves the code in the
 * shopper's WooCommerce session and redirects to the same URL without it. The
 * code is applied as soon as the cart has items: right away if it already does,
 * otherwise when a product is added. Applying it to an empty cart would fail for
 * coupons with a minimum spend or product restrictions, so it waits until then.
 */
class Drip_Woocommerce_Coupon_Link {
	const QUERY_PARAM = 'drip_coupon';
	const SESSION_KEY = 'drip_woocommerce_pending_coupon';

	/**
	 * Longest code accepted from a link. Generated Drip codes are much shorter.
	 */
	const MAX_CODE_LENGTH = 100;

	/**
	 * Set up component
	 */
	public static function init() {
		// Runs before the regular apply below; it exits after redirecting.
		add_action( 'template_redirect', __CLASS__ . '::capture_from_request', 5 );
		add_action( 'template_redirect', __CLASS__ . '::apply_pending_quietly', 20 );
		// Covers AJAX and Store API (block cart) adds, which don't hit template_redirect.
		add_action( 'woocommerce_add_to_cart', __CLASS__ . '::apply_pending_quietly', 20, 0 );
	}

	/**
	 * Pull the coupon code out of the query string.
	 *
	 * @param array $query the request's query parameters, e.g. $_GET.
	 * @return string the code, or '' when missing or unusable.
	 */
	public static function code_from_query( $query ) {
		if ( ! isset( $query[ self::QUERY_PARAM ] ) || ! is_string( $query[ self::QUERY_PARAM ] ) ) {
			return '';
		}

		$code = trim( sanitize_text_field( wp_unslash( $query[ self::QUERY_PARAM ] ) ) );

		return strlen( $code ) > self::MAX_CODE_LENGTH ? '' : $code;
	}

	/**
	 * Save the code from ?drip_coupon= and redirect to the URL without it.
	 */
	public static function capture_from_request() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- An emailed link can't carry a nonce; it only applies a coupon to the visitor's own cart.
		$code = self::code_from_query( $_GET );
		if ( '' === $code || ! WC()->session || ! WC()->cart ) {
			return;
		}

		if ( ! WC()->session->has_session() ) {
			WC()->session->set_customer_session_cookie( true );
		}

		$coupon = new WC_Coupon( $code );
		if ( ! $coupon->get_id() || self::can_never_apply( $coupon ) ) {
			wc_add_notice(
				sprintf(
					/* translators: %s: the coupon code */
					__( 'The discount code %s is not valid.', Drip_Woocommerce_Settings::NAME ),
					'<strong>' . esc_html( $code ) . '</strong>'
				),
				'error'
			);
		} elseif ( WC()->cart->is_empty() ) {
			WC()->session->set( self::SESSION_KEY, $code );
			wc_add_notice(
				sprintf(
					/* translators: %s: the coupon code */
					__( 'Your discount code %s will be applied when you add a product to your cart.', Drip_Woocommerce_Settings::NAME ),
					'<strong>' . esc_html( $code ) . '</strong>'
				),
				'notice'
			);
		} else {
			WC()->session->set( self::SESSION_KEY, $code );
			// Same messages as typing the code into the cart form.
			self::apply_pending( true );
		}

		nocache_headers();
		wp_safe_redirect( remove_query_arg( self::QUERY_PARAM ) );
		exit;
	}

	/**
	 * Try the saved code again without showing errors, e.g. after a product is added.
	 */
	public static function apply_pending_quietly() {
		self::apply_pending( false );
	}

	/**
	 * Apply the code saved in the session, if the cart has items.
	 *
	 * A code that isn't valid for the cart yet (minimum spend, product
	 * restrictions) stays saved and is tried again on the next add or page view.
	 *
	 * @param bool $show_errors whether to show WooCommerce's error notice when the code can't be applied.
	 */
	private static function apply_pending( $show_errors ) {
		if ( ! WC()->session || ! WC()->cart ) {
			return;
		}

		$code = WC()->session->get( self::SESSION_KEY );
		$cart = WC()->cart;
		if ( ! $code || $cart->is_empty() ) {
			return;
		}

		$coupon = new WC_Coupon( $code );
		if ( ! $coupon->get_id() || $cart->has_discount( $code ) || self::can_never_apply( $coupon ) ) {
			// Deleted since the link was followed, already applied, or used up.
			self::forget();
			return;
		}

		if ( ! $show_errors ) {
			// The subtotal minimum spend is checked against is stale right after an add.
			$cart->calculate_totals();
			$discounts = new WC_Discounts( $cart );
			if ( is_wp_error( $discounts->is_coupon_valid( $coupon ) ) ) {
				return;
			}
		}

		if ( $cart->apply_coupon( $code ) ) {
			self::forget();
		}
	}

	/**
	 * Whether no change to the cart can make the coupon valid, so it isn't worth retrying.
	 *
	 * @param WC_Coupon $coupon the saved coupon.
	 * @return bool
	 */
	private static function can_never_apply( $coupon ) {
		$expires = $coupon->get_date_expires();
		if ( $expires && $expires->getTimestamp() < time() ) {
			return true;
		}

		$limit = $coupon->get_usage_limit();
		return $limit > 0 && $coupon->get_usage_count() >= $limit;
	}

	/**
	 * Drop the saved code.
	 */
	private static function forget() {
		WC()->session->set( self::SESSION_KEY, null );
	}
}
