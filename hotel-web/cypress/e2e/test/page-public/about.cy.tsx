describe('About Page', () => {
    beforeEach(() => {
        // Visit the About page (assuming it's hosted locally or on a staging environment)
        cy.visit('/nous');
    });

    it('should load images correctly', () => {
        cy.get('img[alt="Chambre de luxe"]').should('be.visible').and('have.attr', 'src').should('not.be.empty');
        cy.get('img[alt="Hall d\'entrée"]').should('be.visible').and('have.attr', 'src').should('not.be.empty');
        cy.get('img[alt="Piscine"]').should('be.visible').and('have.attr', 'src').should('not.be.empty');
        cy.get('img[alt="Restaurant"]').should('be.visible').and('have.attr', 'src').should('not.be.empty');
    });

    it('should load the About page correctly', () => {
        cy.get('h1').contains('Un séjour luxueux pour chaque invité').should('be.visible');

        cy.get('p').contains('Situé au cœur de la ville, notre hôtel offre un mélange parfait de confort et d\'élégance').should('be.visible');

        cy.get('img[alt="Chambre de luxe"]').should('be.visible');
        cy.get('img[alt="Hall d\'entrée"]').should('be.visible');
        cy.get('img[alt="Piscine"]').should('be.visible');
        cy.get('img[alt="Restaurant"]').should('be.visible');
    });

    it('should contain key sections', () => {
        cy.contains('Notre mission').should('be.visible');

        cy.get('p').contains('Notre mission est de fournir à chaque client un séjour relaxant et mémorable.').should('be.visible');

        cy.contains('Nos principaux atouts').should('be.visible');
    });

    it('should display key statistics about the hotel', () => {
        cy.get('dt').contains('Chambres de luxe').siblings('dd').contains('200+').should('be.visible');

        cy.get('dt').contains('Piscines').siblings('dd').contains('3').should('be.visible');

        cy.get('dt').contains('Restaurants').siblings('dd').contains('4').should('be.visible');

        cy.get('dt').contains('Spa & Bien-être').siblings('dd').contains('1').should('be.visible');
    });

    it('should display the correct mission statement and sustainability message', () => {
        cy.contains('Notre mission est de fournir à chaque client un séjour relaxant et mémorable').should('be.visible');

        cy.contains('Nous croyons en la durabilité et en des pratiques respectueuses de l\'environnement').should('be.visible');
    });
});
