import {useEffect, useState} from "react";
import { toast } from "react-toastify";
import useHotelStore from "../../../service/stores/hotel-store.tsx";
import {Button} from "../../../components/kit-ui/button.tsx";
import {Dialog} from "../../../components/kit-ui/dialog.tsx";
import HotelUpdate from "./hotel-update.tsx";
import HotelCreate from "./hotel-create.tsx";

export default function HotelsList() {
    const { hotels, loading, fetchHotels, deleteHotel} = useHotelStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    const handleUpdateClick = (id: number) => {
        setSelectedHotelId(id);
        setIsOpenUpdate(true);
    };
    useEffect(() => {
        fetchHotels().catch(() => toast.error("Erreur lors du chargement des hôtels."));
    }, [fetchHotels]);

    if (loading) {
        return <p className="text-center text-gray-700 mt-4">Chargement des hôtels...</p>;
    }

    if (!Array.isArray(hotels) || hotels.length === 0) {
        return <p className="text-center text-gray-700 mt-4">Aucun hôtel trouvé.</p>;
    }

    const handleDelete = async (id: number) => {
        if (window.confirm("Voulez-vous vraiment supprimer ?")) {
                await deleteHotel(id);
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-lg font-semibold text-gray-900 mt-5">Liste des Hôtels</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Voici la liste des hôtels disponibles avec leurs informations.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Button  onClick={() => setIsOpen(true)} className="bg-indigo-600 hover:bg-indigo-500">
                        Ajouter un hôtel
                    </Button>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                            <tr>
                                <th className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                    Nom
                                </th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Localisation
                                </th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Prix/Nuit
                                </th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Disponibilité
                                </th>
                                <th className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {hotels.map((hotel) => (
                                <tr key={hotel.id}>
                                    <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                                        {hotel.name}
                                    </td>
                                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{hotel.location}</td>
                                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                        {hotel.price_per_night} €
                                    </td>
                                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                        {hotel.available ? "Disponible" : "Non disponible"}
                                    </td>
                                    <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-500 mr-2"
                                            onClick={() => handleUpdateClick(hotel.id)}
                                        >
                                            Modifier
                                        </Button>
                                        <Button
                                            className="bg-red-600 hover:bg-red-500"
                                            onClick={() => handleDelete(hotel.id)}
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
            <Dialog  open={isOpen} onClose={() => setIsOpen(false)}>
                <HotelCreate setIsOpenCreate={setIsOpen}  />
            </Dialog>
            <Dialog open={isOpenUpdate} onClose={() => setIsOpenUpdate(false)}>
                {selectedHotelId && <HotelUpdate id={selectedHotelId} setIsOpenUpdate={setIsOpenUpdate}  />}
            </Dialog>
        </div>

    );
}
