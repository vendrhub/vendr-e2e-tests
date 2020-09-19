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
                cy.umbracoTreeRoot('Commerce').should("be.visible");

                // Open currency context menu
                cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Currencies"]).click();

                // Ensure a row for the currency exists
                cy.umbracoListViewLink(currency.name);

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
        cy.umbracoTreeRoot('Commerce').should("be.visible");

        // Create store
        cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Currencies"]).rightclick();
        cy.umbracoContextMenuAction("action-create").click();

        // Give the currency a name
        cy.umbracoEditorNameField().type(name);

        // Give the currency a code
        cy.umbracoProperty('ISO Code').find('input').type(code);

        // Give the currency a code
        cy.umbracoProperty('Culture').find('select').select(cultureName);

        // Give the currency a code
        cy.umbracoProperty('Custom Format Template').find('input').type(formatTemplate,  { parseSpecialCharSequences: false });

        // Allow in default country
        cy.vendrToggle("United Kingdom").click();

        // Submit the form
        cy.get('.btn-success').click();

        // Ensure the success notification shows
        cy.umbracoSuccessNotification().should('be.visible');

        // Error message shouldn't be displayed
        cy.umbracoErrorNotification().should('not.be.visible');

    });

    it('can delete a currency via action menu', () => {

        // Create the currency from fixture data
        cy.fixture('test-currency').then(data => {
            data.storeId = storeId;
            data.allowedCountries[0].countryId = countryId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Currency/SaveCurrency", "POST", data).then(currency => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.umbracoTreeRoot('Commerce').should("be.visible");

                // Open currency context menu
                cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Currencies"]).click();

                // Open the currency
                cy.umbracoListViewLink(currency.name).click();

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

                // Check we are directed back to list view
                cy.umbracoEditorName().contains('Currencies');

                // Check the node has gone from the list view
                cy.umbracoListViewLink(currency.name).should('not.exist');
                
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
                cy.umbracoTreeRoot('Commerce').should("be.visible");

                // Open currency context menu
                cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Currencies"]).click();

                // Select the row to delete
                cy.umbracoListViewRow(currency.name).click();

                // Click the delete bulk action
                cy.umbracoBulkActionButton('Delete').click();

                // Click OK to confirm deletion
                cy.umbracoButtonByLabelKey("general_yes").click();

                // Notification message should display
                cy.umbracoSuccessNotification().should('be.visible');

                // Error message shouldn't be displayed
                cy.umbracoErrorNotification().should('not.be.visible');

                // Check the node has gone from the list view
                cy.umbracoListViewLink(currency.name).should('not.exist');
                
            })
        });

    });

});