import {useEffect, useState} from "react";
import { toast } from "react-toastify";
import { Button } from "../../../components/kit-ui/button.tsx";
import useBookingStore from "../../../service/stores/booking-store.tsx";
import {Dialog} from "../../../components/kit-ui/dialog.tsx";
import HotelUpdate from "../hotel/hotel-update.tsx";

export default function BookingList() {
    const { bookings, loading, fetchBookings, deleteBooking } = useBookingStore();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    const handleUpdateClick = (id: number) => {
        setSelectedHotelId(id);
        setIsOpen(true);
    };
    useEffect(() => {
        fetchBookings().catch(() => toast.error("Erreur lors du chargement des réservations."));
    }, [fetchBookings]);

    if (loading) {
        return <p className="text-center text-gray-700 mt-4">Chargement des réservations...</p>;
    }

    if (!Array.isArray(bookings) || bookings.length === 0) {
        return <p className="text-center text-gray-700 mt-4">Aucune réservation trouvée.</p>;
    }

    const handleDelete = async (id: number) => {
        if (window.confirm("Voulez-vous vraiment supprimer ?")) {
                await deleteBooking(id);
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
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
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                                        {booking.guest_names.join(", ")}
                                    </td>
                                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                        {booking.hotel_id}
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
                                    <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-500 mr-2"
                                            onClick={() => handleUpdateClick(booking.id)}
                                        >
                                            Modifier
                                        </Button>
                                        <Button
                                            className="bg-red-600 hover:bg-red-500"
                                            onClick={() => handleDelete(booking.id)}
                                        >
                                            Supprimer
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                {selectedHotelId && <HotelUpdate id={selectedHotelId} />}
            </Dialog>
        </div>
    );
}
