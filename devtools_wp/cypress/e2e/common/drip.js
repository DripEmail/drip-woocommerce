import { Given } from "@badeball/cypress-cucumber-preprocessor"

Given('I have Drip configured', () => {
    cy.wpcliSetDripAccount('1234567')
})
