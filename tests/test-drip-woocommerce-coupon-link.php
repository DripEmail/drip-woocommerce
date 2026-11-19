<?php
/**
 * Class Drip_Woocommerce_Coupon_Link
 *
 * @package Drip_Woocommerce
 */

/**
 * Require the class we are testing
 */
require_once __DIR__ . '/../src/class-drip-woocommerce-coupon-link.php';

/**
 * Test Drip_Woocommerce_Coupon_Link::code_from_query (the rest needs WooCommerce; see the CouponLink e2e feature)
 */
class Drip_Woocommerce_Coupon_Link_Test extends WP_UnitTestCase {
	/**
	 * Test base case
	 */
	public function test_code() {
		$this->assertEquals( 'DRIPTEST10-5JX3KD2G', Drip_Woocommerce_Coupon_Link::code_from_query( array( 'drip_coupon' => 'DRIPTEST10-5JX3KD2G' ) ) );
	}

	/**
	 * Test surrounding whitespace is dropped
	 */
	public function test_trims() {
		$this->assertEquals( 'save10', Drip_Woocommerce_Coupon_Link::code_from_query( array( 'drip_coupon' => "  save10\n" ) ) );
	}

	/**
	 * Test WordPress's magic-quote slashes are removed
	 */
	public function test_unslashes() {
		$this->assertEquals( "o'neil", Drip_Woocommerce_Coupon_Link::code_from_query( array( 'drip_coupon' => "o\\'neil" ) ) );
	}

	/**
	 * Test markup is stripped
	 */
	public function test_strips_tags() {
		$this->assertEquals( 'save10', Drip_Woocommerce_Coupon_Link::code_from_query( array( 'drip_coupon' => '<script>alert(1)</script>save10' ) ) );
	}

	/**
	 * Test missing, blank and non-string params
	 */
	public function test_missing_or_blank() {
		$this->assertEquals( '', Drip_Woocommerce_Coupon_Link::code_from_query( array() ) );
		$this->assertEquals( '', Drip_Woocommerce_Coupon_Link::code_from_query( array( 'drip_coupon' => '   ' ) ) );
		$this->assertEquals( '', Drip_Woocommerce_Coupon_Link::code_from_query( array( 'drip_coupon' => array( 'save10' ) ) ) );
	}

	/**
	 * Test overly long codes are rejected
	 */
	public function test_too_long() {
		$this->assertEquals( '', Drip_Woocommerce_Coupon_Link::code_from_query( array( 'drip_coupon' => str_repeat( 'a', 101 ) ) ) );
		$this->assertEquals( str_repeat( 'a', 100 ), Drip_Woocommerce_Coupon_Link::code_from_query( array( 'drip_coupon' => str_repeat( 'a', 100 ) ) ) );
	}
}
