
export interface Hotel {
    id: number;
    name: string;
    location: string;
    price_per_night: number;
    available: boolean;
    description : string;
    picture_list : string[];
    amenities : string;
    is_available : boolean;
    total_rooms : number;
    created_at: string;
    updated_at: string;
    available_rooms : number;
}



export interface GetHotelsParams {
    available: boolean;
    direction: "asc" | "desc";
    max_price: number;
    min_price: number;
    per_page: number;
    search: string;
    sort_by: "name" | "location" | "price_per_night" | "created_at";
}
