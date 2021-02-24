describe('Landing Page', function() {
  beforeEach(function() {
    cy.visit('/');
    // Most likely the dev site you are testing on is password protected, so you can do something like below to enter the password every test
    // cy.get('#Password').type('password_here');
    // cy.get('#login_form .input-group .input-group__btn > button').click();
  });

  it('Wholesaler section should be scrolled to from link in menu', function() {
    cy.get('.site-header__logo-link').should('have.text', 'Integration Testing Example');
  });
});