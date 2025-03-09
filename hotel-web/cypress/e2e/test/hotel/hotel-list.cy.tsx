describe('Tests du composant HotelList', () => {
    beforeEach(() => {
        // Intercepter la requête API et répondre avec des hôtels mockés
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
        // Vérifie que le message de chargement est bien affiché
        cy.contains('Chargement en cours...').should('exist');

        // Attends la réponse de l'API mockée
        cy.wait('@fetchHotels');

        // Vérifie que le message de chargement disparaît
        cy.contains('Chargement en cours...').should('not.exist');
    });


    it('devrait afficher une liste d\'hôtels lorsque les données sont chargées', () => {
        cy.wait('@fetchHotels'); // Attends que les hôtels soient chargés

        // Vérifie qu'il y a bien 2 hôtels affichés
        cy.get('.group').should('have.length', 2);

        // Vérifie les informations affichées
        cy.contains('Hotel A').should('exist');
        cy.contains('Hotel B').should('exist');
        cy.contains('Paris').should('exist');
        cy.contains('Lyon').should('exist');
        cy.contains('100.00').should('exist');
        cy.contains('200.00').should('exist');
    });

    it('devrait naviguer vers la page de détail de l\'hôtel lorsqu\'on clique sur un hôtel', () => {
        cy.wait('@fetchHotels');

        // Cliquer sur le premier hôtel
        cy.get('.group').first().click();

        // Vérifie la navigation
        cy.url().should('include', '/hotel/1');
    });

    it('devrait afficher un message d\'erreur si une erreur se produit lors du chargement des hôtels', () => {
        // Simuler une erreur serveur (500)
        cy.intercept('GET', '/api/hotels', {
            statusCode: 500,
            body: { message: 'Erreur serveur' }
        }).as('fetchErrorHotels');

        cy.reload();
        cy.wait('@fetchErrorHotels');

        cy.get('.Toastie').contains('Une erreur est survenue').should('exist');
    });
});
