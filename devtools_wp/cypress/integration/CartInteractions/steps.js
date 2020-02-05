import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"
import { mockServerClient } from "mockserver-client"

const Mockclient = mockServerClient("localhost", 1080);

Given('I have a product', () => {
  cy.wpcliCreateProductCategory({
    'porcelain': '',
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

Given('I have a logged in user', () => {
  cy.log('Creating User')
  cy.wpcliCreateUser({
    'inviso-user-login': 'my_fair_user',
    'inviso-user-email': 'myfairuser@example.com',
    'user_pass': '123!@#abc',
    'role': 'subscriber'
  })

  cy.log('Logging in as my_fair_user')
  cy.visit('http://localhost:3007/wp-login.php')
  cy.contains('Lost your password?')
  cy.get('#user_login').clear().type('my_fair_user')
  cy.get('#user_pass').clear().type('123!@#abc')
  cy.get('#wp-submit[value="Log In"]').click()
  cy.contains("Hello world!")
})

Then('I add it to a cart', () => {
  // This is the product slug
  cy.visit('/?product=fair-widget')
  cy.wrap(Mockclient.reset())
  cy.contains('Add to cart').click()
  cy.contains('has been added to your cart')
})

Then('I remove it from the cart', () => {
  cy.visit('http://localhost:3007/?page_id=4') // using the page SLUG won't work here
  cy.wrap(Mockclient.reset())
  cy.contains("Proceed to checkout")
  cy.get('a.remove[data-product_id="6"]').click()
  cy.contains("Your cart is currently empty.")
})

Then('I restore it to the cart', () => {
  cy.contains('Undo?')
  cy.wrap(Mockclient.reset())
  cy.get('a.restore-item').click().wait(300)
  cy.contains('Update cart')
})

Then('I increase the quantity in the cart', () => {
  cy.visit('http://localhost:3007/?page_id=4')
  cy.contains("Update cart")
  cy.get('input[title="Qty"]').first().clear().type('9001')
  cy.wrap(Mockclient.reset())
  cy.get('button[name="update_cart"]').click().wait(300)
  cy.contains("Cart updated.")
})

Then('I decrease the quantity in the cart to zero', () => {
  cy.visit('http://localhost:3007/?page_id=4')
  cy.contains("Update cart")
  cy.get('input[title="Qty"]').first().clear().type('0')
  cy.wrap(Mockclient.reset())
  cy.get('button[name="update_cart"]').click().wait(300)
  cy.contains("Your cart is currently empty.")
})

Then('I get sent a webhook', () => {
  cy.log('Validating that we got the webhook')
  cy.wrap(Mockclient.retrieveRecordedRequests({
    'path': '/my_fair_endpoint',
    'headers': {
      'X-WC-Webhook-Topic': ["action.wc_drip_woocommerce_cart_event"]
    }
  })).then(function (recordedRequests) {
    cy.wrap(validateRequests(recordedRequests)).then(function (body) {
      validateRequestBody(body)
      validateMyFairWidget(body)
    })
  })
})

Then('I get sent a webhook with an empty cart', () => {
  cy.log('Validating that we got the webhook')
  cy.wrap(Mockclient.retrieveRecordedRequests(
    {
      'path': '/my_fair_endpoint',
      'headers': {
        'X-WC-Webhook-Topic': ["action.wc_drip_woocommerce_cart_event"]
      }
    }
  )).then(function (recordedRequests) {
    cy.wrap(validateRequests(recordedRequests)).then(function (body) {
      validateRequestBody(body)
      expect(body.arg.cart_data).to.be.empty
    })
  })
})

Then('I get sent an updated webhook', () => {
  cy.log('Validating that we got the webhook')
  cy.wrap(Mockclient.retrieveRecordedRequests(
    {
      'path': '/my_fair_endpoint',
      'headers': {
        'X-WC-Webhook-Topic': ["action.wc_drip_woocommerce_cart_event"]
      }
    }
  )).then(function (recordedRequests) {
    cy.wrap(validateRequests(recordedRequests)).then(function (body) {
      validateRequestBody(body)
      validateMyFairWidget(body, 9001)
    })
  })
})

Then('No webhook is sent', () => {
  cy.log('Validating the no webhook was sent')
  cy.wrap(Mockclient.retrieveRecordedRequests(
    {
      'path': '/my_fair_endpoint',
      'headers': {
        'X-WC-Webhook-Topic': ["action.wc_drip_woocommerce_cart_event"]
      }
    }
  )).then(function (recordedRequests) {
    expect(recordedRequests).to.have.lengthOf(0)
  })
})

const validateRequests = function (requests) {
  expect(requests).to.have.lengthOf(1)
  const request = requests[0]
  expect(Object.keys(request.headers)).contains('User-Agent')
  expect(request.headers['User-Agent'][0]).match(/.*WooCommerce\/\d+\.\d+\.\d+.*Hookshot.*\(WordPress\/\d+\.\d+\.\d+\)/)
  return JSON.parse(request.body.string)
}

const validateRequestBody = function (body) {
  expect(body.action).to.eq('wc_drip_woocommerce_cart_event')
  expect(body.arg.event_action).to.eq('updated')
  expect(body.arg.customer_email).to.eq('myfairuser@example.com')
  expect(Object.keys(body.arg)).contains('cart_data')
}

const validateMyFairWidget = function (body, quantity = 1) {
  expect(Object.keys(body.arg.cart_data)).to.have.lengthOf(1)
  const product = body.arg.cart_data[Object.keys(body.arg.cart_data)[0]]
  expect(product.product_id.toString()).to.eq('6') // only works because we reset the entire db with each scenerio
  expect(product.product_variant_id.toString()).to.eq('6')
  expect(product.sku).to.eq('fair-widg-12345')
  expect(product.name).to.eq('My Fair Widget')
  expect(product.quantity).to.eq(quantity)
  expect(product.price.toString()).to.eq('10.99')
  expect(product.taxes.toString()).to.eq('0')
  expect(product.total.toString()).to.eq(`${10.99 * quantity}`)
  expect(product.product_url).to.eq('http://localhost:3007/?product=fair-widget')
  expect(product.image_url).contains('<img')
  expect(product.image_url).contains('http://localhost:3007/wp-content/plugins/woocommerce/assets/images/placeholder.png')
  expect(product.categories).to.have.lengthOf(1)
  expect(product.categories[0]).to.eq('my fair category')
  return product
}
