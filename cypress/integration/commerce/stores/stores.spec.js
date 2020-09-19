context('Commerce', () => {

    beforeEach(() => {
        cy.task('app:seed', ['clean', 'permissions']);
        cy.task('app:clearCache');
        cy.umbracoLogin(Cypress.env('username'), Cypress.env('password'));
    });

    it('shows store tree structure', () => {

        // Setup 1 store
        cy.fixture('test-store').then(data => {
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Store/SaveStore", "POST", data).then(store => {

                // Got to settings section
                cy.umbracoSection('commerce');

                // Store should appear in the tree and be highlighted as current
                cy.umbracoTreeItem(store.name).filter('.current').should('be.visible');

                // Ensure tree nodes are present
                cy.umbracoTreeItem(store.name).expander().click();
                cy.umbracoTreeItem('Orders').should('be.visible');
                cy.umbracoTreeItem('Discounts').should('be.visible');
                cy.umbracoTreeItem('Gift Cards').should('be.visible');
                cy.umbracoTreeItem('Analytics').should('be.visible');

            });
        });

    });

});