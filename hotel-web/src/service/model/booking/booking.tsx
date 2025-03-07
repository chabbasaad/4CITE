export interface Booking{
    "id": number,
    "user_id": number,
    "hotel_id": number,
    "check_in_date": string,
    "check_out_date": string,
    "guests_count": number,
    "status": string,
    "special_requests": string,
    "guest_names": string[],
    "contact_phone": string,
    "total_price": number,
    "created_at": string,
    "updated_at": string
}

export interface BookingUser{
    "id": number,
    "user_id": number,
    "hotel_id": number,
    "check_in_date": string,
    "check_out_date": string,
    "guests_count": number,
    "status": string,
    "special_requests": string,
    "guest_names": string[],
    "contact_phone": string,
    "total_price": number,
    "created_at": string,
    "updated_at": string
}