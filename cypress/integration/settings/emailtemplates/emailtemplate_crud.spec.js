context('Email Templates', () => {

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


    it('can list email templates', () => {

        // Create the email template from fixture data
        cy.fixture('test-email-template').then(data => {
            data.storeId = storeId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/EmailTemplate/SaveEmailTemplate", "POST", data).then(orderStatus => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.umbracoTreeRoot('Commerce').should("be.visible");

                // Open email template context menu
                cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Email Templates"]).click();

                // Ensure a row for the email template exists
                cy.umbracoListViewLink(orderStatus.name);

            })
        });

    });

    it('can create an email template', () => {

        cy.server();
        cy.route('/umbraco/backoffice/UmbracoApi/Entity/GetSafeAlias?*').as('getSafeAlias');

        const name = "Test Email Template";
        const alias = "testEmailTemplate";

        // Got to settings section
        cy.umbracoSection('settings');
        cy.umbracoTreeRoot('Commerce').should("be.visible");

        // Create email template
        cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Email Templates"]).rightclick();
        cy.umbracoContextMenuAction("action-create").click();

        // Give the email template a name
        cy.umbracoEditorNameField().type(name);

        // Wait for an alias to come back
        cy.wait('@getSafeAlias');

        // Validate the email template alias
        cy.get('.umb-locked-field__input').should('have.value', alias);

        // Select properties
        cy.umbracoProperty('Category').find('select').select("Custom");
        cy.umbracoProperty('Subject Line').find('input').type("Test Email");
        cy.umbracoProperty('Sender Name').find('input').type("Vendr");
        cy.umbracoProperty('Sender Address').find('input').type("noreply@vendr.net");
        cy.umbracoProperty('Template View').find('input').type("~/views/emails/test-email.cshtml");

        // Submit the form
        cy.get('.btn-success').click();

        // Ensure the success notification shows
        cy.umbracoSuccessNotification().should('be.visible');

        // Error message shouldn't be displayed
        cy.umbracoErrorNotification().should('not.be.visible');

    });

    it('can delete an email template via action menu', () => {

        // Create the email template from fixture data
        cy.fixture('test-email-template').then(data => {
            data.storeId = storeId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/EmailTemplate/SaveEmailTemplate", "POST", data).then(orderStatus => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.umbracoTreeRoot('Commerce').should("be.visible");

                // Open email template context menu
                cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Email Templates"]).click();

                // Open the email template
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
                cy.umbracoErrorNotification().should('not.be.visible');

                // Check we are directed back to list view
                cy.umbracoEditorName().contains('Email Templates');

                // Check the node has gone from the list view
                cy.umbracoListViewLink(orderStatus.name).should('not.exist');
                
            })
        });

    });

    it.only('can delete an email template via bulk action', () => {

        // Create the email template from fixture data
        cy.fixture('test-email-template').then(data => {
            data.storeId = storeId;
            cy.umbracoApiRequest("/umbraco/backoffice/vendr/EmailTemplate/SaveEmailTemplate", "POST", data).then(orderStatus => {

                // Got to settings section
                cy.umbracoSection('settings');
                cy.umbracoTreeRoot('Commerce').should("be.visible");

                // Open email template context menu
                cy.umbracoTreeItemByPath('settings', ["Vendr", "Stores", storeName, "Email Templates"]).click();

                // Select the row to delete
                cy.umbracoListViewRow(orderStatus.name).click();

                // Click the delete bulk action
                cy.umbracoBulkActionButton('Delete').click();

                // Click OK to confirm deletion
                cy.umbracoButtonByLabelKey("general_yes").click();

                // Notification message should display
                cy.umbracoSuccessNotification().should('be.visible');

                // Error message shouldn't be displayed
                cy.umbracoErrorNotification().should('not.be.visible');

                // Check the node has gone from the list view
                cy.umbracoListViewLink(orderStatus.name).should('not.exist');
                
            })
        });

    });

});