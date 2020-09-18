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
                cy.get(`[data-element="tree-item-${store.name}"].current`).should('be.visible');

                // Ensure tree nodes are present
                cy.get(`[data-element="tree-item-${store.name}"] [data-element="tree-item-expand"]`).click();
                cy.get('[data-element="tree-item-Orders"]').should('be.visible');
                cy.get('[data-element="tree-item-Discounts"]').should('be.visible');
                cy.get('[data-element="tree-item-Gift Cards"]').should('be.visible');
                cy.get('[data-element="tree-item-Analytics"]').should('be.visible');

            });
        });

    });

});