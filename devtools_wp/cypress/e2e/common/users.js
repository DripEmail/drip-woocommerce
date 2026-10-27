import { Given } from "@badeball/cypress-cucumber-preprocessor"

// Posts the login form directly: wp-login.php focuses the username field on a timer
// that can wipe what was typed, leaving the form invalid and the user logged out.
function logIn(username, password) {
  cy.setCookie('wordpress_test_cookie', 'WP Cookie check')
  cy.request({
    method: 'POST',
    url: '/wp-login.php',
    form: true,
    body: { log: username, pwd: password, testcookie: 1 },
  })
  cy.getCookies().should((cookies) => {
    expect(cookies.map((cookie) => cookie.name).some((name) => name.startsWith('wordpress_logged_in_')), 'logged in cookie').to.be.true
  })
  cy.visit('/')
}

Given('I have a logged in user', () => {
  cy.log('Creating User')
  cy.wpcliCreateUser({
    'inviso-user-login': 'my_fair_user',
    'inviso-user-email': 'myfairuser@example.com',
    'user_pass': '123!@#abc',
    'role': 'subscriber'
  })

  cy.log('Logging in as my_fair_user')
  logIn('my_fair_user', '123!@#abc')
})

Given('I am logged in as an admin user', () => {
  cy.log('logging in as the admin user')
  logIn('drip', 'abc1234567890')
})
