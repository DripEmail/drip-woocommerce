import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"

Given('I have a product', () => {
  cy.wpcliCreateProduct({})
})
