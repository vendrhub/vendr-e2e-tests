context('Install', () => {

    before(() => {
        cy.task('app:seed', 'clean');
        cy.task('app:clearCache');
    });

    beforeEach(() => {
        cy.umbracoLogin(Cypress.env('username'), Cypress.env('password'));
    });

    it.only('has Vendr Settings section', () => {

        // Got to settings section
        cy.umbracoSection('settings');

        // Ensure there is a root folder called "Commerce"
        cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

        // Ensure there is a Vendr dashboard
        cy.umbracoTreeItem("settings", ["Vendr"]).click();

        // Ensure the dashboard has a title of Vendr Settings
        cy.get('h3').contains('Vendr Settings') 

        // Ensure the invoicing payment provider was installed and is present in the Installed Payment Providers list
        cy.get('.umb-property[label="Installed Payment Providers"]').contains('Vendr.PaymentProviders.Invoicing');

        // Ensure there is a Vendr + Stores setting section
        cy.umbracoTreeItem("settings", ["Vendr", "Stores"]);

    });

    it('has Commerce section', () => {

        // Got to users section
        cy.umbracoSection('users');

        // Go to user groups content app
        cy.get('[data-element="sub-view-userGroups"]').click();

        // Load administrator user group
        cy.get('.umb-table-cell .umb-table-body__link').contains("Administrator").click();

        // Click to add a section
        cy.get('.umb-box:first .umb-property:first a').contains("Add").click();

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