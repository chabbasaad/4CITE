import { useState } from "react";
import useUserStore from "../../../service/stores/user-store.tsx";
import { UserCreateRequestData } from "../../../service/model/user/user-create.tsx";

export default function UserCreate() {
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
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
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
                        className="w-full p-2 border rounded"
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
                        className="w-full p-2 border rounded"
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
                        className="w-full p-2 border rounded"
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
                        className="w-full p-2 border rounded"
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
                        className="w-full p-2 border rounded"
                    >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                    </select>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-500"
                >
                    Ajouter l'utilisateur
                </button>
            </div>
        </div>
    );
}
