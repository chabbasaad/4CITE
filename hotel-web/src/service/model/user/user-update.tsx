import {User} from "./user.tsx";

export interface UserUpdateRequestData{
    id : number
    name: string,
    pseudo: string,
    password: string
    email: string,
    role: string,
    password_confirmation : string
}

export interface UserUpdateResponseData {
    message: string,
    data : User
}