import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const getProfileFilePath = () => path.join(process.cwd(), 'data/profile.json');

export async function GET() {
  try {
    const filePath = getProfileFilePath();
    try {
      await fs.access(filePath);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      return NextResponse.json(data);
    } catch {
      const defaultData = { name: '', avatarUrl: '', university: '', major: '', coins: 0 };
      return NextResponse.json(defaultData);
    }
  } catch (error) {
    console.error('Failed to read profile data:', error);
    return NextResponse.json({ error: 'Failed to read profile data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json();
    return NextResponse.json(updates);
  } catch (error) {
    console.error('Failed to "update" profile data:', error);
    return NextResponse.json({ error: 'Failed to update profile data' }, { status: 500 });
  }
}
