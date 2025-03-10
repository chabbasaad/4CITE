describe('Composant Header', () => {
    beforeEach(() => {
        cy.viewport(1280, 720);

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

    it('Affiche les liens Admin pour un utilisateur avec rôle "admin"', () => {
        cy.contains('Accueil').should('be.visible');
        cy.contains('Nous').should('be.visible');
        cy.contains('Hotel').should('be.visible');
        cy.contains('Gestion User').should('be.visible');
        cy.contains('Gestion Hotel').should('be.visible');
        cy.contains('Gestion Reservation').should('be.visible');
    });

    it('Affiche les liens utilisateur pour un utilisateur avec rôle "user"', () => {
        cy.window().then((win) => {
            win.localStorage.setItem("user_token", "21|QewzsvcnTlj5JswbjiOl5SGeFJKXLfhx6qcVR0zjc5c0d026");
            win.localStorage.setItem("user_data", JSON.stringify({
                id: 16,
                name: "Hamza",
                pseudo: "Hamza",
                email: "hamza@hamza.com",
                role: "user",
                email_verified_at: null,
                created_at: "2025-03-07T22:05:58.000000Z",
                updated_at: "2025-03-07T22:05:58.000000Z",
                deleted_at: null
            }));
        });

        cy.reload();

        cy.contains('Gestion User').should('not.exist');
        cy.contains('Gestion Hotel').should('not.exist');
        cy.contains('Gestion Reservation').should('not.exist');
        cy.contains('Accueil').should('be.visible');
        cy.contains('Nous').should('be.visible');
        cy.contains('Hotel').should('be.visible');
    });

    it('Ouvre et ferme les modales de connexion et d\'inscription en cliquant à l\'extérieur', () => {
        cy.window().then((win) => {
            win.localStorage.clear();
        });
        cy.reload();

        cy.contains('Connexion').click();
        cy.get('div[role="dialog"]').should('be.visible');
        cy.get('body').click(0, 0);
        cy.get('div[role="dialog"]').should('not.exist');

        cy.contains('Inscription').click();
        cy.get('div[role="dialog"]').should('be.visible');
        cy.get('body').click(0, 0);
        cy.get('div[role="dialog"]').should('not.exist');
    });
});

describe('Composant Header (Visiteur)', () => {
    beforeEach(() => {
        cy.viewport(1280, 720);

        cy.window().then((win) => {
            win.localStorage.clear();
        });

        cy.visit('/');
    });

    it('Affiche uniquement les liens accessibles pour un visiteur', () => {
        cy.contains('Accueil').should('be.visible');
        cy.contains('Nous').should('be.visible');
        cy.contains('Hotel').should('be.visible');
        cy.contains('Gestion User').should('not.exist');
        cy.contains('Gestion Hotel').should('not.exist');
        cy.contains('Gestion Reservation').should('not.exist');
    });

    it('Ouvre et ferme les modales de connexion et d\'inscription en cliquant à l\'extérieur', () => {
        cy.contains('Connexion').click();
        cy.get('div[role="dialog"]').should('be.visible');
        cy.get('body').click(0, 0);
        cy.get('div[role="dialog"]').should('not.exist');

        cy.contains('Inscription').click();
        cy.get('div[role="dialog"]').should('be.visible');
        cy.get('body').click(0, 0);
        cy.get('div[role="dialog"]').should('not.exist');
    });
});
