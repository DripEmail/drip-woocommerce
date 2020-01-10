import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"

Given('I have a product', () => {
  cy.wpcliCreateProduct({
    'name': 'My Fair Widget',
    'slug': 'fair-widget',
    'regular_price': 10.99,
    'sku': 'fair-widg-12345'
  })
})
