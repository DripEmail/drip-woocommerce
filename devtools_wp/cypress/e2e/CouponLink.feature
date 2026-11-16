@classic
Feature: Coupon links

  Drip emails link to the store with ?drip_coupon=CODE. The plugin saves the
  code and applies it as soon as the cart has items.

  Scenario: Following a link with an empty cart applies the code once a product is added
    Given I have a product
      And I have a 10 percent coupon "fair10"
    When I follow a coupon link for "fair10"
    Then I am on the home page without the coupon param
      And I see "will be applied when you add a product to your cart"
    When I add it to a cart
    Then my cart has the coupon "fair10"

  Scenario: Following a link with items in the cart applies the code right away
    Given I have a product
      And I have a 10 percent coupon "fair10"
      And I add it to a cart
    When I follow a coupon link for "fair10"
    Then my cart has the coupon "fair10"

  Scenario: Following a link with an unknown code
    Given I have a product
    When I follow a coupon link for "nope"
    Then I see "is not valid"
    When I add it to a cart
    Then my cart has no coupons

  Scenario: A minimum spend code waits until the cart reaches it
    Given I have a product
      And I have a 10 percent coupon "fair10" with a minimum spend of 15
    When I follow a coupon link for "fair10"
      And I add it to a cart
    Then my cart has no coupons
    When I add it to a cart
    Then my cart has the coupon "fair10"
