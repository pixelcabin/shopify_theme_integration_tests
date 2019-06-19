describe('Landing Page', function() {
  beforeEach(function() {
    cy.visit('/');
  });

  it('Wholesaler section should be scrolled to from link in menu', function() {
    cy.get('.site-header__logo-link').should('have.text', 'Integration Testing Example');
  });
});