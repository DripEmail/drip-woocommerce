import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"
import { mockServerClient } from "mockserver-client"

const Mockclient = mockServerClient("localhost", 1080)

Then('I start to check out', () => {
  cy.route('POST', '/?wc-ajax=update_order_review').as('updateOrderReview')

  cy.contains('My Fair Checkout').click()

  cy.wait('@updateOrderReview');

  cy.get('input#billing_first_name').type('John')
  cy.get('input#billing_last_name').type('Doe')
  cy.get('input#billing_address_1').type('123 Main St')
  cy.get('input#billing_city').type('Centerville')
  cy.get('input#billing_postcode').type('12345')
  cy.get('input#billing_phone').type('123-456-7890')
})

Then('I accept marketing', () => {
  // The input is created before it is attached, and we can sometimes get ahead of that.
  cy.contains('Subscribe to newsletter')
  cy.get('input#drip_woocommerce_accept_marketing[type="checkbox"]').check({force: true})
})

Then('I place order', () => {
  cy.contains('Place order').click({force: true})
})
