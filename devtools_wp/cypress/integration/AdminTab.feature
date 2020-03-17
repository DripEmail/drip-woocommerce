Feature: Drip Woocommerce settings

    I want Drip specific settings to show up in the Woocommerce settings page.

    Scenario: Drip has a settings tab in Woocommerce settings
        Given I am logged in as an admin user
        And I navigate to the Woocommerce Settings page
        Then A Drip specific settings tab should be present

    Scenario: My Drip account shows up in the Drip Admin tab
        Given I am logged in as an admin user
        And I have Drip configured
        And I navigate to the Drip settings tab
        Then My Drip account ID is displayed

    Scenario: I can select to enable the sign-up checkbox
        Given I am logged in as an admin user
        And I have Drip configured
        And I navigate to the Drip settings tab
        Then there should be a checkbox for sign-ups
        And the sign-up option should be checked by default

    Scenario: I can customize the text for the sign-up checkbox
        Given I am logged in as an admin user
        And I have Drip configured
        And I navigate to the Drip settings tab
        Then there should be a textbox to customize the text for the sign-up

    Scenario: Sign-up features are disabled if Drip is not integrated
        Given I am logged in as an admin user
        And I navigate to the Drip settings tab
        Then there should be a checkbox for sign-ups
        And the checkbox should be disabled
        And there should be a textbox to customize the text for the sign-up
        And the textbox should be disabled

    Scenario: I can persist my settings in the Drip Admin tab
        Given I am logged in as an admin user
        And I have Drip configured
        And I navigate to the Drip settings tab
        When I uncheck the checkbox
        And I change the sign up text
        And I save the settings
        And I navigate away and return
        Then the settings should be persisted

    Scenario: My custom text is displayed on the checkout page
        Given I am logged in as an admin user
        And I have Drip configured
        When I navigate to the Drip settings tab
        And I change the sign up text
        And I save the settings
        And I have a product
        And I add it to a cart
        Then the custom text appears on the checkout page
