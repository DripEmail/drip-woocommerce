=== Drip for WooCommerce ===
Contributors: getdrip
Tags: ecommerce, emailmarketing, marketingautomation, emailmarketingautomation, woocommerce, drip
Requires at least: 4.6
Tested up to: 6.0.3
Stable tag: 1.1.3
Requires PHP: 5.6
License: GPLv2
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Build long-lasting relationships with perfectly personalized email and onsite marketing automation.

== Description ==

Drip is the customer-first marketing automation platform designed for ecommerce brands. Sync your WooCommerce store with Drip and experience:

The easiest (most powerful) WooCommerce integration ever.

Get up and running in minutes with our seamless WooCommerce integration. Get your WooCommerce data while it’s hot, then use it to fuel email and onsite marketing strategies that work.

The kind of segmentation that WooCommerce success stories are made of.

Tap into dynamic, money-making segmentation that lets you hyper-customize audiences, deliver better shopping experiences, and connect with customers like never before.

Proven pre-built workflows that run the ecomm show.

Access pre-built workflows designed around industry best practices and high-converting logic. Take things a step further and split test up to five paths at a time until the engagement sticks.

Automation that takes “schedule emails” off your to-do list.

Save yourself time with our easy yet powerful automations. Reach people at the right moment, with just the right message to bump click-through-rates and boost sales.

Emails so easy to build you’ll wish we had met sooner.

Pick a template, add your branding using our oh-so-easy visual email builder, and send high-converting email campaigns in minutes.

Popups + onsite personalization that work.

Collect zero-party data on your site and use it to turn visitors → subscribers → customers. 

- Grow your list with non-intrusive multi-step campaigns, quizzes, and gamification. 

- Prevent cart abandonment, promote products and offers, and upsell directly on your site. 

A customer support #DreamTeam.

When you sign up for Drip, you can expect:
    - Tailored solutions that yield real results.
    - Custom strategy that fills in the gaps.
    - Barely-there queues.
    - 99% customer satisfaction rating.

Install the Drip for WooCommerce plugin. See why thousands of ecommerce brands across the globe trust Drip to build personal and profitable relationships with their customers. 


== FAQs ==

=== Do you offer a free trial? ===

Yes, we offer a free 14-day trial for new users. Sign up for a free trial here: https://www.getdrip.com/signup/basic 

=== How much does Drip cost? ===

Plans start at $39/mo. Find your monthly cost on our pricing page: https://www.drip.com/pricing 

=== How do I install the Drip for WooCommerce plugin? ===

Find installation instructions in our User Manual: https://my.drip.com/docs/manual/woocommerce/integration-instructions/

=== Do you offer support? How do I contact them? ===

Our Support Team is available via email between 9 am - 5 pm CST and 8 am - 8 pm CET Monday through Friday at support@drip.com. We offer live chat during these times for customers on the $99/mo+ plan.

=== Are there technical requirements for the plugin? ===

Make sure you're running the latest version of WooCommerce before installing the integration.

== Support ==

Please send support requests to our team within Drip.

== Installation ==

Integrate Drip and your WooCommerce store in a few easy clicks.

* Install the plugin
* Generate API keys in WooCommerce
* Enter your API keys in Drip

View detailed integration instructions in [MyDrip](https://www.drip.com/learn/docs/manual/woocommerce/integration-instructions).

== Changelog ==
= NEXT =

* Your change here!

= 1.1.3 =

* Fix a bug that caused an error when viewing a product with an empty price

= 1.1.2 =

* Add occurred_at timestamp to cart events to avoid timing issues when there are queue backups or other issues.
* Fixed bug in viewed a product snippet insertion where we were adding context params when unneeded. (SumoTTo)
* Changed context param to be 'edit' instead of a custom value in a number of places.

= 1.1.1 =

* Fix bug that prevented product image_urls from appearing in "Viewed a product" events

= 1.1.0 =

* Add option to have Email Marketing checkbox selected by default
* Allow for checkbox string to be translated. (BenceSzalai)

= 1.0.4 =

* Fix bug that auto-subscribed everyone just by virtue of placing an order.

= 1.0.3 =

* Fix bug that recorded prices incorrectly on view product events

= 1.0.2 =

* Fix bug that allowed only a small number of items to be added to the cart at one time

= 1.0.1 =

* Fix bug that affected displaying sign up for email marketing during checkout

= 1.0.0 =

* First production-ready release

= 0.0.5 =

* Update default text values for display

= 0.0.4 =

* Add option for subscriber sign-up during the checkout process

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

== Screenshots ==

1. Product Recommendations
2. Segmentation
3. Email Builder
4. Ecommerce Playbooks
5. Insights and Guidance
