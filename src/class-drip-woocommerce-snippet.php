<?php
class WC_Snippet_Drip {
  public static function init() {
    add_action( "wp_footer", __CLASS__ . "::render_snippet" );
  }

  public static function render_snippet() {
    if ( $account_id = self::get_account_id() ) {
      include( "snippet.js.php" );
    } else {
      echo "<!-- Add your woocommerce credentials in Drip to begin tracking -->";
    }
  }

  public static function get_account_id() {
    return WC_Admin_Settings::get_option( WC_Settings_Drip::ACCOUNT_ID_KEY );
  }
}
