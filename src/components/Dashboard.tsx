import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Flame, Target, Clock, Star, Zap } from 'lucide-react';

interface DashboardProps {
  user: any;
}

export default function Dashboard({ user }: DashboardProps) {
  const stats = [
    { label: 'Mastery', value: `${user?.masteryLevel || 0}%`, icon: Trophy, color: 'text-orange-500' },
    { label: 'Streak', value: `${user?.streak || 0} Days`, icon: Flame, color: 'text-orange-500' },
    { label: 'Tasks', value: '12/20', icon: Target, color: 'text-orange-500' },
    { label: 'Focus Time', value: '14.5h', icon: Clock, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-sans font-bold text-white tracking-tight">Welcome back, {user?.displayName || 'Explorer'}</h2>
        <p className="text-zinc-500 mt-2 font-sans">Ready to continue your journey into the world of JavaScript?</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 hover:border-zinc-800 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-zinc-900 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest font-bold">Live Data</span>
            </div>
            <div className="space-y-1">
              <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-mono font-bold text-white tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              Recent Progress
            </h3>
            <button className="text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-widest font-bold">View History</button>
          </div>
          
          <div className="space-y-6">
            {[
              { title: 'Functional Programming', progress: 65, date: 'Today' },
              { title: 'Asynchronous Patterns', progress: 40, date: 'Yesterday' },
              { title: 'DOM Manipulation', progress: 90, date: '3 days ago' },
            ].map((item) => (
              <div key={item.title} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-300 font-medium">{item.title}</span>
                  <span className="text-zinc-500">{item.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    className="h-full bg-orange-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8">
          <h3 className="text-lg font-sans font-bold text-white mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-orange-500" />
            Top Resources
          </h3>
          <div className="space-y-4">
            {[
              'MDN: Array Methods',
              'You Don\'t Know JS',
              'Clean Code JS Patterns',
              'Performance Optimization'
            ].map((resource) => (
              <div key={resource} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-900 hover:border-zinc-800 cursor-pointer transition-all">
                <div className="w-2 h-2 rounded-full bg-orange-500/50" />
                <span className="text-zinc-400 text-sm hover:text-white transition-colors">{resource}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
