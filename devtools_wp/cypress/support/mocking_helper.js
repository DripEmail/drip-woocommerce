import { mockServerClient } from "mockserver-client"

const mockServer = mockServerClient("localhost", 1080)

// WooCommerce sends webhooks from PHP's shutdown hook, after the page has already
// been flushed to the browser, so a webhook can land after the step that caused it.
const WEBHOOK_TIMEOUT = 10000
const WEBHOOK_SETTLE = 1000
const NO_WEBHOOK_GRACE = 2000

beforeEach(function() {
  cy.log('resetting mocks')
  cy.then(function() {
    return mockServer.reset()
  })
})

function retrieveWebhooks(topic) {
  return cy.then(() => mockServer.retrieveRecordedRequests({
    'path': '/my_fair_endpoint',
    'headers': {
      'X-WC-Webhook-Topic': [topic]
    }
  }))
}

// Yields the recorded requests for the topic once at least one has arrived, after
// a settle period so callers asserting an exact count also see any duplicates.
Cypress.Commands.add('receivedWebhooks', (topic) => {
  const deadline = Date.now() + WEBHOOK_TIMEOUT
  const poll = () => retrieveWebhooks(topic).then((requests) => {
    if (requests.length > 0) {
      return cy.wait(WEBHOOK_SETTLE, { log: false }).then(() => retrieveWebhooks(topic))
    }
    if (Date.now() > deadline) {
      return requests
    }
    return cy.wait(250, { log: false }).then(poll)
  })
  return poll()
})

Cypress.Commands.add('noWebhookReceived', (topic) => {
  cy.wait(NO_WEBHOOK_GRACE)
  retrieveWebhooks(topic).then((requests) => {
    expect(requests, `${topic} webhooks`).to.have.lengthOf(0)
  })
})
