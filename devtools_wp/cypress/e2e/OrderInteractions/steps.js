import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"
import { mockServerClient } from "mockserver-client"
import { placeOrderAndWait, withCheckout } from "../../support/checkout"

const Mockclient = mockServerClient("localhost", 1080)

Then('I add a widget to my cart', () => {
    // This is the product slug
    cy.visit('/?product=fair-widget')
    cy.wrap(Mockclient.reset())
    cy.contains('Add to cart').click()
    cy.contains('has been added to your cart')
  })

  Then('I checkout', () => {
      cy.visitCheckout()
      withCheckout((checkout) => {
        checkout.fillBilling({
          country: 'GB',
          firstName: 'Eliza',
          lastName: 'Doolittle',
          address: '8 Albert Street',
          city: 'Rugby',
          postcode: 'CV212RS',
          phone: '1234567890',
          email: 'eliza.doolittle@example.com',
        })
        placeOrderAndWait(checkout)
      })
  })

  Then("the page includes a Drip JS API call", () => {
    cy.get('script[src*="/wp-content/plugins/drip/src/customer_identify.js"]').should('have.length', 1)

    cy.window().then(function(window) {
      expect(window._dcq).to.have.lengthOf(1)
      const call = window._dcq[0]
      expect(call).to.have.lengthOf(2)
      expect(call[0]).to.eq("identify")
      const identify_data = call[1]
      expect(Object.keys(identify_data)).to.have.lengthOf(2)
      expect(identify_data.email).to.eq('eliza.doolittle@example.com')
    })
  })

  Then("the page does not make Drip JS API call", () => {
    cy.get('script[src*="/wp-content/plugins/drip/src/customer_identify.js"]').should('have.length', 0)

    cy.window().then(function(window) {
      expect(Object.keys(window)).to.not.include('_dcq')
    })
  })
