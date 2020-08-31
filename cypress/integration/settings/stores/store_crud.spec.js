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
        cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

        // Create store
        cy.umbracoTreeItem("settings", ["Vendr", "Stores"]).rightclick();
        cy.umbracoContextMenuAction("action-create").click();

        // Give the store a name
        cy.get('[data-element="editor-name-field"]').type(name);

        // Wait for an alias to come back
        cy.wait('@getSafeAlias');

        // Validate the store alias
        cy.get('.umb-locked-field__input').should('have.value', alias);

        // Submit the form
        cy.get('.btn-success').click();

        // Ensure the success notification shows
        cy.umbracoSuccessNotification().should('be.visible');

        // Check store is selected in the nav
        cy.get(`[data-element="tree-item-${storeName}"]`).should('be.visible').and('have.class', 'current');

        // Check "default" inputs have been populated
        cy.get('.umb-property[label="Default Country"] select > option[selected="selected"]').should('have.text', 'United Kingdom');
        cy.get('.umb-property[label="Default Tax Class"] select > option[selected="selected"]').should('have.text', 'Standard');
        cy.get('.umb-property[label="Default Order Status"] select > option[selected="selected"]').should('have.text', 'New');
        cy.get('.umb-property[label="Error Order Status"] select > option[selected="selected"]').should('have.text', 'Error');
        cy.get('.umb-property[label="Use Cookies"] .umb-toggle').should('have.class', 'umb-toggle--checked');
        cy.get('.umb-property[label="Cookie Timeout"] input').should('have.value', 525600);

        cy.get('.umb-property[label="Confirmation Email"] select > option[selected="selected"]').should('have.text', 'Order Confirmation');
        cy.get('.umb-property[label="Error Email"] select > option[selected="selected"]').should('have.text', 'Order Error');

        cy.get('.umb-property[label="Cart Number Template"] input').should('have.value', 'CART-{0}');
        cy.get('.umb-property[label="Order Number Template"] input').should('have.value', 'ORDER-{0}');
        
        cy.get('.umb-property[label="Code Length"] input').should('have.value', 10);
        cy.get('.umb-property[label="Valid For"] input').should('have.value', 1095);
        cy.get('.umb-property[label="Gift Card Property Aliases"] input').should('have.value', 'giftCardRecipientName,giftCardRecipientEmail,giftCardMessage');
        cy.get('.umb-property[label="Activation Method"] select > option[selected="selected"]').should('have.text', 'Manual');
        cy.get('.umb-property[label="Default Gift Card Email"] select > option[selected="selected"]').should('have.text', 'Gift Card');

        cy.get('.umb-property[label="Order Editor Config"] input').should('have.value', '/app_plugins/vendr/config/order.editor.config.js');

        // Check store entity containers are present beneath the store tree item
        cy.get(`[data-element="tree-item-${storeName}"] [data-element="tree-item-expand"]`).click();
        cy.get('[data-element="tree-item-Order Statuses"]').should('be.visible');
        cy.get('[data-element="tree-item-Shipping Methods"]').should('be.visible');
        cy.get('[data-element="tree-item-Payment Methods"]').should('be.visible');
        cy.get('[data-element="tree-item-Countries"]').should('be.visible');
        cy.get('[data-element="tree-item-Taxes"]').should('be.visible');
        cy.get('[data-element="tree-item-Email Templates"]').should('be.visible');

        // Check default store entities get created
        cy.get('[data-element="tree-item-Order Statuses"] .umb-tree-item__label').click();
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(1) .umb-table__name').contains("New");
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(2) .umb-table__name').contains("Completed");
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(3) .umb-table__name').contains("Cancelled");
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(4) .umb-table__name').contains("Error");

        cy.get('[data-element="tree-item-Shipping Methods"] .umb-tree-item__label').click();
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(1) .umb-table__name').contains("Pickup");

        cy.get('[data-element="tree-item-Payment Methods"] .umb-tree-item__label').click();
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(1) .umb-table__name').contains("Invoicing");

        cy.get('[data-element="tree-item-Countries"] .umb-tree-item__label').click();
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(1) .umb-table__name').contains("United Kingdom");

        cy.get('[data-element="tree-item-Currencies"] .umb-tree-item__label').click();
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(1) .umb-table__name').contains("GBP");

        cy.get('[data-element="tree-item-Taxes"] .umb-tree-item__label').click();
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(1) .umb-table__name').contains("Standard");

        cy.get('[data-element="tree-item-Email Templates"] .umb-tree-item__label').click();
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(1) .umb-table__name').contains("Order Confirmation");
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(2) .umb-table__name').contains("Order Error");
        cy.get('.vendr-table .umb-table-body .umb-table-row:nth-child(3) .umb-table__name').contains("Gift Card");

    });

    it('can delete a store', () => {

        // Create the store from fixture data
        cy.fixture('test-store').then(data => {
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Store/SaveStore", "POST", data).then(store => {
                
                // Got to settings section
                cy.umbracoSection('settings');
                cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

                // Open store context menu
                cy.umbracoTreeItem("settings", ["Vendr", "Stores", store.name]).rightclick();

                // Click to delete (opens confirmation)
                cy.umbracoContextMenuAction("action-delete").click();

                // Click OK to delete
                cy.umbracoButtonByLabelKey("general_ok").click();

                // Notification message should display
                cy.umbracoSuccessNotification().should('be.visible');

                // Check the node has gone from the tree
                cy.get('.umb-tree-item__label').contains(store.name).should('not.exist');

            });
        });

    });

});