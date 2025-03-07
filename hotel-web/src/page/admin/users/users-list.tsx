import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../../components/kit-ui/button.tsx";
import { Dialog } from "../../../components/kit-ui/dialog.tsx";
import UserCreate from "./user-create.tsx";
import useUserStore from "../../../service/stores/user-store.tsx";
import UserUpdate from "./user-update.tsx";

export default function UsersList() {
    const { users, loading, fetchUsers, deleteUser } = useUserStore();
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchUsers().catch(() => toast.error("Erreur lors du chargement des utilisateurs."));
    }, [fetchUsers]);

    if (loading) {
        return <p className="text-center text-gray-700 mt-4">Chargement des utilisateurs...</p>;
    }

    if (!Array.isArray(users) || users.length === 0) {
        return <p className="text-center text-gray-700 mt-4">Aucun utilisateur trouvé.</p>;
    }

    const handleUpdateClick = (id: number) => {
        setSelectedUserId(id);
        setIsOpenUpdate(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Voulez-vous vraiment supprimer ?")) {
            await deleteUser(id);
        }
    };

    return (
        <div className="flex flex-col px-4 sm:px-6 lg:px-8">
            {/* En-tête */}
            <div className="sm:flex sm:items-center mb-4">
                <div className="sm:flex-auto">
                    <h1 className="text-lg font-semibold text-gray-900 mt-5">Liste des Utilisateurs</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Voici la liste des utilisateurs enregistrés dans le système.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Button onClick={() => setIsOpen(true)} className="bg-indigo-600 hover:bg-indigo-500">
                        Ajouter un utilisateur
                    </Button>
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-y-auto max-h-full">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                <tr>
                                    <th className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        Nom
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Pseudo
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Email
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Rôle
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Créé le
                                    </th>
                                    <th className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                                            {user.name}
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                            {user.pseudo}
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                            {user.email}
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                            {user.role}
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                                            <Button
                                                className="bg-blue-600 hover:bg-blue-500 mr-2"
                                                onClick={() => handleUpdateClick(user.id)}
                                            >
                                                Modifier
                                            </Button>
                                            <Button
                                                className="bg-red-600 hover:bg-red-500"
                                                onClick={() => handleDelete(user.id)}
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
            </div>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <UserCreate />
            </Dialog>
            <Dialog open={isOpenUpdate} onClose={() => setIsOpenUpdate(false)}>
                {selectedUserId && <UserUpdate id={selectedUserId} />}
            </Dialog>
        </div>
    );
}
