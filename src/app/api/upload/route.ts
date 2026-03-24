import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename to avoid collisions
    const fileExtension = path.extname(file.name);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}${fileExtension}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    const filePath = path.join(uploadDir, filename);

    // Ensure the directory exists (redundant but safe)
    await fs.mkdir(uploadDir, { recursive: true });

    // Save the file locally
    await fs.writeFile(filePath, buffer);

    // Return the public URL that can be used in <img> tags
    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error('File upload failed:', error);
    return NextResponse.json({ 
      error: 'File upload failed', 
      details: error.message 
    }, { status: 500 });
  }
}
