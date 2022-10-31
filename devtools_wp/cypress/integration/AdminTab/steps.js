import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"
import { mockServerClient } from "mockserver-client"

const Mockclient = mockServerClient("localhost", 1080)

const CheckoutPageId = 11

When('I navigate to the Woocommerce Settings page', () => {
    cy.visit('wp-admin/admin.php?page=wc-settings')
    cy.contains('Save changes')
})

Then('A Drip specific settings tab should be present', () => {
    cy.get('.nav-tab').contains('Drip').should('have.length', 1)
})

Then('I navigate to the Drip settings tab', () => {
    cy.visit('/wp-admin/admin.php?page=wc-settings&tab=settings_drip')
    cy.contains('Save changes')
})

Then('My Drip account ID is displayed', () => {
    cy.contains('Account ID')
    cy.get('input[id="account_id"').should('have.value', '1234567')
})

Then('there should be a checkbox for sign-ups', () => {
    cy.get('input[id="drip_enable_signup"]').should('have.length',1)
    cy.get('label[for="drip_enable_signup"]').contains('Show a sign up option at checkout.')
})

Then('the sign-up option should be checked by default', () => {
    cy.get('input[id="drip_enable_signup"]').should('have.checked',1)
})

Then('there should be a textbox to customize the text for the sign-up', () => {
    cy.get('input[id="drip_signup_text"]').should('have.value', 'Send me news, announcements, and discounts.')
})

Then('the checkbox should be disabled', () => {
    // cannot figure out how to validate the readonly attribute
    cy.get('input[id="drip_enable_signup"]').should('be.disabled')
})

Then('the textbox should be disabled', () => {
    // cannot figure out how to validate the readonly attribute
    cy.get('input[id="drip_signup_text"]').should('be.disabled').should('have.value', 'Send me news, announcements, and discounts.')
})

When('I uncheck the checkbox', () => {
    cy.get('input[id="drip_enable_signup"]').should('be.checked').uncheck()
})

When('I change the sign up text', () => {
    cy.get('input[id="drip_signup_text"]').should('have.value', 'Send me news, announcements, and discounts.').clear().type('Texty McTextface')
})

When('I save the settings', () => {
    cy.contains('Save changes').click().wait(300)
})

When('I navigate away and return', () => {
    cy.visit('/')
    cy.contains('Welcome to WordPress').wait(300)
    cy.visit('/wp-admin/admin.php?page=wc-settings&tab=settings_drip')
    cy.contains('Text that will appear next to the sign up checkbox')
})

Then('the settings should be persisted', () => {
    cy.get('input[id="drip_enable_signup"]').should('not.be.checked')
    cy.get('input[id="drip_signup_text"]').should('not.be.disabled').should('have.value', 'Texty McTextface')
})

Then('the custom text appears on the checkout page', () => {
    cy.visit(`/?page_id=${CheckoutPageId}`).wait(300)
    cy.contains('Texty McTextface').should('have.length', 1)
})
