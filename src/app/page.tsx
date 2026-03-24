import Link from 'next/link';
import { LayoutDashboard, BarChart3, Timer, Users, GraduationCap, ArrowRight } from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'My Tasks',
      desc: 'Organize and track your daily assignments.',
      href: '/tasks',
      icon: <LayoutDashboard className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-100'
    },
    {
      title: 'Analytics',
      desc: 'Visualize your progress with charts.',
      href: '/analytics',
      icon: <BarChart3 className="w-6 h-6 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-100'
    },
    {
      title: 'Focus Mode',
      desc: 'Boost productivity with Pomodoro.',
      href: '/focus',
      icon: <Timer className="w-6 h-6 text-rose-600" />,
      color: 'bg-rose-50 border-rose-100'
    },
    {
      title: 'Share Space',
      desc: 'Collaborate with your study group.',
      href: '/sharespace',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 border-blue-100'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-sm font-bold mb-8 border border-indigo-100 dark:border-indigo-800">
             <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
             v2.0 Productivity Update
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-8">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Study Game</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The ultimate companion for academic success. Track tasks, measure progress, and collaborate in real-time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {features.map((f, i) => (
                <Link 
                    key={i} 
                    href={f.href}
                    className={`group p-8 rounded-[2rem] border bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 border-slate-200 dark:border-slate-800`}
                >
                    <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        {f.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{f.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{f.desc}</p>
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
                        Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats Overlay (Floating Link) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
         <Link 
            href="/tasks"
            className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all text-sm"
         >
            <LayoutDashboard className="w-5 h-5" />
            Launch Planner
         </Link>
      </div>
    </main>
  );
}
