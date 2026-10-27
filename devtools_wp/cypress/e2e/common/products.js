import { Given } from "@badeball/cypress-cucumber-preprocessor"

// Looked up rather than aliased: values on the test context outlive the per-test DB reset.
function fairCategoryId() {
  return cy.task('wpCli', ['term', 'list', 'product_cat', '--slug=my-fair-category', '--field=term_id']).then((id) => {
    return id || cy.wpcliCreateProductCategory({ 'name': 'my fair category' })
  })
}

// Aliases the new product's ID, e.g. @widgetId.
function createFairProduct(alias, product) {
  fairCategoryId().then((categoryId) => {
    cy.wpcliCreateProduct({ ...product, 'categories': `[{"id":${categoryId}}]` }).as(alias)
  })
}

Given('I have a product', () => {
  createFairProduct('widgetId', {
    'name': 'My Fair Widget',
    'slug': 'fair-widget',
    'regular_price': 10.99,
    'sku': 'fair-widg-12345',
  })
})

Given('I have a second product', () => {
  createFairProduct('gizmoId', {
    'name': 'My Fair Gizmo',
    'slug': 'fair-gizmo',
    'regular_price': 11.11,
    'sku': 'fair-gzmo-67890',
  })
})

Given('I have a null-price product', () => {
  createFairProduct('widgetId', {
    'name': 'My Fair Widget Null',
    'slug': 'fair-widget-null',
    'sku': 'fair-widg-12345-null',
  })
})
