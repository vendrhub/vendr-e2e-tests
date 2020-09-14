context('Stores', () => {

    let storeId;
    let storeName;

    beforeEach(() => {
        cy.task('app:seed', ['clean', 'permissions']);
        cy.task('app:clearCache');
        cy.umbracoLogin(Cypress.env('username'), Cypress.env('password'));
        cy.fixture('test-store').then(data => {
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Store/SaveStore", "POST", data).then(store => {
                storeId = store.id;
                storeName = store.name;
            });
        });
    });

    it('can allow access to store by user group', () => {

        // Go to commerce section
        cy.get('[data-element="section-commerce"] a').click();

        // Ensure we don't currently have access to a store
        cy.get(`[data-element="tree-item-${storeName}"]`).should('not.be.visible');

        // Got to settings section
        cy.umbracoSection('settings');
        cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

        // Open the store
        cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName]).click();

        // Go to permissions tab
        cy.get('[data-element="sub-view-permissions"]').click();

        // Give store access to Commerce user group
        cy.get('.umb-property[label="User Groups"] .vendr-toggle').contains('Commerce').click();

        // Save the changes
        cy.get('[data-element="editor-footer"] .btn-success').click();

        // Notification message should display
        cy.umbracoSuccessNotification().should('be.visible');

        // Go to commerce section
        cy.get('[data-element="section-commerce"] a').click();

        // Reload the section
        cy.reload(true);

        // Ensure we don't currently have access to a store
        cy.get(`[data-element="tree-item-${storeName}"]`).should('be.visible');

    });

    it('can allow access to store by user', () => {

        // Go to commerce section
        cy.get('[data-element="section-commerce"] a').click();

        // Ensure we don't currently have access to a store
        cy.get(`[data-element="tree-item-${storeName}"]`).should('not.be.visible');

        // Got to settings section
        cy.umbracoSection('settings');
        cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

        // Open the store
        cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName]).click();

        // Go to permissions tab
        cy.get('[data-element="sub-view-permissions"]').click();

        // Give store access to Commerce user group
        cy.get('.umb-property[label="Users"] .vendr-toggle').contains('Admin').click();

        // Save the changes
        cy.get('[data-element="editor-footer"] .btn-success').click();

        // Notification message should display
        cy.umbracoSuccessNotification().should('be.visible');

        // Go to commerce section
        cy.get('[data-element="section-commerce"] a').click();

        // Reload the section
        cy.reload(true);

        // Ensure we don't currently have access to a store
        cy.get(`[data-element="tree-item-${storeName}"]`).should('be.visible');

    });

    it('can toggle access to store for all user groups', () => {

        // Got to settings section
        cy.umbracoSection('settings');
        cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

        // Open the store
        cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName]).click();

        // Go to permissions tab
        cy.get('[data-element="sub-view-permissions"]').click();

        // Give access to all groups
        cy.get('.umb-property[label="User Groups"] .vendr-toggle:first-child').click();

        // Save the changes
        cy.get('[data-element="editor-footer"] .btn-success').click();

        // Notification message should display
        cy.umbracoSuccessNotification().should('be.visible');

        // Close the notification
        cy.umbracoSuccessNotification().find('.close').click();

        // Ensure all checkboxes are checked
        cy.get('.umb-property[label="User Groups"] .vendr-toggle .umb-toggle').each($toggle => {
            cy.wrap($toggle).should('have.class', 'umb-toggle--checked');
        });

        // Give access to all groups
        cy.get('.umb-property[label="User Groups"] .vendr-toggle:first-child').click();

        // Save the changes
        cy.get('[data-element="editor-footer"] .btn-success').click();

        // Notification message should display
        cy.umbracoSuccessNotification().should('be.visible');

        // Close the notification
        cy.umbracoSuccessNotification().find('.close').click();

        // Ensure all checkboxes are checked
        cy.get('.umb-property[label="User Groups"] .vendr-toggle .umb-toggle').each($toggle => {
            cy.wrap($toggle).should('not.have.class', 'umb-toggle--checked');
        });

    });

    it('can toggle access to store for all users', () => {

        // Got to settings section
        cy.umbracoSection('settings');
        cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

        // Open the store
        cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName]).click();

        // Go to permissions tab
        cy.get('[data-element="sub-view-permissions"]').click();

        // Give access to all users
        cy.get('.umb-property[label="Users"] .vendr-toggle:first-child').click();

        // Save the changes
        cy.get('[data-element="editor-footer"] .btn-success').click();

        // Notification message should display
        cy.umbracoSuccessNotification().should('be.visible');

        // Close the notification
        cy.umbracoSuccessNotification().find('.close').click();

        // Ensure all checkboxes are checked
        cy.get('.umb-property[label="Users"] .vendr-toggle .umb-toggle').each($toggle => {
            cy.wrap($toggle).should('have.class', 'umb-toggle--checked');
        });

        // Give access to all users
        cy.get('.umb-property[label="Users"] .vendr-toggle:first-child').click();

        // Save the changes
        cy.get('[data-element="editor-footer"] .btn-success').click();

        // Notification message should display
        cy.umbracoSuccessNotification().should('be.visible');

        // Close the notification
        cy.umbracoSuccessNotification().find('.close').click();

        // Ensure all checkboxes are checked
        cy.get('.umb-property[label="Users"] .vendr-toggle .umb-toggle').each($toggle => {
            cy.wrap($toggle).should('not.have.class', 'umb-toggle--checked');
        });

    });

    // TODO: Test API permissions to ensure can only access store data of stores a user has access to

});