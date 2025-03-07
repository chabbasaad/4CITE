import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useBookingStore from "../../../service/stores/booking-store.tsx";
import { BookingUpdateRequestData } from "../../../service/model/booking/booking-update.tsx";

export default function BookingUpdate({ id }: { id: number }) {
    const { bookings, loading, updateBooking } = useBookingStore();
    const [bookingData, setBookingData] = useState<BookingUpdateRequestData>({
        check_in_date: "",
        check_out_date: "",
        status: "confirmed",
        special_requests: "",
        guest_names: [],
        contact_phone: "",
    });

    useEffect(() => {
        if (id) {
            const booking = bookings.find((booking) => booking.id === id);
            if (booking) {
                setBookingData({
                    check_in_date: booking.check_in_date,
                    check_out_date: booking.check_out_date,
                    status: booking.status,
                    special_requests: booking.special_requests || "",
                    guest_names: booking.guest_names || [],
                    contact_phone: booking.contact_phone || "",
                });
            } else {
                toast.error("Réservation non trouvée.");
            }
        }
    }, [id, bookings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setBookingData({
            ...bookingData,
            [name]: type === "number" ? Number(value) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateBooking(id, bookingData);

    };

    if (loading) {
        return <p className="text-center text-gray-700 mt-4">Chargement des données...</p>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg ">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-center">Modifier une réservation</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-gray-700 font-medium">Date d'arrivée</label>
                    <input
                        type="date"
                        name="check_in_date"
                        value={bookingData.check_in_date}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Date de départ</label>
                    <input
                        type="date"
                        name="check_out_date"
                        value={bookingData.check_out_date}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Statut</label>
                    <select
                        name="status"
                        value={bookingData.status}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                        <option value="confirmed">Confirmé</option>
                        <option value="canceled">Annulé</option>
                        <option value="checked-in">Arrivé</option>
                        <option value="checked-out">Parti</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Demandes spéciales</label>
                    <textarea
                        name="special_requests"
                        placeholder="Demande spéciale (facultatif)"
                        value={bookingData.special_requests}
                        onChange={handleChange}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Nom des invités</label>
                    <input
                        type="text"
                        name="guest_names"
                        placeholder="Nom des invités"
                        value={bookingData.guest_names.join(", ")}
                        onChange={(e) => setBookingData({
                            ...bookingData,
                            guest_names: e.target.value.split(",").map((name) => name.trim()),
                        })}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Numéro de contact</label>
                    <input
                        type="text"
                        name="contact_phone"
                        placeholder="Numéro de contact"
                        value={bookingData.contact_phone}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-gray-950 text-white py-2 rounded-lg font-semibold transition duration-200 hover:bg-gray-800"
                >
                    Mettre à jour la réservation
                </button>
            </form>
        </div>
    );
}
