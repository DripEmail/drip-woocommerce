@blocks
Feature: Cart Interactions (block cart)

  The block cart changes the cart through the Store API instead of a page reload.

  Scenario: Removing a product from a cart
    Given I have a product
      And I have a logged in user
      And I have set up a cart webhook
      And I add it to a cart
    When I remove it from the cart
    Then I get sent a webhook with an empty cart

  Scenario: Increasing the quantity of a product
    Given I have a product
      And I have a logged in user
      And I have set up a cart webhook
      And I add it to a cart
    When I increase the quantity in the cart
    Then I get sent an updated webhook

  Scenario: Cart Session IDs change as needed
    Given I have a product
      And I have a second product
      And I have a logged in user
      And I have set up a cart webhook
    When I add 'My Fair Widget' to a cart
    Then I get sent a webhook with a cart session ID
    When I remove it from the cart
      And I add it to a cart
    Then I get sent a webhook with a different cart session ID
    When I add 'My Fair Gizmo' to a cart
    Then I get sent a webhook with the same cart session ID
    When I remove the widget from the cart
    Then I get sent a webhook with the same cart session ID
