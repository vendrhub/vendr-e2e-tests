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
import UmbracoTreeItem from 'umbraco-cypress-testhelpers/lib/cypress/commands/umbracoTreeItem';

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
          if (data.isOkStatusCode && data.body.length > 0) {
            // Parse the JSON payload, stripping off the 
            // angularjs JSON Vulnerability Protection )]}',
            return JSON.parse(data.body.substring(6));
          }
          return null;
        });
    });
});

Cypress.Commands.add("umbracoTreeRoot", (name) => {
  cy.get(`li .umb-tree-root:contains("${name}")`);
});
Cypress.Commands.add("umbracoTreeItem", (name) => {
  cy.get(`[data-element="tree-item-${name}"]`);
});
Cypress.Commands.add("umbracoTreeItemByPath", (treeName, itemNamePathArray) => {
  new UmbracoTreeItem('/umbraco').method(treeName, itemNamePathArray);
});

Cypress.Commands.add("umbracoTreeItems", () => {
  cy.get(`.umb-tree-item`);
});
Cypress.Commands.add("expander", {
  prevSubject: true
}, (subject) => {
  cy.wrap(subject).find('[data-element="tree-item-expand"]');
});


Cypress.Commands.add("umbracoActionsMenu", () => {
  cy.get('[data-element="editor-actions"] .umb-button button').should('be.visible');
  cy.get('[data-element="editor-actions"] .umb-button button').should('not.be.disabled');
  cy.get('[data-element="editor-actions"] .umb-button button');
});

Cypress.Commands.add("umbracoActionsMenuItem", (label) => {
  cy.get('ul.umb-actions li.umb-action button').contains(label);
});
Cypress.Commands.add("umbracoActionsMenuAction", (label) => {
  cy.umbracoActionsMenuItem(label);
});

Cypress.Commands.add("umbracoListViewLink", (name) => {
  cy.get(`.umb-table-body__link`).contains(name);
});

Cypress.Commands.add("umbracoListViewRow", (name) => {
  cy.umbracoListViewLink(name).closest('.umb-table-row');
});

Cypress.Commands.add("umbracoListViewRows", () => {
  cy.get('.umb-table-body .umb-table-row');
});

Cypress.Commands.add('umbracoErrorNotification', () => {
  cy.get('.umb-notifications__notifications > .alert-error');
});

Cypress.Commands.add("umbracoContextApp", (alias) => {
  cy.get(`[data-element="sub-view-${alias}"]`);
});
Cypress.Commands.add("umbracoContentApp", (alias) => {
  cy.umbracoContextApp(alias);
});

Cypress.Commands.add("umbracoBulkActionButton", (name) => {
  cy.get('.umb-editor-sub-header button').contains(name);
});

Cypress.Commands.add("umbracoActionLink", (label) => {
  cy.get('.umb-action-link').contains(label);
});

Cypress.Commands.add("umbracoEditorNameField", () => {
  cy.get('[data-element="editor-name-field"]');
});

Cypress.Commands.add("umbracoEditorName", () => {
  cy.get(".umb-panel-header-name");
});

Cypress.Commands.add("umbracoProperty", (label) => {
  cy.get(`.umb-property[label="${label}"]`);
});

Cypress.Commands.add("umbracoOverlay", () => {
  cy.get('[data-element="overlay"]');
});

Cypress.Commands.add("umbracoBox", (header) => {
  cy.get('.umb-box-header-title').contains(header);
});

Cypress.Commands.add("vendrToggle", {
  prevSubject: 'optional'
}, (subject, label) => {
  if (subject) {
    cy.wrap(subject).find('.vendr-toggle').contains(label);
  } else {
    cy.get('.vendr-toggle').contains(label);
  }
});

