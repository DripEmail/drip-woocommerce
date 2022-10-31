import { mockServerClient } from "mockserver-client"

beforeEach(function() {
  cy.log('resetting mocks')
  cy.then(function() {
    return mockServerClient("localhost", 1080)
    .reset()
    .then(
      function () {
        console.log("reset all state");
      },
      function (error) {
        console.log(error);
      }
    )
  })

  cy.visit('wp-admin/install.php')
  cy.get('select')
  .find('option')
  .contains('United States')
  .as('selectOption')
  .then( () => {
    cy.get('select')
      .select(`${this.selectOption.text()}`)
  });
  cy.get('input[type=submit]').click();

  cy.get('input[name="weblog_title"]')
  .type('Drip Store')
  .get('input[name="user_name"]')
  .type('drip')
  .get('input[name="admin_password"]').clear()
  .type('abc1234567890')
  .get('input[name="admin_email"]')
  .type('miguel.orozco@drip.com')
  .get('input[name="pw_weak"]').check()
  .get('input[type=submit]').click()

  cy.visit('wp-login.php')
  cy.wait(500)
  cy.get('input[name="log"]')
  .type('drip')
  cy.get('input[name="pwd"]')
  .type('abc1234567890')
  .get('input[type=submit]').click()


  cy.visit('wp-admin/plugins.php')
  cy.get('a[id="activate-woocommerce"]').click()
  cy.get('input[placeholder="Address line 1"]').type('1155 Lavista Rd NE')
  cy.get('input[type="search"]').type('United States (US) — Alabama{enter}')
  cy.get('input[placeholder="City"]').type('Birmingham')
  cy.get('input[placeholder="Post code"]').type('35005')
  cy.contains('button', 'Continue').click()
  cy.contains('button', 'No thanks').click()
  cy.get('input[value="1"]').check()
  cy.contains('button', 'Continue').click()

  cy.visit('wp-admin/plugins.php')
  cy.get('a[id="activate-drip"]').click()
})
