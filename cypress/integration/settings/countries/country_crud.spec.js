context('Countries', () => {

    let storeId;
    let storeName;
    let currencyId;
    let currencyName;
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
                cy.umbracoApiRequest(`/umbraco/backoffice/vendr/Currency/GetCurrencies?storeId=${storeId}`, "GET").then(result => {
                    currencyId = result[0].id;
                    currencyName = result[0].name;
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

    it('can list countries', () => {

        // Create the country from fixture data
        cy.fixture('test-country').then(data => {
            data.storeId = storeId;
            data.defaultCurrencyId = currencyId;
            data.defaultPaymentMethodId = paymentMethodId;
            data.defaultShippingMethodId = shippingMethodId;
            data.path[2] = storeId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Country/SaveCountry", "POST", data).then(country => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

                // Open country context menu
                cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Countries"]).click();

                // Ensure a row for the country exists
                cy.get('.umb-table-body__link').contains(country.name);

            })
        });

    });

    it('can create a country', () => {

        const name = "Test Country";
        const code = "TS";

        // Got to settings section
        cy.umbracoSection('settings');
        cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

        // Create country
        cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Countries"]).rightclick();
        cy.umbracoContextMenuAction("action-create").click();
        cy.get('.umb-action-link').contains("New blank country").click();

        // Give the country a name
        cy.get('[data-element="editor-name-field"]').type(name);

        // Give the country a code
        cy.get('.umb-property[label="ISO Code"] input').type(code);

        // Select defaults
        cy.get('.umb-property[label="Default Currency"] select').select(currencyName);
        cy.get('.umb-property[label="Default Shipping Method"] select').select(shippingMethodName);
        cy.get('.umb-property[label="Default Payment Method"] select').select(paymentMethodName);

        // Submit the form
        cy.get('.btn-success').click();

        // Ensure the success notification shows
        cy.umbracoSuccessNotification().should('be.visible');

        // Error message shouldn't be displayed
        cy.get('.umb-notifications__notifications > .alert-error').should('not.be.visible');

    });

    it('can create a country from preset', () => {

        // Got to settings section
        cy.umbracoSection('settings');
        cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

        // Create country
        cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Countries"]).rightclick();
        cy.umbracoContextMenuAction("action-create").click();
        cy.get('.umb-action-link').contains("New country from IS0 3166 preset").click();

        // Select the preset
        cy.get('.umb-action-link').contains("United States of America").click();

        // Ensure name + code were set
        cy.get('[data-element="editor-name-field"]').should("have.value", "United States of America");
        cy.get('.umb-property[label="ISO Code"] input').should("have.value", "US");

        // Select defaults
        cy.get('.umb-property[label="Default Currency"] select').select(currencyName);
        cy.get('.umb-property[label="Default Shipping Method"] select').select(shippingMethodName);
        cy.get('.umb-property[label="Default Payment Method"] select').select(paymentMethodName);

        // Submit the form
        cy.get('.btn-success').click();

        // Ensure the success notification shows
        cy.umbracoSuccessNotification().should('be.visible');

        // Error message shouldn't be displayed
        cy.get('.umb-notifications__notifications > .alert-error').should('not.be.visible');

        // Got to regions content app
        cy.get('[data-element="sub-view-regions"]').click();

        // Should have a list of US regions
        cy.get('.umb-table-body__link').should('have.length', 51);

        // Sample some regions
        cy.get('.umb-table-body__link[title="Alabama"]');
        cy.get('.umb-table-body__link[title="Montana"]');
        cy.get('.umb-table-body__link[title="Wyoming"]');

    });

    it('can create all countries from presets', () => {

        // Got to settings section
        cy.umbracoSection('settings');
        cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

        // Create country
        cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Countries"]).rightclick();
        cy.umbracoContextMenuAction("action-create").click();
        cy.get('.umb-action-link').contains("All countries from IS0 3166 presets").click();

        // Confirm the action
        cy.get('.btn-success').contains("OK").click();

        // Ensure the success notification shows
        cy.umbracoSuccessNotification().should('be.visible');

        // Go to the countries list
        cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Countries"]).click();

        // Should have a list of countries
        cy.get('.umb-table-body__link').should('have.length', 249);

        // Sample some countries
        cy.get('.umb-table-body__link[title="United Kingdom"]');
        cy.get('.umb-table-body__link[title="Denmark"]');
        cy.get('.umb-table-body__link[title="Bhutan"]');
        cy.get('.umb-table-body__link[title="Zimbabwe"]');

        // Ensure US regions were created
        cy.get('.umb-table-body__link[title="United States of America"]').click();

        // Got to regions content app
        cy.get('[data-element="sub-view-regions"]').click();

        // Should have a list of US regions
        cy.get('.umb-table-body__link').should('have.length', 51);

        // Sample some regions
        cy.get('.umb-table-body__link[title="Alabama"]');
        cy.get('.umb-table-body__link[title="Montana"]');
        cy.get('.umb-table-body__link[title="Wyoming"]');

    });

    it('can delete a country via action menu', () => {

        // Create the country from fixture data
        cy.fixture('test-country').then(data => {
            data.storeId = storeId;
            data.defaultCurrencyId = currencyId;
            data.defaultPaymentMethodId = paymentMethodId;
            data.defaultShippingMethodId = shippingMethodId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Country/SaveCountry", "POST", data).then(country => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

                // Open country context menu
                cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Countries"]).click();

                // Open the country
                cy.get(".umb-table-body__link").contains(country.name).click();

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
                cy.get(".umb-panel-header-name").contains('Countries');

                // Check the node has gone from the list view
                cy.get(".umb-table-body__link").contains(country.name).should('not.exist');
                
            })
        });

    });

    it('can delete country via bulk action', () => {

        // Create the country from fixture data
        cy.fixture('test-country').then(data => {
            data.storeId = storeId;
            data.defaultCurrencyId = currencyId;
            data.defaultPaymentMethodId = paymentMethodId;
            data.defaultShippingMethodId = shippingMethodId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Country/SaveCountry", "POST", data).then(country => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.get('li .umb-tree-root:contains("Commerce")').should("be.visible");

                // Open country context menu
                cy.umbracoTreeItem("settings", ["Vendr", "Stores", storeName, "Countries"]).click();

                // Select the row to delete
                cy.get('.umb-table-body__link').contains(country.name)
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
                cy.get(".umb-table-body__link").contains(country.name).should('not.exist');
                
            })
        });

    });

    // There was a bug where deleting a country would resave it due to a series of connected domain events
    // and thus it would save over the deletedTimestamp column, preventing the country name from being
    // reused. An update was made in 1.3 to resolve this, but we keep a test to make sure that countries 
    // can continue to be removed and re-created.
    it('can create a country with the ISO Code of a deleted country', () => {

        // Create the country from fixture data
        cy.fixture('test-country').then(data => {
            data.storeId = storeId;
            data.defaultCurrencyId = currencyId;
            data.defaultPaymentMethodId = paymentMethodId;
            data.defaultShippingMethodId = shippingMethodId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/Country/SaveCountry", "POST", data).then(country => {
                cy.umbracoApiRequest(`/umbraco/backoffice/vendr/Country/DeleteCountry?countryId=${country.id}`, "DELETE").then(() => {
                    cy.umbracoApiRequest("/umbraco/backoffice/vendr/Country/SaveCountry", "POST", data);
                });
            })
        });

    });

});