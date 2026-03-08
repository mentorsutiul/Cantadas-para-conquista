import React, { useMemo } from 'react';
import { PICK_UP_LINES } from '../data';
import PickUpLineCard from '../components/PickUpLineCard';
import { Heart, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

const Daily = () => {
  // Simple seed-based random for "daily" effect
  const dailyLine = useMemo(() => {
    const today = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = today.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % PICK_UP_LINES.length;
    return PICK_UP_LINES[index];
  }, []);

  return (
    <div className="pb-24 pt-6 px-6 max-w-md mx-auto min-h-screen flex flex-col">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-lg">
            <Heart size={20} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Cantada do Dia
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Uma frase especial para hoje.
        </p>
      </header>

      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative"
        >
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg z-10">
            <Heart size={20} fill="currentColor" />
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-2xl shadow-rose-500/10 border border-slate-100 dark:border-slate-700 text-center relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16" />
            
            <div className="flex justify-center relative z-10">
              <PickUpLineCard line={dailyLine} />
            </div>
          </div>
        </motion.div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw size={18} />
            Gerar Outra
          </button>
        </div>
      </div>
    </div>
  );
};

export default Daily;
