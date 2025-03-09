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

// Mock de react-toastify
jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mock = new MockAdapter(axios);
const apiUrl = "http://89.168.20.112:8000/api";
const API_URL = `${apiUrl}/hotels`;

describe("API Hotel Tests", () => {
    afterEach(() => {
        mock.reset();
    });

    // ✅ TEST 1: Récupérer la liste des hôtels
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

    // ✅ TEST 3: Créer un hôtel
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

    // ✅ TEST 4: Mettre à jour un hôtel
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

    // ✅ TEST 5: Supprimer un hôtel
    it("should delete a hotel successfully", async () => {
        mock.onDelete(`${API_URL}/1`).reply(200, { message: "Hôtel supprimé avec succès" });

        await deleteHotel(1);

        expect(toast.success).toHaveBeenCalledWith("Hôtel supprimé avec succès");
    });

    // ❌ TEST 6: Gérer une erreur lors de la récupération des hôtels
    it("should handle fetchHotels error", async () => {
        mock.onGet(`${API_URL}`).reply(500, { message: "Erreur serveur" });

        await expect(fetchHotels()).rejects.toThrow();
        expect(toast.error).toHaveBeenCalledWith("Erreur serveur");
    });

    // ❌ TEST 7: Gérer une erreur lors de la création d'un hôtel
    it("should handle createHotel error", async () => {
        mock.onPost(API_URL).reply(400, { message: "Erreur de validation" });

        await expect(createHotel({
            name: "", location: "", description: "", price_per_night: 0, is_available: false, total_rooms: 0, available_rooms: 0, picture_list: [], amenities: [], available: false
        })).rejects.toThrow();

        expect(toast.error).toHaveBeenCalledWith("Erreur serveur");
    });
});

