import axios from "axios";
import {User} from "../model/model.tsx";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export const getUsers = async (): Promise<User[]> => {
    const response = await axios.get<User[]>(API_URL);
    return response.data;
};
