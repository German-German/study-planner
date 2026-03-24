import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Helper to get the absolute path to the data file
const getDataFilePath = () => path.join(process.cwd(), 'data/tasks.json');

export async function GET() {
  try {
    const filePath = getDataFilePath();
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data.tasks);
  } catch (error) {
    console.error('Failed to read tasks data:', error);
    return NextResponse.json({ error: 'Failed to read tasks data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const filePath = getDataFilePath();
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Read the new task from the request body
    const newTask = await request.json();

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
  } catch (error) {
    console.error('Failed to save the new task:', error);
    return NextResponse.json({ error: 'Failed to save the new task data' }, { status: 500 });
  }
}
