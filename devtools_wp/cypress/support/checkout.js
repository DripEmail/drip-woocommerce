// The classic (shortcode) and block checkouts render different markup for the same
// fields. Steps call these through withCheckout() so a scenario reads the same in
// either mode; the mode comes from the feature's @classic or @blocks tag.

const CLASSIC = {
  signupCheckbox: 'input#drip_woocommerce_accepts_marketing[type="checkbox"]',

  fillBilling(customer) {
    cy.get('select#billing_country').select(customer.country, { force: true })
    cy.get('input#billing_first_name').clear({ force: true }).type(customer.firstName, { force: true })
    cy.get('input#billing_last_name').clear({ force: true }).type(customer.lastName, { force: true })
    cy.get('input#billing_address_1').clear({ force: true }).type(customer.address, { force: true })
    cy.get('input#billing_city').clear({ force: true }).type(customer.city, { force: true })
    cy.get('input#billing_postcode').clear({ force: true }).type(customer.postcode, { force: true })
    cy.get('input#billing_phone').clear({ force: true }).type(customer.phone, { force: true })
    if (customer.email) {
      cy.get('input#billing_email').clear({ force: true }).type(customer.email, { force: true })
    }
  },

  placeOrder() {
    cy.get('#place_order').click({ force: true })
  },
}

const BLOCKS = {
  signupCheckbox: 'input#contact-drip-woocommerce-accepts-marketing[type="checkbox"]',

  fillBilling(customer) {
    // The block checkout renders client-side; wait for it before typing.
    cy.get('input#billing-first_name', { timeout: 20000 }).should('be.visible')
    cy.get('select#billing-country').select(customer.country)
    cy.get('input#billing-first_name').clear().type(customer.firstName)
    cy.get('input#billing-last_name').clear().type(customer.lastName)
    cy.get('input#billing-address_1').clear().type(customer.address)
    cy.get('input#billing-city').clear().type(customer.city)
    cy.get('input#billing-postcode').clear().type(customer.postcode)
    cy.get('input#billing-phone').clear().type(customer.phone)
    if (customer.email) {
      cy.get('input#email').clear().type(customer.email)
    }
  },

  placeOrder() {
    cy.get('button.wc-block-components-checkout-place-order-button').click()
  },
}

const CHECKOUTS = { classic: CLASSIC, blocks: BLOCKS }

export function withCheckout(fn) {
  return cy.get('@storeMode').then((mode) => fn(CHECKOUTS[mode]))
}

export function placeOrderAndWait(checkout) {
  checkout.placeOrder()
  cy.url({ timeout: 20000 }).should('include', 'order-received')
}
