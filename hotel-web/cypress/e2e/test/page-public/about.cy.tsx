describe('Page À propos', () => {
    beforeEach(() => {
        cy.visit('/nous');
    });

    it('devrait charger correctement les images', () => {
        cy.get('img[alt="Chambre de luxe"]').should('be.visible').and('have.attr', 'src').should('not.be.empty');
        cy.get('img[alt="Hall d\'entrée"]').should('be.visible').and('have.attr', 'src').should('not.be.empty');
        cy.get('img[alt="Piscine"]').should('be.visible').and('have.attr', 'src').should('not.be.empty');
        cy.get('img[alt="Restaurant"]').should('be.visible').and('have.attr', 'src').should('not.be.empty');
    });

    it('devrait charger correctement la page À propos', () => {
        cy.get('h1').contains('Un séjour luxueux pour chaque invité').should('be.visible');

        cy.get('p').contains('Situé au cœur de la ville, notre hôtel offre un mélange parfait de confort et d\'élégance').should('be.visible');

        cy.get('img[alt="Chambre de luxe"]').should('be.visible');
        cy.get('img[alt="Hall d\'entrée"]').should('be.visible');
        cy.get('img[alt="Piscine"]').should('be.visible');
        cy.get('img[alt="Restaurant"]').should('be.visible');
    });

    it('devrait contenir des sections clés', () => {
        cy.contains('Notre mission').should('be.visible');

        cy.get('p').contains('Notre mission est de fournir à chaque client un séjour relaxant et mémorable.').should('be.visible');

        cy.contains('Nos principaux atouts').should('be.visible');
    });

    it('devrait afficher les statistiques clés sur l\'hôtel', () => {
        cy.get('dt').contains('Chambres de luxe').siblings('dd').contains('200+').should('be.visible');

        cy.get('dt').contains('Piscines').siblings('dd').contains('3').should('be.visible');

        cy.get('dt').contains('Restaurants').siblings('dd').contains('4').should('be.visible');

        cy.get('dt').contains('Spa & Bien-être').siblings('dd').contains('1').should('be.visible');
    });

    it('devrait afficher la déclaration de mission correcte et le message de durabilité', () => {
        cy.contains('Notre mission est de fournir à chaque client un séjour relaxant et mémorable').should('be.visible');

        cy.contains('Nous croyons en la durabilité et en des pratiques respectueuses de l\'environnement').should('be.visible');
    });

    it('ne devrait pas contenir de déclarations de mission incorrectes', () => {
        cy.contains('Notre mission est de fournir un service rapide').should('not.exist');
        cy.contains('Nous ne croyons pas en la durabilité').should('not.exist');
    });

    it('ne devrait pas contenir de statistiques obsolètes', () => {
        cy.get('dt').contains('Chambres de luxe').siblings('dd').should('not.contain', '100');  // Vérifier une valeur obsolète
        cy.get('dt').contains('Piscines').siblings('dd').should('not.contain', '2');  // Vérifier une valeur obsolète
        cy.get('dt').contains('Restaurants').siblings('dd').should('not.contain', '2');  // Vérifier une valeur obsolète
        cy.get('dt').contains('Spa & Bien-être').siblings('dd').should('not.contain', '0');  // Vérifier une valeur obsolète
    });

    it('ne devrait pas contenir d\'images cassées', () => {
        cy.get('img[alt="Chambre de luxe"]').should('have.attr', 'src').and('not.match', /404/);
        cy.get('img[alt="Hall d\'entrée"]').should('have.attr', 'src').and('not.match', /404/);
        cy.get('img[alt="Piscine"]').should('have.attr', 'src').and('not.match', /404/);
        cy.get('img[alt="Restaurant"]').should('have.attr', 'src').and('not.match', /404/);
    });
});
