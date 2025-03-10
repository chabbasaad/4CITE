import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useHotelStore from "../../../service/stores/hotel-store.tsx";
import { toast } from "react-toastify";
import { StarIcon } from '@heroicons/react/20/solid'
import useBookingStore from "../../../service/stores/booking-store.tsx";
import { BookingCreateRequestData } from "../../../service/model/booking/booking-create.tsx";
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/react";

const reviews = { href: '#', average: 4, totalCount: 117 }

export default function HotelOverview() {
    const { id } = useParams();
    const { hotels, fetchHotel } = useHotelStore();
    const { createBooking } = useBookingStore();

    const [hotelData, setHotelData] = useState<BookingCreateRequestData>({
        hotel_id: id ? Number(id) : 0,
        check_in_date: "",
        check_out_date: "",
        contact_phone: "",
        special_requests: "",
        guest_names: [""],
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
        await createBooking(hotelData);
        setHotelData({
            hotel_id: id ? Number(id) : 0,
            check_in_date: "",
            check_out_date: "",
            contact_phone: "",
            special_requests: "",
            guest_names: [""],
        });
    };

    useEffect(() => {
        if (id) {
            fetchHotel(Number(id)).catch(() => toast.error("Erreur lors du chargement de l'hôtel."));
        }
    }, [id, fetchHotel]);

    const hotel = hotels.find(h => h.id === Number(id));

    if (!hotel) {
        return <p className="text-center text-gray-500 mt-4">Hôtel introuvable.</p>;
    }

    function classNames(...classes: (string | boolean | undefined | null)[]): string {
        return classes.filter(Boolean).join(" ");
    }

    return (
        <div className="bg-white mt-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <TabGroup className="flex flex-col-reverse">
                    <div className="mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                        <TabList className="grid grid-cols-4 gap-6">
                            {hotel.picture_list.map((image: string, index: number) => (
                                <Tab
                                    key={index}
                                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-offset-4"
                                >
                                    <span className="sr-only">View image {index + 1}</span>
                                    <span className="absolute inset-0 overflow-hidden rounded-md">
                                        <img 
                                            src={image} 
                                            alt="" 
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </span>
                                    <span
                                        className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2"
                                        aria-hidden="true"
                                    />
                                </Tab>
                            ))}
                        </TabList>
                    </div>

                    <div className="w-full">
                        <TabPanels className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-lg">
                            {hotel.picture_list.map((image: string, index: number) => (
                                <TabPanel key={index}>
                                    <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
                                        <img
                                            src={image}
                                            alt={`View of ${hotel.name}`}
                                            className="absolute inset-0 h-full w-full object-cover object-center"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-10"></div>
                                    </div>
                                </TabPanel>
                            ))}
                        </TabPanels>
                    </div>
                </TabGroup>
            </div>

            <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
                <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{hotel.name}</h1>
                </div>

                <div className="mt-4 lg:row-span-3 lg:mt-0">
                    <h2 className="sr-only">Product information</h2>
                    <p className="text-3xl tracking-tight text-gray-900">{hotel.price_per_night} par nuit</p>

                    <div className="mt-10">
                        <h2 className="text-sm font-medium text-gray-900">Details</h2>

                        <div className="mt-4 space-y-6">
                            <p className="text-sm text-gray-600">
                                Notre chambre d'hôtel est conçue pour offrir un confort optimal et une expérience
                                inoubliable.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="sr-only">Reviews</h3>
                        <div className="flex items-center">
                            <div className="flex items-center">
                                {[0, 1, 2, 3, 4].map((rating) => (
                                    <StarIcon
                                        key={rating}
                                            aria-hidden="true"
                                            className={classNames(
                                                reviews.average > rating ? 'text-yellow-300' : 'text-gray-200',
                                                'size-5 shrink-0',
                                            )}
                                        />
                                    ))}
                                </div>
                                <p className="sr-only">{reviews.average} out of 5 stars</p>
                                <a href={reviews.href}
                                   className="ml-3 text-sm font-medium text-gray-950 hover:text-gray-900">
                                    {reviews.totalCount} reviews
                                </a>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h3 className="text-sm font-medium text-gray-900">Réserver maintenant</h3>

                            <div className="mt-4 space-y-6">
                                <div>
                                    <label htmlFor="check_in_date" className="block text-sm font-medium text-gray-700">Date d'entrée</label>
                                    <input
                                        id="check_in_date"
                                        type="datetime-local"
                                        name="check_in_date"
                                        value={hotelData.check_in_date}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="check_out_date" className="block text-sm font-medium text-gray-700">Date de sortie</label>
                                    <input
                                        id="check_out_date"
                                        type="datetime-local"
                                        name="check_out_date"
                                        value={hotelData.check_out_date}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
                                    <input
                                        id="contact_phone"
                                        type="tel"
                                        name="contact_phone"
                                        value={hotelData.contact_phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border rounded"
                                        placeholder="Numéro de téléphone"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="special_requests" className="block text-sm font-medium text-gray-700">Demandes spéciales</label>
                                    <textarea
                                        id="special_requests"
                                        name="special_requests"
                                        value={hotelData.special_requests}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                        placeholder="Écrivez vos demandes spéciales ici"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="guest_names" className="block text-sm font-medium text-gray-700">Noms des invités</label>
                                    <input
                                        id="guest_names"
                                        type="text"
                                        name="guest_names"
                                        value={hotelData.guest_names.join(", ")}
                                        onChange={e =>
                                            setHotelData({
                                                ...hotelData,
                                                guest_names: e.target.value.split(",").map((name) => name.trim())
                                            })
                                        }
                                        className="w-full p-2 border rounded"
                                        placeholder="Noms des invités (séparés par des virgules)"
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="mt-4 w-full bg-gray-950 text-white py-3 rounded-md hover:bg-gray-800"
                                >
                                    Réserver maintenant
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
                        <div>
                            <h3 className="sr-only">Description</h3>

                            <div className="space-y-6">
                                <p className="text-base text-gray-900">{hotel.description}</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

                            <div className="mt-4">
                                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                                    <li>
                                        <strong>Chambres Disponibles :</strong> {hotel.available_rooms}
                                    </li>
                                    <li>
                                        <strong>Disponibilité
                                            :</strong> {hotel.is_available ? "Disponible" : "Indisponible"}
                                    </li>
                                    <li>
                                        <strong>Localisation :</strong> {hotel.location}
                                    </li>
                                    <li>
                                        <strong>Nombre Total de Chambres :</strong> {hotel.total_rooms}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-10">
                            <h2 className="text-sm font-medium text-gray-900">Details</h2>

                            <div className="mt-4 space-y-6">
                                <p className="text-sm text-gray-600">
                                    Notre chambre d'hôtel est conçue pour offrir un confort optimal et une expérience
                                    inoubliable. Située dans un cadre paisible, elle combine élégance et modernité, avec
                                    une attention particulière aux détails pour garantir un séjour agréable et relaxant.

                                    Notre chambre d'hôtel est conçue pour offrir un confort optimal et une expérience
                                    inoubliable. Située dans un cadre paisible, elle combine élégance et modernité, avec
                                    une attention particulière aux détails pour garantir un séjour agréable et relaxant.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

        </div>
    );
}
