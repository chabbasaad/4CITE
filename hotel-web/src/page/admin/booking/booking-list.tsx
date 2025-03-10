import {useEffect} from "react";
import useBookingStore from "../../../service/stores/booking-store";
import useHotelStore from "../../../service/stores/hotel-store";

export default function BookingList() {
    const { bookings, loading, fetchBookings } = useBookingStore();
    const { hotels, fetchHotels } = useHotelStore();

    useEffect(() => {
        fetchHotels();
        fetchBookings();
    }, [fetchBookings]);

    if (loading) {
        return <p className="mt-15 text-center text-gray-700 mt-4">Chargement des réservations...</p>;
    }

    if (!Array.isArray(bookings) || bookings.length === 0) {
        return <p className="mt-15 text-center text-gray-700 mt-4">Aucune réservation trouvée.</p>;
    }

    return (
        <div className="mt-15 px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-lg font-semibold text-gray-900 mt-5">Liste des Réservations</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Voici la liste des réservations effectuées dans le système.
                    </p>
                </div>

            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                            <tr>
                                <th className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                    Utilisateur
                                </th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Hôtel
                                </th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Date d'arrivée
                                </th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Date de départ
                                </th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Nombre d'invités
                                </th>
                                <th className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {bookings.map((booking) => {
                                    const hotel = hotels.find((hotel) => hotel.id === booking.hotel_id);
                                    return (
                                        <tr key={booking.id}>
                                            <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                                                {booking.guest_names.join(", ")}
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {hotel ? hotel.name : "Hôtel inconnu"}
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {new Date(booking.check_in_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {new Date(booking.check_out_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {booking.guests_count}
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
