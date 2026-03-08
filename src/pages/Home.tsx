import React, { useState, useMemo } from 'react';
import { CATEGORIES, PICK_UP_LINES } from '../data';
import CategoryCard from '../components/CategoryCard';
import PickUpLineCard from '../components/PickUpLineCard';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Search, Moon, Sun } from 'lucide-react';
import { useSettings } from '../SettingsContext';

const Home = () => {
  const { settings, updateSettings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLines = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return PICK_UP_LINES.filter(line => 
      line.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const toggleTheme = () => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    updateSettings({ theme: isCurrentlyDark ? 'light' : 'dark' });
  };

  return (
    <div className="pb-24 pt-4 px-6 max-w-md mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <Heart size={20} fill="white" className="text-white" />
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Cantadas
          </h1>
        </div>
        
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm text-slate-600 dark:text-slate-300"
        >
          {settings.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Separator Line */}
      <div className="h-[1px] w-full bg-slate-100 dark:bg-slate-800 mb-6" />

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="Pesquisar frases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/20 outline-none shadow-sm transition-all"
        />
      </div>

      {searchTerm.trim() ? (
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-4">
            Resultados da busca ({filteredLines.length})
          </h2>
          <AnimatePresence mode="popLayout">
            {filteredLines.map((line) => (
              <PickUpLineCard key={line.id} line={line} />
            ))}
          </AnimatePresence>
          {filteredLines.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">Nenhuma cantada encontrada.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((cat, idx) => (
              <CategoryCard key={cat.id} category={cat} index={idx} />
            ))}
          </div>

          <div className="mt-12 p-6 rounded-3xl bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-xl shadow-rose-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
            <h3 className="text-xl font-bold mb-2 relative z-10">Dica do Dia</h3>
            <p className="text-rose-50 opacity-90 text-sm leading-relaxed relative z-10">
              "O segredo de uma boa cantada não é apenas a frase, mas a confiança e o sorriso no rosto."
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
