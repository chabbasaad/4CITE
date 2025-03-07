import { create } from "zustand";
import {createUser, deleteUser, fetchUsers, updateUser} from "../servises/service-user.tsx";
import {User} from "../model/user/user.tsx";
import {UserCreateRequestData} from "../model/user/user-create.tsx";
import {UserUpdateRequestData} from "../model/user/user-update.tsx";

interface UserState {
    users: User[];
    user: User | null;
    loading: boolean;
    fetchUsers: () => Promise<void>;
    createUser : (params: UserCreateRequestData) => Promise<void>;
    updateUser : (id: number, params :UserUpdateRequestData)=> Promise<void>;
    deleteUser: (id: number) => Promise<void>;

}

const useUserStore = create<UserState>((set) => ({
    users: [],
    user: null,
    loading : false,

    fetchUsers: async () => {
        try {
            const response = await fetchUsers();
            const users = response.data
            set({ users });
        } catch (error) {
            console.error(error);
        }
    },

    createUser: async (params) => {
        set({ loading: true });
        try {
            const response  = await createUser(params);
            console.log(response)
            const newUser = response.data;
            set((state) => ({ users: [...state.users, newUser] }));
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },

    updateUser: async (id, params) => {
        set({ loading: true });
        try {
            const response  = await updateUser(id, params);
            const updatedUser = response.data;
            set((state ) => ({
                users: state.users.map((h) => (h.id === id ? updatedUser : h)),
                user: updatedUser,
            }));
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },

    deleteUser: async (id) => {
        set({ loading: true });
        try {
            await deleteUser(id);
            set((state) => ({
                users: state.users.filter((h) => h.id !== id),
                user: state.user?.id === id ? null : state.user,
            }));
        } catch (error) {
            console.error("Erreur lors de la suppression de l'hôtel:", error);
        } finally {
            set({ loading: false });
        }
    },

}));

export default useUserStore;
