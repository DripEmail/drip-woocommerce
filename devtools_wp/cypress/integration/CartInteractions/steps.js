import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"
import { mockServerClient } from "mockserver-client"

const Mockclient = mockServerClient("localhost", 1080);

Given('I have a product', () => {
  cy.wpcliCreateProductCategory({
    'porcelain':'',
    'name': 'my fair category'
  })

  cy.wpcliCreateProduct({
    'name': 'My Fair Widget',
    'slug': 'fair-widget',
    'regular_price': 10.99,
    'sku': 'fair-widg-12345',
    'categories': '[{"id":16}]'
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
    'delivery_url': 'http://mock:8080/my_fair_endpoint'
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
    expect(body.arg.event_action).to.eq('updated')
    expect(body.arg.customer_email).to.eq('nobody@example.com')
    expect(Object.keys(body.arg.cart_data)).to.have.lengthOf(1)
    const product = body.arg.cart_data[Object.keys(body.arg.cart_data)[0]]
    expect(product.product_id).to.eq('4')
    expect(product.product_variant_id).to.eq('4')
    expect(product.sku).to.eq('fair-widg-12345')
    expect(product.name).to.eq('My Fair Widget')
    expect(product.price).to.eq(10.99)
    expect(product.taxes).to.eq(0.0)
    expect(product.total).to.eq(10.99)
    expect(product.quantity).to.eq(1)
    expect(product.product_url).to.eq('http://localhost:3007/?product=fair-widget')
    expect(product.image_url).to.eq('http://localhost:3007/wp-content/plugins/woocommerce/assets/images/placeholder.png')
    expect(product.categories).to.have.lengthOf(1)
    expect(product.categories[0]).to.eq('my fair category')
  })
})
