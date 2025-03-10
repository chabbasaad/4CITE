describe('Composant Header', () => {
    beforeEach(() => {
        cy.viewport(1280, 720);  // Taille de l'écran pour le test

        // Pour tester un utilisateur avec rôle "admin"
        cy.window().then((win) => {
            win.localStorage.setItem("user_token", "21|QewzsvcnTlj5JswbjiOl5SGeFJKXLfhx6qcVR0zjc5c0d026");
            win.localStorage.setItem("user_data", JSON.stringify({
                id: 16,
                name: "Hamza",
                pseudo: "Hamza",
                email: "hamza@hamza.com",
                role: "admin",  // Rôle "admin"
                email_verified_at: null,
                created_at: "2025-03-07T22:05:58.000000Z",
                updated_at: "2025-03-07T22:05:58.000000Z",
                deleted_at: null
            }));
        });

        cy.visit('/');  // Charge la page d'accueil
    });

    it('Affiche les liens Admin pour un utilisateur avec rôle "admin"', () => {
        // Vérifie les liens qui sont visibles pour un utilisateur "admin"
        cy.contains('Accueil').should('be.visible');
        cy.contains('Nous').should('be.visible');
        cy.contains('Hotel').should('be.visible');
        cy.contains('Gestion User').should('be.visible');
        cy.contains('Gestion Hotel').should('be.visible');
        cy.contains('Gestion Reservation').should('be.visible');
    });

    it('Affiche les liens utilisateur pour un utilisateur avec rôle "user"', () => {
        // Simule un utilisateur avec rôle "user"
        cy.window().then((win) => {
            win.localStorage.setItem("user_token", "21|QewzsvcnTlj5JswbjiOl5SGeFJKXLfhx6qcVR0zjc5c0d026");
            win.localStorage.setItem("user_data", JSON.stringify({
                id: 16,
                name: "Hamza",
                pseudo: "Hamza",
                email: "hamza@hamza.com",
                role: "user",  // Rôle "user"
                email_verified_at: null,
                created_at: "2025-03-07T22:05:58.000000Z",
                updated_at: "2025-03-07T22:05:58.000000Z",
                deleted_at: null
            }));
        });

        cy.reload();  // Recharger la page avec la nouvelle session

        // Vérifie que les liens spécifiques à l'admin ne sont pas visibles
        cy.contains('Gestion User').should('not.exist');
        cy.contains('Gestion Hotel').should('not.exist');
        cy.contains('Gestion Reservation').should('not.exist');

        // Vérifie que les liens de base sont toujours présents
        cy.contains('Accueil').should('be.visible');
        cy.contains('Nous').should('be.visible');
        cy.contains('Hotel').should('be.visible');
    });

    it('Ouvre et ferme les modales de connexion et d\'inscription en cliquant à l\'extérieur', () => {
        // Efface le localStorage pour simuler une session utilisateur non authentifiée
        cy.window().then((win) => {
            win.localStorage.clear();
        });
        cy.reload();

        // Ouvre la modale de connexion
        cy.contains('Connexion').click();
        // Vérifie que la modale est visible
        cy.get('div[role="dialog"]').should('be.visible');
        // Clique à l'extérieur de la modale pour la fermer
        cy.get('body').click(0, 0);
        // Vérifie que la modale est fermée
        cy.get('div[role="dialog"]').should('not.exist');

        // Ouvre la modale d'inscription
        cy.contains('Inscription').click();
        // Vérifie que la modale est visible
        cy.get('div[role="dialog"]').should('be.visible');
        // Clique à l'extérieur de la modale pour la fermer
        cy.get('body').click(0, 0);
        // Vérifie que la modale est fermée
        cy.get('div[role="dialog"]').should('not.exist');
    });

    describe('Composant Header', () => {
        beforeEach(() => {
            cy.viewport(1280, 720);  // Taille de l'écran pour le test

            // Pour simuler un visiteur (sans localStorage)
            cy.window().then((win) => {
                win.localStorage.clear(); // Efface le localStorage pour simuler l'absence de connexion
            });

            cy.visit('/');  // Charge la page d'accueil
        });

        it('Affiche uniquement les liens accessibles pour un visiteur', () => {
            // Vérifie que les liens de base sont visibles pour un visiteur
            cy.contains('Accueil').should('be.visible');
            cy.contains('Nous').should('be.visible');
            cy.contains('Hotel').should('be.visible');

            // Vérifie que les liens réservés aux administrateurs ou aux utilisateurs connectés ne sont pas visibles
            cy.contains('Gestion User').should('not.exist');
            cy.contains('Gestion Hotel').should('not.exist');
            cy.contains('Gestion Reservation').should('not.exist');
        });

        it('Ouvre et ferme les modales de connexion et d\'inscription en cliquant à l\'extérieur', () => {
            // Ouvre la modale de connexion
            cy.contains('Connexion').click();
            // Vérifie que la modale est visible
            cy.get('div[role="dialog"]').should('be.visible');
            // Clique à l'extérieur de la modale pour la fermer
            cy.get('body').click(0, 0);
            // Vérifie que la modale est fermée
            cy.get('div[role="dialog"]').should('not.exist');

            // Ouvre la modale d'inscription
            cy.contains('Inscription').click();
            // Vérifie que la modale est visible
            cy.get('div[role="dialog"]').should('be.visible');
            // Clique à l'extérieur de la modale pour la fermer
            cy.get('body').click(0, 0);
            // Vérifie que la modale est fermée
            cy.get('div[role="dialog"]').should('not.exist');
        });
    });

});
