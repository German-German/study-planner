"use client";

import { useState, useEffect } from 'react';
import { Users, UserPlus, MessageSquare, ListTodo, Send, Share2, Globe, Lock, Bell, Plus, Trash2, X } from 'lucide-react';

interface SharedTask {
  id: number;
  title: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface Message {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

export default function ShareSpacePage() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'chat'>('tasks');
  const [inviteCode] = useState('STUDY-2024-XP');
  const [copied, setCopied] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  
  const [tasks, setTasks] = useState<SharedTask[]>([
    { id: 1, title: 'Final Project Documentation', assignedTo: 'Alex', status: 'in-progress' },
    { id: 2, title: 'Database Schema Design', assignedTo: 'Me', status: 'pending' },
    { id: 3, title: 'Frontend UI Components', assignedTo: 'Sarah', status: 'completed' },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, user: 'Sarah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', text: "Hey guys, I finished the UI buttons!", time: '10:45 AM' },
    { id: 2, user: 'Alex', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', text: "Awesome! I'll start the docs now.", time: '10:50 AM' },
  ]);

  const [inputMessage, setInputMessage] = useState('');

  const copyInvite = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    const newMessage: Message = {
      id: Date.now(),
      user: 'Me',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 sm:p-12 md:p-20 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-600 rounded-xl">
                    <Users className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Group <span className="text-indigo-600">Share Space</span>
                </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400">Collaborate on assignments and track group progress</p>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
             <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Invite Code</p>
                <p className="font-mono font-bold text-indigo-600">{inviteCode}</p>
             </div>
             <button 
                onClick={copyInvite}
                className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
             >
               {copied ? <div className="text-xs font-bold px-2">Copied!</div> : <Share2 className="w-5 h-5" />}
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Group Info */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-500" />
                    Project Details
                </h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Title</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Computer Science Finals</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Deadline</p>
                        <p className="text-sm font-semibold text-rose-500">April 15, 2024</p>
                    </div>
                    <div className="pt-2">
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full w-[65%]"></div>
                        </div>
                        <p className="text-[10px] mt-1 text-slate-500 text-right">65% Complete</p>
                    </div>
                </div>
             </div>

             <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-emerald-500" />
                    Members
                </h3>
                <div className="flex flex-wrap gap-2">
                    {['Sarah', 'Alex', 'Me', 'James'].map(m => (
                        <div key={m} className="group relative">
                            <img 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m}`} 
                                alt={m}
                                className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all cursor-pointer"
                            />
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {m}
                            </div>
                        </div>
                    ))}
                    <button 
                        onClick={() => setShowInviteModal(true)}
                        className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-500 transition-all font-bold"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
             </div>

             {/* Invite Modal */}
             {showInviteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2rem] shadow-2xl max-w-sm w-full relative">
                        <button 
                            onClick={() => setShowInviteModal(false)}
                            className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                        <div className="mb-8 text-center">
                            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <UserPlus className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Invite Member</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Send an invitation to join your group.</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Email Address</label>
                                <input 
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="classmate@university.edu"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 p-4 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 font-medium"
                                />
                            </div>
                            <button 
                                onClick={() => {
                                    alert(`Invitation sent to ${inviteEmail}`);
                                    setShowInviteModal(false);
                                    setInviteEmail('');
                                }}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                            >
                                Send Invitation
                            </button>
                        </div>
                    </div>
                </div>
             )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[600px] flex flex-col">
                {/* Tabs */}
                <div className="flex p-4 gap-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <button 
                        onClick={() => setActiveTab('tasks')}
                        className={`flex-1 py-3 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'tasks' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
                    >
                        <ListTodo className="w-4 h-4" />
                        Shared Tasks
                    </button>
                    <button 
                        onClick={() => setActiveTab('chat')}
                        className={`flex-1 py-3 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Team Chat
                        <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-bounce">2</span>
                    </button>
                </div>

                {activeTab === 'tasks' ? (
                    <div className="p-8 flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold">Project Task Pool</h3>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add Task
                            </button>
                        </div>
                        <div className="space-y-4">
                            {tasks.map(task => (
                                <div key={task.id} className="group p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${task.status === 'completed' ? 'bg-emerald-500' : task.status === 'in-progress' ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                                        <div>
                                            <p className={`font-bold transition-colors ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>{task.title}</p>
                                            <p className="text-[10px] text-slate-500 font-medium">Assigned to: <span className="text-indigo-500 uppercase tracking-widest">{task.assignedTo}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <select className="bg-transparent border-0 text-xs font-bold text-slate-500 focus:ring-0 cursor-pointer">
                                            <option>Update Status</option>
                                            <option>In Progress</option>
                                            <option>Completed</option>
                                        </select>
                                        <button className="p-2 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full flex-1">
                         <div className="flex-1 p-8 space-y-6 overflow-y-auto max-h-[450px]">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex gap-4 ${msg.user === 'Me' ? 'flex-row-reverse' : ''}`}>
                                    <img src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-full" />
                                    <div className={`max-w-[70%] ${msg.user === 'Me' ? 'items-end' : ''}`}>
                                        <div className="flex items-center gap-2 mb-1 px-1">
                                            <span className="text-xs font-bold text-slate-500">{msg.user}</span>
                                            <span className="text-[10px] text-slate-400">{msg.time}</span>
                                        </div>
                                        <div className={`p-4 rounded-3xl text-sm ${msg.user === 'Me' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                         </div>
                         <form onSubmit={handleSendMessage} className="p-6 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                            <input 
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type a message to the group..."
                                className="flex-1 bg-white dark:bg-slate-900 border-0 p-4 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-600 shadow-sm"
                            />
                            <button className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all">
                                <Send className="w-5 h-5" />
                            </button>
                         </form>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
