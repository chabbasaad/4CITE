<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/documentation/postman', function () {
    // Determine the environment
    $environment = app()->environment();

    // Set the file path based on the environment
    $filePath = base_path(
        $environment === 'production'
        ? 'documentation/postman/social_api_EndPoint_Production.postman_collection.json'
        : 'documentation/postman/social_api_EndPoint_Local.postman_collection.json'
    );

    // Check if the file exists
    if (!file_exists($filePath)) {
        abort(404, 'File not found');
    }

    // Serve the file with proper headers
    return response()->file($filePath, [
        'Content-Type' => 'application/json',
    ]);
});
