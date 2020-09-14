context('Countries', () => {

    beforeEach(() => {
        cy.task('app:seed', 'clean');
        cy.task('app:clearCache');
        cy.umbracoLogin(Cypress.env('username'), Cypress.env('password'));
    });

    it('can create a country', () => {

        

    });

    it('can create a countries from preset', () => {

        

    });

    it('can create all countries', () => {

        

    });

    it('can delete a country', () => {

        

    });

});