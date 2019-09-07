describe('Landing Page', function() {
  beforeEach(function() {

    // Circle we set a qs param for the for the initial test
    // this allows us once the preview has been triggered to be able to correctly pass visit() 
    // without throwin an invalid url
    if(Cypress.config().previewQS) {cy.visit(`/${Cypress.config().previewQS}`)}

    cy.visit('/');
  });

  it('Wholesaler section should be scrolled to from link in menu', function() {
    cy.get('.site-header__logo-link').should('have.text', 'Integration Testing Example');
  });
});