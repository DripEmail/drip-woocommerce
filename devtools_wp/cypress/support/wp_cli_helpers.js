function createWooEntity(entity, params) {
  cy.log(`Creating woocommerce ${entity}`)

  const defaults = {
    'user': 'drip',
  }

  const mergedParams = {...defaults, ...params}

  let options = ''
  for (const key in mergedParams) {
    options += ` --${key}='${mergedParams[key]}'`
  }

  cy.exec(`docker-compose exec -u www-data -T web wp wc ${entity} create ${options}`)
}

// Parameters can be found by running `wp wc product create --help` in the container.
Cypress.Commands.add('wpcliCreateProduct', (desc) => {
  createWooEntity('product', desc)
})

Cypress.Commands.add('wpcliCreateWebhook', (desc) => {
  createWooEntity('webhook', desc)
})
