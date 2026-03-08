import { auth } from '@/auth';
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Simple in-memory rate limiter to prevent bot abuse
// Format: userId -> { count, resetAt }
const uploadRates = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: You must be logged in to upload images.',
        },
        { status: 401 },
      );
    }

    const userId = session.user.id;
    if (userId) {
      const now = Date.now();
      const userRate = uploadRates.get(userId);

      if (userRate && now < userRate.resetAt) {
        if (userRate.count >= 100) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Upload rate limit exceeded. Please wait before uploading more images.',
            },
            { status: 429 },
          );
        }
        userRate.count++;
      } else {
        // Reset or initialize count: 100 uploads per 60 seconds
        uploadRates.set(userId, { count: 1, resetAt: now + 60000 });
      }
    }

    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64 for Cloudinary upload
    const base64Data = buffer.toString('base64');
    const fileUri = `data:${file.type};base64,${base64Data}`;

    // Upload to Cloudinary with optimizations and watermark
    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder: 'classifieds-platform/uploads',
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
      transformation: [
        // Step 1 — cap dimensions (portrait & landscape safe)
        { width: 1600, height: 1600, crop: 'limit' },
        // Step 2 — draw watermark text at a safe small size, anchored to bottom-right corner.
        // Using fl_relative + small % width so text always fits regardless of image size.
        {
          color: '#FFFFFF',
          overlay: {
            font_family: 'Arial',
            font_size: 18,
            font_weight: 'bold',
            letter_spacing: 2,
            text: 'PazarPlus',
          },
          // Constrain text width to 40% of the image width (shrink if needed)
          width: 0.4,
          crop: 'fit',
          flags: 'relative',
        },
        // Step 3 — position the rendered text layer inside the image (safe % inset)
        {
          flags: 'layer_apply.relative',
          gravity: 'south_east',
          // 3% inset from each edge — scales with image size, never clips
          x: 0.03,
          y: 0.03,
          opacity: 60,
        },
      ],
    });

    console.log(`File uploaded to Cloudinary: ${uploadResponse.secure_url}`);

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to upload to Cloudinary',
    });
  }
}
