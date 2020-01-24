Feature: Cart Interactions

  I want cart events to trigger a webhook.

  Scenario: When a site has Client.js enabled
    Given I have a product
      And I have set up a cart webhook
    When I add it to a cart
    Then I get sent a webhook
