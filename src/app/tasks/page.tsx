"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  dueDate: string;
  subject: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter & Sort State
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [sortDateNearest, setSortDateNearest] = useState<boolean>(false);

  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Task>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditFormData({
      title: task.title,
      subject: task.subject,
      priority: task.priority,
      completed: task.completed,
      dueDate: task.dueDate
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleEditChange = (field: keyof Task, value: any) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveTask = async (id: number) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prev => prev.map(t => (t.id === id ? updatedTask : t)));
        setEditingId(null);
      } else {
        console.error('Failed to save task');
      }
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTaskCompletion = async (task: Task) => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prev => prev.map(t => (t.id === task.id ? updatedTask : t)));
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setTasks(prev => prev.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getPriorityColor = (priority: Task['priority'], completed: boolean) => {
    if (completed) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
    
    switch (priority) {
      case 'high':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-500/20';
      case 'medium':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
      case 'low':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400 border-slate-200 dark:border-slate-500/20';
    }
  };

  const subjects = ['All', ...Array.from(new Set(tasks.map(t => t.subject))).filter(Boolean)];

  const filteredAndSortedTasks = tasks
    .filter(t => subjectFilter === 'All' || t.subject === subjectFilter)
    .sort((a, b) => {
      if (!sortDateNearest) return 0;
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateA - dateB;
    });

  return (
    <main className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 p-4 sm:p-12 md:p-24 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Your Tasks
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage and track your upcoming assignments
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              Home
            </Link>
          </div>
        </header>

        {!loading && tasks.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 mb-6 gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label htmlFor="subject-filter" className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">Filter by Subject:</label>
              <select
                id="subject-filter"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full sm:w-auto rounded-lg border-0 py-2 pl-3 pr-10 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              >
                {subjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setSortDateNearest(prev => !prev)}
              className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                sortDateNearest 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 ring-1 ring-indigo-200 dark:ring-indigo-800' 
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
              </svg>
              {sortDateNearest ? 'Sorted: Nearest First' : 'Sort: Date (Nearest First)'}
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-500"></div>
            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Loading your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No tasks found</h3>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Get started by creating a new task.</p>
          </div>
        ) : filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No tasks match your filter</h3>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Try selecting a different subject.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTasks.map((task) => (
              <div
                key={task.id}
                className={`group relative flex flex-col justify-between rounded-2xl p-6 shadow-sm ring-1 transition-all ${
                  editingId === task.id 
                    ? 'bg-indigo-50/50 dark:bg-indigo-900/20 ring-indigo-300 dark:ring-indigo-700' 
                    : task.completed 
                      ? 'bg-slate-50 dark:bg-slate-900/50 ring-slate-200 dark:ring-slate-800 hover:shadow-md' 
                      : 'bg-white dark:bg-slate-900 ring-slate-200 dark:ring-slate-800 hover:shadow-md hover:ring-indigo-500/50 dark:hover:ring-indigo-400/50'
                }`}
              >
                {editingId === task.id ? (
                  /* EDIT MODE UI */
                  <div className="flex flex-col gap-3 h-full">
                    <input
                      type="text"
                      value={editFormData.title || ''}
                      onChange={e => handleEditChange('title', e.target.value)}
                      className="w-full rounded-md border-0 py-1.5 px-3 text-slate-900 dark:text-white bg-white dark:bg-slate-800 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Task Title"
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editFormData.subject || ''}
                        onChange={e => handleEditChange('subject', e.target.value)}
                        className="w-full rounded-md border-0 py-1.5 px-3 text-slate-900 dark:text-white bg-white dark:bg-slate-800 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Subject"
                      />
                      <input
                        type="date"
                        value={editFormData.dueDate || ''}
                        onChange={e => handleEditChange('dueDate', e.target.value)}
                        className="w-full rounded-md border-0 py-1.5 px-3 text-slate-900 dark:text-white bg-white dark:bg-slate-800 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <select
                        value={editFormData.priority || 'medium'}
                        onChange={e => handleEditChange('priority', e.target.value)}
                        className="rounded-md border-0 py-1.5 pl-3 pr-8 text-slate-900 dark:text-white bg-white dark:bg-slate-800 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                      
                      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editFormData.completed || false}
                          onChange={e => handleEditChange('completed', e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        Completed
                      </label>
                    </div>

                    <div className="mt-auto pt-4 flex gap-2 justify-end">
                      <button
                        onClick={cancelEditing}
                        className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveTask(task.id)}
                        disabled={isSaving}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50 transition-colors flex items-center gap-1"
                      >
                        {isSaving ? '...' : (
                          <>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Save
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* VIEW MODE UI */
                  <>
                    <div>
                      {/* Top Bar: Subject & Actions */}
                      <div className="flex items-start justify-between mb-4">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${task.completed ? 'bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-400' : 'bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/20'}`}>
                          {task.subject}
                        </span>
                        
                        {/* Hover Actions */}
                        <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleTaskCompletion(task)}
                            className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            title={task.completed ? "Mark incomplete" : "Mark complete"}
                          >
                            {task.completed ? (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => startEditing(task)}
                            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title="Edit task"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                            title="Delete task"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border uppercase tracking-wider ${getPriorityColor(task.priority, task.completed)}`}>
                          {task.completed ? 'Done' : `${task.priority} Priority`}
                        </span>
                      </div>
                      
                      <h3 className={`text-xl font-semibold mb-2 transition-colors ${task.completed ? 'text-slate-500 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                        {task.title}
                      </h3>
                    </div>
                    
                    <div className={`mt-6 flex items-center justify-between text-sm ${task.completed ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>
                      <div className="flex items-center">
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        Due {task.dueDate}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
