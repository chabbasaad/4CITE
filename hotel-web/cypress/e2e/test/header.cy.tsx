describe('Header Component', () => {
    beforeEach(() => {
        cy.viewport(1280, 720);

        // Mock localStorage
        cy.window().then((win) => {
            win.localStorage.setItem("user_token", "21|QewzsvcnTlj5JswbjiOl5SGeFJKXLfhx6qcVR0zjc5c0d026");
            win.localStorage.setItem("user_data", JSON.stringify({
                id: 16,
                name: "Hamza",
                pseudo: "Hamza",
                email: "hamza@hamza.com",
                role: "admin",
                email_verified_at: null,
                created_at: "2025-03-07T22:05:58.000000Z",
                updated_at: "2025-03-07T22:05:58.000000Z",
                deleted_at: null
            }));
        });

        cy.visit('/');
    });

    it('Affiche le menu avec les liens Admin', () => {
        cy.contains('Accueil').should('be.visible');
        cy.contains('Nous').should('be.visible');
        cy.contains('Hotel').should('be.visible');
        cy.contains('Gestion User').should('be.visible');
        cy.contains('Gestion Hotel').should('be.visible');
        cy.contains('Gestion Reservation').should('be.visible');
    });


    it('Ouvre et ferme les modales de connexion et dinscription', () => {
    cy.window().then((win) => {
        win.localStorage.clear();
    });
    cy.reload();

    cy.contains('Connexion').click();
    cy.get('div[role="dialog"]').should('be.visible');
    cy.get('button').contains('Fermer').click();
    cy.get('div[role="dialog"]').should('not.exist');

    cy.contains('Inscription').click();
    cy.get('div[role="dialog"]').should('be.visible');
    cy.get('button').contains('Fermer').click();
    cy.get('div[role="dialog"]').should('not.exist');
});
});
