import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { toast } from "react-toastify";
import {
    fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking
} from "../service-booking";
import { BookingCreateRequestData, BookingCreateResponseData } from "../../model/booking/booking-create";
import { BookingUpdateRequestData, BookingUpdateResponseData } from "../../model/booking/booking-update";
import { BookingFetchResponseData } from "../../model/booking/booking-fetch";
import {testEnv} from "../../../../env.ts";


// Mock de react-toastify
jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mock = new MockAdapter(axios);

const API_URL =  `${testEnv.VITE_API_URL}/bookings`;

describe("API Booking Tests", () => {
    afterEach(() => {
        mock.reset();
    });

    // ✅ TEST 1: Récupérer la liste des réservations
    it("should fetch bookings successfully", async () => {
        const mockResponse: BookingFetchResponseData = {
            data: [
                {
                    id: 1,
                    user_id: 1,
                    hotel_id: 1,
                    check_in_date: "2025-03-01",
                    check_out_date: "2025-03-07",
                    guests_count: 2,
                    status: "confirmed",
                    special_requests: "None",
                    guest_names: ["John Doe", "Jane Doe"],
                    contact_phone: "123456789",
                    total_price: 500,
                    created_at: "",
                    updated_at: ""
                },
                {
                    id: 2,
                    user_id: 2,
                    hotel_id: 2,
                    check_in_date: "2025-03-10",
                    check_out_date: "2025-03-15",
                    guests_count: 1,
                    status: "pending",
                    special_requests: "Late check-in",
                    guest_names: ["Alice Smith"],
                    contact_phone: "987654321",
                    total_price: 300,
                    created_at: "",
                    updated_at: ""
                }
            ]
        };
        mock.onGet(`${API_URL}`).reply(200, mockResponse);

        const response = await fetchBookings();

        expect(response.data).toEqual(mockResponse.data);
    });

    // ✅ TEST 2: Créer une réservation
    it("should create a booking successfully", async () => {
        const mockRequest: BookingCreateRequestData = {
            hotel_id: 1,
            check_in_date: "2025-03-01",
            check_out_date: "2025-03-07",
            special_requests: "None",
            guest_names: ["John Doe", "Jane Doe"],
            contact_phone: "123456789"
        };

        const mockResponse: BookingCreateResponseData = {
            message: "",
            data: {
                id: 1,
                user_id: 1,
                hotel_id: 1,
                check_in_date: "2025-03-01",
                check_out_date: "2025-03-07",
                status: "confirmed",
                special_requests: "None",
                guests_count : 1,
                guest_names: ["John Doe", "Jane Doe"],
                contact_phone: "123456789",
                total_price: 500,
                created_at: "",
                updated_at: ""
            }
        };

        mock.onPost(API_URL).reply(201, mockResponse);

        const response = await createBooking(mockRequest);

        expect(response).toEqual(mockResponse);
        expect(toast.success).toHaveBeenCalledWith("");
    });

    // ✅ TEST 3: Mettre à jour une réservation
    it("should update a booking successfully", async () => {
        const mockRequest: BookingUpdateRequestData = {
            check_in_date: "2025-03-01",
            check_out_date: "2025-03-07",
            status: "confirmed",
            special_requests: "None",
            guest_names: ["John Doe", "Jane Doe"],
            contact_phone: "123456789"
        };

        const mockResponse: BookingUpdateResponseData = {
            message: "",
            data: {
                id: 1,
                user_id: 1,
                hotel_id: 1,
                check_in_date: "2025-03-01",
                check_out_date: "2025-03-07",
                status: "confirmed",
                special_requests: "None",
                guests_count : 1,
                guest_names: ["John Doe", "Jane Doe"],
                contact_phone: "123456789",
                total_price: 500,
                created_at: "",
                updated_at: ""
            }
        };

        mock.onPut(`${API_URL}/1`).reply(200, mockResponse);

        const response = await updateBooking(1, mockRequest);

        expect(response).toEqual(mockResponse);
        expect(toast.success).toHaveBeenCalledWith("");
    });

    // ✅ TEST 4: Supprimer une réservation
    it("should delete a booking successfully", async () => {
        mock.onDelete(`${API_URL}/1`).reply(200, { message: "Réservation supprimée avec succès" });

        await deleteBooking(1);

        expect(toast.success).toHaveBeenCalledWith("Réservation supprimée avec succès");
    });

    // ❌ TEST 5: Gérer une erreur lors de la récupération des réservations
    it("should handle fetchBookings error", async () => {
        mock.onGet(`${API_URL}`).reply(500, { message: "Erreur serveur" });

        await expect(fetchBookings()).rejects.toThrow();
        expect(toast.error).toHaveBeenCalledWith("Erreur serveur");
    });

    // ❌ TEST 6: Gérer une erreur lors de la création d'une réservation
    it("should handle createBooking error", async () => {
        mock.onPost(API_URL).reply(400, { message: "Erreur de validation" });

        await expect(createBooking({
            hotel_id: 1,
            check_in_date: "",
            check_out_date: "",
            special_requests: "",
            guest_names: [],
            contact_phone: ""
        })).rejects.toThrow();

        expect(toast.error).toHaveBeenCalledWith("Erreur serveur");
    });
});
