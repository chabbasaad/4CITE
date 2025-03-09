<?php

namespace Database\Seeders;

use App\Models\Hotel;
use Illuminate\Database\Seeder;

class HotelSeeder extends Seeder
{
    public function run(): void
    {
        $hotels = [
            [
                'name' => 'Luxury Beach Resort',
                'location' => 'Coastal Boulevard, Beach City',
                'description' => '5-star luxury resort with private beach access and world-class amenities',
                'picture_list' => [
                    'https://raw.githubusercontent.com/chabbasaad/4CITE/master/images_hotels/hotel1.jpg',
                    'https://raw.githubusercontent.com/chabbasaad/4CITE/master/images_hotels/hotel1_2.jpg',
                ],
                'price_per_night' => 299.99,
                'is_available' => true,
                'amenities' => ['Swimming Pool', 'Spa', 'Private Beach', 'Restaurant', '24/7 Room Service'],
                'total_rooms' => 50,
                'available_rooms' => 45,
            ],
            [
                'name' => 'City Center Hotel',
                'location' => 'Downtown, Metropolitan City',
                'description' => 'Modern business hotel in the heart of the city',
                'picture_list' => [
                    'https://raw.githubusercontent.com/chabbasaad/4CITE/master/images_hotels/hotel2.jpg',
                    'https://raw.githubusercontent.com/chabbasaad/4CITE/master/images_hotels/hotel2_2.jpg',
                ],
                'price_per_night' => 199.99,
                'is_available' => true,
                'amenities' => ['Business Center', 'Gym', 'Restaurant', 'Conference Rooms'],
                'total_rooms' => 100,
                'available_rooms' => 85,
            ],
            [
                'name' => 'Mountain View Lodge',
                'location' => 'Alpine Heights, Mountain Town',
                'description' => 'Cozy mountain retreat with breathtaking views',
                'picture_list' => [
                    'https://raw.githubusercontent.com/chabbasaad/4CITE/master/images_hotels/hotel3.jpg',
                    'https://raw.githubusercontent.com/chabbasaad/4CITE/master/images_hotels/hotel3_3.jpg',
                ],
                'price_per_night' => 249.99,
                'is_available' => true,
                'amenities' => ['Fireplace', 'Hiking Trails', 'Restaurant', 'Spa'],
                'total_rooms' => 30,
                'available_rooms' => 25,
            ],
            [
                'name' => 'Historic Boutique Hotel',
                'location' => 'Old Town, Heritage City',
                'description' => 'Charming boutique hotel in a restored historic building',
                'picture_list' => [
                    'https://raw.githubusercontent.com/chabbasaad/4CITE/master/images_hotels/hotel4.jpg',
                    'https://raw.githubusercontent.com/chabbasaad/4CITE/master/images_hotels/hotel4_4.jpg',
                ],
                'price_per_night' => 179.99,
                'is_available' => true,
                'amenities' => ['Antique Furnishings', 'Garden', 'Tea Room', 'Library'],
                'total_rooms' => 20,
                'available_rooms' => 15,
            ],
            [
                'name' => 'Resort & Spa Retreat',
                'location' => 'Wellness Valley, Tranquil City',
                'description' => 'Luxury wellness resort focused on relaxation and rejuvenation',
                'picture_list' => [
                    'https://raw.githubusercontent.com/chabbasaad/4CITE/master/images_hotels/hotel5.jpg',
                    'https://raw.githubusercontent.com/chabbasaad/4CITE/master/images_hotels/hotel5_5.jpg',
                ],
                'price_per_night' => 399.99,
                'is_available' => true,
                'amenities' => ['Luxury Spa', 'Yoga Studio', 'Meditation Garden', 'Organic Restaurant', 'Pool'],
                'total_rooms' => 40,
                'available_rooms' => 35,
            ],
        ];

        foreach ($hotels as $hotel) {
            Hotel::create([
                'name' => $hotel['name'],
                'location' => $hotel['location'],
                'description' => $hotel['description'],
                'picture_list' => $hotel['picture_list'],
                'price_per_night' => $hotel['price_per_night'],
                'is_available' => $hotel['is_available'],
                'amenities' => $hotel['amenities'],
                'total_rooms' => $hotel['total_rooms'],
                'available_rooms' => $hotel['available_rooms'],
            ]);
        }
    }
}
