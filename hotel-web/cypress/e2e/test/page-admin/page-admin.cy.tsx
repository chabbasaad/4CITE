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



    it('Affiche la liste des hôtels pour l\'utilisateur admin', () => {
        cy.visit('admin/gestion-hotel');

        cy.contains('Hôtel Example').should('be.visible');
        cy.contains('150 €').should('be.visible');
    });

    it('Peut mettre à jour un hôtel', () => {
        cy.contains('Hôtel Example').parent().find('button').contains('Modifier').click();

        cy.get('h2').contains('Modifier un hôtel').should('be.visible');

        cy.get('input[name="name"]').clear().type('Hotel A Updated');

        cy.contains("Mettre à jour l'hôtel").click();

        cy.contains('Hotel A Updated').should('be.visible');
    });

    it('Peut supprimer un hôtel', () => {

        cy.on('window:confirm', (message) => {
            expect(message).to.include('Voulez-vous vraiment supprimer ?');
            return true;
        });

        cy.contains('Hotel A Updated').parent().find('button').contains('Supprimer').click();

        cy.get('button').contains('Supprimer').click();

        cy.contains('Hotel A Updated').should('not.exist');
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
                        data: [{id: 1, name: 'hamzap', pseudo: 'hamzap', email: 'userc@email.com', role: 'user'}],
                    },
                });
            });
        }).as('getUsers');

        cy.visit('/admin/gestion-users');
        cy.wait('@getUsers');
    });

    it('Affiche la liste des utilisateurs', () => {
        cy.contains('hamzap').should('be.visible');
        cy.contains('userc@email.com').should('be.visible');
        cy.log('✅ Utilisateurs affichés correctement');
    });

    it('Peut ajouter un nouvel utilisateur', () => {
        cy.contains('Ajouter un utilisateur').click();
        cy.get('h2').contains('Ajouter un utilisateur').should('be.visible');

        cy.get('input[name="name"]').type('hamzap');
        cy.get('input[name="pseudo"]').type('hamzap');
        cy.get('input[name="email"]').type('userc@email.com');
        cy.get('select[name="role"]').select('user').should('have.value', 'user');
        cy.get('input[name="password"]').type('Hamza123!');

        // Mock du POST
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

        cy.contains('hamzap').should('be.visible');
    });

    it('Peut supprimer un utilisateur', () => {
        cy.contains('hamzap').parent().find('button').contains('Supprimer').click();

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

        cy.contains('hamzap').should('not.exist');
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
