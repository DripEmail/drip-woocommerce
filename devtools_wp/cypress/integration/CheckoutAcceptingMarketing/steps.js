import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"
import { mockServerClient } from "mockserver-client"

const Mockclient = mockServerClient("localhost", 1080)

Given('I have created an accepts marketing webhook', () => {
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
    'topic': 'action.wc_drip_woocommerce_subscriber_updated',
    'delivery_url': 'http://mock:8080/my_fair_endpoint'
  })
})

Given('I have opted out of showing email marketing signup at checkout', () => {
  cy.visit('/wp-admin/admin.php?page=wc-settings&tab=settings_drip');
  cy.wrap(Mockclient.reset());
  cy.get('input#drip_enable_signup[type="checkbox"]').uncheck();
  cy.contains('Save changes').click()
})

Given('I have opted into showing email marketing signup at checkout', () => {
  cy.visit('/wp-admin/admin.php?page=wc-settings&tab=settings_drip');
  cy.wrap(Mockclient.reset());
  cy.get('input#drip_enable_signup[type="checkbox"]').check();
  cy.contains('Save changes').click()
})

Then('I start to check out', () => {
  cy.route('POST', '/?wc-ajax=update_order_review').as('updateOrderReview')

  cy.contains('My Fair Checkout').click()

  cy.wait('@updateOrderReview');

  cy.get('input#billing_first_name').type('Oliver', { force: true })
  cy.get('input#billing_last_name').type('Smith', { force: true })
  cy.get('input#billing_address_1').type('123 Main St', { force: true })
  cy.get('input#billing_city').type('Feltham', { force: true })
  cy.get('input#billing_postcode').type('TW13 6LL', { force: true })
  cy.get('input#billing_phone').type('123-456-7890', { force: true })
})

Then('I accept marketing', () => {
  // The input is created before it is attached, and we can sometimes get ahead of that.
  cy.contains('Send me news, announcements, and discounts.')
  cy.get('input#drip_woocommerce_accepts_marketing[type="checkbox"]').check({ force: true })
})

Then('I place order', () => {
  cy.wrap(Mockclient.reset())
  cy.contains('Place order').click({ force: true })
  cy.contains('Order received').wait(300)
})

Then('Drip receives a subscriber event', () => {
  cy.log('Validating that we got the webhook')
  cy.wrap(Mockclient.retrieveRecordedRequests({
    'path': '/my_fair_endpoint',
    'headers': {
      'X-WC-Webhook-Topic': ["action.wc_drip_woocommerce_subscriber_updated"]
    }
  })).then(function (recordedRequests) {
    const event = validateRequests(recordedRequests)
    expect(event.email).to.eq('myfairuser@example.com')
    expect(event.status).to.eq('active')
  })
})

Then('Drip receives no subscriber event', () => {
  cy.log('Validating that the webhook did not get called')
  cy.wrap(Mockclient.retrieveRecordedRequests({
    'path': '/my_fair_endpoint',
    'headers': {
      'X-WC-Webhook-Topic': ["action.wc_drip_woocommerce_subscriber_updated"]
    }
  })).then(function (recordedRequests) {
    expect(recordedRequests).to.have.lengthOf(0)
  })
})

Then('The marketing checkbox is not present', () => {
  cy.get('input#drip_woocommerce_accepts_marketing[type="checkbox"]').should('have.length', 0)
})

Then('The marketing checkbox is present', () => {
  cy.get('input#drip_woocommerce_accepts_marketing[type="checkbox"]').should('have.length', 1)
})

const validateRequests = function (requests) {
  expect(requests).to.have.lengthOf(1)
  const request = requests[0]
  expect(Object.keys(request.headers)).contains('User-Agent')
  expect(request.headers['User-Agent'][0]).match(/.*WooCommerce\/\d+\.\d+\.\d+.*Hookshot.*\(WordPress\/\d+\.\d+\.\d+\)/)
  const body = JSON.parse(request.body.string)
  expect(body.action).to.eq('wc_drip_woocommerce_subscriber_updated')
  expect(body.arg).to.not.be.null
  return body.arg
}
