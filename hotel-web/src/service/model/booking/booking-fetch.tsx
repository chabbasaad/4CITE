import {Booking} from "./booking";

export interface BookingFetchResponseData {
    data: Booking[]
}



export interface BookingFetchRequestData{
    direction: string;
    per_page : string;
    sort_by : string;
}