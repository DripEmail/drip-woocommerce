import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"
import { mockServerClient } from "mockserver-client"

const Mockclient = mockServerClient("localhost", 1080)

Then('I add a widget to my cart', () => {
    // This is the product slug
    cy.visit('/?product=fair-widget')
    cy.wrap(Mockclient.reset())
    cy.contains('Add to cart').click()
    cy.contains('has been added to your cart')
  })

  Then('I checkout', () => {
      cy.contains('a','Checkout').click()
      cy.get('#billing_first_name').clear({force: true}).type('Eliza')
      cy.get('#billing_last_name').clear({force: true}).type('Doolittle')
      cy.get('#billing_address_1').clear({force: true}).type('8 Albert Street')
      cy.get('#billing_city').clear({force: true}).type('Rugby')
      cy.get('#billing_postcode').clear({force: true}).type('CV212RS')
      cy.get('#billing_phone').clear({force: true}).type('1234567890')
      cy.get('#billing_email').clear({force: true}).type('eliza.doolittle@example.com')
      cy.get('#place_order').click({force: true}).wait(300)
  })

  Then("the page includes a Drip JS API call", () => {
    cy.get('script[src="http://localhost:3007/wp-content/plugins/drip/src/customer_identify.js?ver=9.3.1"]').should('have.length', 1)

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
    cy.get('script[src="http://localhost:3007/wp-content/plugins/drip/src/customer_identify.js?ver=9.3.1"]').should('have.length', 0)

    cy.window().then(function(window) {
      expect(Object.keys(window)).to.not.include('_dcq')
    })
  })
