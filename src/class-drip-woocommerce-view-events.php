<?php

defined( 'ABSPATH' ) || die( 'Executing outside of the WordPress context.' );

class Drip_Woocommerce_View_Events
{
    public static function init()
    {
        $view_events = new Drip_Woocommerce_View_Events();
        $view_events->setup_view_actions();
    }

    public function setup_view_actions()
    {
        add_action( 'woocommerce_after_single_product', array($this, 'drip_woocommerce_viewed_product'), 10 );
    }

    public function drip_woocommerce_viewed_product() {
      $product = wc_get_product();
      $currency = get_option('woocommerce_currency');
      $categories = $this->product_categories($product);
      $image_id  = $product->get_image_id();
      $image_url = wp_get_attachment_image_url( $image_id );
      $script_tag = <<<TAG
        <!-- Drip track -->
        <script type="text/javascript">
        var _dcq = _dcq || [];
        _dcq.push(["track", "Viewed a product", {
            product_id: "{$product->get_id('drip_woocommerce')}",
            product_variant_id: "{$product->get_variation_id('drip_woocommerce')}",
            sku: "{$product->get_sku('drip_woocommerce')}",
            name: "{$product->get_name('drip_woocommerce')}",
            categories: "{$categories}",
            price: "{$product->get_price('drip_woocommerce')}",
            currency: "{$currency}",
            product_url: "{$product->get_permalink()}",
            image_url: "{$image_url}",
            source: "drip_woocommerce"
        }]);
        </script>
        <!-- end Drip track -->
TAG;

      echo $script_tag;
    }

    private function product_categories($product) {
        $categories = array();
        foreach($product->get_category_ids() as $cid) {
            $woo_category = get_term_by( 'id', absint( $cid ), 'product_cat' );
            array_push($categories, $woo_category->name);
        }
        return join(",", $categories);
    }
}
