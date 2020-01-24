import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"
import { mockServerClient } from "mockserver-client"

const Mockclient = mockServerClient("localhost", 1080);

Given('I have a product', () => {
  cy.wpcliCreateProduct({
    'name': 'My Fair Widget',
    'slug': 'fair-widget',
    'regular_price': 10.99,
    'sku': 'fair-widg-12345'
  })
})

Given('I have set up a cart webhook', () => {
  cy.wrap(Mockclient.mockAnyResponse({
    "httpRequest": {
        "method": "POST",
        "path": "/my_fair_endpoint"
    },
    "httpResponse": {
        "statusCode": 202
    }
  }))

  cy.wpcliCreateWebhook({
    'name': 'My Fair Webhook',
    'topic': 'action.wc_drip_woocommerce_cart_event',
    'delivery_url': 'http://mock:8080/my_fair_endpoint',
  })
})

Then('I add it to a cart', () => {
  // This is the product slug
  cy.visit('/?product=fair-widget')
  cy.contains('Add to cart').click()
  cy.contains('has been added to your cart')
})

Then('I get sent a webhook', () => {
  cy.log('Validating that we got the webhook')
  cy.wrap(Mockclient.retrieveRecordedRequests({
    'path': '/my_fair_endpoint',
    'headers': {
      'X-WC-Webhook-Topic': ["action.wc_drip_woocommerce_cart_event"]
    }
  })).then(function(recordedRequests) {
    expect(recordedRequests).to.have.lengthOf(1)
    const body = JSON.parse(recordedRequests[0].body.string)
    expect(body.action).to.eq('wc_drip_woocommerce_cart_event')
    expect(body.arg).to.eq('blah de blah')
  })
})
