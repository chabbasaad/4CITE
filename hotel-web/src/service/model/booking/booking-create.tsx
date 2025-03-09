import {Booking} from "./booking.tsx";

export interface BookingCreateRequestData{
    "hotel_id": number,
    "check_in_date": string,
    "check_out_date": string,
    "special_requests": string,
    "guest_names": string[],
    "contact_phone": string,
}

export interface BookingCreateResponseData{
    "message": string,
    "data": Booking,
}