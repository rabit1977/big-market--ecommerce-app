import { mkdir, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided' });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Ensure uploads directory exists
  const uploadDir = join(process.cwd(), 'public/uploads'); 
  await mkdir(uploadDir, { recursive: true });

  // Create a unique filename
  // Replace anything that is not alphanumeric, dot, or dash with underscore
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `${Date.now()}-${safeName}`;
  const path = join(uploadDir, filename);

  try {
    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);
    
    // Return the public URL
    const url = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url });

  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ success: false, error: 'Failed to save file' });
  }
}
