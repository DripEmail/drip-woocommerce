import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"
import { mockServerClient } from "mockserver-client"
import { DEFAULT_SIGNUP_TEXT, WEBHOOK_USER_AGENT } from "../../support/drip"
import { placeOrderAndWait, withCheckout } from "../../support/checkout"

const Mockclient = mockServerClient("localhost", 1080)
const SUBSCRIBER_TOPIC = 'action.wc_drip_woocommerce_subscriber_updated'

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

// Saving these through the settings screen is covered by AdminTab.feature. A save
// writes both checkboxes, and the sign up is only hidden when both are off.
Given('I have opted out of showing email marketing signup at checkout', () => {
  cy.wpcliSetOption('drip_enable_signup', 'no')
  cy.wpcliSetOption('drip_enable_signup_default', 'no')
})

Given('I have opted into showing email marketing signup at checkout', () => {
  cy.wpcliSetOption('drip_enable_signup', 'yes')
})

Given('I have opted into showing email marketing signup by default at checkout', () => {
  cy.wpcliSetOption('drip_enable_signup_default', 'yes')
})

Given('I have set the sign up text to {string}', (text) => {
  cy.wpcliSetOption('drip_signup_text', text)
})

Then('I start to check out', () => {
  cy.visitCheckout()
  withCheckout((checkout) => checkout.fillBilling({
    country: 'GB',
    firstName: 'Oliver',
    lastName: 'Smith',
    address: '123 Main St',
    city: 'Feltham',
    postcode: 'TW13 6LL',
    phone: '123-456-7890',
  }))
})

Then('I accept marketing', () => {
  // The input is created before it is attached, and we can sometimes get ahead of that.
  cy.contains(DEFAULT_SIGNUP_TEXT)
  withCheckout((checkout) => cy.get(checkout.signupCheckbox).check({ force: true }))
})

Then('I decline marketing', () => {
  cy.contains(DEFAULT_SIGNUP_TEXT)
  withCheckout((checkout) => cy.get(checkout.signupCheckbox).should('be.checked').uncheck({ force: true }))
})

Then('I place order', () => {
  cy.wrap(Mockclient.reset())
  withCheckout(placeOrderAndWait)
})

Then('Drip receives a subscriber event', () => {
  cy.log('Validating that we got the webhook')
  cy.receivedWebhooks(SUBSCRIBER_TOPIC).then(function (recordedRequests) {
    const event = validateRequests(recordedRequests)
    expect(event.email).to.eq('myfairuser@example.com')
    expect(event.status).to.eq('active')
  })
})

Then('Drip receives no subscriber event', () => {
  cy.noWebhookReceived(SUBSCRIBER_TOPIC)
})

Then('The marketing checkbox is not present', () => {
  withCheckout((checkout) => cy.get(checkout.signupCheckbox).should('have.length', 0))
})

Then('The marketing checkbox is present and unchecked', () => {
  withCheckout((checkout) => cy.get(checkout.signupCheckbox).should('have.length', 1).and('not.be.checked'))
})

Then('The marketing checkbox is present and checked', () => {
  withCheckout((checkout) => cy.get(checkout.signupCheckbox).should('have.length', 1).and('be.checked'))
})

Then('The marketing checkbox is labelled {string}', (text) => {
  withCheckout((checkout) => cy.get(checkout.signupCheckbox).parents('label, p, .wc-block-components-checkbox').first().should('contain.text', text))
})

const validateRequests = function (requests) {
  expect(requests).to.have.lengthOf(1)
  const request = requests[0]
  expect(Object.keys(request.headers)).contains('User-Agent')
  expect(request.headers['User-Agent'][0]).match(WEBHOOK_USER_AGENT)
  
  const body = request.body.json
  expect(body.action).to.eq('wc_drip_woocommerce_subscriber_updated')
  expect(body.arg).to.not.be.null

  return body.arg
}
