import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useBookingStore from "../../../service/stores/booking-store.tsx"; // Supposons que vous avez un store booking-store.tsx
import { BookingUpdateRequestData } from "../../../service/model/booking/booking-update.tsx"; // Le modèle pour la mise à jour de la réservation

export default function BookingUpdate({ id ,setIsOpenUpdate}: { id: number,setIsOpenUpdate: (open: boolean) => void }) {
    const { bookings, loading, updateBooking } = useBookingStore();
    const [bookingData, setBookingData] = useState<BookingUpdateRequestData>({
        check_in_date: "",
        check_out_date: "",
        status: "pending", // L'état par défaut peut être "pending" ou autre selon votre logique
        special_requests: "",
        guest_names: [],
        contact_phone: "",
    });

    useEffect(() => {
        if (id) {
            const booking = bookings.find((booking) => booking.id === Number(id));
            if (booking) {
                setBookingData({
                    check_in_date: booking.check_in_date,
                    check_out_date: booking.check_out_date,
                    status: booking.status,
                    special_requests: booking.special_requests,
                    guest_names: booking.guest_names,
                    contact_phone: booking.contact_phone,
                });
            } else {
                toast.error("Réservation non trouvée.");
            }
        }
    }, [id, bookings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        setBookingData({
            ...bookingData,
            [name]: value,
        });
    };

    const handleGuestNamesChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        e.preventDefault();
        const updatedNames = [...bookingData.guest_names];
        updatedNames[index] = e.target.value;
        setBookingData({
            ...bookingData,
            guest_names: updatedNames,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateBooking(Number(id), bookingData);
        setIsOpenUpdate(false);
        window.location.reload();
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
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Statut</label>
                    <select
                        name="status"
                        value={bookingData.status}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="cancelled">Annulée</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Demandes spéciales</label>
                    <textarea
                        name="special_requests"
                        placeholder="Demandes spéciales"
                        value={bookingData.special_requests}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Noms des invités</label>
                    {bookingData.guest_names.map((guest, index) => (
                        <input
                            key={index}
                            type="text"
                            name={`guest_name_${index}`}
                            placeholder={`Nom de l'invité ${index + 1}`}
                            value={guest}
                            onChange={(e) => handleGuestNamesChange(e, index)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    ))}
                    <button
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, guest_names: [...bookingData.guest_names, ""] })}
                        className="text-indigo-600 mt-2"
                    >
                        Ajouter un invité
                    </button>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Numéro de téléphone</label>
                    <input
                        type="text"
                        name="contact_phone"
                        value={bookingData.contact_phone}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-gray-950 text-white py-2 rounded-lg font-semibold transition duration-200 hover:bg-gray-800 "
                >
                    Mettre à jour la réservation
                </button>
            </form>
        </div>
    );
}
