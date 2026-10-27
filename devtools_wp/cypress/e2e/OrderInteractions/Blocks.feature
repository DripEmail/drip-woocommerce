@blocks
Feature: Order Interactions (block checkout)

    I want to include Drip calls when an order placed through the block checkout is completed

    Scenario: The customer_identify.js script is included on a completed order if integrated
        Given I have Drip configured
          And I have a product
         When I add a widget to my cart
          And I checkout
         Then the page includes a Drip JS API call

    Scenario: The customer_identify.js script is NOT included on a completed order if not integrated
      Given I have a product
       When I add a widget to my cart
        And I checkout
       Then the page does not make Drip JS API call
