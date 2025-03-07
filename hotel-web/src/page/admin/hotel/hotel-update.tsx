import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useHotelStore from "../../../service/stores/hotel-store.tsx";
import { HotelUpdateRequestData } from "../../../service/model/hotel/hotel-update.tsx";

export default function HotelUpdate({ id }: { id: number }) {
    const { hotels, loading, updateHotel } = useHotelStore();
    const [hotelData, setHotelData] = useState<HotelUpdateRequestData>({
        name: "",
        location: "",
        description: "",
        price_per_night: 0,
        is_available: true,
        total_rooms: 1,
        available_rooms: 0,
        picture_list: [],
        amenities: ["test"],
    });

    useEffect(() => {
        if (id) {
            const hotel = hotels.find((hotel) => hotel.id === Number(id));
            if (hotel) {
                setHotelData({
                    name: hotel.name,
                    location: hotel.location,
                    description: hotel.description,
                    price_per_night: hotel.price_per_night,
                    is_available: hotel.available,
                    total_rooms: hotel.total_rooms,
                    available_rooms: hotel.available_rooms,
                    picture_list: hotel.picture_list,
                    amenities: ["test"],
                });
            } else {
                toast.error("Hôtel non trouvé.");
            }
        }
    }, [id, hotels]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setHotelData({
            ...hotelData,
            [name]: type === "number" ? Number(value) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateHotel(Number(id), hotelData);
    };

    if (loading) {
        return <p className="text-center text-gray-700 mt-4">Chargement des données...</p>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-center">Modifier un hôtel</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-gray-700 font-medium">Nom de l'hôtel</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nom de l'hôtel"
                        value={hotelData.name}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Localisation</label>
                    <input
                        type="text"
                        name="location"
                        placeholder="Localisation"
                        value={hotelData.location}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Description</label>
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={hotelData.description}
                        onChange={handleChange}
                        rows={4}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Prix par nuit (€)</label>
                        <input
                            type="number"
                            name="price_per_night"
                            placeholder="Prix par nuit"
                            value={hotelData.price_per_night}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Nombre total de chambres</label>
                        <input
                            type="number"
                            name="total_rooms"
                            placeholder="Nombre total de chambres"
                            value={hotelData.total_rooms}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Chambres disponibles</label>
                    <input
                        type="number"
                        name="available_rooms"
                        placeholder="Nombre de chambres disponibles"
                        value={hotelData.available_rooms}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold transition duration-200 hover:bg-indigo-500 hover:scale-105"
                >
                    Mettre à jour l'hôtel
                </button>
            </form>
        </div>
    );
}
