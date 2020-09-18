context('Currencies', () => {

    let storeId;
    let storeName;
    let countryId;

    beforeEach(() => {
        cy.task('app:seed', 'clean');
        cy.task('app:clearCache');
        cy.umbracoLogin(Cypress.env('username'), Cypress.env('password'));
        cy.fixture('test-store').then(data => {
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Store/SaveStore", "POST", data).then(store => {
                storeId = store.id;
                storeName = store.name;
                countryId = store.defaultCountryId;
            });
        });
    });

    it('can list currencies', () => {

        // Create the currency from fixture data
        cy.fixture('test-currency').then(data => {
            data.storeId = storeId;
            data.allowedCountries[0].countryId = countryId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Currency/SaveCurrency", "POST", data).then(currency => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

                // Open currency context menu
                cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Currencies"]).click();

                // Ensure a row for the currency exists
                cy.get('.umb-table-body__link').contains(currency.name);

            })
        });

    });

    it('can create a currency', () => {

        const name = "Test Currency";
        const code = "TST";
        const cultureName = "English (United Kingdom)";
        const formatTemplate = "{0}TST";

        // Got to settings section
        cy.umbracoSection('settings');
        cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

        // Create store
        cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Currencies"]).rightclick();
        cy.umbracoContextMenuAction("action-create").click();

        // Give the currency a name
        cy.get('[data-element="editor-name-field"]').type(name);

        // Give the currency a code
        cy.get('.umb-property[label="ISO Code"] input').type(code);

        // Give the currency a code
        cy.get('.umb-property[label="Culture"] select').select(cultureName);

        // Give the currency a code
        cy.get('.umb-property[label="Custom Format Template"] input').type(formatTemplate,  { parseSpecialCharSequences: false });

        // Allow in default country
        cy.get('.vendr-toggle').contains("United Kingdom").click();

        // Submit the form
        cy.get('.btn-success').click();

        // Ensure the success notification shows
        cy.umbracoSuccessNotification().should('be.visible');

        // Error message shouldn't be displayed
        cy.get('.umb-notifications__notifications > .alert-error').should('not.be.visible');

    });

    it('can delete a currency via action menu', () => {

        // Create the currency from fixture data
        cy.fixture('test-currency').then(data => {
            data.storeId = storeId;
            data.allowedCountries[0].countryId = countryId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Currency/SaveCurrency", "POST", data).then(currency => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

                // Open currency context menu
                cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Currencies"]).click();

                // Open the currency
                cy.get(".umb-table-body__link").contains(currency.name).click();

                // Open the actions menu
                cy.get('[data-element="editor-actions"] .umb-button').click();

                // Click to delete (opens confirmation)
                cy.get('ul.umb-actions li.umb-action button').contains("Delete").click();

                // Click OK to delete
                cy.umbracoButtonByLabelKey("general_ok").click();

                // Notification message should display
                cy.umbracoSuccessNotification().should('be.visible');

                // Error message shouldn't be displayed
                cy.get('.umb-notifications__notifications > .alert-error').should('not.be.visible');

                // Check we are directed back to list view
                cy.get(".umb-panel-header-name").contains('Currencies');

                // Check the node has gone from the list view
                cy.get(".umb-table-body__link").contains(currency.name).should('not.exist');
                
            })
        });

    });

    it('can delete currency via bulk action', () => {

        // Create the currency from fixture data
        cy.fixture('test-currency').then(data => {
            data.storeId = storeId;
            data.allowedCountries[0].countryId = countryId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Currency/SaveCurrency", "POST", data).then(currency => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

                // Open currency context menu
                cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Currencies"]).click();

                // Select the row to delete
                cy.get('.umb-table-body__link').contains(currency.name)
                    .closest('.umb-table-row').click();

                // Click the delete bulk action
                cy.get('.umb-editor-sub-header button').contains('Delete').click();

                // Click OK to confirm deletion
                cy.get('[data-element="overlay"]')
                    .umbracoButtonByLabelKey("general_yes").click();

                // Notification message should display
                cy.umbracoSuccessNotification().should('be.visible');

                // Error message shouldn't be displayed
                cy.get('.umb-notifications__notifications > .alert-error').should('not.be.visible');

                // Check the node has gone from the list view
                cy.get(".umb-table-body__link").contains(currency.name).should('not.exist');
                
            })
        });

    });

});