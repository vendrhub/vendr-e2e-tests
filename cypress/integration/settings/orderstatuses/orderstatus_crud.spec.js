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
            data.path[2] = storeId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/OrderStatus/SaveOrderStatus", "POST", data).then(orderStatus => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

                // Open store context menu
                cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Order Statuses"]).click();

                // Ensure a row for the order status exists
                cy.get('.umb-table-body__link').contains(orderStatus.name);

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
        cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

        // Create store
        cy.umbracoTreeItem("settings", ["Vendr", "Stores", "Test Store", "Order Statuses"]).rightclick();
        cy.umbracoContextMenuAction("action-create").click();

        // Give the store a name
        cy.get('[data-element="editor-name-field"]').type(name);

        // Wait for an alias to come back
        cy.wait('@getSafeAlias');

        // Validate the store alias
        cy.get('.umb-locked-field__input').should('have.value', alias);

        // Select a colour
        cy.get('.umb-color-box.vendr-bg--lime').click();

        // Submit the form
        cy.get('.btn-success').click();

        // Ensure the success notification shows
        cy.umbracoSuccessNotification().should('be.visible');

    });

    it('can delete an order status via action menu', () => {

        // Create the order status from fixture data
        cy.fixture('test-order-status').then(data => {
            data.storeId = storeId;
            data.path[2] = storeId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/OrderStatus/SaveOrderStatus", "POST", data).then(orderStatus => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

                // Open store context menu
                cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Order Statuses"]).click();

                // Open the order status
                cy.get(".umb-table-body__link").contains(orderStatus.name).click();

                // Open the actions menu
                cy.get('[data-element="editor-actions"] .umb-button').click();

                // Click to delete (opens confirmation)
                cy.get('ul.umb-actions li.umb-action button').contains("Delete").click();

                // Click OK to delete
                cy.umbracoButtonByLabelKey("general_ok").click();

                // Notification message should display
                cy.umbracoSuccessNotification().should('be.visible');

                // Check we are directed back to list view
                cy.get(".umb-panel-header-name").contains('Order Statuses');

                // Check the node has gone from the list view
                cy.get(".umb-table-body__link").contains(orderStatus.name).should('not.exist');
                
            })
        });

    });

    it('can delete an order status via bulk action', () => {

        // Create the order status from fixture data
        cy.fixture('test-order-status').then(data => {
            data.storeId = storeId;
            data.path[2] = storeId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/OrderStatus/SaveOrderStatus", "POST", data).then(orderStatus => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

                // Open store context menu
                cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Order Statuses"]).click();

                // Select the row to delete
                cy.get('.umb-table-body__link').contains(orderStatus.name)
                    .closest('.umb-table-row').click();

                // Click the delete bulk action
                cy.get('.umb-editor-sub-header button').contains('Delete').click();

                // Click OK to confirm deletion
                cy.get('[data-element="overlay"]')
                    .umbracoButtonByLabelKey("general_yes").click();

                // Notification message should display
                cy.umbracoSuccessNotification().should('be.visible');

                // Check the node has gone from the tree
                cy.get(".umb-table-body__link").contains(orderStatus.name).should('not.exist');
                
            })
        });

    });

});