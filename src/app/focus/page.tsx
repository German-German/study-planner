"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Timer, Pause, Play, RefreshCw, X, CheckCircle2, Trophy, Plus } from 'lucide-react';
import Link from 'next/link';
import { storage } from '@/lib/storage';

function FocusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams.get('taskId');
  const [taskTitle, setTaskTitle] = useState<string | null>(null);
  
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (taskId) {
        const tasks = storage.getTasks();
        const task = tasks.find((t: any) => t.id === parseInt(taskId));
        if (task) setTaskTitle(task.title);
        
        // Background fetch for consistency
        fetch('/api/tasks')
            .then(res => res.json())
            .then(tasks => {
                const task = tasks.find((t: any) => t.id === parseInt(taskId));
                if (task) setTaskTitle(task.title);
            });
    }
  }, [taskId]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = async () => {
    setIsActive(false);
    if (!isBreak) {
      const newSessionCount = sessionsCompleted + 1;
      setSessionsCompleted(newSessionCount);
      setIsBreak(true);
      setTimeLeft(5 * 60); // 5 minute break
      setShowReward(true);
      
      // Log session in stats
      try {
        storage.addFocusSession(25);
        // Background fetch for consistency
        fetch('/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ focusTimeMinutes: 25 })
        });
      } catch (err) {
        console.error('Failed to log focus session', err);
      }
    } else {
      setIsBreak(false);
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100 
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <main className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center text-white overflow-hidden font-sans">
      {/* Background Pulse Animation */}
      <div className={`absolute inset-0 transition-all duration-1000 opacity-20 ${isActive ? 'bg-indigo-500/20' : 'bg-slate-800'}`}>
        <div className={`absolute inset-0 flex items-center justify-center`}>
            <div className={`w-[500px] h-[500px] rounded-full border border-white/10 animate-ping opacity-5`}></div>
            <div className={`w-[800px] h-[800px] rounded-full border border-white/10 animate-ping opacity-5 delay-300`}></div>
        </div>
      </div>

      <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg ring-4 ring-indigo-500/20">
                <Timer className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight uppercase">Focus Mode</span>
        </div>
        <button 
          onClick={() => router.back()}
          className="p-3 hover:bg-white/10 rounded-full transition-colors border border-white/10"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center text-center">
        {taskTitle && (
            <div className="mb-12">
                <p className="text-indigo-400 text-sm font-bold uppercase tracking-widest mb-2">Focusing On</p>
                <h2 className="text-3xl font-extrabold">{taskTitle}</h2>
            </div>
        )}

        <div className="relative mb-16">
          {/* Circular Progress SVG */}
          <svg className="w-80 h-80 transform -rotate-90 drop-shadow-2xl">
            <circle
              cx="160"
              cy="160"
              r="150"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="160"
              cy="160"
              r="150"
              stroke={isBreak ? "#10b981" : "#6366f1"}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={942}
              strokeDashoffset={942 - (942 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {hasMounted && (
              <>
                <span className="text-7xl font-black tracking-tighter tabular-nums mb-2">
                  {formatTime(timeLeft)}
                </span>
                <span className={`text-sm font-bold uppercase tracking-widest ${isBreak ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {isBreak ? 'Take a Break' : 'Focus Time'}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 mb-12">
          <button 
            onClick={resetTimer}
            className="p-5 bg-white/5 hover:bg-white/10 rounded-3xl transition-all hover:scale-105 active:scale-95 border border-white/10"
          >
            <RefreshCw className="w-6 h-6 text-slate-400" />
          </button>
          
          <button 
            onClick={toggleTimer}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl ${
              isActive 
                ? 'bg-white text-slate-900' 
                : isBreak ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
            }`}
          >
            {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
          </button>

          <div className="p-5 bg-white/5 rounded-3xl border border-white/10 relative group">
            <Trophy className={`w-6 h-6 ${sessionsCompleted > 0 ? 'text-amber-400' : 'text-slate-600'}`} />
            <span className="absolute -top-2 -right-2 bg-indigo-600 w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center shadow-lg border-2 border-slate-900 group-hover:scale-110 transition-transform">
                {sessionsCompleted}
            </span>
          </div>
        </div>

        {isBreak && (
             <p className="text-emerald-400 font-medium animate-pulse">
                Excellent work! Refresh and recharge for 5 minutes.
             </p>
        )}
      </div>

      {/* Break Reward Notification Overlay */}
      {showReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-white/10 p-12 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center relative overflow-hidden group">
                {/* Konfetti-like particles (CSS) */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500"></div>
                
                <div className="mb-8 flex justify-center">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center animate-bounce">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                </div>
                <h3 className="text-2xl font-black mb-4">Focus Complete!</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    You've successfully completed a 25-minute session and earned <span className="text-amber-400 font-bold">10 Coins</span>!
                </p>
                <button 
                    onClick={() => setShowReward(false)}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                >
                    Start Break
                </button>
            </div>
        </div>
      )}

      {/* Motivational Quotes (Footer) */}
      <footer className={`absolute bottom-8 left-0 right-0 text-center transition-opacity duration-1000 ${isActive ? 'opacity-20' : 'opacity-60'}`}>
        <p className="text-sm italic font-medium text-slate-400 px-12">
          "The secret of getting ahead is getting started."
        </p>
      </footer>
    </main>
  );
}

export default function FocusPage() {
  return (
    <Suspense fallback={
        <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center text-white">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-indigo-600 mb-4" />
            <p className="text-sm font-medium text-slate-400">Loading Focus Mode...</p>
        </div>
    }>
      <FocusContent />
    </Suspense>
  );
}
