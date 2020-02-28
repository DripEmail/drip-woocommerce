<?php
/**
 * Class Drip_Woocommerce_Cookie_Parser
 *
 * @package Drip_Woocommerce
 */

/**
 * Require the class we are testing
 */
require_once __dir__ . '/../src/class-drip-woocommerce-cookie-parser.php';

/**
 * Test Drip_Woocommerce_Cookie_Parser
 */
class Drip_Woocommerce_Cookie_Parser_Test extends WP_UnitTestCase {
	/**
	 * Test base case
	 */
	public function test_example() {
		$example = 'vid%3D9abd631718b5404c877ef75500800304%26pageViews%3D1%26sessionPageCount%3D1%26lastVisitedAt%3D1582896227547%26weeklySessionCount%3D1%26lastSessionAt%3D1582896227547';
		$parser  = new Drip_Woocommerce_Cookie_Parser( $example );

		$this->assertEquals( '9abd631718b5404c877ef75500800304', $parser->get_vid() );
	}

	/**
	 * Test for missing cookie
	 */
	public function test_missing() {
		$example = null;
		$parser  = new Drip_Woocommerce_Cookie_Parser( $example );

		$this->assertEquals( null, $parser->get_vid() );
	}

	/**
	 * Test for blank cookie
	 */
	public function test_blank() {
		$example = '';
		$parser  = new Drip_Woocommerce_Cookie_Parser( $example );

		$this->assertEquals( null, $parser->get_vid() );
	}

	/**
	 * Test for invalid cookie
	 */
	public function test_invalid() {
		$example = 'skjhfdhjklashkljdflhjk';
		$parser  = new Drip_Woocommerce_Cookie_Parser( $example );

		$this->assertEquals( null, $parser->get_vid() );
	}
}
