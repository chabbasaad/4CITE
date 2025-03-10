describe('Tests du composant HotelListFilter', () => {
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
                        price_per_night: 100,
                        is_available: true
                    },
                    {
                        id: 2,
                        name: 'Hotel B',
                        location: 'Lyon',
                        description: 'Hôtel de luxe',
                        picture_list: ['https://example.com/image2.jpg'],
                        price_per_night: 200,
                        is_available: false
                    }
                ]
            }
        }).as('fetchHotels');

        cy.visit('/hotel');  // Assurez-vous de visiter la page où le composant est monté.
    });

    it('devrait charger et afficher les hôtels après la récupération des données', () => {
        cy.wait('@fetchHotels');
        cy.contains('Hotel A').should('exist');
        cy.contains('Hotel B').should('exist');
        cy.contains('Paris').should('exist');
        cy.contains('Lyon').should('exist');
    });

    it('devrait appliquer le filtre de recherche par nom d\'hôtel', () => {
        cy.wait('@fetchHotels');

        cy.get('input[name="search"]').type('Hotel A');
        cy.get('.group').should('have.length', 1);
        cy.contains('Hotel A').should('exist');
        cy.contains('Hotel B').should('not.exist');
    });

    it('devrait appliquer le filtre par localisation', () => {
        cy.wait('@fetchHotels');

        cy.get('input[name="location"]').type('Lyon');
        cy.get('.group').should('have.length', 1);
        cy.contains('Hotel B').should('exist');
        cy.contains('Hotel A').should('not.exist');
    });

    it('devrait appliquer les filtres de prix', () => {
        cy.wait('@fetchHotels');

        cy.get('input[name="min_price"]').type('150');
        cy.get('input[name="max_price"]').type('250');

        cy.get('.group').should('have.length', 1);
        cy.contains('Hotel B').should('exist');
        cy.contains('Hotel A').should('not.exist');
    });

    it('devrait appliquer le filtre de disponibilité', () => {
        cy.wait('@fetchHotels');

        cy.get('select[name="available"]').select('true');
        cy.get('.group').should('have.length', 1);
        cy.contains('Hotel A').should('exist');
        cy.contains('Hotel B').should('not.exist');
    });

    it('devrait trier les hôtels par prix de manière croissante', () => {
        cy.wait('@fetchHotels');

        cy.get('select[name="sort_by"]').select('price_per_night');
        cy.get('select[name="direction"]').select('asc');

        cy.get('.group').first().contains('Hotel A');
        cy.get('.group').eq(1).contains('Hotel B');
    });

    it('devrait trier les hôtels par prix de manière décroissante', () => {
        cy.wait('@fetchHotels');

        cy.get('select[name="sort_by"]').select('price_per_night');
        cy.get('select[name="direction"]').select('desc');

        cy.get('.group').first().contains('Hotel B');
        cy.get('.group').eq(1).contains('Hotel A');
    });

    it('devrait réinitialiser tous les filtres en cliquant sur le bouton "Réinitialiser"', () => {
        cy.wait('@fetchHotels');

        // Appliquer des filtres
        cy.get('input[name="search"]').type('Hotel A');
        cy.get('input[name="location"]').type('Paris');

        // Cliquer sur "Réinitialiser"
        cy.contains('Réinitialiser').click();

        // Vérifier que les filtres sont réinitialisés
        cy.get('input[name="search"]').should('have.value', '');
        cy.get('input[name="location"]').should('have.value', '');
        cy.get('.group').should('have.length', 2);  // Les deux hôtels doivent être affichés
    });


    it('devrait naviguer vers la page de détail d\'un hôtel lorsqu\'on clique sur un hôtel', () => {
        cy.wait('@fetchHotels');

        cy.get('.group').first().click();
        cy.url().should('include', '/hotel/1');
    });

    it('devrait afficher le message "Aucun hôtel ne correspond aux filtres sélectionnés" si aucun hôtel n\'est trouvé', () => {
        cy.wait('@fetchHotels');

        cy.get('input[name="search"]').type('Hotel C');  // Aucun hôtel avec ce nom
        cy.get('.group').should('have.length', 0);
        cy.contains('Aucun hôtel ne correspond aux filtres sélectionnés.').should('exist');
    });
});
