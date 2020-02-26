Feature: Product View Interactions

  I want product pages to include calls to Drip's JS API.

  Scenario: I view a product page
    Given I have a product
    When I view a product
    Then the page includes a Drip JS API call
