import { create } from "zustand";
import {Post} from "../model/model.tsx";
import {addPost, deletePost, getPosts} from "../servises/postService.tsx";

interface PostState {
    posts: Post[];
    fetchPosts: () => Promise<void>;
    addPost: (newPost: Omit<Post, "id">) => Promise<void>;
    deletePost: (id: number) => Promise<void>;
}

const usePostStore = create<PostState>((set) => ({
    posts: [],

    fetchPosts: async () => {
        try {
            const posts = await getPosts();
            set({ posts });
        } catch (error) {
            console.error("Erreur de chargement des posts:", error);
        }
    },

    addPost: async (newPost) => {
        try {
            const post = await addPost(newPost);
            set((state) => ({ posts: [post, ...state.posts] }));
        } catch (error) {
            console.error("Erreur d'ajout:", error);
        }
    },

    deletePost: async (id) => {
        try {
            await deletePost(id);
            set((state) => ({ posts: state.posts.filter((post) => post.id !== id) }));
        } catch (error) {
            console.error("Erreur de suppression:", error);
        }
    }
}));

export default usePostStore;
