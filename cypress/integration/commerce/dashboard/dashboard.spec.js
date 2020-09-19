context('Commerce', () => {

    beforeEach(() => {
        cy.task('app:seed', ['clean', 'permissions']);
        cy.task('app:clearCache');
        cy.umbracoLogin(Cypress.env('username'), Cypress.env('password'));
    });

    it('shows help center when no stores available', () => {

        // Got to settings section
        cy.umbracoSection('commerce');

        // There should be no visible tree items
        cy.umbracoTreeItems().should('have.length', 0);

        // Ensure the help center dialog is present
        cy.get('.vendr-message__heading').contains('Help Center');

    });

    it('auto redirects to store when only one store available', () => {

        // Setup 1 store
        cy.fixture('test-store').then(data => {
            data.allowedUsers.push(-1);
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Store/SaveStore", "POST", data).then(store => {

                // Got to settings section
                cy.umbracoSection('commerce');

                // Store should appear in the tree and be highlighted as current
                cy.umbracoTreeItem(store.name).filter('.current').should('be.visible');

                // Ensure the dashboard heading is visible
                cy.get('h2').contains(`${store.name} Dashboard`);

            });
        });

    });

    it('show store summaries when more than one store available', () => {

        // Setup 2 stores
        cy.fixture('test-store').then(data => {
            data.allowedUsers.push(-1);
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Store/SaveStore", "POST", data).then(store1 => {
                data.name = "Test Store 2";
                data.alias = "testStore2";
                cy.umbracoApiRequest("/umbraco/backoffice/vendr/Store/SaveStore", "POST", data).then(store2 => {

                    // Got to settings section
                    cy.umbracoSection('commerce');
    
                    // Stores should appear in the tree and not be highlighted
                    cy.umbracoTreeItem(store1.name).not('.current').should('be.visible');
                    cy.umbracoTreeItem(store2.name).not('.current').should('be.visible');
    
                    // Ensure the dashboard heading is visible
                    cy.get('h2').contains(`Welcome to the Commerce Section`);
    
                    // Ensure store summaries should be visible
                    cy.get(`.store-list .store`).contains(store1.name).should('be.visible');
                    cy.get(`.store-list .store`).contains(store2.name).should('be.visible');

                    // Ensure clicking a store summary takes you to that store
                    cy.get(`.store-list .store`).contains(store2.name).click();

                    // Store should appear in the tree and be highlighted as current
                    cy.umbracoTreeItem(store2.name).filter('.current').should('be.visible');

                    // Ensure the dashboard heading is visible
                    cy.get('h2').contains(`${store2.name} Dashboard`);

                });

            });
        });

    });

});