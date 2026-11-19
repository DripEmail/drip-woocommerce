@blocks
Feature: Coupon links (block cart)

  The block cart adds products through the Store API, which doesn't render a page.

  Scenario: Following a link with an empty cart applies the code once a product is added
    Given I have a product
      And I have a 10 percent coupon "fair10"
    When I follow a coupon link for "fair10"
      And I add it to the cart through the Store API
    Then my cart has the coupon "fair10"
