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
  cy.wpcliCreateWebhook({
    'name': 'My Fair Webhook',
    'topic': 'dripcart.updated',
    'delivery_url': 'http://mock:1080/my_fair_endpoint',
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
    // TODO: Reenable this
    // 'path': '/my_fair_endpoint'
  })).then(function(recordedRequests) {
    console.log(recordedRequests)
    expect(recordedRequests).to.have.lengthOf(1)
    const body = JSON.parse(recordedRequests[0].body.string)
    console.log(body)
    // expect(body.subscribers).to.have.lengthOf(1)

    // const sub = body.subscribers[0]
    // expect(sub.email).to.eq('testuser@example.com')
    // expect(sub.new_email).to.eq('')

    // if (state === 'subscribed') {
    //   expect(sub.initial_status).to.eq('active')
    //   expect(sub.custom_fields.accepts_marketing).to.eq('yes')
    //   expect(sub.status).to.eq('active')
    // } else {
    //   expect(sub.initial_status).to.eq('unsubscribed')
    //   expect(sub.custom_fields.accepts_marketing).to.eq('no')
    //   expect(sub.status).to.be.undefined
    // }

    // expect(sub.custom_fields.birthday).to.be.null
    // expect(sub.custom_fields.first_name).to.eq('Test')
    // expect(sub.custom_fields.gender).to.eq('')
    // expect(sub.custom_fields.last_name).to.eq('User')
    // expect(sub.custom_fields.magento_customer_group).to.eq('General')
    // expect(sub.custom_fields.magento_store).to.eq(1)
  })
})
