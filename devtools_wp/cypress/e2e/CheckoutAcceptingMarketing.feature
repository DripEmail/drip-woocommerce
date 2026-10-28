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
    Then The marketing checkbox is present and unchecked

  Scenario: Marketing checkbox shows up if using default opt-in
    Given I have Drip configured
      And I am logged in as an admin user
      And I have created an accepts marketing webhook
      And I have a product
    When I add it to a cart
      And I start to check out
    Then The marketing checkbox is present and unchecked

  Scenario: Marketing checkbox doesn't show up if opted out
    Given I have Drip configured
      And I am logged in as an admin user
      And I have created an accepts marketing webhook
      And I have a product
      And I have opted out of showing email marketing signup at checkout
    When I add it to a cart
      And I start to check out
    Then The marketing checkbox is not present

  Scenario: Marketing checkbox shows up if opted in
    Given I have Drip configured
      And I am logged in as an admin user
      And I have created an accepts marketing webhook
      And I have a product
      And I have opted into showing email marketing signup at checkout
    When I add it to a cart
      And I start to check out
    Then The marketing checkbox is present and unchecked

  Scenario: Marketing checkbox shows up if opted in by default
    Given I have Drip configured
      And I am logged in as an admin user
      And I have created an accepts marketing webhook
      And I have a product
      And I have opted into showing email marketing signup by default at checkout
    When I add it to a cart
      And I start to check out
    Then The marketing checkbox is present and checked

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
