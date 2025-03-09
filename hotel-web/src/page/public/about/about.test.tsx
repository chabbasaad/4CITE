import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import About from "./about";

describe("About Page", () => {
    it("should render the page with the correct content", () => {
        // Render the About page component
        render(<About />);

        // Vérifier si les éléments principaux sont présents
        expect(screen.getByText("À propos de notre hôtel")).toBeInTheDocument();
        expect(screen.getByText("Un séjour luxueux pour chaque invité")).toBeInTheDocument();

        // Vérifier le titre de la section "Notre mission"
        expect(screen.getByText("Notre mission")).toBeInTheDocument();

        // Vérifier si les sections d'images sont présentes
        const images = screen.getAllByRole("img");
        expect(images.length).toBeGreaterThan(0); // Vérifie qu'il y a des images

        // Vérifier les statistiques des principaux atouts
        expect(screen.getByText("Chambres de luxe")).toBeInTheDocument();
        expect(screen.getByText("Piscines")).toBeInTheDocument();
        expect(screen.getByText("Restaurants")).toBeInTheDocument();
        expect(screen.getByText("Spa & Bien-être")).toBeInTheDocument();

        // Vérifier les valeurs des statistiques
        expect(screen.getByText("200+")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
        expect(screen.getByText("4")).toBeInTheDocument();
        expect(screen.getByText("1")).toBeInTheDocument();
    });
});
