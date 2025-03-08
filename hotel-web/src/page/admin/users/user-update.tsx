import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useUserStore from "../../../service/stores/user-store.tsx";
import { UserUpdateRequestData } from "../../../service/model/user/user-update.tsx";

export default function UserUpdate({ id, setIsOpenUpdate }: { id: number, setIsOpenUpdate: (open: boolean) => void }) {
    const { users, loading, updateUser } = useUserStore();
    const [userData, setUserData] = useState<UserUpdateRequestData>({
        name: "",
        pseudo: "",
        email: "",
        role: "user",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        if (id) {
            const user = users.find((user) => user.id === Number(id));
            if (user) {
                setUserData({
                    name: user.name,
                    pseudo: user.pseudo,
                    email: user.email,
                    role: user.role,
                    password: "",
                    password_confirmation: "",
                });
            } else {
                toast.error("Utilisateur non trouvé.");
            }
        }
    }, [id, users]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
            ...(name === "password" && { password_confirmation: value })
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateUser(Number(id), userData);
        setIsOpenUpdate(false);
    };

    if (loading) {
        return <p className="text-center text-gray-700 mt-4">Chargement des données...</p>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Modifier un utilisateur</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="block font-medium text-gray-700">Nom</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Nom de l'utilisateur"
                        value={userData.name}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="pseudo" className="block font-medium text-gray-700">Pseudo</label>
                    <input
                        id="pseudo"
                        type="text"
                        name="pseudo"
                        placeholder="Pseudo"
                        value={userData.pseudo}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email de l'utilisateur"
                        value={userData.email}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="role" className="block font-medium text-gray-700">Rôle</label>
                    <select
                        id="role"
                        name="role"
                        value={userData.role}
                        onChange={handleChange}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="block font-medium text-gray-700">Mot de passe</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Nouveau mot de passe"
                        value={userData.password}
                        onChange={handleChange}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password_confirmation" className="block font-medium text-gray-700">Confirmation du mot de passe</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        placeholder="Confirmez le mot de passe"
                        value={userData.password_confirmation}
                        onChange={handleChange}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-gray-950 text-white p-2 rounded hover:bg-gray-800"
                >
                    Mettre à jour l'utilisateur
                </button>
            </form>
        </div>
    );
}
