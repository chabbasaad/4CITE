import {Hotel} from "./hotel.tsx";

export interface HotelUpdateRequestData{
    "name": string,
    "location": string,
    "description": string,
    "price_per_night": number,
    "is_available": boolean,
    "total_rooms": number,
    "available_rooms": number,
    "picture_list": string[],
    "amenities": string[]
}

export interface HotelUpdateResponseData {
    "message": string,
    "data": Hotel
}