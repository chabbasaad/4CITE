import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { toast } from "react-toastify";
import {
    fetchHotels,
    fetchHotel,
    createHotel,
    updateHotel,
    deleteHotel
} from "../service-hotel";
import {HotelCreateRequestData, HotelCreateResponseData} from "../../model/hotel/hotel-create";
import {HotelUpdateRequestData, HotelUpdateResponseData} from "../../model/hotel/hotel-update";
import {testEnv} from "../../../../env";

// Mock de react-toastify
jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mock = new MockAdapter(axios);

const API_URL =  `${testEnv.VITE_API_URL}/hotels`;

describe("API Hotel Tests", () => {
    afterEach(() => {
        mock.reset();
    });

    it("should fetch hotels successfully", async () => {
        const mockResponse = {
            data: [
                { id: 1, name: "Hotel Lux", location: "Paris", price_per_night: 150, available: true, description: "Un bel hôtel", picture_list: [], amenities: [], is_available: true, total_rooms: 50, created_at: "", updated_at: "", available_rooms: 20 },
                { id: 2, name: "Hotel Cozy", location: "Lyon", price_per_night: 100, available: true, description: "Hôtel confortable", picture_list: [], amenities: [], is_available: true, total_rooms: 30, created_at: "", updated_at: "", available_rooms: 10 }
            ]
        };
        mock.onGet(`${API_URL}`).reply(200, mockResponse);

        const response = await fetchHotels();

        // Comparaison avec data, car la réponse contient un objet avec une clé `data`
        expect(response.data).toEqual(mockResponse.data);
    });

    it("should fetch a single hotel successfully", async () => {
        const mockResponse = {
            data: {
                id: 1, name: "Hotel Lux", location: "Paris", price_per_night: 150, available: true, description: "Un bel hôtel", picture_list: [], amenities: [], is_available: true, total_rooms: 50, created_at: "", updated_at: "", available_rooms: 20
            }
        };
        mock.onGet(`${API_URL}/1`).reply(200, mockResponse);

        const response = await fetchHotel(1);

        // Comparaison avec data, car la réponse contient un objet avec une clé `data`
        expect(response.data).toEqual(mockResponse.data);
    });

    it("should handle fetch hotel by invalid ID", async () => {
        mock.onGet(`${API_URL}/999`).reply(404, { message: "Hotel not found" });

        await expect(fetchHotel(999)).rejects.toThrow("Request failed with status code 404");
        expect(toast.error).toHaveBeenCalledWith("Hotel not found");
    });

    it("should handle create hotel with duplicate data", async () => {
        const mockRequest: HotelCreateRequestData = {
            name: "Hotel Lux", // Already exists
            location: "Paris",
            description: "Un bel hôtel",
            price_per_night: 150,
            is_available: true,
            total_rooms: 50,
            available_rooms: 20,
            picture_list: [],
            amenities: [],
            available: true,
        };

        mock.onPost(API_URL).reply(409, { message: "Hotel already exists" });

        await expect(createHotel(mockRequest)).rejects.toThrow("Request failed with status code 409");
        expect(toast.error).toHaveBeenCalledWith("Hotel already exists");
    });

    it("should create a hotel successfully", async () => {
        const mockRequest: HotelCreateRequestData = {
            name: "Hotel Paradise",
            location: "Nice",
            description: "Un hôtel 5 étoiles",
            price_per_night: 200,
            is_available: true,
            total_rooms: 100,
            available_rooms: 80,
            picture_list: [""],
            amenities: [""],
            available: true,
        };

        const mockResponse: HotelCreateResponseData = {
            message: "Hôtel créé avec succès",
            data: { ...mockRequest, id: 3, created_at: "", updated_at: "" }
        };

        mock.onPost(API_URL).reply(201, mockResponse);

        const response = await createHotel(mockRequest);

        expect(response).toEqual(mockResponse);
        expect(toast.success).toHaveBeenCalledWith("Hôtel créé avec succès");
    });

    it("should handle create hotel with missing data", async () => {
        const mockRequest: HotelCreateRequestData = {
            name: "", // Missing name
            location: "", // Missing location
            description: "Un hôtel sans description",
            price_per_night: 0, // Invalid price
            is_available: true,
            total_rooms: 0, // Invalid total rooms
            available_rooms: 0, // Invalid available rooms
            picture_list: [],
            amenities: [""],
            available: false,
        };


        await expect(createHotel(mockRequest)).rejects.toThrow("Request failed with status code 404");
        expect(toast.error).toHaveBeenCalledWith("Une erreur est survenue");
    });

    it("should update a hotel successfully", async () => {
        const mockRequest: HotelUpdateRequestData = {
            name: "Hotel Lux",
            location: "Paris",
            description: "Un bel hôtel rénové",
            price_per_night: 180,
            is_available: true,
            total_rooms: 50,
            available_rooms: 25,
            picture_list: [""],
            amenities: [""]
        };

        const mockResponse: HotelUpdateResponseData = {
            message: "Hôtel mis à jour avec succès",
            data: { ...mockRequest, id: 1, created_at: "", updated_at: "", available: false }
        };

        mock.onPut(`${API_URL}/1`).reply(200, mockResponse);

        const response = await updateHotel(1, mockRequest);

        expect(response).toEqual(mockResponse);
        expect(toast.success).toHaveBeenCalledWith("Hôtel mis à jour avec succès");
    });

    it("should handle update hotel with missing data", async () => {
        const mockRequest: HotelUpdateRequestData = {
            name: "", // Missing name
            location: "", // Missing location
            description: "",
            price_per_night: 0, // Invalid price
            is_available: false,
            total_rooms: 0,
            available_rooms: 0,
            picture_list: [],
            amenities: [],
        };


        await expect(updateHotel(1, mockRequest)).rejects.toThrow("Request failed with status code 404");
        expect(toast.error).toHaveBeenCalledWith("Hotel not found");
    });

    it("should delete a hotel successfully", async () => {
        mock.onDelete(`${API_URL}/1`).reply(200, { message: "Hôtel supprimé avec succès" });

        await deleteHotel(1);

        expect(toast.success).toHaveBeenCalledWith("Hôtel supprimé avec succès");
    });

    it("should handle delete non-existing hotel", async () => {
        mock.onDelete(`${API_URL}/999`).reply(404, { message: "Hotel not found" });

        await expect(deleteHotel(999)).rejects.toThrow("Request failed with status code 404");
        expect(toast.error).toHaveBeenCalledWith("Hotel not found");
    });

    it("should handle fetchHotels error", async () => {
        mock.onGet(`${API_URL}`).reply(500, { message: "Erreur serveur" });

        await expect(fetchHotels()).rejects.toThrow();
        expect(toast.error).toHaveBeenCalledWith("Erreur serveur");
    });

    it("should handle createHotel error", async () => {
        mock.onPost(API_URL).reply(400, { message: "Erreur de validation" });

        await expect(createHotel({
            name: "", location: "", description: "", price_per_night: 0, is_available: false, total_rooms: 0, available_rooms: 0, picture_list: [], amenities: [], available: false
        })).rejects.toThrow();

        expect(toast.error).toHaveBeenCalledWith("Erreur serveur");
    });

    it("should handle fetch hotels when server is down", async () => {
        mock.onGet(`${API_URL}`).reply(500, { message: "Server Error" });

        await expect(fetchHotels()).rejects.toThrow("Request failed with status code 500");
        expect(toast.error).toHaveBeenCalledWith("Server Error");
    });

    it("should handle server timeout", async () => {
        mock.onGet(`${API_URL}`).timeout();

        await expect(fetchHotels()).rejects.toThrow("timeout of 0ms exceeded");
        expect(toast.error).toHaveBeenCalledWith("Hotel not found");
    });
});

