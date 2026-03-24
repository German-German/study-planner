"use client";

import { useState, useEffect } from 'react';
import { Award, BookOpen, GraduationCap, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface Grade {
  taskTitle: string;
  subject: string;
  grade: string;
  date: string;
}

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setGrades(data.grades || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch grades', err);
        setLoading(false);
      });
  }, []);

  const calculateGPA = () => {
    if (grades.length === 0) return "N/A";
    // Mock GPA calculation (assuming A=4, B=3, etc. for demo)
    const gradeMap: Record<string, number> = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };
    let total = 0;
    let count = 0;
    grades.forEach(g => {
        const val = gradeMap[g.grade.toUpperCase()[0]];
        if (val !== undefined) {
            total += val;
            count++;
        }
    });
    return count > 0 ? (total / count).toFixed(2) : "N/A";
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-6 sm:p-12 md:p-20 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
              Academic <span className="text-indigo-600">Grades</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Your performance history and GPA tracking</p>
          </div>
          <Link href="/analytics" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Analytics
          </Link>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-indigo-600 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden group">
            <GraduationCap className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
            <p className="text-indigo-100 text-sm font-medium mb-1 uppercase tracking-wider">Overall GPA</p>
            <p className="text-5xl font-black">{calculateGPA()}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-6">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
              <Award className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Credits</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{grades.length * 3}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
              <BookOpen className="w-10 h-10 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Assignments</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{grades.length}</p>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <h3 className="font-bold text-slate-900 dark:text-white">Recent Submissions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50/30 dark:bg-slate-800/10">
                  <th className="px-8 py-4">Assignment</th>
                  <th className="px-8 py-4">Subject</th>
                  <th className="px-8 py-4 text-center">Grade</th>
                  <th className="px-8 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {grades.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-500 dark:text-slate-400">
                      No grades recorded yet. Complete and grade a task to see it here!
                    </td>
                  </tr>
                ) : (
                  grades.map((g, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-semibold text-slate-900 dark:text-white">{g.taskTitle}</p>
                      </td>
                      <td className="px-8 py-6">
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                           {g.subject}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg ${
                            g.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            g.grade.startsWith('B') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {g.grade}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right text-sm text-slate-500 dark:text-slate-400">
                        {g.date}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
