<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{


    public function download(Request $request, $fileName)
    {
        $disk = Storage::disk('azure');

        // Check if the file exists on Azure Blob Storage
        if (!$disk->exists($fileName)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        // Retrieve the file content from Azure Blob Storage
        $fileContent = $disk->get($fileName);

        // Check for valid content
        if (!$fileContent) {
            return response()->json(['message' => 'Unable to retrieve file content.'], 500);
        }

        // Determine MIME type based on file extension
        $extension = pathinfo($fileName, PATHINFO_EXTENSION);
        $mimeType = match (strtolower($extension)) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'mp4' => 'video/mp4',
            'avi' => 'video/x-msvideo',
            'mov' => 'video/quicktime',
            'mkv' => 'video/x-matroska',
            default => 'application/octet-stream', // Default for unsupported types
        };

        // Return the file as a response with appropriate headers
        return response($fileContent, 200, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
        ]);
    }


}
