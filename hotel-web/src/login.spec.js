describe('Tests de connexion', () => {
    it('Devrait se connecter avec des identifiants valides', () => {
        cy.visit('https://ton-site-web.com/login'); // Accéder à la page de connexion

        // Saisir un email et un mot de passe
        cy.get('input[name="email"]').type('utilisateur@example.com');  // Saisie de l'email
        cy.get('input[name="password"]').type('motdepassevalide');      // Saisie du mot de passe

        // Cliquer sur le bouton de connexion
        cy.get('button[type="submit"]').click();

        // Vérifier qu'on est redirigé vers la page d'accueil (ou autre page)
        cy.url().should('include', '/home');  // Vérifier l'URL

        // Vérifier si un message de bienvenue ou un élément de la page est visible
        cy.contains('Bienvenue').should('be.visible');
    });
});
