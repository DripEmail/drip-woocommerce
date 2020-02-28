<?php
/**
 * Cookie parsing
 *
 * @package Drip_Woocommerce
 */

defined( 'ABSPATH' ) || die( 'Executing outside of the WordPress context.' );

/**
 * Cookie parsing
 */
class Drip_Woocommerce_Cookie_Parser {
	/**
	 * The cookie string
	 *
	 * @var string
	 */
	private $cookie_string;

	/**
	 * @param string $cookie_string The cookie string.
	 */
	public function __construct($cookie_string) {
		$this->cookie_string = $cookie_string;
	}

	/**
	 * Obtain visitor id using key
	 *
	 * @return string|null
	 */
	public function get_vid() {
		$drip_cookie_array = $this->drip_cookie_array();

		foreach ( $drip_cookie_array as $cookie ) {
			list($key, $value) = explode( '=', $cookie );
			if ( 'vid' === $key ) {
				return $value;
			}
		}

		return;
	}

	private function drip_cookie_string() {
		return empty( $this->cookie_string ) ? '' : urldecode( wp_kses_data( wp_unslash( $this->cookie_string ) ) );
	}

	private function drip_cookie_array() {
		if ( empty( $this->drip_cookie_string() ) ) {
			return array();
		}

		return explode( '&', $this->drip_cookie_string() );
	}
}
