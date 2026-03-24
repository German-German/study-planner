import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const getProfileFilePath = () => path.join(process.cwd(), 'data/profile.json');

export async function GET() {
  try {
    const filePath = getProfileFilePath();
    try {
      await fs.access(filePath);
    } catch {
      // If file doesn't exist, create it with default data
      const defaultData = { name: '', avatarUrl: '', university: '', major: '' };
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return NextResponse.json(defaultData);
    }
    
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read profile data:', error);
    return NextResponse.json({ error: 'Failed to read profile data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json();
    const filePath = getProfileFilePath();
    
    let currentData = { name: '', avatarUrl: '', university: '', major: '' };
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      currentData = JSON.parse(fileContent);
    } catch {
      // If it doesn't exist, it's fine, we will create it
      await fs.mkdir(path.dirname(filePath), { recursive: true });
    }

    const newData = { ...currentData, ...updates };
    await fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf-8');
    
    return NextResponse.json(newData);
  } catch (error) {
    console.error('Failed to update profile data:', error);
    return NextResponse.json({ error: 'Failed to update profile data' }, { status: 500 });
  }
}
