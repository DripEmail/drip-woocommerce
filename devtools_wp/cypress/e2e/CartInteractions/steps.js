import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"
import { mockServerClient } from "mockserver-client"
import { WEBHOOK_USER_AGENT } from "../../support/drip"
import { withCart } from "../../support/cart"

const Mockclient = mockServerClient("localhost", 1080)
const CART_TOPIC = 'action.wc_drip_woocommerce_cart_event'

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

Given('I have been cookied', () => {
  cy.setCookie('_drip_client_1234567', 'vid%253D8f081a6c93ca47bab5a33eed8f1adab6%2526pageViews%253D7%2526sessionPageCount%253D3%2526lastVisitedAt%253D1573592329061%2526weeklySessionCount%253D1%2526lastSessionAt%253D1573591512388')
})

Then('I remove it from the cart', () => {
  cy.visitCart()
  cy.wrap(Mockclient.reset())
  withCart((cart) => cart.removeItem({ waitForEmpty: true }))
})

Then ('I remove the widget from the cart', () => {
  cy.visitCart()
  cy.wrap(Mockclient.reset())
  withCart((cart) => cart.removeItem({ waitForEmpty: false }))
})

Then('I restore it to the cart', () => {
  cy.contains('Undo?')
  cy.wrap(Mockclient.reset())
  cy.get('a.restore-item').click().wait(300)
  cy.contains('Update cart')
})

Then('I increase the quantity in the cart', () => {
  cy.visitCart()
  cy.wrap(Mockclient.reset())
  withCart((cart) => cart.setQuantity(9001))
})

Then('I decrease the quantity in the cart to zero', () => {
  cy.visitCart()
  cy.contains("Update cart")
  cy.get('.quantity input.input-text').first().clear().type('0')
  cy.wrap(Mockclient.reset())
  cy.get('button[name="update_cart"]').click().wait(300)
  cy.contains("Your cart is currently empty.")
})

Then('I get sent a webhook', function () {
  cy.log('Validating that we got the webhook')
  cy.receivedWebhooks(CART_TOPIC).then(function (recordedRequests) {
    cy.wrap(validateRequests(recordedRequests)).then(function (body) {
      const event = validateRequestBody(body)
      expect(event.grand_total).to.eq('10.99')
      expect(Object.keys(event.cart_data)).to.have.lengthOf(1)
      validateMyFairWidget(event, this.widgetId)
    })
  })
})

Then('I get sent a webhook with visitor_uuid', function () {
  cy.log('Validating that we got the webhook')
  cy.receivedWebhooks(CART_TOPIC).then(function (recordedRequests) {

    cy.wrap(validateRequests(recordedRequests)).then(function (body) {
      expect(body.action).to.eq('wc_drip_woocommerce_cart_event')
      const event = body.arg
      cy.wrap([
        'event_action',
        'session',
        'visitor_uuid',
        'cart_data',
        'grand_total',
        'total_discounts',
        'total_taxes',
        'total_fees',
        'total_shipping',
        'currency'
      ]).each(function(item) {
        expect(Object.keys(event)).contains(item)
        expect(event[item], `body.arg[${item}]`).to.not.be.null;
      })
      expect(event.event_action).to.eq('updated')
      expect(event.visitor_uuid).to.eq('8f081a6c93ca47bab5a33eed8f1adab6')
      expect(Number(event.total_discounts)).to.eq(0)
      expect(Number(event.total_taxes)).to.eq(0)
      expect(Number(event.total_fees)).to.eq(0)
      expect(Number(event.total_shipping)).to.eq(0)
      expect(event.currency).to.eq('USD')
      expect(event.grand_total).to.eq('10.99')
      expect(Object.keys(event.cart_data)).to.have.lengthOf(1)
      validateMyFairWidget(event, this.widgetId)
    })
  })
})

Then('I get sent a webhook with an empty cart', () => {
  cy.log('Validating that we got the webhook')
  cy.receivedWebhooks(CART_TOPIC).then(function (recordedRequests) {
    cy.wrap(validateRequests(recordedRequests)).then(function (body) {
      const event = validateRequestBody(recordedRequests[0].body.json)
      // expected [] to have a length of 1 but got 0
      expect(Object.keys(event.cart_data)).to.have.lengthOf(0)
      expect(event.grand_total).to.eq(0)
      expect(event.cart_data).to.be.empty
    })
  })
})

Then('I get sent an updated webhook', function () {
  cy.log('Validating that we got the webhook')
  cy.receivedWebhooks(CART_TOPIC).then(function (recordedRequests) {
    cy.wrap(validateRequests(recordedRequests)).then(function (body) {
      const event = validateRequestBody(recordedRequests[0].body.json)
      expect(Object.keys(event.cart_data)).to.have.lengthOf(1)
      validateMyFairWidget(event, this.widgetId, 9001)
      expect(event.grand_total.toString()).to.eq(`${10.99 * 9001}`)
    })
  })
})

Then('I get sent a webhook with two products', function () {
  cy.log('Validating that we got the webhook')
  cy.receivedWebhooks(CART_TOPIC).then(function (recordedRequests) {
    cy.wrap(validateRequests(recordedRequests)).then(function (body) {
      console.log(body)
      const event = validateRequestBody(body)
      expect(Object.keys(event.cart_data)).to.have.lengthOf(2)
      expect(event.grand_total).to.eq('22.10')
      validateMyFairWidget(event, this.widgetId)
      validateMyFairGizmo(event, this.gizmoId)
    })
  })
})

Then('I get sent a webhook with a cart session ID', () => {
  cy.log('Validating the webhook has a valid cart session id')
  cy.receivedWebhooks(CART_TOPIC).then(function (recordedRequests) {
    const body = validateRequests(recordedRequests)
    const event = body.arg
    expect(event.session).to.have.lengthOf(64)
    cy.wrap(event.session).as('lastCartSession')
  })
})

Then('I get sent a webhook with a different cart session ID', () => {
  cy.log('Validating the webhook has a new cart session ID')
  cy.receivedWebhooks(CART_TOPIC).then(function (recordedRequests) {
    const body = validateRequests(recordedRequests)
    cy.wrap(this.lastCartSession).then(function(lastCartSession) {
      const event = body.arg
      expect(lastCartSession).to.have.lengthOf(64)
      expect(event.session).to.have.lengthOf(64)
      expect(event.session).to.not.eq(lastCartSession)
      cy.wrap(event.session).as('lastCartSession')
    })
  })
})

Then('I get sent a webhook with the same cart session ID', () => {
  cy.log('Validating the webhook receives a persisted cart session id')
  cy.receivedWebhooks(CART_TOPIC).then(function (recordedRequests) {
    const body = validateRequests(recordedRequests)
    const event = body.arg
    cy.wrap(this.lastCartSession).then(function(lastCartSession) {
      expect(lastCartSession).to.have.lengthOf(64)
      expect(event.session).to.have.lengthOf(64)
      expect(event.session).to.eq(lastCartSession)
      cy.wrap(event.session).as('lastCartSession')
    })
  })
})

Then('No webhook is sent', () => {
  cy.noWebhookReceived(CART_TOPIC)
})

const validateRequests = function (requests) {
  expect(requests).to.have.lengthOf(1)
  const request = requests[0]
  expect(Object.keys(request.headers)).contains('User-Agent')
  expect(request.headers['User-Agent'][0]).match(WEBHOOK_USER_AGENT)
  return request.body.json
}

const validateRequestBody = function (body) {
  expect(body.action).to.eq('wc_drip_woocommerce_cart_event')
  console.log(body.arg)
  const event = body.arg
  cy.wrap([
    'event_action',
    'session',
    'customer_email',
    'cart_data',
    'grand_total',
    'total_discounts',
    'total_taxes',
    'total_fees',
    'total_shipping',
    'currency'
  ]).each(function(item) {
    expect(Object.keys(event)).contains(item)
    expect(event[item], `body.arg[${item}]`).to.not.be.null;
  })
  expect(event.event_action).to.eq('updated')
  expect(event.customer_email).to.eq('myfairuser@example.com')
  expect(Number(event.total_discounts)).to.eq(0)
  expect(Number(event.total_taxes)).to.eq(0)
  expect(Number(event.total_fees)).to.eq(0)
  expect(Number(event.total_shipping)).to.eq(0)
  expect(event.currency).to.eq('USD')
  return event;
}

const validateMyFairWidget = function (event, widgetId, quantity = 1) {
  const product = findProduct(widgetId, event.cart_data)
  expect(product.product_id.toString()).to.eq(widgetId)
  expect(product.product_variant_id.toString()).to.eq('0')
  expect(product.quantity).to.eq(quantity)
  expect(product.taxes.toString()).to.eq('0')
  expect(product.total.toString()).to.eq(`${10.99 * quantity}`)
  return product
}

const validateMyFairGizmo = function (event, gizmoId, quantity = 1) {
  const product = findProduct(gizmoId, event.cart_data)
  expect(product.product_id.toString()).to.eq(gizmoId)
  expect(product.product_variant_id.toString()).to.eq('0')
  expect(product.quantity).to.eq(quantity)
  expect(product.taxes.toString()).to.eq('0')
  expect(product.total.toString()).to.eq(`${11.11 * quantity}`)
  return product
}

const findProduct = function(product_id, cart_data) {
  const product = Object.values(cart_data).find((item) => item.product_id.toString() === product_id)
  expect(product, `cart item for product ${product_id}`).to.exist
  return product
}
