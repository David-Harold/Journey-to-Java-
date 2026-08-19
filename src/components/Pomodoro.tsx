import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Coffee, Brain, Volume2, VolumeX } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-utils';

const MODES = {
  work: { label: 'Focus', initial: 25 * 60, color: 'text-orange-500', icon: Brain },
  short_break: { label: 'Short Break', initial: 5 * 60, color: 'text-zinc-300', icon: Coffee },
  long_break: { label: 'Long Break', initial: 15 * 60, color: 'text-zinc-400', icon: Coffee },
};

export default function Pomodoro() {
  const [mode, setMode] = useState<keyof typeof MODES>('work');
  const [timeLeft, setTimeLeft] = useState(MODES[mode].initial);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleComplete = async () => {
    setIsActive(false);
    if (!isMuted) {
      // Play sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
    }

    if (auth.currentUser) {
      try {
        await addDoc(collection(db, 'users', auth.currentUser.uid, 'sessions'), {
          userId: auth.currentUser.uid,
          duration: Math.floor(MODES[mode].initial / 60),
          type: mode,
          timestamp: serverTimestamp()
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, `users/${auth.currentUser.uid}/sessions`);
      }
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].initial);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const ModeIcon = MODES[mode].icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
      {/* Mode Selector */}
      <div className="flex bg-zinc-950 p-1 border border-zinc-900 rounded-2xl">
        {(Object.keys(MODES) as Array<keyof typeof MODES>).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setTimeLeft(MODES[m].initial);
              setIsActive(false);
            }}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === m ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-400'
            }`}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative group">
        <div className="absolute inset-0 bg-orange-500/10 blur-[100px] rounded-full group-hover:bg-orange-500/20 transition-all" />
        <div className="relative w-80 h-80 rounded-full border-2 border-zinc-900 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute top-16"
            >
              <ModeIcon className={`w-8 h-8 ${MODES[mode].color} opacity-50`} />
            </motion.div>
          </AnimatePresence>

          <span className="text-7xl font-mono font-bold text-white tracking-tighter">
            {formatTime(timeLeft)}
          </span>
          <span className={`text-xs font-mono uppercase tracking-widest font-bold mt-4 ${MODES[mode].color}`}>
            {isActive ? 'In Progress' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 text-zinc-500 hover:text-white transition-all"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>

        <button 
          onClick={toggleTimer}
          className="w-20 h-20 rounded-full bg-orange-500 hover:bg-orange-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 transition-all transform hover:scale-105 active:scale-95"
        >
          {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>

        <button 
          onClick={resetTimer}
          className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 text-zinc-500 hover:text-white transition-all"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
