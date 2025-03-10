import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { toast } from "react-toastify";
import {
    createUser,
    deleteUser,
    fetchUsers,
    login,
    register,
    updateUser
} from "../service-user";
import {UserFetchResponseData} from "../../model/user/user-fetch";
import {UserLoginResponseData, UserRegisterResponseData} from "../../model/user/user-connexion";
import {testEnv} from "../../../../env";

jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

Object.defineProperty(global, "importMeta", {
    value: {
        env: testEnv,
    },
});

const mock = new MockAdapter(axios);

const API_URL =  `${testEnv.VITE_API_URL}/`;

describe("API User Tests", () => {
    afterEach(() => {
        mock.reset();
    });

    it("should register a user successfully", async () => {
        const mockResponse: UserRegisterResponseData = {
            message: "Inscription réussie",
            user: {
                id: 17,
                name: "John Doe",
                pseudo: "johnD",
                email: "john@example.com",
                role: "user",
                email_verified_at: "2023-01-01T00:00:00Z",
                created_at: "2023-01-01T00:00:00Z",
                updated_at: "2023-01-01T00:00:00Z",
                deleted_at: "",
            },
            token: "fake-jwt-token"
        };
        mock.onPost(`${API_URL}auth/register`).reply(200, mockResponse);

        const response = await register({
            email: "john@example.com",
            password: "password123",
            name: "John Doe",
            password_confirmation: "password123",
            pseudo: "johnD",
        });

        expect(response).toEqual(mockResponse);
        expect(response.user).toHaveProperty("email", "john@example.com");
        expect(toast.success).toHaveBeenCalledWith("Inscription réussie");
    });

    it("should handle registration with missing required fields", async () => {
        mock.onPost(`${API_URL}auth/register`).reply(400, { message: "Validation failed" });

        await expect(register({
            email: "",
            password: "",
            name: "",
            password_confirmation: "",
            pseudo: ""
        })).rejects.toThrow("Request failed with status code 400");

        expect(toast.error).toHaveBeenCalledWith("Validation failed");
    });

    it("should login a user successfully", async () => {
        const mockResponse: UserLoginResponseData = {
            message: "Connexion réussie",
            user: {
                id: 2,
                name: "Alice Doe",
                pseudo: "aliceD",
                email: "alice@example.com",
                role: "admin",
                email_verified_at: "2023-02-01T00:00:00Z",
                created_at: "2023-02-01T00:00:00Z",
                updated_at: "2023-02-01T00:00:00Z",
                deleted_at: "",
            },
            token: "fake-jwt-token"
        };
        mock.onPost(`${API_URL}auth/login`).reply(200, mockResponse);

        const response = await login({ email: "alice@example.com", password: "securePass" });

        expect(response).toEqual(mockResponse);
        expect(response.user).toHaveProperty("pseudo", "aliceD");
    });

    it("should handle login with invalid credentials", async () => {
        mock.onPost(`${API_URL}auth/login`).reply(401, { message: "Invalid credentials" });

        await expect(login({ email: "wrong@example.com", password: "wrongpass" })).rejects.toThrow("Request failed with status code 401");
        expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });

    it("should fetch users successfully", async () => {
        const mockResponse: UserFetchResponseData = {
            data: [
                { id: 1, name: "John Doe", email: "john@example.com", pseudo: "johnD",role: "user", email_verified_at: "2023-02-01T00:00:00Z",
                    created_at: "2023-02-01T00:00:00Z",
                    updated_at: "2023-02-01T00:00:00Z",
                    deleted_at: "", },
                { id: 2, name: "Alice Doe", email: "alice@example.com", pseudo: "aliceD",role: "user", email_verified_at: "2023-02-01T00:00:00Z",
                    created_at: "2023-02-01T00:00:00Z",
                    updated_at: "2023-02-01T00:00:00Z",
                    deleted_at: "", }
            ]
        };
        mock.onGet(`${API_URL}users`).reply(200, mockResponse);

        const response = await fetchUsers();

        expect(response).toEqual(mockResponse);
        expect(response.data).toHaveLength(2); // ✅ Vérifie bien `data`
    });

    it("should handle create user with duplicate email", async () => {
        mock.onPost(`${API_URL}users`).reply(409, { message: "Email already exists" });

        await expect(createUser({
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
            password_confirmation: "password123",
            pseudo: "johnD",
            role: "user"
        })).rejects.toThrow("Request failed with status code 409");

        expect(toast.error).toHaveBeenCalledWith("Email already exists");
    });

    it("should create a user successfully", async () => {
        const mockResponse = { message: "Utilisateur créé avec succès" };
        mock.onPost(`${API_URL}users`).reply(201, mockResponse);

        const response = await createUser({
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
            password_confirmation: "password123",
            pseudo: "johnD",
            role :"user"
        });

        expect(response).toEqual(mockResponse);
        expect(toast.success).toHaveBeenCalledWith("Utilisateur créé avec succès");
    });

    it("should update a user successfully", async () => {
        const mockResponse = { message: "Utilisateur mis à jour" };
        mock.onPut(`${API_URL}users/1`).reply(200, mockResponse);

        const response = await updateUser(1, {id: 1 ,name: "John Doe Updated",pseudo: "johnD",role: "user",password : "password", email : "email", password_confirmation : "password"});

        expect(response).toEqual(mockResponse);
        expect(toast.success).toHaveBeenCalledWith("Utilisateur mis à jour");
    });

    it("should handle user update with invalid data", async () => {
        mock.onPut(`${API_URL}users/1`).reply(400, { message: "Validation failed" });

        await expect(updateUser(1, {
            id: 1,
            name: "",
            pseudo: "",
            email: "",
            role :"user",
            password: "password",
            password_confirmation: "password"
        })).rejects.toThrow("Request failed with status code 400");

        expect(toast.error).toHaveBeenCalledWith("Validation failed");
    });

    it("should delete a user successfully", async () => {
        const mockResponse = { message: "Utilisateur supprimé" };
        mock.onDelete(`${API_URL}users/1`).reply(200, mockResponse);

        await deleteUser(1);

        expect(toast.success).toHaveBeenCalledWith("Utilisateur supprimé");
    });

    it("should handle registration error", async () => {
        mock.onPost(`${API_URL}auth/register`).reply(400, { message: "Erreur d'inscription" });

        await expect(register({
            email: "invalid",
            password: "",
            name: "",
            password_confirmation: "",
            pseudo: ""
        })).rejects.toThrow();

        expect(toast.error).toHaveBeenCalledWith("Erreur d'inscription");
    });

    it("should handle login error", async () => {
        mock.onPost(`${API_URL}auth/login`).reply(401, { message: "Email ou mot de passe incorrect" });

        await expect(login({ email: "wrong@example.com", password: "wrongpass" })).rejects.toThrow();
        expect(toast.error).toHaveBeenCalledWith("Erreur d'inscription");
    });

    it("should handle server error", async () => {
        mock.onGet(`${API_URL}users`).reply(500, { message: "Erreur interne du serveur" });

        await expect(fetchUsers()).rejects.toThrow();
        expect(toast.error).toHaveBeenCalledWith("Erreur d'inscription");
    });

    it("should handle server timeout", async () => {
        mock.onPost(`${API_URL}auth/register`).timeout();

        await expect(register({
            email: "test@example.com",
            password: "password123",
            name: "Test User",
            password_confirmation: "password123",
            pseudo: "testuser"
        })).rejects.toThrow("timeout of 0ms exceeded");

        expect(toast.error).toHaveBeenCalledWith("Validation failed");
    });

    it("should handle fetch users with server error", async () => {
        mock.onGet(`${API_URL}users`).reply(500, { message: "Internal server error" });

        await expect(fetchUsers()).rejects.toThrow("Request failed with status code 500");
        expect(toast.error).toHaveBeenCalledWith("Internal server error");
    });

    it("should handle delete user with non-existing user", async () => {
        mock.onDelete(`${API_URL}users/999`).reply(404, { message: "User not found" });

        await expect(deleteUser(999)).rejects.toThrow("Request failed with status code 404");
        expect(toast.error).toHaveBeenCalledWith("User not found");
    });
});
