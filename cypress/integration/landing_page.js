describe('Landing Page', function() {
  beforeEach(function() {
    // As the first link is a preview this will need a pretty nasty work around
    // basically hit the preview, then redirect to the path
    cy.visit()
    cy.visit('/');
  });

  it('Wholesaler section should be scrolled to from link in menu', function() {
    cy.get('.site-header__logo-link').should('have.text', 'Integration Testing Example');
  });
});