function createWooEntity(entity, params) {
  cy.log(`Creating woocommerce ${entity}`)

  const defaults = {
    'user': 'drip',
  }

  const mergedParams = { ...defaults, ...params }

  const options = []
  for (const key in mergedParams) {
    options.push(`--${key}=${mergedParams[key]}`)
  }

  cy.task('wpCli', ['wc', entity, 'create', ...options])
}

function setDripAccount(account_id){
  cy.task('wpCli', ['option', 'update', 'account_id', `${account_id}`])
}

Cypress.Commands.add('wpcliCreateUser', (desc) => {
  const options = []
  for (const key in desc) {
    if (key.startsWith('inviso-')) {
      options.push(`${desc[key]}`)
    } else {
      options.push(`--${key}=${desc[key]}`)
    }
  }

  cy.task('wpCli', ['user', 'create', ...options])
})

Cypress.Commands.add('wpcliCreateProductCategory', (desc) => {
  createWooEntity('product_cat', desc)
})

// Parameters can be found by running `wp wc product create --help` in the container.
Cypress.Commands.add('wpcliCreateProduct', (desc) => {
  createWooEntity('product', desc)
})

Cypress.Commands.add('wpcliCreateWebhook', (desc) => {
  createWooEntity('webhook', desc)
})

Cypress.Commands.add('wpcliSetDripAccount', (desc) => {
  setDripAccount(desc)
})
