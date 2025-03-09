describe("Hotel Overview Page (Mocked)", () => {
    beforeEach(() => {
        cy.fixture("hotel.json").then((hotelData) => {
            cy.intercept("GET", "/api/hotels/1", (req) => {
                console.log("Intercepted request:", req);
                req.reply({ body: hotelData });
            }).as("getHotel");
        });

        cy.visit("/hotel/1");
        cy.wait("@getHotel"); // Assurer que l'API mockée a bien été appelée
    });


    it("Affiche les détails de l'hôtel avec mock", () => {
        cy.wait("@getHotel");
        cy.get("h1").should("contain.text", "Hôtel Test");
        cy.contains("120 par nuit").should("be.visible");
        cy.contains("Un hôtel de luxe au centre de Paris.").should("be.visible");
        cy.get("img").should("have.attr", "src", "https://via.placeholder.com/150");
    });

    it("Gère le cas où l'hôtel est introuvable", () => {
        cy.intercept("GET", "/api/hotels/999", { statusCode: 404 }).as("getHotelError");
        cy.visit("/hotel/999");
        cy.contains("Hôtel introuvable.").should("be.visible");
    });

    it("Permet de faire une réservation avec un mock", () => {
        cy.intercept("POST", "/api/bookings", { statusCode: 201, body: { message: "Réservation réussie" } }).as("postBooking");

        cy.get("input[name='check_in_date']").type("2025-04-01T12:00");
        cy.get("input[name='check_out_date']").type("2025-04-05T12:00");
        cy.get("input[name='contact_phone']").type("0612345678");
        cy.get("textarea[name='special_requests']").type("Chambre avec vue");
        cy.get("input[name='guest_names']").type("Jean Dupont, Alice Durand");

        cy.get("button").contains("Réserver maintenant").click();
        cy.wait("@postBooking");

        cy.contains("Réservation réussie").should("be.visible");
    });
});
