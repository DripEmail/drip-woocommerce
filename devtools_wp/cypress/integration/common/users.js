import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"

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
  cy.visit('/')
  cy.contains("Hello world!")
})

Given('I am logged in as an admin user', () => {
  cy.log('logging in as the admin user')
  cy.visit('http://localhost:3007/wp-login.php')
  cy.contains('Lost your password?').wait(300)
  cy.get('#user_login').clear().type('drip')
  cy.get('#user_pass').clear().type('abc1234567890')
  cy.get('#wp-submit[value="Log In"]').click()
  cy.visit('/')
  cy.contains("Hello world!")
})
