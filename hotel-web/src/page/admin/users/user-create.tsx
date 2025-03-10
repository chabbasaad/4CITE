import { useState } from "react";
import useUserStore from "../../../service/stores/user-store";
import { UserCreateRequestData } from "../../../service/model/user/user-create";

export default function UserCreate({ setIsOpenCreate }: {  setIsOpenCreate: (open: boolean) => void }) {
    const { createUser } = useUserStore();
    const [userData, setUserData] = useState<UserCreateRequestData>({
        name: "",
        pseudo: "",
        email: "",
        password: "",
        role: "user",
        password_confirmation : "",

    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
            ...(name === "password" && { password_confirmation: value })
        });
    };

    const handleSubmit = async () => {
        await createUser(userData);
        setUserData({
            name: "",
            pseudo: "",
            email: "",
            password: "",
            role: "user",
            password_confirmation: ""
        });
        setIsOpenCreate(false);
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg ">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Ajouter un utilisateur</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block font-medium text-gray-700">Nom</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        placeholder="Nom complet"
                    />
                </div>

                <div>
                    <label htmlFor="pseudo" className="block font-medium text-gray-700">Pseudo</label>
                    <input
                        id="pseudo"
                        type="text"
                        name="pseudo"
                        value={userData.pseudo}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        placeholder="Pseudo"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        placeholder="Email"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block font-medium text-gray-700">Mot de passe</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        placeholder="Mot de passe"
                    />
                </div>

                <div>
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

                <button
                    onClick={handleSubmit}
                    className="w-full bg-gray-950 text-white p-2 rounded hover:bg-gray-800"
                >
                    Ajouter l'utilisateur
                </button>
            </div>
        </div>
    );
}
