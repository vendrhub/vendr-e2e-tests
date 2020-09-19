context('Stores', () => {

    beforeEach(() => {
        cy.task('app:seed', 'clean');
        cy.task('app:clearCache');
        cy.umbracoLogin(Cypress.env('username'), Cypress.env('password'));
    });

    it('can create a store', () => {

        cy.server();
        cy.route('/umbraco/backoffice/UmbracoApi/Entity/GetSafeAlias?*').as('getSafeAlias');

        const name = "Test Store";
        const alias = "testStore";

        // Got to settings section
        cy.umbracoSection('settings');
        cy.umbracoTreeRoot('Commerce').should("be.visible");

        // Create store
        cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores"]).rightclick();
        cy.umbracoContextMenuAction("action-create").click();

        // Give the store a name
        cy.umbracoEditorNameField().type(name);

        // Wait for an alias to come back
        cy.wait('@getSafeAlias');

        // Validate the store alias
        cy.get('.umb-locked-field__input').should('have.value', alias);

        // Submit the form
        cy.get('.btn-success').click();

        // Ensure the success notification shows
        cy.umbracoSuccessNotification().should('be.visible');

        // Check store is selected in the nav
        cy.umbracoTreeItem(name).should('be.visible').and('have.class', 'current');

        // Check "default" inputs have been populated
        cy.umbracoProperty('Base Currency').find('select > option[selected="selected"]').should('have.text', 'GBP');
        cy.umbracoProperty('Default Country').find('select > option[selected="selected"]').should('have.text', 'United Kingdom');
        cy.umbracoProperty('Default Tax Class').find('select > option[selected="selected"]').should('have.text', 'Standard');
        cy.umbracoProperty('Default Order Status').find('select > option[selected="selected"]').should('have.text', 'New');
        cy.umbracoProperty('Error Order Status').find('select > option[selected="selected"]').should('have.text', 'Error');
        cy.umbracoProperty('Use Cookies').find('.umb-toggle').should('have.class', 'umb-toggle--checked');
        cy.umbracoProperty('Cookie Timeout').find('input').should('have.value', 525600);

        cy.umbracoProperty('Confirmation Email').find('select > option[selected="selected"]').should('have.text', 'Order Confirmation');
        cy.umbracoProperty('Error Email').find('select > option[selected="selected"]').should('have.text', 'Order Error');

        cy.umbracoProperty('Cart Number Template').find('input').should('have.value', 'CART-{0}');
        cy.umbracoProperty('Order Number Template').find('input').should('have.value', 'ORDER-{0}');
        
        cy.umbracoProperty('Code Length').find('input').should('have.value', 10);
        cy.umbracoProperty('Valid For').find('input').should('have.value', 1095);
        cy.umbracoProperty('Gift Card Property Aliases').find('input').should('have.value', 'giftCardRecipientName,giftCardRecipientEmail,giftCardMessage');
        cy.umbracoProperty('Activation Method').find('select > option[selected="selected"]').should('have.text', 'Manual');
        cy.umbracoProperty('Default Gift Card Email').find('select > option[selected="selected"]').should('have.text', 'Gift Card');

        cy.umbracoProperty('Order Editor Config').find('input').should('have.value', '/app_plugins/vendr/config/order.editor.config.js');

        // Check store entity containers are present beneath the store tree item
        cy.umbracoTreeItem(name).expander().click();
        cy.umbracoTreeItem('Order Statuses').should('be.visible');
        cy.umbracoTreeItem('Shipping Methods').should('be.visible');
        cy.umbracoTreeItem('Payment Methods').should('be.visible');
        cy.umbracoTreeItem('Countries').should('be.visible');
        cy.umbracoTreeItem('Taxes').should('be.visible');
        cy.umbracoTreeItem('Email Templates').should('be.visible');

        // Check default store entities get created
        cy.umbracoTreeItem('Order Statuses').find('.umb-tree-item__label').click();
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(1) .umb-table__name').contains("New");
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(2) .umb-table__name').contains("Completed");
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(3) .umb-table__name').contains("Cancelled");
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(4) .umb-table__name').contains("Error");

        cy.umbracoTreeItem('Shipping Methods').find('.umb-tree-item__label').click();
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(1) .umb-table__name').contains("Pickup");

        cy.umbracoTreeItem('Payment Methods').find('.umb-tree-item__label').click();
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(1) .umb-table__name').contains("Invoicing");

        cy.umbracoTreeItem('Countries').find('.umb-tree-item__label').click();
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(1) .umb-table__name').contains("United Kingdom");

        cy.umbracoTreeItem('Currencies').find('.umb-tree-item__label').click();
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(1) .umb-table__name').contains("GBP");

        cy.umbracoTreeItem('Taxes').find('.umb-tree-item__label').click();
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(1) .umb-table__name').contains("Standard");

        cy.umbracoTreeItem('Email Templates').find('.umb-tree-item__label').click();
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(1) .umb-table__name').contains("Order Confirmation");
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(2) .umb-table__name').contains("Order Error");
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(3) .umb-table__name').contains("Gift Card");

    });

    it('can delete a store via tree context menu', () => {

        // Create the store from fixture data
        cy.fixture('test-store').then(data => {
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Store/SaveStore", "POST", data).then(store => {
                
                // Got to settings section
                cy.umbracoSection('settings');
                cy.umbracoTreeRoot('Commerce').should("be.visible");

                // Open store context menu
                cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", store.name]).rightclick();

                // Click to delete (opens confirmation)
                cy.umbracoContextMenuAction("action-delete").click();

                // Click OK to delete
                cy.umbracoButtonByLabelKey("general_ok").click();

                // Notification message should display
                cy.umbracoSuccessNotification().should('be.visible');

                // Error message shouldn't be displayed
                cy.umbracoErrorNotification().should('not.be.visible');

                // Check the node has gone from the tree
                cy.umbracoTreeItem(store.name).should('not.exist');

            });
        });

    });

    it('can delete a store via action menu', () => {

        // Create the store from fixture data
        cy.fixture('test-store').then(data => {
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Store/SaveStore", "POST", data).then(store => {
                
                // Got to settings section
                cy.umbracoSection('settings');
                cy.umbracoTreeRoot('Commerce').should("be.visible");

                // Open store context menu
                cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", store.name]).click();

                // Open the actions menu
                cy.umbracoActionsMenu().click();

                // Click to delete (opens confirmation)
                cy.umbracoActionsMenuItem("Delete").click();

                // Click OK to delete
                cy.umbracoButtonByLabelKey("general_ok").click();

                // Notification message should display
                cy.umbracoSuccessNotification().should('be.visible');

                // Error message shouldn't be displayed
                cy.umbracoErrorNotification().should('not.be.visible');

                // Check the node has gone from the tree
                cy.umbracoTreeItem(store.name).should('not.exist');

            });
        });

    });

});