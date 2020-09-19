context('Stores', () => {

    let storeId;
    let storeName;

    beforeEach(() => {
        cy.task('app:seed', ['clean', 'permissions']);
        cy.task('app:clearCache');
        cy.umbracoLogin(Cypress.env('username'), Cypress.env('password'));
        cy.fixture('test-store').then(data => {
            data.allowedUsers = []; // Ensure allowed users is empty
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Store/SaveStore", "POST", data).then(store => {
                storeId = store.id;
                storeName = store.name;
            });
        });
    });

    it('can allow access to store by user group', () => {

        // Go to commerce section
        cy.umbracoSection('commerce');

        // Ensure we don't currently have access to a store
        cy.umbracoTreeItem(storeName).should('not.be.visible');

        // Got to settings section
        cy.umbracoSection('settings');
        cy.umbracoTreeRoot('Commerce').should("be.visible");

        // Open the store
        cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName]).click();

        // Go to permissions tab
        cy.umbracoContextApp('permissions').click();

        // Give store access to Commerce user group
        cy.umbracoProperty('User Groups').vendrToggle('Commerce').click();

        // Save the changes
        cy.get('[data-element="editor-footer"] .btn-success').click();

        // Notification message should display
        cy.umbracoSuccessNotification().should('be.visible');

        // Go to commerce section
        cy.umbracoSection('commerce');

        // Reload the section
        cy.reload(true);

        // Ensure we now have access to a store
        cy.umbracoTreeItem(storeName).should('be.visible');

    });

    it('can allow access to store by user', () => {

        // Go to commerce section
        cy.umbracoSection('commerce');

        // Ensure we don't currently have access to a store
        cy.umbracoTreeItem(storeName).should('not.be.visible');

        // Got to settings section
        cy.umbracoSection('settings');
        cy.umbracoTreeRoot('Commerce').should("be.visible");

        // Open the store
        cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName]).click();

        // Go to permissions tab
        cy.umbracoContextApp('permissions').click();

        // Give store access to Commerce user group
        cy.umbracoProperty('Users').vendrToggle('Admin').click();

        // Save the changes
        cy.get('[data-element="editor-footer"] .btn-success').click();

        // Notification message should display
        cy.umbracoSuccessNotification().should('be.visible');

        // Go to commerce section
        cy.umbracoSection('commerce');

        // Reload the section
        cy.reload(true);

        // Ensure we don't currently have access to a store
        cy.umbracoTreeItem(storeName).should('be.visible');

    });

    it('can toggle access to store for all user groups', () => {

        // Got to settings section
        cy.umbracoSection('settings');
        cy.umbracoTreeRoot('Commerce').should("be.visible");

        // Open the store
        cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName]).click();

        // Go to permissions tab
        cy.umbracoContextApp('permissions').click();

        // Give access to all groups
        cy.umbracoProperty('User Groups').find('.vendr-toggle:first-child').click();

        // Save the changes
        cy.get('[data-element="editor-footer"] .btn-success').click();

        // Notification message should display
        cy.umbracoSuccessNotification().should('be.visible');

        // Close the notification
        cy.umbracoSuccessNotification().find('.close').click();

        // Ensure all checkboxes are checked
        cy.umbracoProperty('User Groups').find('.vendr-toggle .umb-toggle').each($toggle => {
            cy.wrap($toggle).should('have.class', 'umb-toggle--checked');
        });

        // Give access to all groups
        cy.umbracoProperty('User Groups').find('.vendr-toggle:first-child').click();

        // Save the changes
        cy.get('[data-element="editor-footer"] .btn-success').click();

        // Notification message should display
        cy.umbracoSuccessNotification().should('be.visible');

        // Close the notification
        cy.umbracoSuccessNotification().find('.close').click();

        // Ensure all checkboxes are checked
        cy.umbracoProperty('User Groups').find('.vendr-toggle .umb-toggle').each($toggle => {
            cy.wrap($toggle).should('not.have.class', 'umb-toggle--checked');
        });

    });

    it('can toggle access to store for all users', () => {

        // Got to settings section
        cy.umbracoSection('settings');
        cy.umbracoTreeRoot('Commerce').should("be.visible");

        // Open the store
        cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName]).click();

        // Go to permissions tab
        cy.umbracoContextApp('permissions').click();

        // Give access to all users
        cy.umbracoProperty('Users').find('.vendr-toggle:first-child').click();

        // Save the changes
        cy.get('[data-element="editor-footer"] .btn-success').click();

        // Notification message should display
        cy.umbracoSuccessNotification().should('be.visible');

        // Close the notification
        cy.umbracoSuccessNotification().find('.close').click();

        // Ensure all checkboxes are checked
        cy.umbracoProperty('Users').find('.vendr-toggle .umb-toggle').each($toggle => {
            cy.wrap($toggle).should('have.class', 'umb-toggle--checked');
        });

        // Give access to all users
        cy.umbracoProperty('Users').find('.vendr-toggle:first-child').click();

        // Save the changes
        cy.get('[data-element="editor-footer"] .btn-success').click();

        // Notification message should display
        cy.umbracoSuccessNotification().should('be.visible');

        // Close the notification
        cy.umbracoSuccessNotification().find('.close').click();

        // Ensure all checkboxes are checked
        cy.umbracoProperty('Users').find('.vendr-toggle .umb-toggle').each($toggle => {
            cy.wrap($toggle).should('not.have.class', 'umb-toggle--checked');
        });

    });

    // TODO: Test API permissions to ensure can only access store data of stores a user has access to

});