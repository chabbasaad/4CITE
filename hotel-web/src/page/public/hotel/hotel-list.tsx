import { useNavigate } from "react-router-dom";
import useHotelStore from "../../../service/stores/hotel-store.tsx";
import {useEffect} from "react";
import {toast} from "react-toastify";

export default function HotelList() {
    const { hotels, loading, fetchHotels } = useHotelStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchHotels().catch(() => toast.error("Erreur lors du chargement des hôtels."));
    }, [fetchHotels]);

    if (!Array.isArray(hotels)) {
        return <p className="text-center text-white mt-4">Aucun hôtel trouvé.</p>;
    }

    return (
        <div className="bg-black">
            <div className="py-16 sm:py-24 lg:mx-auto lg:max-w-7xl lg:px-8">
                <div className="flex items-center">
                    <h2 style={{justifyContent: "center"}} className="text-2xl font-bold tracking-tight text-white">Nos Hôtels</h2>
                </div>

                {loading ? (
                    <p className="text-center text-white mt-4">Chargement en cours...</p>
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {hotels.slice(0, 8).map((hotel) => (
                            <div
                                key={hotel.id}
                                className="group relative rounded-lg border p-4 shadow-lg cursor-pointer"
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
                        ))}
                    </div>

                )}
            </div>
        </div>
    );
}
