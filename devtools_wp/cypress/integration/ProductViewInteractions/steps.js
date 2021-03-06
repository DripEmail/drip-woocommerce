import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"

Given('I view a product', () => {
    cy.visit('/?product=fair-widget')
})

Then("the page includes a Drip JS API call", () => {
  cy.window().then(function(win) {
    expect(win._dcq).to.have.lengthOf(1)

    const call = win._dcq[0]
    expect(call).to.have.lengthOf(3)
    expect(call[0]).to.eq("track")
    expect(call[1]).to.eq("Viewed a product")

    const product = call[2]
    expect(product.product_id.toString()).to.eq('12') // only works because we reset the entire db with each scenerio
    expect(product.product_variant_id.toString()).to.eq('12')
    expect(product.sku).to.eq('fair-widg-12345')
    expect(product.name).to.eq('My Fair Widget')
    expect(product.price.toString()).to.eq('1099')
    expect(product.product_url).to.eq('http://localhost:3007/?product=fair-widget')
    expect(product.image_url).to.have.string('woocommerce-placeholder-150x150.png')
    expect(product.currency).to.eq('GBP')
    expect(product.categories).to.eq('my fair category')
  })
})
