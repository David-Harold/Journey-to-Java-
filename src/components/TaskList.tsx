import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, CheckCircle2, Circle, Clock, Tag, X } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-utils';

const CATEGORIES = [
  { id: 'docs', label: 'Documentation', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'project', label: 'Project', color: 'bg-purple-500/20 text-purple-400' },
  { id: 'video', label: 'Visual Learning', color: 'bg-red-500/20 text-red-400' },
  { id: 'theory', label: 'Theory', color: 'bg-green-500/20 text-green-400' },
];

export default function TaskList() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [category, setCategory] = useState('docs');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'users', auth.currentUser.uid, 'tasks'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setIsLoading(false);
    }, (error) => {
      console.error("Task subscription error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, 'users', auth.currentUser.uid, 'tasks'), {
        userId: auth.currentUser.uid,
        title: newTaskTitle,
        description: '',
        category,
        status: 'todo',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNewTaskTitle('');
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `users/${auth.currentUser.uid}/tasks`);
    }
  };

  const toggleTask = async (task: any) => {
    if (!auth.currentUser) return;
    const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', task.id), {
        status: nextStatus,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${auth.currentUser.uid}/tasks/${task.id}`);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!auth.currentUser) return;
    try {
      await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', taskId));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${auth.currentUser.uid}/tasks/${taskId}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-sans font-bold text-white tracking-tight">Study Path</h2>
          <p className="text-zinc-500 mt-1">Plan your milestones and track your mastery.</p>
        </div>
      </header>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl space-y-4">
        <input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="What do you want to learn next?"
          className="w-full bg-transparent border-none text-white placeholder-zinc-700 text-lg focus:ring-0"
        />
        <div className="flex items-center justify-between border-t border-zinc-900 pt-4">
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  category === cat.id ? cat.color : 'text-zinc-600 hover:text-zinc-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <button 
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </button>
        </div>
      </form>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="text-center py-12 text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">
              Syncing with database...
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-900 rounded-3xl">
              <p className="text-zinc-600 text-sm italic font-sans">No active goals. Time to dream big!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                  task.status === 'completed' 
                    ? 'bg-zinc-950/50 border-zinc-900 grayscale opacity-60' 
                    : 'bg-zinc-950 border-zinc-900 hover:border-zinc-800'
                }`}
              >
                <button onClick={() => toggleTask(task)} className="text-zinc-700 hover:text-orange-500 transition-all">
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-500/10" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                <div className="flex-1">
                  <h4 className={`text-sm font-medium ${task.status === 'completed' ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {task.category}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.createdAt?.toDate().toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-zinc-800 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
