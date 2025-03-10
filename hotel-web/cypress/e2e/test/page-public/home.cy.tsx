describe('Page d\'accueil', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('devrait afficher le titre principal', () => {
        // Vérifiez si le titre principal est affiché
        cy.get('h2').contains('Profitez d\'un séjour inoubliable dans notre hôtel de luxe.').should('be.visible');
    });

    it('devrait afficher la description', () => {
        // Vérifiez si la description est affichée
        cy.get('p').contains('Découvrez un cadre exceptionnel avec des services haut de gamme pour un confort absolu.').should('be.visible');
    });

    it('devrait afficher le bouton "Réserver maintenant"', () => {
        cy.get('a').contains('Réserver maintenant').should('be.visible').and('have.attr', 'href').and('include', '#');
    });

});
