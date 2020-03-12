Feature: Checkout Accepting Marketing

  I want to be able to accept marketing as part of checkout.

  Scenario: Marketing checkbox doesn't show up if not integrated
    Given I have created an accepts marketing webhook
      And I have a product
      And I have a logged in user
    When I add it to a cart
     And I start to check out
    Then The marketing checkbox is not present

  Scenario: Marketing checkbox shows up if integrated
    Given I have Drip configured
      And I have created an accepts marketing webhook
      And I have a product
      And I have a logged in user
    When I add it to a cart
     And I start to check out
    Then The marketing checkbox is present

  Scenario: Accepting marketing during checkout
    Given I have Drip configured
      And I have created an accepts marketing webhook
      And I have a product
      And I have a logged in user
    When I add it to a cart
     And I start to check out
     And I accept marketing
     And I place order
    Then Drip receives a subscriber event

  Scenario: Not accepting marketing during checkout
    Given I have Drip configured
      And I have created an accepts marketing webhook
      And I have a product
      And I have a logged in user
    When I add it to a cart
     And I start to check out
     And I place order
    Then Drip receives no subscriber event
