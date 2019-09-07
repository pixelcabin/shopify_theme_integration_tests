// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {

    // NOTE: These Envs never get read !!! it will always require the credentials should be looked at

    const credentials = (Cypress.env('SHOPIFY_URL') === undefined) ?  require('../../credentials.json') : '';
    let themeID = (Cypress.env('SHOPIFY_THEME_ID') === undefined) ? credentials.theme_id : Cypress.env('SHOPIFY_THEME_ID');
  
    let full_path = `${url}?preview_theme_id=${themeID}`;

  // originalFn is the existing `visit` command that you need to call
  // and it will receive whatever you pass in here.
  //
  // make sure to add a return here!
  return originalFn(full_path, options);
});