// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// The cart and checkout pages are chosen per feature; see cypress/e2e/common/store_mode.js.
Cypress.Commands.add('visitCart', () => {
  cy.get('@cartPageId').then((id) => cy.visit(`/?page_id=${id}`))
})

Cypress.Commands.add('visitCheckout', () => {
  cy.get('@checkoutPageId').then((id) => cy.visit(`/?page_id=${id}`))
})
