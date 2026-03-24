"use client";

// Types
export interface Task {
  id: number;
  title: string;
  dueDate: string;
  subject: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface Stats {
  coins: number;
  totalFocusTime: number;
  completedTasks: { day: string; count: number }[];
  grades: any[];
  dailyFocusTime: number;
  totalFocusSessions: number;
  weeklyProgress: number[];
}

export interface Profile {
  name: string;
  avatarUrl: string;
  university: string;
  major: string;
  coins: number;
}

// Storage Keys
const KEYS = {
  TASKS: 'study-planner-tasks',
  STATS: 'study-planner-stats',
  PROFILE: 'study-planner-profile',
  INITIALIZED: 'study-planner-initialized'
};

class StorageService {
  private isBrowser = typeof window !== 'undefined';

  private get<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser) return defaultValue;
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    try {
      return JSON.parse(stored);
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    if (!this.isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Tasks
  getTasks(): Task[] {
    return this.get<Task[]>(KEYS.TASKS, []);
  }

  setTasks(tasks: Task[]): void {
    this.set(KEYS.TASKS, tasks);
  }

  addTask(task: Omit<Task, 'id'>): Task {
    const tasks = this.getTasks();
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const newTask = { ...task, id: newId };
    this.setTasks([...tasks, newTask]);
    return newTask;
  }

  updateTask(id: number, updates: Partial<Task>): Task | null {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    const updatedTask = { ...tasks[index], ...updates };
    tasks[index] = updatedTask;
    this.setTasks(tasks);
    return updatedTask;
  }

  deleteTask(id: number): void {
    const tasks = this.getTasks();
    this.setTasks(tasks.filter(t => t.id !== id));
  }

  // Stats
  getStats(): Stats {
    return this.get<Stats>(KEYS.STATS, {
      coins: 0,
      totalFocusTime: 0,
      completedTasks: [
        { day: "Mon", count: 0 },
        { day: "Tue", count: 0 },
        { day: "Wed", count: 0 },
        { day: "Thu", count: 0 },
        { day: "Fri", count: 0 },
        { day: "Sat", count: 0 },
        { day: "Sun", count: 0 }
      ],
      grades: [],
      dailyFocusTime: 0,
      totalFocusSessions: 0,
      weeklyProgress: [0, 0, 0, 0, 0, 0, 0]
    });
  }

  updateStats(updates: Partial<Stats>): Stats {
    const stats = this.getStats();
    const newStats = { ...stats, ...updates };
    this.set(KEYS.STATS, newStats);
    return newStats;
  }

  addFocusSession(minutes: number): Stats {
    const stats = this.getStats();
    const updatedStats = {
        ...stats,
        dailyFocusTime: (stats.dailyFocusTime || 0) + minutes,
        totalFocusTime: (stats.totalFocusTime || 0) + minutes,
        totalFocusSessions: (stats.totalFocusSessions || 0) + 1,
        coins: (stats.coins || 0) + 10 // Award 10 coins
    };
    this.set(KEYS.STATS, updatedStats);
    
    // Also update coins in profile
    const profile = this.getProfile();
    this.updateProfile({ coins: (profile.coins || 0) + 10 });
    
    return updatedStats;
  }

  addGrade(newGrade: any): Stats {
    const stats = this.getStats();
    const dayOfWeek = (new Date()).getDay(); // 0 for Sunday
    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayDay = dayMap[dayOfWeek];
    
    const completedTasks = stats.completedTasks.map(d => 
        d.day === todayDay ? { ...d, count: d.count + 1 } : d
    );

    const updatedStats = {
        ...stats,
        grades: [newGrade, ...(stats.grades || [])],
        completedTasks
    };
    this.set(KEYS.STATS, updatedStats);
    return updatedStats;
  }

  // Profile
  getProfile(): Profile {
    return this.get<Profile>(KEYS.PROFILE, {
      name: '',
      avatarUrl: '',
      university: '',
      major: '',
      coins: 0
    });
  }

  updateProfile(updates: Partial<Profile>): Profile {
    const profile = this.getProfile();
    const newProfile = { ...profile, ...updates };
    this.set(KEYS.PROFILE, newProfile);
    return newProfile;
  }

  // Initialization/Migration from API
  async initialize(): Promise<void> {
    if (!this.isBrowser) return;
    if (localStorage.getItem(KEYS.INITIALIZED)) return;

    try {
      // Pull initial data from existing API endpoints (Server files)
      const [tasksRes, statsRes, profileRes] = await Promise.all([
        fetch('/api/tasks').then(res => res.ok ? res.json() : []),
        fetch('/api/stats').then(res => res.ok ? res.json() : null),
        fetch('/api/profile').then(res => res.ok ? res.json() : null)
      ]);

      if (tasksRes.length > 0) this.setTasks(tasksRes);
      if (statsRes) this.set(KEYS.STATS, statsRes);
      if (profileRes) this.set(KEYS.PROFILE, profileRes);

      localStorage.setItem(KEYS.INITIALIZED, 'true');
    } catch (error) {
      console.error('Failed to initialize storage from API:', error);
      // Still mark as initialized to prevent repeated failed attempts
      localStorage.setItem(KEYS.INITIALIZED, 'true');
    }
  }
}

export const storage = new StorageService();
