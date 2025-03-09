
export interface Hotel {
    id: number;
    name: string;
    location: string;
    price_per_night: number;
    available: boolean;
    description : string;
    picture_list : string[];
    amenities : string[];
    is_available : boolean;
    total_rooms : number;
    created_at: string;
    updated_at: string;
    available_rooms : number;
}
