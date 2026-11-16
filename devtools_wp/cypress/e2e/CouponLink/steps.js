import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"

const STORE_CART = '/wp-json/wc/store/v1/cart'

function createCoupon(code, extra = {}) {
  cy.wpcliCreateCoupon({ 'code': code, 'discount_type': 'percent', 'amount': 10, ...extra })
}

function cartCoupons() {
  return cy.request(STORE_CART).then((response) => response.body.coupons.map((coupon) => coupon.code))
}

Given('I have a 10 percent coupon {string}', (code) => {
  createCoupon(code)
})

Given('I have a 10 percent coupon {string} with a minimum spend of {int}', (code, minimum) => {
  createCoupon(code, { 'minimum_amount': minimum })
})

When('I follow a coupon link for {string}', (code) => {
  cy.visit(`/?drip_coupon=${encodeURIComponent(code)}`)
})

When('I add it to the cart through the Store API', () => {
  cy.get('@widgetId').then((id) => {
    cy.request(STORE_CART).then((cart) => {
      cy.request({
        method: 'POST',
        url: `${STORE_CART}/add-item`,
        headers: { 'Nonce': cart.headers['nonce'] },
        body: { id: Number(id), quantity: 1 },
      })
    })
  })
})

Then('I am on the home page without the coupon param', () => {
  cy.location('pathname').should('eq', '/')
  cy.location('search').should('not.contain', 'drip_coupon')
})

Then('I see {string}', (text) => {
  // Block themes only print WooCommerce notices on WooCommerce pages.
  cy.visit('/?post_type=product')
  cy.contains(text)
})

Then('my cart has the coupon {string}', (code) => {
  cartCoupons().should('deep.equal', [code])
})

Then('my cart has no coupons', () => {
  cartCoupons().should('deep.equal', [])
})
