import { useState, useEffect } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import useUserStore from "../../../service/stores/user-store";
import { toast } from "react-toastify";
import useBookingStore from "../../../service/stores/booking-store";
import { Dialog } from "../../../components/kit-ui/dialog";
import BookingUpdate from "../booking/booking-update";
import { ArchiveBoxIcon } from "@heroicons/react/16/solid";
import { UserUpdateRequestData } from "../../../service/model/user/user-update";
import useHotelStore from "../../../service/stores/hotel-store";

const secondaryNavigation = [
    { name: "General", href: "#", icon: UserCircleIcon },
    { name: "Reservation", href: "#", icon: ArchiveBoxIcon },
];

function classNames(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(" ");
}

export default function Profile() {
    const { updateUser,deleteUser } = useUserStore();
    const { bookings, fetchBookings, deleteBooking } = useBookingStore();
    const { hotels, fetchHotels } = useHotelStore();
    const [user, setUser] = useState<{ id: number; name: string; pseudo: string; email: string } | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

    const handleUpdateClick = (id: number) => {
        setSelectedBookingId(id);
        setIsOpenUpdate(true);
    };

    const [formData, setFormData] = useState<UserUpdateRequestData>({
        id: 1,
        name: "",
        pseudo: "",
        email: "",
        role: "user",
        password: "",
        password_confirmation: "",
    });
    const [currentNavigation, setCurrentNavigation] = useState("General");

    useEffect(() => {
        fetchHotels();
        const userData = localStorage.getItem("user_data");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setFormData({
                id: parsedUser.id,
                name: parsedUser.name,
                role: "user",
                pseudo: parsedUser.pseudo,
                email: parsedUser.email,
                password: parsedUser.password,
                password_confirmation: parsedUser.password,
            });
        }
        fetchBookings().catch(() => toast.error("Erreur lors du chargement des réservations."));
    }, [fetchBookings]);

    const handleSubmit = async () => {
        if (!user) return;
        try {
            const response = await updateUser(user.id, formData);
            if (response && response.data) {
                localStorage.setItem("user_data", JSON.stringify(response.data));
                setUser(response.data);
            } else {
                console.error("Réponse API invalide:", response);
            }

            setEditMode(false);
        } catch (error) {
            console.error("Erreur API:", error);
        }
    };

    const handleNavigationClick = (name: string) => {
        setCurrentNavigation(name);
    };

    const handleDeleteBooking = async (id: number) => {
        if (window.confirm("Voulez-vous vraiment supprimer?")) {
            await deleteBooking(id);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Voulez-vous vraiment supprimer ?")) {
            await deleteUser(id);
            localStorage.removeItem("user_token");
            localStorage.removeItem("user_data");
            window.location.reload();
        }
    };

    return (
        <>
            <div className="mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8">
                <h1 className="sr-only">Profile</h1>
                <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
                    <nav className="flex-none px-4 sm:px-6 lg:px-0">
                        <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
                            {secondaryNavigation.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavigationClick(item.name);
                                        }}
                                        className={classNames(
                                            currentNavigation === item.name
                                                ? "bg-gray-200 text-gray-950"
                                                : "text-gray-800 hover:bg-gray-950 hover:text-white",
                                            "group flex gap-x-3 rounded-md py-2 pr-3 pl-2 text-sm/6 font-semibold"
                                        )}
                                    >
                                        <item.icon
                                            aria-hidden="true"
                                            className={classNames(
                                                currentNavigation === item.name
                                                    ? "text-gray-950"
                                                    : "text-gray-400 group-hover:text-white",
                                                "size-6 shrink-0"
                                            )}
                                        />
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
                    <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
                        {currentNavigation === "General" && (
                            <div>
                                <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
                                <p className="mt-1 text-sm/6 text-gray-500">Modifiez vos informations personnelles.</p>
                                {user ? (
                                    <dl className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
                                        <div className="py-6 sm:flex">
                                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Nom</dt>
                                            <dd className="mt-1 sm:mt-0 sm:flex-auto">
                                                {editMode ? (
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="border border-gray-300 p-2 rounded-md w-full"
                                                    />
                                                ) : (
                                                    <span className="text-gray-900">{user.name}</span>
                                                )}
                                            </dd>
                                        </div>
                                        <div className="py-6 sm:flex">
                                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Pseudo</dt>
                                            <dd className="mt-1 sm:mt-0 sm:flex-auto">
                                                {editMode ? (
                                                    <input
                                                        type="text"
                                                        name="pseudo"
                                                        value={formData.pseudo}
                                                        onChange={handleChange}
                                                        className="border border-gray-300 p-2 rounded-md w-full"
                                                    />
                                                ) : (
                                                    <span className="text-gray-900">{user.pseudo}</span>
                                                )}
                                            </dd>
                                        </div>
                                        <div className="py-6 sm:flex">
                                            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email</dt>
                                            <dd className="mt-1 sm:mt-0 sm:flex-auto">
                                                {editMode ? (
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="border border-gray-300 p-2 rounded-md w-full"
                                                    />
                                                ) : (
                                                    <span className="text-gray-900">{user.email}</span>
                                                )}
                                            </dd>
                                        </div>
                                        {editMode && (
                                            <div className="py-6 sm:flex">
                                                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Nouveau
                                                    mot de passe
                                                </dt>
                                                <dd className="mt-1 sm:mt-0 sm:flex-auto">
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        className="border border-gray-300 p-2 rounded-md w-full"
                                                    />
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                ) : (
                                    <p className="text-sm/6 text-gray-500">Aucune information utilisateur trouvée.</p>
                                )}
                                <div className="mt-6">
                                    {editMode ? (
                                        <div className="flex gap-x-4">
                                            <button
                                                onClick={handleSubmit}
                                                className="px-4 py-2 text-white bg-gray-950 rounded-md hover:bg-gray-800"
                                            >
                                                Sauvegarder
                                            </button>
                                            <button
                                                onClick={() => setEditMode(false)}
                                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    ) : (
                                        <div >
                                            <button
                                                onClick={() => setEditMode(true)}
                                                className="px-4 py-2 text-white bg-gray-950 rounded-md hover:bg-white hover:text-gray-950"
                                            >
                                                Modifier
                                            </button>

                                            <button
                                                onClick={() => handleDelete(formData.id)}
                                                className="px-4 ml-5 py-2 text-white bg-gray-950 rounded-md hover:bg-white hover:text-gray-950"
                                            >
                                                Suprrime votre compte
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}

                        {currentNavigation === "Reservation" && (
                            <div>
                                <h2 className="text-base/7 font-semibold text-gray-900">Vos Réservations</h2>
                                <p className="mt-1 text-sm/6 text-gray-500">Ici, vous pouvez voir toutes vos
                                    réservations passées et futures.</p>
                                {bookings.length === 0 ? (
                                    <p className="mt-4 text-gray-900">Aucune réservation à afficher pour le moment.</p>
                                ) : (
                                    bookings.map((booking) => {
                                        // Trouver l'hôtel correspondant à booking.hotel_id
                                        const hotel = hotels.find((hotel) => hotel.id === booking.hotel_id);
                                        return (
                                            <div key={booking.id} className="bg-white shadow-md rounded-lg p-6 mt-6">
                                                <h3 className="text-lg font-semibold">{hotel ? hotel.name : "Hôtel inconnu"}</h3>
                                                <p className="text-sm text-gray-600">{hotel ? hotel.location : "Localisation inconnue"}</p>

                                                <div className="mt-2">
                                                    <strong>Dates :</strong>{" "}
                                                    {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
                                                    {new Date(booking.check_out_date).toLocaleDateString()}
                                                </div>
                                                <div className="mt-2">
                                                    <strong>Prix total :</strong> ${booking.total_price.toFixed(2)}
                                                </div>
                                                <div className="mt-2">
                                                    <strong>Nombre de personnes :</strong> {booking.guests_count}
                                                </div>
                                                <div className="mt-2">
                                                    <strong>Demande spéciale :</strong> {booking.special_requests || "Aucune"}
                                                </div>
                                                <div className="mt-2">
                                                    <strong>Contacts :</strong> {booking.contact_phone}
                                                </div>
                                                <div className="flex gap-4 mt-4">
                                                    <button
                                                        onClick={() => handleUpdateClick(booking.id)}
                                                        className="px-4 py-2 bg-gray-950 text-white rounded-md hover:bg-gray-800 focus:outline-none"
                                                    >
                                                        Modifier
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteBooking(booking.id)}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 focus:outline-none"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                </main>
                <Dialog open={isOpenUpdate} onClose={() => setIsOpenUpdate(false)}>
                    {selectedBookingId && <BookingUpdate id={selectedBookingId} setIsOpenUpdate={setIsOpenUpdate} />}
                </Dialog>
            </div>
        </>
    );
}
