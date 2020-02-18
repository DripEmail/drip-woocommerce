<?php

require_once( ABSPATH . "wp-admin/includes/plugin.php" );

class Drip_Woocommerce_Version {
  const HEADER = "X-WC-Drip-Version";

  public static function init() {
    add_filter( "woocommerce_webhook_http_args", __CLASS__ . "::add_version_header", 50 );
  }

  public static function add_version_header( $http_args ) {
    // TODO: Is it possible to only set this for webhooks destined to drip?
    // if $webhook->get_name() contains 'Drip', perhaps?
    if ( $version = self::my_plugin_data( "Version" ) ) {
      $http_args["headers"][self::HEADER] = $version;
    }
    return $http_args;
  }

  private static function my_plugin_data( $attribute ) {
    $path = realpath(__DIR__ . "/../drip-woocommerce.php");
    $plugin_data = get_plugin_data( $path );
    return trim($plugin_data[$attribute]);
  }
}
