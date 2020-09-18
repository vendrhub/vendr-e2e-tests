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
                cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

                // Open region context menu
                cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Countries"]).click();

                // Open the country
                cy.get(`.umb-table-body__link[title="${countryName}"]`).click();
        
                // Got to regions content app
                cy.get('[data-element="sub-view-regions"]').click();

                // Ensure a row for the region exists
                cy.get('.umb-table-body__link').contains(region.name);

            })
        });

    });

    it('can create a region', () => {

        const name = "Test Region";
        const code = "TS";

        // Got to settings section
        cy.umbracoSection('settings');
        cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

        // Create region
        cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Countries"]).click();
        
        // Open the country
        cy.get(`.umb-table-body__link[title="${countryName}"]`).click();
        
        // Open the actions menu
        cy.get('[data-element="editor-actions"] .umb-button').click();

        // Click to delete (opens confirmation)
        cy.get('ul.umb-actions li.umb-action button').contains("Create").click();
        
        // Give the region a name
        cy.get('[data-element="editor-name-field"]').type(name);

        // Give the region a code
        cy.get('.umb-property[label="Code"] input').type(code);

        // Select defaults
        cy.get('.umb-property[label="Default Shipping Method"] select').select(shippingMethodName);
        cy.get('.umb-property[label="Default Payment Method"] select').select(paymentMethodName);

        // Submit the form
        cy.get('.btn-success').click();

        // Ensure the success notification shows
        cy.umbracoSuccessNotification().should('be.visible');

        // Error message shouldn't be displayed
        cy.get('.umb-notifications__notifications > .alert-error').should('not.be.visible');

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
                cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

                // Open region context menu
                cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Countries"]).click();
        
                // Open the country
                cy.get(`.umb-table-body__link[title="${countryName}"]`).click();
        
                // Got to regions content app
                cy.get('[data-element="sub-view-regions"]').click();
        
                // Open the country
                cy.get(`.umb-table-body__link[title="${region.name}"]`).click();

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
                cy.get('[data-element="editor-name-field"]').should('have.value', countryName);

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
                cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

                // Open region context menu
                cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Countries"]).click();
        
                // Open the country
                cy.get(`.umb-table-body__link[title="${countryName}"]`).click();
        
                // Got to regions content app
                cy.get('[data-element="sub-view-regions"]').click();

                // Select the row to delete
                cy.get('.umb-table-body__link').contains(region.name)
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

                // Check there are now no region results
                cy.get(".umb-empty-state").should('be.visible');
                
            })
        });

    });

});