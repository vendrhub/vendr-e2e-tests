context('Commerce', () => {

    beforeEach(() => {
        cy.task('app:seed', ['clean', 'permissions']);
        cy.task('app:clearCache');
        cy.umbracoLogin(Cypress.env('username'), Cypress.env('password'));
    });

    it('shows default widgets', () => {

        // Setup 1 store
        cy.fixture('test-store').then(data => {
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Store/SaveStore", "POST", data).then(store => {

                // Got to settings section
                cy.umbracoSection('commerce');
                cy.umbracoTreeRoot('Stores').should("be.visible");

                // Expand store tree item
                cy.umbracoTreeItemByPath("commerce", [store.name, 'Analytics']).click();

                // Ensure default widgets are present
                cy.umbracoBox("Total Orders");
                cy.umbracoBox("Total Revenue");
                cy.umbracoBox("Average Order Value");
                cy.umbracoBox("Cart Conversion Rates");
                cy.umbracoBox("Repeat Customer Rates");
                cy.umbracoBox("Top Selling Products");
                
                // Error message shouldn't be displayed
                cy.umbracoErrorNotification().should('not.be.visible');

            });
        });

    });

});