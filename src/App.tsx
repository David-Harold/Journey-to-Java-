/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Pomodoro from './components/Pomodoro';
import TaskList from './components/TaskList';
import AIService from './components/AIService';
import { Code2, Github, LayoutGrid, Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch or create user profile
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          const newUserData = {
            userId: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Explorer',
            email: firebaseUser.email,
            masteryLevel: 0,
            streak: 1,
            lastActive: serverTimestamp(),
            createdAt: serverTimestamp()
          };
          await setDoc(userRef, newUserData);
          setUserData(newUserData);
        } else {
          setUserData(userSnap.data());
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-zinc-600 font-mono text-xs uppercase tracking-[0.2em] font-bold">Synchronizing Journey</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8 text-center bg-zinc-950 border border-zinc-900 p-12 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
          
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-zinc-800">
            <Code2 className="text-orange-500 w-8 h-8" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-sans font-bold text-white tracking-tight">Journey to Java</h1>
            <p className="text-zinc-500 text-sm leading-relaxed px-4">
              Your intelligent companion for mastering JavaScript through focused study, AI mentorship, and organized practice.
            </p>
          </div>

          <div className="pt-8 space-y-4">
            <button 
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all transform active:scale-95 shadow-xl shadow-white/5"
            >
              <Github className="w-5 h-5" />
              Continue with Google
            </button>
            <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-widest">
              Secure Auth Powered by Firebase
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 px-8 lg:px-16 py-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard user={userData} />}
          {activeTab === 'pomodoro' && <Pomodoro />}
          {activeTab === 'tasks' && <TaskList />}
          {activeTab === 'ai' && <AIService />}
        </div>
      </main>

      {/* Decorative background gradients */}
      <div className="fixed top-0 right-0 w-[50vw] h-[50vh] bg-orange-500/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[30vw] h-[30vh] bg-blue-500/5 blur-[120px] pointer-events-none" />
    </div>
  );
}
