import { create } from "zustand";
import {getUsers} from "../servises/userSerivice.tsx";
import {User} from "../model/model.tsx";

interface UserState {
    users: User[];
    fetchUsers: () => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
    users: [],

    fetchUsers: async () => {
        try {
            const users = await getUsers();
            set({ users });
        } catch (error) {
            console.error("Erreur de chargement des utilisateurs:", error);
        }
    }
}));

export default useUserStore;
