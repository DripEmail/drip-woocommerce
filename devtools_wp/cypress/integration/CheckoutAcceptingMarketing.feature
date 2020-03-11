Feature: Checkout Accepting Marketing

  I want to be able to accept marketing as part of checkout.

  Scenario: Accepting marketing during checkout
    Given I have a product
      And I have a logged in user
    When I add it to a cart
      And I start to check out
      And I accept marketing
      And I place order
    Then I receive an accepts marketing field
