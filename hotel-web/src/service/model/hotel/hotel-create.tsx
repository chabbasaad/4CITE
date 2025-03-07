import {Hotel} from "../model-hotel.tsx";

export interface HotelCreateRequestData {
    name: string;
    location: string;
    description: string;
    price_per_night: number;
    is_available: boolean;
    total_rooms: number;
    available_rooms: number;
    picture_list: string[] ;
    amenities: string[] ;
    available: boolean;
}


export interface HotelCreateResponseData {
    message: string,
    data: Hotel
}
