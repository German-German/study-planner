"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  User, 
  Settings, 
  LayoutDashboard, 
  BarChart3, 
  GraduationCap, 
  Timer, 
  Users, 
  ChevronDown,
  Home,
  LogOut
} from 'lucide-react';

import { storage, Profile } from '@/lib/storage';

export default function ProfileMenu() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = storage.getProfile();
    setProfile(data);

    // Background fetch for consistency
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setProfile(data);
      })
      .catch(console.error);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800">
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <svg className="w-full h-full text-slate-400 p-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </div>
        <span className="hidden sm:block text-sm font-semibold text-slate-700 dark:text-slate-200">
          {profile?.name || 'Account'}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-[70] animate-in fade-in zoom-in-95 duration-100">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{profile?.name || 'Student'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{profile?.major} {profile?.university ? `@ ${profile.university}` : ''}</p>
          </div>
          <div className="p-2">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <User className="w-4 h-4 opacity-70" />
              Account Settings
            </Link>
            <Link
              href="/analytics"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <BarChart3 className="w-4 h-4 opacity-70 text-indigo-500" />
              Analytics Dashboard
            </Link>
            <Link
              href="/grades"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <GraduationCap className="w-4 h-4 opacity-70 text-emerald-500" />
              Academic Grades
            </Link>
            <Link
              href="/focus"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Timer className="w-4 h-4 opacity-70 text-rose-500" />
              Focus Mode
            </Link>
            <Link
              href="/sharespace"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Users className="w-4 h-4 opacity-70 text-blue-500" />
              Group Share Space
            </Link>
            <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>
            <Link
              href="/tasks"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 opacity-70" />
              My Tasks
            </Link>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-800/50">
             <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
