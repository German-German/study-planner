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
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const stats = await getStats();
        
        if (body.focusTimeMinutes) {
            stats.dailyFocusTime = (stats.dailyFocusTime || 0) + body.focusTimeMinutes;
            stats.totalFocusTime = (stats.totalFocusTime || 0) + body.focusTimeMinutes;
            stats.totalFocusSessions = (stats.totalFocusSessions || 0) + 1;
            
            // Reward coins (10 per session)
            try {
                try {
                    await fs.access(PROFILE_PATH);
                } catch {
                    const defaultProfile = { coins: 0 };
                    await fs.mkdir(path.dirname(PROFILE_PATH), { recursive: true });
                    await fs.writeFile(PROFILE_PATH, JSON.stringify(defaultProfile, null, 2));
                }

                const profileData = await fs.readFile(PROFILE_PATH, 'utf-8');
                const profile = JSON.parse(profileData);
                profile.coins = (profile.coins || 0) + 10;
                await fs.writeFile(PROFILE_PATH, JSON.stringify(profile, null, 2));
            } catch (e) {
                console.error('Failed to update profile coins', e);
            }
        }
        
        if (body.newGrade) {
            stats.grades = [body.newGrade, ...(stats.grades || [])];
            
            // Update completedTasks for Analytics BarChart
            const dayOfWeek = (new Date()).getDay(); // 0 for Sunday
            const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const todayDay = dayMap[dayOfWeek];
            
            if (!stats.completedTasks) {
                stats.completedTasks = dayMap.map(d => ({ day: d, count: 0 }));
            }
            
            const dayEntry = stats.completedTasks.find((d: any) => d.day === todayDay);
            if (dayEntry) {
                dayEntry.count += 1;
            }
        }

        await fs.writeFile(STATS_PATH, JSON.stringify(stats, null, 2));
        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
    }
}
