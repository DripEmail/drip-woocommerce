// A `true` value is passed as a bare flag (e.g. --porcelain).
function toOptions(params) {
  const options = []
  for (const key in params) {
    options.push(params[key] === true ? `--${key}` : `--${key}=${params[key]}`)
  }
  return options
}

// Yields the new entity's ID.
function createWooEntity(entity, params) {
  cy.log(`Creating woocommerce ${entity}`)

  const defaults = {
    'user': 'drip',
    'porcelain': true,
  }

  return cy.task('wpCli', ['wc', entity, 'create', ...toOptions({ ...defaults, ...params })])
}

function setDripAccount(account_id){
  cy.task('wpCli', ['option', 'update', 'account_id', `${account_id}`])
}

Cypress.Commands.add('wpcliCreateUser', (desc) => {
  const positional = []
  const named = {}
  for (const key in desc) {
    if (key.startsWith('inviso-')) {
      positional.push(`${desc[key]}`)
    } else {
      named[key] = desc[key]
    }
  }

  cy.task('wpCli', ['user', 'create', ...positional, ...toOptions(named)])
})

Cypress.Commands.add('wpcliCreateProductCategory', (desc) => {
  return createWooEntity('product_cat', desc)
})

// Parameters can be found by running `wp wc product create --help` in the container.
Cypress.Commands.add('wpcliCreateProduct', (desc) => {
  return createWooEntity('product', desc)
})

Cypress.Commands.add('wpcliCreateWebhook', (desc) => {
  return createWooEntity('webhook', desc)
})

Cypress.Commands.add('wpcliSetDripAccount', (desc) => {
  setDripAccount(desc)
})

Cypress.Commands.add('wpcliSetOption', (name, value) => {
  cy.task('wpCli', ['option', 'update', name, `${value}`])
})
