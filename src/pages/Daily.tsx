import React, { useState, useCallback } from 'react';
import { PICK_UP_LINES } from '../data';
import PickUpLineCard from '../components/PickUpLineCard';
import { Heart, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Daily = () => {
  // Initial daily line based on date
  const getDailyLine = () => {
    const today = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = today.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % PICK_UP_LINES.length;
    return PICK_UP_LINES[index];
  };

  const [currentLine, setCurrentLine] = useState(getDailyLine());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Add a small delay for the animation feel
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * PICK_UP_LINES.length);
      setCurrentLine(PICK_UP_LINES[randomIndex]);
      setIsRefreshing(false);
    }, 400);
  }, []);

  return (
    <div className="pb-24 pt-6 px-6 max-w-md mx-auto min-h-screen flex flex-col">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <Heart size={20} fill="white" className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Cantadas do Dia
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Uma frase especial para você agora.
        </p>
      </header>

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLine.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg z-10">
              <Heart size={20} fill="currentColor" />
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-2xl shadow-rose-500/10 border border-slate-100 dark:border-slate-700 text-center relative overflow-hidden">
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16" />
              
              <div className="flex justify-center relative z-10">
                <PickUpLineCard line={currentLine} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 text-center">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-8 py-4 bg-rose-500 text-white rounded-full font-bold text-base shadow-lg shadow-rose-500/25 hover:bg-rose-600 transition-all active:scale-95 disabled:opacity-70"
          >
            <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
            Gerar Outra
          </button>
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            Busca cantadas aleatórias de todas as categorias
          </p>
        </div>
      </div>
    </div>
  );
};

export default Daily;
