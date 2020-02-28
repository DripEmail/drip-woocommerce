<?php
/**
 * Value object for cart event products
 *
 * @package Drip_Woocommerce
 */

/**
 * Value object for cart event products
 */
class Drip_Woocommerce_Cart_Event_Product {
	/**
	 * Product ID
	 *
	 * @var string
	 */
	public $product_id;

	/**
	 * Product Variant ID
	 *
	 * @var string
	 */
	public $product_variant_id;

	/**
	 * SKU
	 *
	 * @var string
	 */
	public $sku;

	/**
	 * Name
	 *
	 * @var string
	 */
	public $name;

	/**
	 * Short Description
	 *
	 * @var string
	 */
	public $short_description;

	/**
	 * Price
	 *
	 * @var float
	 */
	public $price;

	/**
	 * Taxes
	 *
	 * @var float
	 */
	public $taxes;

	/**
	 * Total
	 *
	 * @var float
	 */
	public $total;

	/**
	 * Quantity
	 *
	 * @var int
	 */
	public $quantity;

	/**
	 * Product URL
	 *
	 * @var string
	 */
	public $product_url;

	/**
	 * Image URL
	 *
	 * @var string
	 */
	public $image_url;

	/**
	 * Categories
	 *
	 * @var array
	 */
	public $categories = array();
}
