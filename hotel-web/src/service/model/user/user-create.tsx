import {User} from "./user";

export interface UserCreateRequestData {
    "name": string,
    "email": string,
    "pseudo": string,
    "password": string,
    "role": string,
    "password_confirmation": string
}

export interface UserCreateResponseData {
    "message": string,
    "data": User
}