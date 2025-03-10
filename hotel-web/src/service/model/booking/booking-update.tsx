import {Booking} from "./booking";

export interface BookingUpdateRequestData {
    "check_in_date": string,
    "check_out_date": string,
    "status": string,
    "special_requests": string,
    "guest_names": string[],
    "contact_phone": string,
}

export interface BookingUpdateResponseData{
    "message": string,
    "data": Booking,
}