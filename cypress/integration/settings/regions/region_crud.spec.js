context('Regions', () => {

    let storeId;
    let storeName;
    let countryId;
    let countryName;
    let paymentMethodId;
    let paymentMethodName;
    let shippingMethodId;
    let shippingMethodName;

    beforeEach(() => {
        cy.task('app:seed', 'clean');
        cy.task('app:clearCache');
        cy.umbracoLogin(Cypress.env('username'), Cypress.env('password'));
        cy.fixture('test-store').then(data => {
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Store/SaveStore", "POST", data).then(store => {
                storeId = store.id;
                storeName = store.name;
                cy.umbracoApiRequest(`/umbraco/backoffice/vendr/Country/GetCountries?storeId=${storeId}`, "GET").then(result => {
                    countryId = result[0].id;
                    countryName = result[0].name;
                });
                cy.umbracoApiRequest(`/umbraco/backoffice/vendr/PaymentMethod/GetPaymentMethods?storeId=${storeId}`, "GET").then(result => {
                    paymentMethodId = result[0].id;
                    paymentMethodName = result[0].name;
                });
                cy.umbracoApiRequest(`/umbraco/backoffice/vendr/ShippingMethod/GetShippingMethods?storeId=${storeId}`, "GET").then(result => {
                    shippingMethodId = result[0].id;
                    shippingMethodName = result[0].name;
                });
            });
        });
    });

    it('can list regions', () => {

        // Create the region from fixture data
        cy.fixture('test-region').then(data => {
            data.storeId = storeId;
            data.countryId = countryId;
            data.defaultPaymentMethodId = paymentMethodId;
            data.defaultShippingMethodId = shippingMethodId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Country/SaveRegion", "POST", data).then(region => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.umbracoTreeRoot('Commerce').should("be.visible");

                // Open region context menu
                cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Countries"]).click();

                // Open the country
                cy.umbracoListViewLink(countryName).click();
        
                // Got to regions content app
                cy.umbracoContextApp('regions').click();

                // Ensure a row for the region exists
                cy.umbracoListViewLink(region.name);

            })
        });

    });

    it('can create a region', () => {

        const name = "Test Region";
        const code = "TS";

        // Got to settings section
        cy.umbracoSection('settings');
        cy.umbracoTreeRoot('Commerce').should("be.visible");

        // Create region
        cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Countries"]).click();
        
        // Open the country
        cy.umbracoListViewLink(countryName).click();
        
        // Open the actions menu
        cy.umbracoActionsMenu().click();

        // Click to delete (opens confirmation)
        cy.umbracoActionsMenuItem("Create").click();
        
        // Give the region a name
        cy.umbracoEditorNameField().type(name);

        // Give the region a code
        cy.umbracoProperty('Code').find('input').type(code);

        // Select defaults
        cy.umbracoProperty('Default Shipping Method').find('select').select(shippingMethodName);
        cy.umbracoProperty('Default Payment Method').find('select').select(paymentMethodName);

        // Submit the form
        cy.get('.btn-success').click();

        // Ensure the success notification shows
        cy.umbracoSuccessNotification().should('be.visible');

        // Error message shouldn't be displayed
        cy.umbracoErrorNotification().should('not.be.visible');

    });

    it('can delete a region via action menu', () => {

        // Create the region from fixture data
        cy.fixture('test-region').then(data => {
            data.storeId = storeId;
            data.countryId = countryId;
            data.defaultPaymentMethodId = paymentMethodId;
            data.defaultShippingMethodId = shippingMethodId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Country/SaveRegion", "POST", data).then(region => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.umbracoTreeRoot('Commerce').should("be.visible");

                // Open region context menu
                cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Countries"]).click();
        
                // Open the country
                cy.umbracoListViewLink(countryName).click();
        
                // Got to regions content app
                cy.umbracoContextApp('regions').click();
        
                // Open the country
                cy.umbracoListViewLink(region.name).click();

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
                cy.umbracoEditorNameField().should('have.value', countryName);

                // Check there are now no region results
                cy.get(".umb-empty-state").should('be.visible');
                
            })
        });

    });

    it('can delete region via bulk action', () => {

        // Create the region from fixture data
        cy.fixture('test-region').then(data => {
            data.storeId = storeId;
            data.countryId = countryId;
            data.defaultPaymentMethodId = paymentMethodId;
            data.defaultShippingMethodId = shippingMethodId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Country/SaveRegion", "POST", data).then(region => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.umbracoTreeRoot('Commerce').should("be.visible");

                // Open region context menu
                cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Countries"]).click();
        
                // Open the country
                cy.umbracoListViewLink(countryName).click();
        
                // Got to regions content app
                cy.umbracoContextApp('regions').click();

                // Select the row to delete
                cy.umbracoListViewRow(region.name).click();

                // Click the delete bulk action
                cy.umbracoBulkActionButton('Delete').click();

                // Click OK to confirm deletion
                cy.umbracoButtonByLabelKey("general_yes").click();

                // Notification message should display
                cy.umbracoSuccessNotification().should('be.visible');

                // Error message shouldn't be displayed
                cy.umbracoErrorNotification().should('not.be.visible');

                // Check there are now no region results
                cy.get(".umb-empty-state").should('be.visible');
                
            })
        });

    });

});