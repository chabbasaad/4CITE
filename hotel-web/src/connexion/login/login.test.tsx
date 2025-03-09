// Login.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import useUserStore from "../../service/stores/user-store";
import Login from "./login.tsx";

// Mocking the useUserStore and toast notifications
jest.mock("../../service/stores/user-store");
jest.mock("react-toastify");

describe('Login Component', () => {
    const mockFetchUser = jest.fn();
    const mockCloseModal = jest.fn();

    beforeEach(() => {
        // Mock localStorage
        Storage.prototype.setItem = jest.fn();

        (useUserStore as unknown as jest.Mock).mockReturnValue({
            fetchUser: mockFetchUser,
        });

        (toast.success as jest.Mock).mockImplementation(() => {});
        (toast.error as jest.Mock).mockImplementation(() => {});
    });

    it('should render the login form', () => {
        render(<Login closeModal={mockCloseModal} />);

        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByText(/connexion/i)).toBeInTheDocument();
    });

    it('should submit the form and login successfully', async () => {
        render(<Login closeModal={mockCloseModal} />);

        const emailInput = screen.getByLabelText(/email address/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByText(/connexion/i);

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });

        // Mock successful login response
        mockFetchUser.mockResolvedValueOnce({
            token: "fake_token",
            user: { id: 1, email: "test@example.com" },
            message: "Logged in successfully"
        });

        fireEvent.click(submitButton);

        await waitFor(() => expect(mockFetchUser).toHaveBeenCalledWith({ email: "test@example.com", password: "password123" }));
        expect(localStorage.setItem).toHaveBeenCalledWith("user_token", "fake_token");
        expect(localStorage.setItem).toHaveBeenCalledWith("user_data", '{"id":1,"email":"test@example.com"}');
        expect(mockCloseModal).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith("Logged in successfully");
    });

    it('should handle login error', async () => {
        render(<Login closeModal={mockCloseModal} />);

        const emailInput = screen.getByLabelText(/email address/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByText(/connexion/i);

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });


        fireEvent.click(submitButton);

        // Wait for the function to be called and check if the error toast was shown
        await waitFor(() => expect(mockFetchUser).toHaveBeenCalled());
    });
});
