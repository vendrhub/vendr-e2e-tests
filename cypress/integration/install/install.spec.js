context('Install', () => {

    before(() => {
        cy.task('app:seed', 'clean');
        cy.task('app:clearCache');
    });

    beforeEach(() => {
        cy.umbracoLogin(Cypress.env('username'), Cypress.env('password'));
    });

    it('has Vendr Settings section', () => {

        // Got to settings section
        cy.umbracoSection('settings');

        // Ensure there is a root folder called "Commerce"
        cy.umbracoTreeRoot('Commerce').should("be.visible");

        // Ensure there is a Vendr dashboard
        cy.umbracoTreeItemByPath("settings", ["Vendr"]).click();

        // Ensure the dashboard has a title of Vendr Settings
        cy.get('h3').contains('Vendr Settings') 

        // Ensure the invoicing payment provider was installed and is present in the Installed Payment Providers list
        cy.umbracoProperty('Installed Payment Providers').contains('Vendr.PaymentProviders.Invoicing');

        // Ensure there is a Vendr + Stores setting section
        cy.umbracoTreeItemByPath("settings", ["Vendr", "Stores"]);

    });

    it('has Commerce section', () => {

        // Got to users section
        cy.umbracoSection('users');

        // Go to user groups content app
        cy.umbracoContextApp('userGroups').click();

        // Load administrator user group
        cy.umbracoListViewLink("Administrators").click();

        // Click to add a section
        cy.umbracoProperty('@main_sections').find('button').contains("Add").click();

        // Check there is a commerce section in the list of sections
        cy.get('.umb-editor--level1 .umb-tree-item span').contains('Commerce').click();

        // Add the commerce section
        cy.get('.umb-editor--level1 .btn-success').click();

        // Save the user group
        cy.get('form[name="editUserForm"] .btn-success').click();

        // Reload the page
        cy.reload(true);

        // Make sure the Commerce section is in the sections nav after Media
        cy.get('[data-element="section-media"] + [data-element="section-commerce"]');

    });

});