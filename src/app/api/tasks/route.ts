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
    await ensureDataFileExists();
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data.tasks || []);
  } catch (error) {
    console.error('Failed to read tasks data:', error);
    return NextResponse.json({ error: 'Failed to read tasks data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const filePath = getDataFilePath();
    await ensureDataFileExists();
    
    // Read the new task from the request body
    const newTask = await request.json();
    
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    if (!data.tasks) {
      data.tasks = [];
    }

    // Assign a new ID (could also use crypto.randomUUID(), but sticking to numeric id for now)
    const newId = data.tasks.length > 0 ? Math.max(...data.tasks.map((t: any) => t.id)) + 1 : 1;
    
    const taskToAdd = {
      id: newId,
      ...newTask
    };

    // Add the new task and write back to the file
    data.tasks.push(taskToAdd);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json(taskToAdd, { status: 201 });
  } catch (error: any) {
    console.error('Failed to save the new task:', error);
    return NextResponse.json({ 
      error: 'Failed to save the new task data', 
      details: error.message 
    }, { status: 500 });
  }
}
