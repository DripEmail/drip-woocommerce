// Classic and block carts update differently: the classic cart reloads the page,
// the block cart calls the Store API. Steps call these through withCart(); the
// mode comes from the feature's @classic or @blocks tag.

const CLASSIC = {
  removeItem({ waitForEmpty }) {
    cy.get('a.remove').first().click()
    cy.contains(waitForEmpty ? 'Your cart is currently empty.' : 'removed')
  },

  setQuantity(quantity) {
    cy.contains('Update cart')
    cy.get('.quantity input.input-text').first().clear().type(`${quantity}`)
    cy.get('button[name="update_cart"]').click()
    cy.contains('Cart updated.')
  },
}

const BLOCKS = {
  removeItem({ waitForEmpty }) {
    cy.intercept('POST', '**/wc/store/v1/**').as('storeApi')
    cy.get('button.wc-block-cart-item__remove-link', { timeout: 20000 }).first().click()
    cy.wait('@storeApi')
    if (waitForEmpty) {
      cy.get('.wp-block-woocommerce-empty-cart-block').should('be.visible')
    }
  },

  setQuantity(quantity) {
    cy.intercept('POST', '**/wc/store/v1/**').as('storeApi')
    // Clearing snaps the input back to 1, so type over a selection instead.
    cy.get('input.wc-block-components-quantity-selector__input', { timeout: 20000 }).first()
      .type(`{selectall}${quantity}`).blur()
    cy.wait('@storeApi')
  },
}

const CARTS = { classic: CLASSIC, blocks: BLOCKS }

export function withCart(fn) {
  return cy.get('@storeMode').then((mode) => fn(CARTS[mode]))
}
