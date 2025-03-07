
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { register } from '../../service/servises/service-user.tsx';
import Register from "./register.tsx";

// Mock de la fonction register
jest.mock('../../service/servises/service-user.tsx', () => ({
    register: jest.fn(),
}));

describe('Register Component', () => {

    test('Successful registration', async () => {
        // Mock la réponse de l'API pour une inscription réussie
        register.mockResolvedValue({
            status: 201,
            data: { token: 'fake_token', user: { name: 'Saad Chabba' } },
        });

        render(<Register closeModal={jest.fn()} />);

        // Remplir les champs du formulaire
        userEvent.type(screen.getByLabelText(/name/i), 'Saad Chabba');
        userEvent.type(screen.getByLabelText(/pseudo/i), 'Saadchabba');
        userEvent.type(screen.getByLabelText(/email address/i), 'Saad.chabba@example.com');
        userEvent.type(screen.getByLabelText(/password/i), 'Password123!');
        userEvent.type(screen.getByLabelText(/password confirmation/i), 'Password123!');

        // Soumettre le formulaire
        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(register).toHaveBeenCalledWith({
                name: 'Saad Chabba',
                pseudo: 'Saadchabba',
                email: 'Saad.chabba@example.com',
                password: 'Password123!',
                password_confirmation: 'Password123!',
            });
        });

        // Vérifier la redirection après l'inscription réussie
        expect(localStorage.getItem('user_token')).toBe('fake_token');
        expect(localStorage.getItem('user_data')).toBe(JSON.stringify({ name: 'Saad Chabba' }));
    });

    test('Attempting registration with an existing email', async () => {
        // Mock la réponse de l'API pour un email déjà existant
        register.mockRejectedValueOnce({
            response: {
                status: 400,
                data: { message: 'Email already taken' },
            },
        });

        render(<Register closeModal={jest.fn()} />);

        // Remplir les champs du formulaire avec un email déjà existant
        userEvent.type(screen.getByLabelText(/name/i), 'Saad Chabba');
        userEvent.type(screen.getByLabelText(/pseudo/i), 'Saadchabba');
        userEvent.type(screen.getByLabelText(/email address/i), 'existing@example.com');
        userEvent.type(screen.getByLabelText(/password/i), 'Password123!');
        userEvent.type(screen.getByLabelText(/password confirmation/i), 'Password123!');

        // Soumettre le formulaire
        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/Email already taken/i)).toBeInTheDocument();
        });
    });

    test('Registration with a weak password', async () => {
        render(<Register closeModal={jest.fn()} />);

        // Remplir les champs du formulaire avec un mot de passe faible
        userEvent.type(screen.getByLabelText(/name/i), 'Saad Chabba');
        userEvent.type(screen.getByLabelText(/pseudo/i), 'Saadchabba');
        userEvent.type(screen.getByLabelText(/email address/i), 'Saad.chabba@example.com');
        userEvent.type(screen.getByLabelText(/password/i), '123');
        userEvent.type(screen.getByLabelText(/password confirmation/i), '123');

        // Soumettre le formulaire
        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/Password is too weak/i)).toBeInTheDocument();
        });
    });

    test('Registration with a missing required field', async () => {
        render(<Register closeModal={jest.fn()} />);

        // Soumettre le formulaire sans remplir le champ 'email'
        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/This field is required/i)).toBeInTheDocument();
        });
    });

    test('Registration with an email containing leading/trailing spaces', async () => {
        render(<Register closeModal={jest.fn()} />);

        // Remplir l'email avec des espaces avant et après
        userEvent.type(screen.getByLabelText(/name/i), 'Saad Chabba');
        userEvent.type(screen.getByLabelText(/pseudo/i), 'Saadchabba');
        userEvent.type(screen.getByLabelText(/email address/i), '   Saad.chabba@example.com   ');
        userEvent.type(screen.getByLabelText(/password/i), 'Password123!');
        userEvent.type(screen.getByLabelText(/password confirmation/i), 'Password123!');

        // Soumettre le formulaire
        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(register).toHaveBeenCalledWith({
                name: 'Saad Chabba',
                pseudo: 'Saadchabba',
                email: 'Saad.chabba@example.com', // Les espaces ont été supprimés
                password: 'Password123!',
                password_confirmation: 'Password123!',
            });
        });
    });

    test('Registration with a pseudo already taken', async () => {
        // Mock de l'API pour un pseudo déjà pris
        register.mockRejectedValueOnce({
            response: {
                status: 400,
                data: { message: 'Pseudo already taken' },
            },
        });

        render(<Register closeModal={jest.fn()} />);

        // Remplir les champs du formulaire avec un pseudo déjà pris
        userEvent.type(screen.getByLabelText(/name/i), 'Saad Chabba');
        userEvent.type(screen.getByLabelText(/pseudo/i), 'Saadchabba');
        userEvent.type(screen.getByLabelText(/email address/i), 'saad.chabba@example.com');
        userEvent.type(screen.getByLabelText(/password/i), 'Password123!');
        userEvent.type(screen.getByLabelText(/password confirmation/i), 'Password123!');

        // Soumettre le formulaire
        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/Pseudo already taken/i)).toBeInTheDocument();
        });
    });

    test('Registration with a very long name or email', async () => {
        render(<Register closeModal={jest.fn()} />);

        // Remplir les champs avec des valeurs très longues
        userEvent.type(screen.getByLabelText(/name/i), 'A very long name that exceeds the maximum allowed length');
        userEvent.type(screen.getByLabelText(/pseudo/i), 'Saadchabba');
        userEvent.type(screen.getByLabelText(/email address/i), 'a.really.long.email.address@domain.com');
        userEvent.type(screen.getByLabelText(/password/i), 'Password123!');
        userEvent.type(screen.getByLabelText(/password confirmation/i), 'Password123!');

        // Soumettre le formulaire
        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/Name or email is too long/i)).toBeInTheDocument();
        });
    });

    test('Registration with special characters in the name', async () => {
        render(<Register closeModal={jest.fn()} />);

        // Remplir les champs avec des caractères spéciaux dans le nom
        userEvent.type(screen.getByLabelText(/name/i), 'Saad@Chabba!');
        userEvent.type(screen.getByLabelText(/pseudo/i), 'Saadchabba');
        userEvent.type(screen.getByLabelText(/email address/i), 'saad.chabba@example.com');
        userEvent.type(screen.getByLabelText(/password/i), 'Password123!');
        userEvent.type(screen.getByLabelText(/password confirmation/i), 'Password123!');

        // Soumettre le formulaire
        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(register).toHaveBeenCalledWith({
                name: 'Saad@Chabba!',
                pseudo: 'Saadchabba',
                email: 'saad.chabba@example.com',
                password: 'Password123!',
                password_confirmation: 'Password123!',
            });
        });
    });

    test('Registration with a password containing spaces', async () => {
        render(<Register closeModal={jest.fn()} />);

        // Remplir les champs avec un mot de passe contenant des espaces
        userEvent.type(screen.getByLabelText(/name/i), 'Saad Chabba');
        userEvent.type(screen.getByLabelText(/pseudo/i), 'Saadchabba');
        userEvent.type(screen.getByLabelText(/email address/i), 'saad.chabba@example.com');
        userEvent.type(screen.getByLabelText(/password/i), 'Password 123!');
        userEvent.type(screen.getByLabelText(/password confirmation/i), 'Password 123!');

        // Soumettre le formulaire
        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/Password cannot contain spaces/i)).toBeInTheDocument();
        });
    });

    test('Registration with a password that matches the email or name', async () => {
        render(<Register closeModal={jest.fn()} />);

        // Remplir les champs avec un mot de passe qui correspond à l'email
        userEvent.type(screen.getByLabelText(/name/i), 'Saad Chabba');
        userEvent.type(screen.getByLabelText(/pseudo/i), 'Saadchabba');
        userEvent.type(screen.getByLabelText(/email address/i), 'saad.chabba@example.com');
        userEvent.type(screen.getByLabelText(/password/i), 'saad.chabba@example.com');
        userEvent.type(screen.getByLabelText(/password confirmation/i), 'saad.chabba@example.com');

        // Soumettre le formulaire
        fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/Password cannot match the email or name/i)).toBeInTheDocument();
        });
    });

    // Vous pouvez ajouter d'autres tests similaires pour les autres cas spécifiques
});

