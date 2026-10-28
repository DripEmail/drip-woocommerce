import { Before } from "@badeball/cypress-cucumber-preprocessor"

// WooCommerce ships two cart/checkout implementations, and the plugin hooks into
// each separately. setup.sh creates a shortcode (classic) page for each; WooCommerce
// creates the block versions itself. A feature picks one with @classic or @blocks.
const STORE_PAGES = {
  classic: { cart: 'my-fair-cart', checkout: 'my-fair-checkout' },
  blocks: { cart: 'cart', checkout: 'checkout' },
}

function useStorePage(page, slug) {
  cy.task('wpCli', ['post', 'list', '--post_type=page', `--name=${slug}`, '--field=ID']).then((id) => {
    expect(id, `${slug} page`).to.match(/^\d+$/)
    cy.wpcliSetOption(`woocommerce_${page}_page_id`, id)
    cy.wrap(id).as(`${page}PageId`)
  })
}

function useStorePages(mode) {
  cy.log(`Using the ${mode} cart and checkout`)
  cy.wrap(mode).as('storeMode')
  useStorePage('cart', STORE_PAGES[mode].cart)
  useStorePage('checkout', STORE_PAGES[mode].checkout)
}

Before({ tags: '@classic' }, () => useStorePages('classic'))
Before({ tags: '@blocks' }, () => useStorePages('blocks'))
