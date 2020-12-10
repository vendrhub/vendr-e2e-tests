context('Order Statuses', () => {

    let storeId;
    let storeName;

    beforeEach(() => {
        cy.task('app:seed', 'clean');
        cy.task('app:clearCache');
        cy.umbracoLogin(Cypress.env('username'), Cypress.env('password'));
        cy.fixture('test-store').then(data => {
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Store/SaveStore", "POST", data).then(store => {
                storeId = store.id;
                storeName = store.name;
            });
        });
    });


    it('can list order statuses', () => {

        // Create the order status from fixture data
        cy.fixture('test-order-status').then(data => {
            data.storeId = storeId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/OrderStatus/SaveOrderStatus", "POST", data).then(orderStatus => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.umbracoTreeRoot('Commerce').should("be.visible");

                // Open order status context menu
                cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Order Statuses"]).click();

                // Ensure a row for the order status exists
                cy.umbracoListViewLink(orderStatus.name);

                // Ensure the color swatch exists
                cy.get(`.vendr-color-swatch.vendr-bg--${orderStatus.color}`);

            })
        });

    });

    it('can create an order status', () => {

        cy.server();
        cy.route('/umbraco/backoffice/UmbracoApi/Entity/GetSafeAlias?*').as('getSafeAlias');

        const name = "Test Order Status";
        const alias = "testOrderStatus";

        // Got to settings section
        cy.umbracoSection('settings');
        cy.umbracoTreeRoot('Commerce').should("be.visible");

        // Create order status
        cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Order Statuses"]).rightclick();
        cy.umbracoContextMenuAction("action-create").click();

        // Give the order status a name
        cy.umbracoEditorNameField().type(name);

        // Wait for an alias to come back
        cy.wait('@getSafeAlias');

        // Validate the order status alias
        cy.get('.umb-locked-field__input').should('have.value', alias);

        // Select a colour
        cy.get('.umb-color-box.vendr-bg--lime').click();

        // Submit the form
        cy.get('.btn-success').click();

        // Ensure the success notification shows
        cy.umbracoSuccessNotification().should('be.visible');

        // Error message shouldn't be displayed
        // cy.umbracoErrorNotification().should('not.be.visible');

    });

    it('can delete an order status via action menu', () => {

        // Create the order status from fixture data
        cy.fixture('test-order-status').then(data => {
            data.storeId = storeId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/OrderStatus/SaveOrderStatus", "POST", data).then(orderStatus => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.umbracoTreeRoot('Commerce').should("be.visible");

                // Open order status context menu
                cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Order Statuses"]).click();

                // Open the order status
                cy.umbracoListViewLink(orderStatus.name).click();

                // Open the actions menu
                cy.umbracoActionsMenu().click();

                // Click to delete (opens confirmation)
                cy.umbracoActionsMenuItem("Delete").click();

                // Click OK to delete
                cy.umbracoButtonByLabelKey("general_ok").click();

                // Notification message should display
                cy.umbracoSuccessNotification().should('be.visible');

                // Error message shouldn't be displayed
                // cy.umbracoErrorNotification().should('not.be.visible');

                // Check we are directed back to list view
                cy.umbracoEditorName().contains('Order Statuses');

                // Check the node has gone from the list view
                cy.umbracoListViewLink(orderStatus.name).should('not.exist');
                
            })
        });

    });

    it('can delete an order status via bulk action', () => {

        // Create the order status from fixture data
        cy.fixture('test-order-status').then(data => {
            data.storeId = storeId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/OrderStatus/SaveOrderStatus", "POST", data).then(orderStatus => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.umbracoTreeRoot('Commerce').should("be.visible");

                // Open order status context menu
                cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Order Statuses"]).click();

                // Select the row to delete
                cy.umbracoListViewRow(orderStatus.name).click();

                // Click the delete bulk action
                cy.umbracoBulkActionButton('Delete').click();

                // Click OK to confirm deletion
                cy.umbracoButtonByLabelKey("general_yes").click();

                // Notification message should display
                cy.umbracoSuccessNotification().should('be.visible');

                // Error message shouldn't be displayed
                // cy.umbracoErrorNotification().should('not.be.visible');

                // Check the node has gone from the list view
                cy.umbracoListViewLink(orderStatus.name).should('not.exist');
                
            })
        });

    });

    it('can sort order statuses', () => {

        // Got to settings section
        cy.umbracoSection('settings');
        cy.umbracoTreeRoot('Commerce').should("be.visible");

        // Open order status context menu
        cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Order Statuses"]).rightclick();
        cy.umbracoContextMenuAction("action-sort").click();

        // Drag and drop
        cy.get('.ui-sortable .ui-sortable-handle :nth-child(2)').eq(0).trigger('mousedown', { which: 1 })
        cy.get('.ui-sortable .ui-sortable-handle :nth-child(2)').eq(1).trigger("mousemove").trigger("mouseup")

        // Save and close dialog
        cy.get('.umb-modalcolumn .btn-success').click();

        // Load the order statuses
        cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Order Statuses"]).click();

        // Assert the order
        cy.umbracoListViewRows().eq(0).should('contain.text', "Completed");
        cy.umbracoListViewRows().eq(1).should('contain.text', "New");
        cy.umbracoListViewRows().eq(2).should('contain.text', "Cancelled");

    });

});