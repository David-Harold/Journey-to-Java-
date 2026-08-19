import React from 'react';
import { 
  LayoutDashboard, 
  Timer, 
  CheckSquare, 
  Sparkles, 
  LogOut,
  ChevronRight,
  Code2,
  BookOpen,
  Youtube,
  Trophy
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Study Path', icon: CheckSquare },
    { id: 'pomodoro', label: 'Focus Timer', icon: Timer },
    { id: 'ai', label: 'AI Mentor', icon: Sparkles },
  ];

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
            <Code2 className="text-white w-5 h-5" />
          </div>
          <h1 className="font-sans font-bold text-lg text-white tracking-tight">Journey to Java</h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                activeTab === item.id 
                  ? 'bg-zinc-900 text-orange-500 border border-zinc-800' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {activeTab === item.id && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-zinc-900">
        <button 
          onClick={() => signOut(auth)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
