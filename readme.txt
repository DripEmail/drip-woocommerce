=== Drip for WooCommerce ===
Contributors: getdrip
Tags: woocommerce, drip, ecrm, email marketing automation
Requires at least: 4.6
Tested up to: 5.3
Stable tag: 0.0.3
Requires PHP: 7.2
License: GPLv2
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Drip empowers WooCommerce stores to build customer loyalty through deep insights, proven strategies, and tailored communication across channels.

== Description ==

**Note: The Drip WooCommerce native plugin is in early access limited-release. If you want early access [you can request it here](https://docs.google.com/forms/d/e/1FAIpQLSd1OFURetR7Fi2l4w6urTvZQ3HCKnw6A3mf-qAkEtxEjfjZbg/viewform), and based on availability we’ll enable it inside your paid Drip account.**

When WooCommerce stores integrate with Drip, a pathway to increased customer loyalty, higher LTV, and lower CAC opens up for sellers at any stage.

Drip empowers WooCommerce stores to build customer loyalty so they can keep on selling for years to come. When your WooCommerce store and Drip get together, customer data can finally be turned into one-of-a-kind customer experiences that build brand loyalty and grow your sales for the long run.

By connecting customer data to your store's marketing channels, WooCommerce stores get deeper customer insights to power more effective, higher ROI cross-channel campaigns. These relevant, tailored brand communications are delivered via email, SMS texts, social media, and beyond delivering the experiences people expect from online brands today—not the forgettable commoditized experiences that marketplaces offer.

WooCommerce and Drip together can create memorable online shopping experiences that build brand affinity and loyalty for any store selling online. This integration busts down more barriers to entrepreneurship and success for independent online sellers, and it’s another step forward in the evolution of ecommerce.

=== Understand People Along the Entire Shopping Journey ===

When you’re selling with WooCommerce, the world’s most customizable ecommerce platform, the pool of customer data at your fingertips runs deep. When your store connects with Drip, we distill all of that data to reveal valuable insights like how many customers you have, how many repeat purchasers you have, how increased customer loyalty is impacting your bottom line, and beyond.

By seeing who is moving along their customer journey and how they’re getting to loyalty, WooCommerce stores have a deeper understanding of their customer base and the strategies that are having this greatest effect.

Use your WooCommerce customer data to apply:

* Tags that help you quickly see how a customer interacts with your store
* Custom Fields for truly nitty-gritty personalization
* Events that track every click, purchase, and real-life action

=== Guide Customers Toward Long-term Loyalty and Higher LTV ===

With a solid foundation of understanding who your customers are and how they’re shopping with your store, Drip digs into your next steps. We look at the strategies you’re already implementing and recommend ones that are missing from your ecommerce game plan.

With proven recommendations for what you should do next, you’ll save time and guesswork. Whether Drip recommends a friendly Welcome Series Workflow or an effective multi-channel Abandoned Cart Campaign, you’ll never have to worry about what’s missing from your strategic game plan. We’ll let you know what strategy is your next best move to get more shoppers to become repeat purchasers.

Loyalty-generating strategies in Drip include:
* Sending personalized emails that speak to unique customers
* Making behavior-based automations that ensure your most relevant campaigns are being sent to the right people at the right time
* Utilizing the full strength of your customer data across all your marketing channels

=== See the Metrics That Matter with an At-a-Glance Dashboard ===
Drip’s Account Dashboard is a one-stop hub for all the numbers you want to know when it comes to checking on your store’s growth and areas for optimization. Easily see your store’s overall revenue, how much revenue can be attributed to your work in Drip, your top-performing strategies, and more.

When you connect your WooCommerce store to Drip, you’ll have access to:
* Automatic revenue attribution helps you understand what’s making money so you can make decisions faster
* Dashboards in Drip show you must-have engagement metrics and revenue details, such as revenue per person, for your emails and workflows
* Workflow split testing makes it possible to see which combination of engagement and channel is having the greatest impact.

== Screenshots ==

1. Account dashboard
2. Broadcast dashboard
3. Multi-channel workflows
4. Product recommendations
5. Customer profiles
6. Visual email builder

== Installation ==

**See [the MyDrip instructions for details](https://my.drip.com/docs/manual/woocommerce/).**

1. Upload the plugin files to the `/wp-content/plugins/drip` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress
1. Create WooCommerce webhook keys.
1. Log into your Drip account, and go to 'WooCommerce' in your integration settings to configure.

== Changelog ==

= 0.0.3 =

* Allow carts to be associated based on being identified in JS.
* Clarified wording on the purpose of the account id field in the settings.
* Explicitly identify customers upon order completion.
* Officially rename plugin to "drip"

= 0.0.2 =

* Linter fixes to prep for WP Plugin Directory submission.
* Rename from drip-woocommerce to drip.
* Send Viewed a Product events via the JS API.

= 0.0.1 =
* Initial release

== Development ==

The philosophy behind this plugin is to do as little as possible in it, and as much as possible in a microservice run by Drip. This allows us to ship fixes for our customers without their having to upgrade a plugin. So often a bug will need to be fixed in the microservice rather than in this plugin. If you do indeed find a bug in the plugin, feel free to submit [a Pull Request in our GitHub repo](https://github.com/DripEmail/drip-woocommerce/).
