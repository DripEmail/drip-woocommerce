// Matches Drip_Woocommerce_Settings::default_signup_text() for the test store's name.
export const DEFAULT_SIGNUP_TEXT = 'Email me exclusive offers and updates from drip_woocommerce_test'

// WooCommerce sets this on every webhook; WordPress omits a ".0" patch version (e.g. "7.1").
export const WEBHOOK_USER_AGENT = /WooCommerce\/\d+\.\d+(\.\d+)?.*Hookshot.*\(WordPress\/\d+\.\d+(\.\d+)?\)/
