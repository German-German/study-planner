import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Helper to get the absolute path to the data file
const getDataFilePath = () => path.join(process.cwd(), 'data/tasks.json');

async function ensureDataFileExists() {
  const filePath = getDataFilePath();
  try {
    await fs.access(filePath);
  } catch {
    // If file doesn't exist, create it with default data
    const defaultData = { tasks: [] };
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

export async function GET() {
  try {
    const filePath = getDataFilePath();
    // Only try to read if it exists, otherwise return empty
    try {
      await fs.access(filePath);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      return NextResponse.json(data.tasks || []);
    } catch {
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Failed to read tasks data:', error);
    return NextResponse.json({ error: 'Failed to read tasks data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // In serverless environments, we cannot write to the filesystem.
    // The frontend has been migrated to use LocalStorage.
    // We return the task as if it was saved to maintain backward compatibility during migration.
    const newTask = await request.json();
    const taskToAdd = {
      id: Date.now(),
      ...newTask
    };

    return NextResponse.json(taskToAdd, { status: 201 });
  } catch (error: any) {
    console.error('Failed to "save" the new task:', error);
    return NextResponse.json({ 
      error: 'Failed to save the new task data', 
      details: error.message 
    }, { status: 500 });
  }
}
