import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import useUserStore from "../../service/stores/user-store.tsx";
import Login from "./login.tsx";

// Moquer les notifications toast
jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),  // Mock de la méthode success
        error: jest.fn(),    // Mock de la méthode error
    },
}));

// Moquer le store
jest.mock("../../service/stores/user-store.tsx", () => ({
    __esModule: true,
    default: () => ({
        fetchUser: jest.fn(),
    }),
}));

describe("Login Component", () => {
    let fetchUser: jest.Mock;

    beforeEach(() => {
        fetchUser = useUserStore().fetchUser;
    });

    it("should render the login form correctly", () => {
        render(<Login closeModal={jest.fn()} />);

        // Vérifier que les champs du formulaire et le bouton de soumission sont bien rendus
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    });

    it("should handle user input correctly", async () => {
        render(<Login closeModal={jest.fn()} />);

        // Simuler la saisie de l'utilisateur dans les champs email et mot de passe
        const emailInput = screen.getByLabelText(/email address/i);
        const passwordInput = screen.getByLabelText(/password/i);

        await userEvent.type(emailInput, "test@example.com");
        await userEvent.type(passwordInput, "password123");

        // Vérifier que l'email et le mot de passe ont bien été mis à jour dans le state
        expect(emailInput).toHaveValue("test@example.com");
        expect(passwordInput).toHaveValue("password123");
    });

    it("should submit the form and handle successful login", async () => {
        const mockUser = { token: "fake-token", user: { name: "John Doe" }, message: "Login successful" };
        fetchUser.mockResolvedValue(mockUser);
        const closeModal = jest.fn();

        render(<Login closeModal={closeModal} />);

        // Simuler la saisie de l'utilisateur
        await userEvent.type(screen.getByLabelText(/email address/i), "test@example.com");
        await userEvent.type(screen.getByLabelText(/password/i), "password123");

        // Soumettre le formulaire
        await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

        // Attendre que le toast de succès apparaisse
        await waitFor(() => expect(toast.success).toHaveBeenCalledWith(mockUser.message));

        // Vérifier que localStorage a été mis à jour
        expect(localStorage.getItem("user_token")).toBe("fake-token");
        expect(localStorage.getItem("user_data")).toBe(JSON.stringify(mockUser.user));

        // Vérifier que la fonction closeModal a été appelée
        expect(closeModal).toHaveBeenCalled();
    });

    it("should show an error toast if login fails", async () => {
        fetchUser.mockRejectedValue(new Error("Login failed"));

        render(<Login closeModal={jest.fn()} />);

        // Simuler la saisie de l'utilisateur
        await userEvent.type(screen.getByLabelText(/email address/i), "test@example.com");
        await userEvent.type(screen.getByLabelText(/password/i), "password123");

        // Soumettre le formulaire
        await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

        // Attendre que le toast d'erreur apparaisse
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Login failed"));
    });

    it("should handle empty input fields", async () => {
        render(<Login closeModal={jest.fn()} />);

        // Essayer de soumettre le formulaire avec des champs vides
        await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

        // Vérifier que le formulaire ne soumet pas (et qu'aucun toast ne s'affiche)
        await waitFor(() => expect(toast.success).not.toHaveBeenCalled());
    });
});
