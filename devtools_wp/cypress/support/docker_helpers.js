beforeEach(function() {
  cy.log('resetting docker for test')
  cy.task('resetDocker', null, {timeout: 120000})
})
