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

                // Expand store tree item
                cy.get(`[data-element="tree-item-${store.name}"] [data-element="tree-item-expand"]`).click();

                // Navigate to analytics section
                cy.get('[data-element="tree-item-Analytics"]').click();

                // Ensure default widgets are present
                cy.get('.umb-box-header-title').contains("Total Orders");
                cy.get('.umb-box-header-title').contains("Total Revenue");
                cy.get('.umb-box-header-title').contains("Average Order Value");
                cy.get('.umb-box-header-title').contains("Cart Conversion Rates");
                cy.get('.umb-box-header-title').contains("Repeat Customer Rates");
                cy.get('.umb-box-header-title').contains("Top Selling Products");
                
                // Error message shouldn't be displayed
                cy.get('.umb-notifications__notifications > .alert-error').should('not.be.visible');

            });
        });

    });

});