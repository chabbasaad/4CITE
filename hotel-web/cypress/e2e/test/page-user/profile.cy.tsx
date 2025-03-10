describe('Page de profil utilisateur', () => {
    beforeEach(() => {
        cy.window().then((win) => {
            const user = {
                id: 1,
                name: "Test User",
                pseudo: "TestPseudonym",
                email: "testuser@example.com",
                role: "user"
            };
            const token = "5|PQuqWInMtUB4LBxHRquxSavVmeIjo8GdSR17uZ19de91939d";
            win.localStorage.setItem("user_token", token);
            win.localStorage.setItem("user_data", JSON.stringify(user));
        });

        cy.visit('/profile');
    });

    it('Affiche les informations de l\'utilisateur', () => {
        cy.contains("Test User").should('be.visible');
        cy.contains("TestPseudonym").should('be.visible');
        cy.contains("testuser@example.com").should('be.visible');
    });
});

describe('Modification du profil utilisateur', () => {
    beforeEach(() => {
        cy.window().then((win) => {
            const user = {
                id: 1,
                name: "Test User",
                pseudo: "TestPseudonym",
                email: "testuser@example.com",
                role: "user"
            };
            const token = "static_user_token_123456";
            win.localStorage.setItem("user_token", token);
            win.localStorage.setItem("user_data", JSON.stringify(user));
        });

        cy.visit('/profile');
    });

    it('Peut entrer en mode édition et sauvegarder les modifications', () => {
        cy.contains('Modifier').click();
        cy.get('input[name="name"]').should('be.visible').clear().type('Nouveau Nom');
        cy.get('input[name="email"]').should('be.visible').clear().type('newemail@example.com');
        cy.contains('Sauvegarder').click();
    });
});

describe('Réservations utilisateur', () => {
    beforeEach(() => {
        cy.window().then((win) => {
            const user = {
                id: 1,
                name: "Test User",
                pseudo: "TestPseudonym",
                email: "testuser@example.com",
                role: "user"
            };
            const token = "static_user_token_123456";
            win.localStorage.setItem("user_token", token);
            win.localStorage.setItem("user_data", JSON.stringify(user));
        });

        cy.intercept('GET', 'api/bookings', {
            statusCode: 200,
            body: {
                data: [
                    {
                        id: 1,
                        user_id: 1,
                        hotel_id: 101,
                        check_in_date: '2025-03-10',
                        check_out_date: '2025-03-15',
                        guests_count: 2,
                        status: 'confirmed',
                        special_requests: 'None',
                        guest_names: ['John Doe', 'Jane Doe'],
                        contact_phone: '1234567890',
                        total_price: 500.00,
                        created_at: '2025-03-01',
                        updated_at: '2025-03-01'
                    },
                    {
                        id: 2,
                        user_id: 2,
                        hotel_id: 102,
                        check_in_date: '2025-04-01',
                        check_out_date: '2025-04-07',
                        guests_count: 1,
                        status: 'pending',
                        special_requests: 'Extra towels',
                        guest_names: ['Alice Smith'],
                        contact_phone: '9876543210',
                        total_price: 750.00,
                        created_at: '2025-03-01',
                        updated_at: '2025-03-01'
                    }
                ]
            }
        }).as('fetchBookings');


        cy.visit('/profile');
    });

    it('Affiche correctement les réservations utilisateur', () => {
        cy.contains('Profile').should('be.visible');
        cy.contains('Reservation').click();
        cy.wait('@fetchBookings');
        cy.contains('Vos Réservations').should('be.visible');
        cy.contains('Aucune réservation à afficher pour le moment').should('not.exist');
        cy.contains('500').should('be.visible');
        cy.contains('123456789').should('be.visible');
        cy.contains('750').should('be.visible');
        cy.contains('987654321').should('be.visible');
    });
});

describe('Navigation dans le profil', () => {
    beforeEach(() => {
        cy.window().then((win) => {
            const user = {
                id: 1,
                name: "Test User",
                pseudo: "TestPseudonym",
                email: "testuser@example.com",
                role: "user"
            };
            const token = "static_user_token_123456";
            win.localStorage.setItem("user_token", token);
            win.localStorage.setItem("user_data", JSON.stringify(user));
        });

        cy.visit('/profile');
    });

    it('Navigue entre les sections "General" et "Reservation"', () => {
        cy.contains('Profile').should('be.visible');
        cy.contains('Reservation').click();
        cy.contains('Vos Réservations').should('be.visible');
    });
});
