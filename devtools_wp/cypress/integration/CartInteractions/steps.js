import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"

Given('I have a product', () => {
  cy.wpcliCreateProduct({
    'name': 'My Fair Widget',
    'slug': 'fair-widget',
    'regular_price': 10.99,
    'sku': 'fair-widg-12345'
  })
})

Given('I have set up a cart webhook', () => {
  cy.wpcliCreateWebhook({
    'name': 'My Fair Webhook',
    'topic': 'dripcart.updated',
    'delivery_url': 'http://mock:1080/my_fair_endpoint',
  })
})
