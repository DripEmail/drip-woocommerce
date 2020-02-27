<?php

require_once( ABSPATH . "wp-admin/includes/plugin.php" );

class Drip_Woocommerce_Version {
	const HEADER = "X-WC-Drip-Version";

	public static function init() {
		add_filter( "woocommerce_webhook_http_args", __CLASS__ . "::add_version_header", 50, 3 );
	}

	public static function add_version_header( $http_args, $_arg, $this_id ) {
		// $this_id is webhook id
		$webhook_name = (new WC_Webhook($this_id))->get_name();
		if ( strpos(strtolower($webhook_name), "drip") !== false ) {
			if ( $version = self::my_plugin_data( "Version" ) ) {
				$http_args["headers"][self::HEADER] = $version;
			}
		}
		return $http_args;
	}

	private static function my_plugin_data( $attribute ) {
		$path = realpath(__DIR__ . "/../drip-woocommerce.php");
		$plugin_data = get_plugin_data( $path );
		return trim($plugin_data[$attribute]);
	}
}
