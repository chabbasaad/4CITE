describe('Tests du composant HotelList', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/hotels', {
            statusCode: 200,
            body: {
                data: [
                    {
                        id: 1,
                        name: 'Hotel A',
                        location: 'Paris',
                        description: 'Hôtel confortable',
                        picture_list: ['https://example.com/image.jpg'],
                        price_per_night: 100
                    },
                    {
                        id: 2,
                        name: 'Hotel B',
                        location: 'Lyon',
                        description: 'Hôtel de luxe',
                        picture_list: ['https://example.com/image2.jpg'],
                        price_per_night: 200
                    }
                ]
            }
        }).as('fetchHotels');

        cy.visit('/');
    });

    it('devrait afficher un message de chargement pendant que les hôtels se chargent', () => {
        cy.contains('Chargement en cours...').should('exist');
        cy.wait('@fetchHotels');
        cy.contains('Chargement en cours...').should('not.exist');
    });

    it('devrait afficher une liste d\'hôtels lorsque les données sont chargées', () => {
        cy.wait('@fetchHotels');
        cy.get('.group').should('have.length', 2);
        cy.contains('Hotel A').should('exist');
        cy.contains('Hotel B').should('exist');
        cy.contains('Paris').should('exist');
        cy.contains('Lyon').should('exist');
        cy.contains('100.00').should('exist');
        cy.contains('200.00').should('exist');
    });

    it('devrait naviguer vers la page de détail de l\'hôtel lorsqu\'on clique sur un hôtel', () => {
        cy.wait('@fetchHotels');
        cy.get('.group').first().click();
        cy.url().should('include', '/hotel/1');
    });
});
