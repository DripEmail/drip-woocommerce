function createWooEntity(entity, params) {
  cy.log(`Creating woocommerce ${entity}`)

  const defaults = {
    'user': 'drip',
  }

  const mergedParams = { ...defaults, ...params }

  let options = ''
  for (const key in mergedParams) {
    options += ` --${key}='${mergedParams[key]}'`
  }

  cy.exec(`docker-compose exec -u www-data -T web wp wc ${entity} create ${options}`)
}

function setDripAccount(account_id){
  cy.exec(`docker-compose exec -u www-data -T web wp option update account_id "${account_id}"`)
}

Cypress.Commands.add('wpcliCreateUser', (desc) => {
  const options = function (params) {
    let options = ''
    for (const key in params) {
      if (key.startsWith('inviso-')) {
        options += ` ${params[key]}`
      } else {
        options += ` --${key}="${params[key]}"`
      }
    }
    return options
  }

  cy.exec(`docker-compose exec -u www-data -T web wp user create ${options(desc)}`)
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
