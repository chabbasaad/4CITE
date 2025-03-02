import axios from "axios";
import {Post} from "../model/model.tsx";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

export const getPosts = async (): Promise<Post[]> => {
    const response = await axios.get<Post[]>(API_URL);
    return response.data.slice(0, 5); // On prend 5 posts pour l'exemple
};

export const addPost = async (post: Omit<Post, "id">): Promise<Post> => {
    const response = await axios.post<Post>(API_URL, post);
    return response.data;
};

export const deletePost = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
