context('Stores', () => {

    beforeEach(() => {
        cy.umbracoLogin(Cypress.env('username'), Cypress.env('password'));
    });

    it('Create store', () => {

        const name = "Test store";

        // Got to settings section
        cy.umbracoSection('settings');
        cy.get('li .umb-tree-root:contains("Settings")').should("be.visible");

        // Create store
        cy.umbracoTreeItem("settings", ["Vendr", "Stores"]).rightclick();
        cy.umbracoContextMenuAction("action-create").click();

        

    });

});