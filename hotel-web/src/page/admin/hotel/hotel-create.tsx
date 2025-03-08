import { useState } from "react";
import useHotelStore from "../../../service/stores/hotel-store.tsx";
import {HotelCreateRequestData} from "../../../service/model/hotel/hotel-create.tsx";

export default function HotelCreate({  setIsOpenCreate }: { setIsOpenCreate: (open: boolean) => void }) {
    const { createHotel } = useHotelStore();
    const [hotelData, setHotelData] = useState<HotelCreateRequestData>({
        name: "Hôtel Example",
        location: "Paris, France",
        description: "Un hôtel de luxe au cœur de Paris.",
        price_per_night: 150,
        is_available: true,
        total_rooms: 50,
        available_rooms: 10,
        picture_list: [],
        amenities: ["Wi-Fi", "Climatisation", "Parking"],
        available: true
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        const { name, value, type } = e.target;
        setHotelData({
            ...hotelData,
            [name]: type === "number" ? Number(value) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createHotel(hotelData);
        setHotelData({
                name: "",
                location: "",
                description: "",
                price_per_night: 0,
                is_available: true,
                total_rooms: 1,
                available_rooms: 0,
                picture_list: [],
                amenities: [],
                available: true
            });
        setIsOpenCreate(false);
    };

    return (
        <div className="max-w-2xl  mx-auto bg-white  rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Ajouter un hôtel</h2>
            <div className="space-y-6 d-flex">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <div className="space-y-2">
                            <label htmlFor="name" className="block  m-2 font-medium text-gray-700">Nom de l'hôtel</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={hotelData.name}
                                onChange={handleChange}
                                required
                                className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                placeholder="Nom de l'hôtel"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="location" className="m-2 block font-medium text-gray-700">Localisation</label>
                            <input
                                id="location"
                                type="text"
                                name="location"
                                value={hotelData.location}
                                onChange={handleChange}
                                required
                                className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                placeholder="Localisation de l'hôtel"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="m-2 block font-medium text-gray-700">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={hotelData.description}
                                onChange={handleChange}
                                required
                                className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                placeholder="Description de l'hôtel"
                            />
                        </div>

                        <div className="space-y-2 mt-2">
                            <label htmlFor="price_per_night" className=" m-2 block font-medium text-gray-700">Prix par nuit
                                (€)</label>
                            <input
                                id="price_per_night"
                                type="number"
                                name="price_per_night"
                                value={hotelData.price_per_night}
                                onChange={handleChange}
                                required
                                className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                placeholder="Prix par nuit"
                            />
                        </div>
                    </div>
                    <div>

                        <div className="space-y-2">
                            <label htmlFor="total_rooms" className="m-2 block font-medium text-gray-700">Nombre total de
                                chambres</label>
                            <input
                                id="total_rooms"
                                type="number"
                                name="total_rooms"
                                value={hotelData.total_rooms}
                                onChange={handleChange}
                                required
                                className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                placeholder="Nombre total de chambres"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="available_rooms" className="m-2 block font-medium text-gray-700">Nombre de
                                chambres
                                disponibles</label>
                            <input
                                id="available_rooms"
                                type="number"
                                name="available_rooms"
                                value={hotelData.available_rooms}
                                onChange={handleChange}
                                required
                                className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                placeholder="Chambres disponibles"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="amenities" className="m-2 block font-medium text-gray-700">Services et
                                Commodités</label>
                            <input
                                id="amenities"
                                type="text"
                                name="amenities"
                                value={hotelData?.amenities.join(", ")}
                                onChange={e => setHotelData({
                                    ...hotelData,
                                    amenities: e.target.value.split(",").map(item => item.trim())
                                })}
                                className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                placeholder="Services, séparés par des virgules"
                            />
                        </div>
                        <div>
                            <label className="m-2 block font-medium text-gray-700">Photos de l'hôtel</label>
                            <input
                                type="text"
                                name="picture_list"
                                value={hotelData?.picture_list.join(", ")}
                                onChange={(e) =>
                                    setHotelData({
                                        ...hotelData,
                                        picture_list: e.target.value.split(",").map(item => item.trim()),
                                    })
                                }
                                className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                placeholder="URLs des images séparées par des virgules"
                            />
                        </div>
                    </div>
                </div>


                <button
                    onClick={handleSubmit}
                    className="w-full bg-gray-950 text-white p-2 rounded hover:bg-gray-8000"
                >
                    Ajouter l'hôtel
                </button>
            </div>
        </div>
    );
}
