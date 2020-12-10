// context('Stores', () => {

//     let storeId;
//     let storeName;

//     beforeEach(() => {
//         cy.task('app:seed', 'clean');
//         cy.task('app:clearCache');
//         cy.umbracoLogin(Cypress.env('username'), Cypress.env('password'));
//         cy.fixture('test-store').then(data => {
//             data.allowedUsers = []; // Ensure allowed users is empty
//             cy.umbracoApiRequest("/umbraco/backoffice/vendr/Store/SaveStore", "POST", data).then(store => {
//                 storeId = store.id;
//                 storeName = store.name;
//             });
//         });
//     });

//     it.only('looks right', () => {

//         // Got to settings section
//         cy.umbracoSection('settings');
//         cy.umbracoTreeRoot('Commerce').should("be.visible");

//         // Open the store
//         cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName]).click();

//         // Ensure the page has loaded
//         cy.get('[data-element="editor-container"]').should('be.visible');

//         cy.wait(1000);

//         // Match snapshot
//         cy.get('[data-element="editor-container"] .umb-pane').compareSnapshot('store-settings');

//     });

// });