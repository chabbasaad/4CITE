import {Hotel} from "./hotel";


export interface HotelFetchResponseData {
    message: string,
    data: Hotel
}

export interface HotelFetchsResponseData {
    message: string,
    data: Hotel[]
}
