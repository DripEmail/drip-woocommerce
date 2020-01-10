Cypress.Commands.add('wpcliCreateProduct', (desc) => {
  cy.log('Creating woocommerce product')

  const defaults = {
    'user': 'drip',
  }

  const mergedParams = {...defaults, ...desc}

  let options = ''
  for (const key in mergedParams) {
    options += ` --${key}='${mergedParams[key]}'`
  }

  cy.exec(`docker-compose exec -u www-data -T web wp wc product create ${options}`)
})
