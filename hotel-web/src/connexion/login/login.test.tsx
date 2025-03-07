// Login.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { login } from '../../service/servises/service-user.tsx'; // Le service de login
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Login from "./login.tsx";

// Mock de la fonction login
jest.mock('../../service/servises/service-user.tsx', () => ({
    login: jest.fn(),
}));

// Mock de useNavigate
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

// Mock de toast
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('Login Component', () => {
    const closeModal = jest.fn();
    const navigate = jest.fn();

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(navigate);
    });

    test('should login successfully and redirect to admin page if user is an admin', async () => {
        const response = {
            token: 'fake_token',
            user: { email: 'user@example.com', role: 'admin' },
            message: 'Login successful',
        };
        login.mockResolvedValue(response);

        render(<Login closeModal={closeModal} />);

        userEvent.type(screen.getByLabelText(/email address/i), 'user@example.com');
        userEvent.type(screen.getByLabelText(/password/i), 'password123');
        fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password123' });
        });

        expect(localStorage.getItem('user_token')).toBe('fake_token');
        expect(localStorage.getItem('user_data')).toBe(JSON.stringify({ email: 'user@example.com', role: 'admin' }));
        expect(navigate).toHaveBeenCalledWith('/admin');
        expect(toast.success).toHaveBeenCalledWith('Login successful');
        expect(closeModal).toHaveBeenCalled();
    });

    test('should login successfully and redirect to home page if user is not an admin', async () => {
        const response = {
            token: 'fake_token',
            user: { email: 'user@example.com', role: 'user' },
            message: 'Login successful',
        };
        login.mockResolvedValue(response);

        render(<Login closeModal={closeModal} />);

        userEvent.type(screen.getByLabelText(/email address/i), 'user@example.com');
        userEvent.type(screen.getByLabelText(/password/i), 'password123');
        fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password123' });
        });

        expect(localStorage.getItem('user_token')).toBe('fake_token');
        expect(localStorage.getItem('user_data')).toBe(JSON.stringify({ email: 'user@example.com', role: 'user' }));
        expect(navigate).toHaveBeenCalledWith('/');
        expect(toast.success).toHaveBeenCalledWith('Login successful');
        expect(closeModal).toHaveBeenCalled();
    });

    test('should show an error message when login fails', async () => {
        const errorMessage = 'Invalid credentials';
        login.mockRejectedValueOnce({
            response: { status: 401, data: { message: errorMessage } },
        });

        render(<Login closeModal={closeModal} />);

        userEvent.type(screen.getByLabelText(/email address/i), 'user@example.com');
        userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
        fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });

        expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });

    test('should trim email with leading/trailing spaces before login', async () => {
        const response = {
            token: 'fake_token',
            user: { email: 'user@example.com', role: 'user' },
            message: 'Login successful',
        };
        login.mockResolvedValue(response);

        render(<Login closeModal={closeModal} />);

        userEvent.type(screen.getByLabelText(/email address/i), '   user@example.com   ');
        userEvent.type(screen.getByLabelText(/password/i), 'password123');
        fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password123' });
        });

        expect(localStorage.getItem('user_token')).toBe('fake_token');
        expect(localStorage.getItem('user_data')).toBe(JSON.stringify({ email: 'user@example.com', role: 'user' }));
        expect(navigate).toHaveBeenCalledWith('/');
    });

    test('should show an error message when the email format is incorrect', async () => {
        render(<Login closeModal={closeModal} />);

        userEvent.type(screen.getByLabelText(/email address/i), 'invalid-email');
        userEvent.type(screen.getByLabelText(/password/i), 'password123');
        fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
        });
    });

    test('should handle blank email and password fields', async () => {
        render(<Login closeModal={closeModal} />);

        fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
        });
    });
});
