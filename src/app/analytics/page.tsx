"use client";

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Target, Award, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  coins: number;
  totalFocusTime: number;
  completedTasks: { day: string; count: number }[];
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    fetch('/api/stats')
//...
      .catch(err => {
        console.error('Failed to fetch stats', err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
    </div>
  );

  const dailyGoal = 5;
  const todayCount = hasMounted ? (stats?.completedTasks[new Date().getDay() - 1]?.count || 0) : 0;
  const progressPercent = Math.min((todayCount / dailyGoal) * 100, 100);

  const pieData = [
    { name: 'Completed', value: todayCount },
    { name: 'Remaining', value: Math.max(dailyGoal - todayCount, 0) }
  ];

  const COLORS = ['#6366f1', '#e2e8f0'];

  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-6 sm:p-12 md:p-20 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
            Study <span className="text-indigo-600">Analytics</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Track your progress and stay motivated</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
              <Award className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Coins</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.coins}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Focus Hours</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{(stats?.totalFocusTime || 0) / 60}h</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tasks Completed</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats?.completedTasks.reduce((acc, curr) => acc + curr.count, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Weekly Workload Bar Chart */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Weekly Workload
            </h3>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.completedTasks}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Goal Progress Ring */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 w-full flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-500" />
              Daily Goal
            </h3>
            <div className="relative h-[250px] w-[250px] flex items-center justify-center mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {hasMounted && (
                  <>
                    <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{Math.round(progressPercent)}%</p>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{todayCount} / {dailyGoal} Tasks</p>
                  </>
                )}
              </div>
            </div>
            <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
              {progressPercent >= 100 
                ? "Amazing! You've reached your goal for today! 🎉" 
                : `${dailyGoal - todayCount} more tasks to reach your daily target!`}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
           <Link href="/tasks" className="px-6 py-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
             Back to Tasks
           </Link>
           <Link href="/grades" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-indigo-500 transition-all">
             View Grades
           </Link>
        </div>
      </div>
    </main>
  );
}
