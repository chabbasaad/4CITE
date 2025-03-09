import {Hotel} from "./hotel.tsx";


export interface HotelFetchResponseData {
    message: string,
    data: Hotel
}

export interface HotelFetchsResponseData {
    message: string,
    data: Hotel[]
}
