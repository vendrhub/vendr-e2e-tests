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
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


import { Command as UmbracoCommands } from 'umbraco-cypress-testhelpers';

new UmbracoCommands().registerCypressCommands();

// Umbraco API request helper that auto prepends the required
// Umbraco XSRF protection token and also parses the output
// to JSON stripping out the AngularJS JSON vulnerability protection
Cypress.Commands.add("umbracoApiRequest", (url, method, body) => {
    return cy.getCookie('UMB-XSRF-TOKEN', { log: false }).then((token) => {
        return cy.request({
          method: method ?? 'GET',
          url: url,
          body: body,
          followRedirect: true,
          headers: {
            'Accept': 'application/json',
            'X-UMB-XSRF-TOKEN': token.value,
          }
        }).then(data => {
          if (data.isOkStatusCode) {
            // Parse the JSON payload, stripping off the 
            // angularjs JSON Vulnerability Protection )]}',
            return JSON.parse(data.body.substring(6));
          }
          return null;
        });
    });
});