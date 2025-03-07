
export interface UserRequest {
    id: number;
    name: string;
    email: string;
    password : string;
    password_confirmation : string;
    pseudo : string;
}

export interface UserResponseData {
    "id": 17,
    "name": string,
    "pseudo": string,
    "email": string,
    "role": string,
    "email_verified_at": string,
    "created_at": string,
    "updated_at": string,
    "deleted_at": string
}

export interface UserLogin {
    email: string;
    password : string;
}

export interface UserLoginResponseData {
    "message": string,
    "user": UserResponseData,
    "token": string
}

export interface UserRegisterResponseData {
    "message": string,
    "user": UserResponseData,
    "token": string
}



