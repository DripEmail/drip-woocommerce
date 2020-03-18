import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"
import { mockServerClient } from "mockserver-client"

const Mockclient = mockServerClient("localhost", 1080)

Then('I add {string} to a cart', (product) => {
  let slug = '/?product=fair-widget'
  if(product === 'My Fair Gizmo') {
    slug = '/?product=fair-gizmo'
  }
  cy.visit(slug)
  cy.wrap(Mockclient.reset())
  cy.contains('Add to cart').click().wait(300)
  cy.contains('has been added to your cart')
})

Then('I add it to a cart', () => {
  // This is the product slug
  cy.visit('/?product=fair-widget')
  cy.wrap(Mockclient.reset())
  cy.contains('Add to cart').click()
  cy.contains('has been added to your cart')
})
