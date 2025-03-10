import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./home";
jest.mock("../hotel/hotel-list.tsx", () => ({
    __esModule: true,
    default: jest.fn(() => <div>HotelList Component</div>),
}));

jest.mock("../../../components/footer/footer", () => ({
    __esModule: true,
    default: jest.fn(() => <div>Footer Component</div>),
}));

describe("Home Page", () => {
    it("renders the page correctly", () => {
        render(<Home />);

        // Vérifier l'image de fond via le `data-testid`
        const backgroundImageElement = screen.getByTestId("background-image");
        expect(backgroundImageElement).toHaveStyle('background-image: url("/about/hotel4.jpg")');

        // Vérifier le texte principal
        expect(screen.getByText("Profitez d'un séjour inoubliable dans notre hôtel de luxe.")).toBeInTheDocument();
        expect(screen.getByText("Découvrez un cadre exceptionnel avec des services haut de gamme pour un confort absolu.")).toBeInTheDocument();

        // Vérifier que le bouton "Réserver maintenant" est présent
        const reserveButton = screen.getByText("Réserver maintenant");
        expect(reserveButton).toBeInTheDocument();

        // Vérifier que le composant HotelList est affiché
        expect(screen.getByText("HotelList Component")).toBeInTheDocument();

        // Vérifier que le composant Footer est affiché
        expect(screen.getByText("Footer Component")).toBeInTheDocument();
    });

    it("simulates clicking the 'Réserver maintenant' button", () => {
        render(<Home />);

        // Simuler le clic sur le bouton
        const reserveButton = screen.getByText("Réserver maintenant");
        fireEvent.click(reserveButton);

        // Vous pouvez tester si le bouton redirige ou effectue une action
        // Comme ici, il n'a pas de logique de navigation ou d'action définie,
        // vous pouvez simuler une action ou vérifier un changement d'état.
        expect(reserveButton).toHaveClass('hover:bg-white'); // exemple de vérification de changement de style
    });
});
