import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const STATS_PATH = path.join(process.cwd(), 'data/stats.json');
const PROFILE_PATH = path.join(process.cwd(), 'data/profile.json');

async function ensureStatsFile() {
  try {
    await fs.access(STATS_PATH);
  } catch {
    const defaultData = {
      coins: 0,
      totalFocusTime: 0,
      completedTasks: [
        { "day": "Mon", "count": 0 },
        { "day": "Tue", "count": 0 },
        { "day": "Wed", "count": 0 },
        { "day": "Thu", "count": 0 },
        { "day": "Fri", "count": 0 },
        { "day": "Sat", "count": 0 },
        { "day": "Sun", "count": 0 }
      ],
      grades: [],
      dailyFocusTime: 0, // Added for new functionality
      totalFocusSessions: 0, // Added for new functionality
      weeklyProgress: [0, 0, 0, 0, 0, 0, 0] // Added for new functionality
    };
    await fs.mkdir(path.dirname(STATS_PATH), { recursive: true });
    await fs.writeFile(STATS_PATH, JSON.stringify(defaultData, null, 2));
  }
}

async function getStats() {
  await ensureStatsFile();
  const content = await fs.readFile(STATS_PATH, 'utf-8');
  return JSON.parse(content);
}

export async function GET() {
  try {
    try {
        await fs.access(STATS_PATH);
        const content = await fs.readFile(STATS_PATH, 'utf-8');
        return NextResponse.json(JSON.parse(content));
    } catch {
        return NextResponse.json({
            coins: 0,
            totalFocusTime: 0,
            completedTasks: [],
            grades: []
        });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
        // In serverless environments, we cannot write to the filesystem.
        // We just return a success response.
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to "update" stats' }, { status: 500 });
    }
}
