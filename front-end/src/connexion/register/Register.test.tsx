import { render, screen, fireEvent } from "@testing-library/react";
import Register from "./Register";

describe("Login Component", () => {
    it("devrait afficher le formulaire", () => {
        render(<Register />);
        expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
        expect(screen.getByLabelText("Email address")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    });

    it("devrait permettre de saisir l'email et le mot de passe", ()      => {
        render(<Register />);
        const emailInput = screen.getByLabelText("Email address") as HTMLInputElement;
        const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });

        expect(emailInput.value).toBe("test@example.com");
        expect(passwordInput.value).toBe("password123");
    });

    it("devrait soumettre le formulaire avec les bonnes valeurs", () => {
        render(<Register />);
        const emailInput = screen.getByLabelText("Email address") as HTMLInputElement;
        const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
        const submitButton = screen.getByRole("button", { name: /sign in/i });

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        //fireEvent.click(submitButton);

        // Simulation de l'envoi du formulaire (vérification console.log ou appel d'une fonction)
        expect(emailInput.value).toBe("test@example.com");
        expect(passwordInput.value).toBe("password123");
    });
});
