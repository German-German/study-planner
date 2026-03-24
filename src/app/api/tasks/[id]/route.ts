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
    const defaultData = { tasks: [] };
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

export async function PUT(
  request: Request,
  { params }: { params: any }
) {
  try {
    const { id: idStr } = await Promise.resolve(params);
    const id = parseInt(idStr, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const updates = await request.json();

    const filePath = getDataFilePath();
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    const taskIndex = data.tasks.findIndex((t: any) => t.id === id);
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Update task fields
    const updatedTask = {
      ...data.tasks[taskIndex],
      ...updates,
      id // preserve original ID
    };

    data.tasks[taskIndex] = updatedTask;

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Failed to update task:', error);
    return NextResponse.json({ error: 'Failed to update task data' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: any }
) {
  try {
    const { id: idStr } = await Promise.resolve(params);
    const id = parseInt(idStr, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const filePath = getDataFilePath();
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    const taskIndex = data.tasks.findIndex((t: any) => t.id === id);
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    data.tasks.splice(taskIndex, 1);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete task:', error);
    return NextResponse.json({ error: 'Failed to delete task data' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: any }
) {
  // Delegate completely to PUT since it handles partial updates perfectly
  return PUT(request, { params });
}
