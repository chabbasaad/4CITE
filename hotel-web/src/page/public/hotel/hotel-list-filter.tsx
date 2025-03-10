import { useEffect, useState } from 'react';
import useHotelStore from "../../../service/stores/hotel-store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function HotelListFilter() {
    const { hotels, loading, fetchHotels } = useHotelStore();
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        search: '',
        location: '',
        min_price: 0,
        max_price: 0,
        available: 'false',
        sort_by: "price_per_night",
        direction: "asc",
    });

    useEffect(() => {
        fetchHotels().catch(() => toast.error("Erreur lors du chargement des hôtels."));
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: name.includes("price") ? (value ? parseFloat(value) : 0) : value,
        }));
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            location: '',
            min_price: 0,
            max_price: 0,
            available: 'false',
            sort_by: "price_per_night",
            direction: "asc",
        });
    };

    // Filtrage des hôtels localement
    const filteredHotels = hotels
        .filter(hotel =>
            hotel.name.toLowerCase().includes(filters.search.toLowerCase()) &&
            hotel.location.toLowerCase().includes(filters.location.toLowerCase()) &&
            (filters.min_price === 0 || hotel.price_per_night >= filters.min_price) &&
            (filters.max_price === 0 || hotel.price_per_night <= filters.max_price) &&
            (filters.available === "false" || hotel.is_available === true)
        )
        .sort((a, b) => {
            const fieldA = a[filters.sort_by as keyof typeof a];
            const fieldB = b[filters.sort_by as keyof typeof b];

            if (typeof fieldA === "number" && typeof fieldB === "number") {
                return filters.direction === "asc" ? fieldA - fieldB : fieldB - fieldA;
            } else if (typeof fieldA === "string" && typeof fieldB === "string") {
                return filters.direction === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
            }
            return 0;
        });

    return (
        <div className="bg-gray-950 min-h-screen">
            <main className="bg-gray-950 mx-auto max-w-7xl px-4 py-16">
                <div className="border-b pb-10 flex justify-between items-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white">Nos Hôtels</h1>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">Filtres</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <input
                            type="text"
                            name="search"
                            placeholder="Nom de l'hôtel"
                            value={filters.search}
                            onChange={handleInputChange}
                            className="p-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700"
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Localisation"
                            value={filters.location}
                            onChange={handleInputChange}
                            className="p-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700"
                        />
                        <input
                            type="number"
                            name="min_price"
                            placeholder="Prix min (€)"
                            value={filters.min_price || ''}
                            onChange={handleInputChange}
                            className="p-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700"
                        />
                        <input
                            type="number"
                            name="max_price"
                            placeholder="Prix max (€)"
                            value={filters.max_price || ''}
                            onChange={handleInputChange}
                            className="p-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700"
                        />
                        <select
                            name="available"
                            value={filters.available}
                            onChange={handleInputChange}
                            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
                        >
                            <option value="false">Tous</option>
                            <option value="true">Disponible</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                        <select
                            name="sort_by"
                            value={filters.sort_by}
                            onChange={handleInputChange}
                            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
                        >
                            <option value="name">Nom</option>
                            <option value="location">Localisation</option>
                            <option value="price_per_night">Prix</option>
                            <option value="created_at">Date d'ajout</option>
                        </select>

                        <select
                            name="direction"
                            value={filters.direction}
                            onChange={handleInputChange}
                            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
                        >
                            <option value="asc">Croissant</option>
                            <option value="desc">Décroissant</option>
                        </select>
                    </div>

                    <div className="mt-4 flex justify-end space-x-4">
                        <button
                            onClick={resetFilters}
                            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Réinitialiser
                        </button>
                    </div>
                </div>

                <div className="bg-gray-950 mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {loading ? (
                        <p className="text-center text-white bg-gray-950">Chargement...</p>
                    ) : (
                        filteredHotels.length > 0 ? (
                            filteredHotels.map((hotel) => (
                                <div
                                    key={hotel.id}
                                    className="group relative rounded-lg border p-4 shadow-lg cursor-pointer bg-gray-900 hover:bg-gray-800"
                                    onClick={() => navigate(`/hotel/${hotel.id}`)}
                                >
                                    <img
                                        src={hotel.picture_list[0]}
                                        alt={hotel.name}
                                        className="w-full h-48 object-cover rounded-md group-hover:opacity-75"
                                    />
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold text-white">{hotel.name}</h3>
                                        <p className="text-sm text-white">{hotel.location}</p>
                                        <p className="text-sm mt-1 text-white">{hotel.description}</p>
                                        <p className="mt-2 font-semibold text-white">
                                            {hotel.price_per_night.toFixed(2)} € / nuit
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-white col-span-full">Aucun hôtel ne correspond aux filtres sélectionnés.</p>
                        )
                    )}
                </div>
            </main>
        </div>
    );
}
