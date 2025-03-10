describe('Tests de la liste des hôtels avec un utilisateur admin', () => {
    beforeEach(() => {
        cy.window().then((win) => {
            const adminUser = {
                id: 1,
                name: "Admin User",
                pseudo: "AdminPseudonym",
                email: "adminuser@example.com",
                role: "admin",
            };
            const token = "static_admin_token_123456";
            win.localStorage.setItem("user_token", token);
            win.localStorage.setItem("user_data", JSON.stringify(adminUser));
        });

        cy.visit('/admin/gestion-hotel');
    });

    it('Peut ajouter un nouvel hôtel', () => {
        cy.contains('Ajouter un hôtel').click();

        cy.get('button').contains('Ajouter un hôtel').should('be.visible');

        // Remplir le formulaire pour ajouter un hôtel
        const hotelName = 'Hotel Test';
        const hotelLocation = 'Paris';

        cy.get('input[name="name"]').type(hotelName);
        cy.get('input[name="location"]').type(hotelLocation);
        cy.get('input[name="price_per_night"]').type("100");
        cy.get('input[name="total_rooms"]').type("10");

        cy.contains("Ajouter l'hôtel").click();

        cy.contains(hotelName).should('be.visible');
        cy.contains(hotelLocation).should('be.visible');

    });


    it('Affiche la liste des hôtels pour l\'utilisateur admin', () => {
        cy.visit('admin/gestion-hotel');
        cy.contains('Hôtel ExampleHotel Test').should('be.visible');
        cy.contains('100 €').should('be.visible');
    });

    it('Peut mettre à jour un hôtel', () => {
        cy.contains('Hôtel ExampleHotel Test').parent().find('button').contains('Modifier').click();

        cy.get('h2.text-2xl.font-semibold.mb-6.text-gray-900.text-center', { timeout: 10000 })
            .should('be.visible');  // Attendre que l'élément soit visible

        cy.get('input[name="name"]').clear().type('Hotel A Updated Test');

        cy.contains("Mettre à jour l'hôtel").click();

        cy.contains('Hotel A Updated Test').should('be.visible');
    });


    it('Peut supprimer un hôtel', () => {

        cy.on('window:confirm', (message) => {
            expect(message).to.include('Voulez-vous vraiment supprimer ?');
            return true;
        });

        cy.contains('Hotel A Updated Test').parent().find('button').contains('Supprimer').click();

        cy.get('button').contains('Supprimer').click();

        cy.contains('Hotel A Updated Test').should('not.exist');
    });
});

describe('Tests de la liste des utilisateurs', () => {
    beforeEach(() => {
        cy.window().then((win) => {
            const adminUser = {
                id: 1,
                name: "Admin User",
                pseudo: "AdminPseudonym",
                email: "adminuser@example.com",
                role: "admin",
            };
            const token = "static_admin_token_123456";
            win.localStorage.setItem("user_token", token);
            win.localStorage.setItem("user_data", JSON.stringify(adminUser));
        });

        cy.intercept('GET', '/api/users', (req) => {
            req.reply((res) => {
                res.send({
                    delay: 500,
                    statusCode: 200,
                    body: {
                        data: [{id: 1, name: 'hamza', pseudo: 'bely', email: 'h@h.com', role: 'user'}],
                    },
                });
            });
        }).as('getUsers');

        cy.visit('/admin/gestion-users');
        cy.wait('@getUsers');
    });

    it('Affiche la liste des utilisateurs', () => {
        cy.contains('hamza').should('be.visible');
        cy.contains('h@h.com').should('be.visible');
    });

    it('Peut ajouter un nouvel utilisateur', () => {
        cy.contains('Ajouter un utilisateur').click();
        cy.get('button').contains('Ajouter un utilisateur').should('be.visible');

        cy.get('input[name="name"]').type('hamzap');
        cy.get('input[name="pseudo"]').type('hamzap');
        cy.get('input[name="email"]').type('userc@email.com');
        cy.get('input[name="password"]').type('Hamza123!');

        cy.intercept('POST', '/api/users', {
            statusCode: 201,
            body: { message: 'Utilisateur ajouté avec succès',data: {
                    id: 1,
                    name: 'hamzap',
                    pseudo: 'hamzap',
                    email: 'userc@email.com',
                    role: 'user'
                } }
        }).as('createUser');

        cy.contains("Ajouter l'utilisateur").click();
        cy.wait('@createUser');
        cy.wait(500);

        cy.contains('hamzap').should('be.visible');
    });

    it('Peut supprimer un utilisateur', () => {

        cy.contains('hamza').parent().find('button').contains('Supprimer').click();

        cy.intercept('DELETE', '/api/users/1', {
            statusCode: 200,
            body: { message: 'Utilisateur supprimé avec succès' }
        }).as('deleteUser');

        cy.on('window:confirm', (message) => {
            expect(message).to.include('Voulez-vous vraiment supprimer ?');
            return true;
        });

        cy.get('button').contains('Supprimer').click();
        cy.wait('@deleteUser');

        cy.contains('hamza').should('not.exist');
    });
});

describe('Tests de la liste des booking avec un utilisateur admin', () => {
    beforeEach(() => {
        cy.window().then((win) => {
            const adminUser = {
                id: 1,
                name: "Admin User",
                pseudo: "AdminPseudonym",
                email: "adminuser@example.com",
                role: "admin",
            };
            const token = "3|BQKbAadjqPRlCh1w9xLgxIoFpFZVv6E71Q9h5lLu81fdd982";
            win.localStorage.setItem("user_token", token);
            win.localStorage.setItem("user_data", JSON.stringify(adminUser));
        });

        cy.visit('/admin/gestion-booking');
    });


    it('Affiche la liste des booking pour l\'utilisateur admin', () => {
        cy.visit('admin/gestion-booking');

        cy.contains('Historic Boutique Hotel').should('be.visible');
        cy.contains('User 10').should('be.visible');
    });
});
