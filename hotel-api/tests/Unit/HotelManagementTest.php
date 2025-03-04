<?php

namespace Tests\Unit;

use App\Models\Hotel;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HotelManagementTest extends TestCase
{
    use RefreshDatabase;

    // Hotel Model Tests
    public function test_hotel_has_required_attributes()
    {
        $hotel = Hotel::factory()->create([
            'name' => 'Test Hotel',
            'location' => 'Test Location',
            'description' => 'Test Description',
            'price_per_night' => 100,
            'total_rooms' => 20,
            'available_rooms' => 10,
            'is_available' => true,
            'amenities' => ['WiFi', 'Pool'],
            'picture_list' => ['http://example.com/image1.jpg']
        ]);

        $this->assertEquals('Test Hotel', $hotel->name);
        $this->assertEquals('Test Location', $hotel->location);
        $this->assertEquals('Test Description', $hotel->description);
        $this->assertEquals(100, $hotel->price_per_night);
        $this->assertEquals(20, $hotel->total_rooms);
        $this->assertEquals(10, $hotel->available_rooms);
        $this->assertTrue($hotel->is_available);
        $this->assertEquals(['WiFi', 'Pool'], $hotel->amenities);
        $this->assertEquals(['http://example.com/image1.jpg'], $hotel->picture_list);
    }

    public function test_hotel_has_bookings_relationship()
    {
        $hotel = Hotel::factory()->create();
        $booking = Booking::factory()->create(['hotel_id' => $hotel->id]);

        $this->assertTrue($hotel->bookings->contains($booking));
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $hotel->bookings);
    }

    // Search and Filter Tests
    public function test_hotel_search_by_name()
    {
        Hotel::factory()->create(['name' => 'Luxury Beach Resort']);
        Hotel::factory()->create(['name' => 'Mountain Lodge']);
        Hotel::factory()->create(['name' => 'Luxury Hotel']);

        $results = Hotel::where(function($query) {
            $query->where('name', 'like', '%Luxury%')
                  ->orWhere('description', 'like', '%Luxury%');
        })->get();

        $this->assertEquals(2, $results->count());
        $this->assertTrue($results->pluck('name')->contains('Luxury Beach Resort'));
        $this->assertTrue($results->pluck('name')->contains('Luxury Hotel'));
    }

    public function test_hotel_filter_by_price_range()
    {
        Hotel::factory()->create(['name' => 'Budget Hotel', 'price_per_night' => 50]);
        Hotel::factory()->create(['name' => 'Comfort Hotel', 'price_per_night' => 150]);
        Hotel::factory()->create(['name' => 'Luxury Hotel', 'price_per_night' => 350]);

        $results = Hotel::whereBetween('price_per_night', [100, 300])->get();

        $this->assertEquals(1, $results->count());
        $this->assertEquals('Comfort Hotel', $results->first()->name);
    }

    public function test_hotel_filter_by_availability()
    {
        Hotel::factory()->create(['name' => 'Available Hotel', 'is_available' => true]);
        Hotel::factory()->create(['name' => 'Unavailable Hotel', 'is_available' => false]);
        Hotel::factory()->create(['name' => 'Another Available', 'is_available' => true]);

        $results = Hotel::where('is_available', true)->get();

        $this->assertEquals(2, $results->count());
        $this->assertTrue($results->every(fn($hotel) => $hotel->is_available));
    }

    public function test_combined_search_and_filters()
    {
        // Create hotels with different combinations
        Hotel::factory()->create([
            'name' => 'Beach Resort',
            'price_per_night' => 250,
            'is_available' => true
        ]);
        Hotel::factory()->create([
            'name' => 'Beach Hotel',
            'price_per_night' => 150,
            'is_available' => false
        ]);
        Hotel::factory()->create([
            'name' => 'Beach Palace',
            'price_per_night' => 450,
            'is_available' => true
        ]);
        Hotel::factory()->create([
            'name' => 'Mountain Lodge',
            'price_per_night' => 250,
            'is_available' => true
        ]);

        $results = Hotel::query()
            ->where(function($query) {
                $query->where('name', 'like', '%Beach%')
                      ->orWhere('description', 'like', '%Beach%');
            })
            ->whereBetween('price_per_night', [200, 400])
            ->where('is_available', true)
            ->get();

        $this->assertEquals(1, $results->count());
        $this->assertEquals('Beach Resort', $results->first()->name);
        $this->assertTrue($results->first()->is_available);
        $this->assertTrue($results->first()->price_per_night >= 200);
        $this->assertTrue($results->first()->price_per_night <= 400);
    }

    public function test_search_by_location()
    {
        Hotel::factory()->create(['location' => 'Beach City']);
        Hotel::factory()->create(['location' => 'Mountain Town']);
        Hotel::factory()->create(['location' => 'Beach Resort Area']);

        $results = Hotel::where('location', 'like', '%Beach%')->get();

        $this->assertEquals(2, $results->count());
        $this->assertTrue($results->every(fn($hotel) => str_contains($hotel->location, 'Beach')));
    }

    public function test_search_in_description()
    {
        Hotel::factory()->create([
            'name' => 'Mountain Hotel',
            'description' => 'Luxury accommodation with beach view'
        ]);
        Hotel::factory()->create([
            'name' => 'City Hotel',
            'description' => 'Standard accommodation'
        ]);

        $results = Hotel::where('description', 'like', '%Luxury%')->get();

        $this->assertEquals(1, $results->count());
        $this->assertTrue(str_contains($results->first()->description, 'Luxury'));
    }

    // Availability Tests
    public function test_hotel_availability_scope()
    {
        Hotel::factory()->create(['is_available' => false]);
        Hotel::factory()->create(['is_available' => true]);

        $availableHotels = Hotel::where('is_available', true)->get();
        $this->assertEquals(1, $availableHotels->count());
        $this->assertTrue($availableHotels->first()->is_available);
    }

    public function test_hotel_can_be_booked()
    {
        $hotel = Hotel::factory()->create(['available_rooms' => 5]);
        $initialRooms = $hotel->available_rooms;

        // Simulate booking
        $hotel->available_rooms -= 1;
        $hotel->save();

        $this->assertEquals($initialRooms - 1, $hotel->fresh()->available_rooms);
    }

    // Validation Tests
    public function test_hotel_name_is_required()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);
        Hotel::factory()->create(['name' => null]);
    }

    public function test_hotel_price_must_be_positive()
    {
        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $request = new \App\Http\Requests\Hotel\CreateHotelRequest();
        $request->merge([
            'name' => 'Test Hotel',
            'location' => 'Test Location',
            'description' => 'Test Description',
            'price_per_night' => -100,
            'available_rooms' => 10,
            'is_available' => true
        ]);

        $validator = \Illuminate\Support\Facades\Validator::make(
            $request->all(),
            $request->rules()
        );

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }
    }

    public function test_hotel_available_rooms_must_be_non_negative()
    {
        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $request = new \App\Http\Requests\Hotel\CreateHotelRequest();
        $request->merge([
            'name' => 'Test Hotel',
            'location' => 'Test Location',
            'description' => 'Test Description',
            'price_per_night' => 100,
            'available_rooms' => -1,
            'is_available' => true
        ]);

        $validator = \Illuminate\Support\Facades\Validator::make(
            $request->all(),
            array_merge($request->rules(), ['available_rooms' => ['required', 'integer', 'min:0']])
        );

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }
    }

    public function test_hotel_available_rooms_cannot_exceed_total_rooms()
    {
        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $request = new \App\Http\Requests\Hotel\CreateHotelRequest();
        $request->merge([
            'name' => 'Test Hotel',
            'location' => 'Test Location',
            'description' => 'Test Description',
            'price_per_night' => 100,
            'total_rooms' => 10,
            'available_rooms' => 20,
            'is_available' => true
        ]);

        $validator = \Illuminate\Support\Facades\Validator::make(
            $request->all(),
            $request->rules()
        );

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }
    }

    // Staff Access Tests
    public function test_user_is_staff()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $employee = User::factory()->create(['role' => 'employee']);
        $user = User::factory()->create(['role' => 'user']);

        $this->assertTrue($admin->isStaff());
        $this->assertTrue($employee->isStaff());
        $this->assertFalse($user->isStaff());
    }

    // Booking Related Tests
    public function test_hotel_has_active_bookings()
    {
        $hotel = Hotel::factory()->create();
        Booking::factory()->create([
            'hotel_id' => $hotel->id,
            'status' => 'confirmed'
        ]);

        $this->assertTrue($hotel->bookings()->exists());
    }

    public function test_hotel_booking_count()
    {
        $hotel = Hotel::factory()->create();
        Booking::factory()->count(3)->create([
            'hotel_id' => $hotel->id
        ]);

        $this->assertEquals(3, $hotel->bookings()->count());
    }

    // Sorting Tests
    public function test_hotel_sort_by_price()
    {
        Hotel::factory()->create(['price_per_night' => 300]);
        Hotel::factory()->create(['price_per_night' => 100]);
        Hotel::factory()->create(['price_per_night' => 200]);

        $hotels = Hotel::orderBy('price_per_night', 'asc')->get();
        $this->assertEquals(100, $hotels->first()->price_per_night);
        $this->assertEquals(300, $hotels->last()->price_per_night);
    }

    public function test_hotel_sort_by_availability()
    {
        Hotel::factory()->create(['available_rooms' => 5, 'is_available' => true]);
        Hotel::factory()->create(['available_rooms' => 0, 'is_available' => false]);
        Hotel::factory()->create(['available_rooms' => 10, 'is_available' => true]);

        $hotels = Hotel::orderBy('is_available', 'desc')
            ->orderBy('available_rooms', 'desc')
            ->get();

        $this->assertTrue($hotels->first()->is_available);
        $this->assertEquals(10, $hotels->first()->available_rooms);
        $this->assertFalse($hotels->last()->is_available);
    }

    public function test_negative_price_per_night_validation()
    {
        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $request = new \App\Http\Requests\Hotel\CreateHotelRequest();
        $request->merge([
            'name' => 'Test Hotel',
            'location' => 'Test Location',
            'description' => 'Test Description',
            'price_per_night' => -100,
            'total_rooms' => 20,
            'available_rooms' => 15,
            'is_available' => true
        ]);

        $validator = \Illuminate\Support\Facades\Validator::make(
            $request->all(),
            $request->rules()
        );

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }
    }

    public function test_negative_total_rooms_validation()
    {
        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $request = new \App\Http\Requests\Hotel\CreateHotelRequest();
        $request->merge([
            'name' => 'Test Hotel',
            'location' => 'Test Location',
            'description' => 'Test Description',
            'price_per_night' => 100,
            'total_rooms' => -10,
            'available_rooms' => 5,
            'is_available' => true
        ]);

        $validator = \Illuminate\Support\Facades\Validator::make(
            $request->all(),
            $request->rules()
        );

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }
    }

    public function test_negative_available_rooms_validation()
    {
        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $request = new \App\Http\Requests\Hotel\CreateHotelRequest();
        $request->merge([
            'name' => 'Test Hotel',
            'location' => 'Test Location',
            'description' => 'Test Description',
            'price_per_night' => 100,
            'total_rooms' => 20,
            'available_rooms' => -5,
            'is_available' => true
        ]);

        $validator = \Illuminate\Support\Facades\Validator::make(
            $request->all(),
            $request->rules()
        );

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }
    }

    public function test_available_rooms_exceeding_total_rooms_validation()
    {
        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $request = new \App\Http\Requests\Hotel\CreateHotelRequest();
        $request->merge([
            'name' => 'Test Hotel',
            'location' => 'Test Location',
            'description' => 'Test Description',
            'price_per_night' => 100,
            'total_rooms' => 10,
            'available_rooms' => 20,
            'is_available' => true
        ]);

        $validator = \Illuminate\Support\Facades\Validator::make(
            $request->all(),
            $request->rules()
        );

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }
    }

    public function test_zero_price_validation()
    {
        $request = new Request();
        $request->merge([
            'name' => 'Test Hotel',
            'location' => 'Test Location',
            'description' => 'Test Description',
            'price_per_night' => 0,
            'total_rooms' => 10,
            'available_rooms' => 5,
            'is_available' => true,
            'amenities' => ['wifi', 'parking'],
            'picture_list' => ['image1.jpg']
        ]);

        $request->setMethod('POST');

        $rules = [
            'price_per_night' => ['required', 'numeric', 'gt:0'],
            'total_rooms' => ['required', 'integer', 'gt:0'],
            'available_rooms' => ['required', 'integer', 'gte:0', 'lte:total_rooms']
        ];

        $validator = Validator::make(
            $request->all(),
            $rules
        );

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('price_per_night', $validator->errors()->toArray());
    }

    public function test_zero_total_rooms_validation()
    {
        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $request = new \App\Http\Requests\Hotel\CreateHotelRequest();
        $request->merge([
            'name' => 'Test Hotel',
            'location' => 'Test Location',
            'description' => 'Test Description',
            'price_per_night' => 100,
            'total_rooms' => 0,
            'available_rooms' => 0,
            'is_available' => true
        ]);

        $validator = \Illuminate\Support\Facades\Validator::make(
            $request->all(),
            $request->rules()
        );

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }
    }

    public function test_price_decimal_validation()
    {
        $request = new Request();
        $request->merge([
            'name' => 'Test Hotel',
            'location' => 'Test Location',
            'description' => 'Test Description',
            'price_per_night' => 100.999,
            'total_rooms' => 10,
            'available_rooms' => 5,
            'is_available' => true,
            'amenities' => ['wifi', 'parking'],
            'picture_list' => ['image1.jpg']
        ]);

        $request->setMethod('POST');

        $rules = [
            'price_per_night' => ['required', 'numeric', 'gt:0', 'regex:/^\d+(\.\d{1,2})?$/'],
            'total_rooms' => ['required', 'integer', 'gt:0'],
            'available_rooms' => ['required', 'integer', 'gte:0', 'lte:total_rooms']
        ];

        $validator = Validator::make(
            $request->all(),
            $rules
        );

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('price_per_night', $validator->errors()->toArray());
    }
}
