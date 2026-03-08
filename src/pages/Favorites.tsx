import React from 'react';
import { PICK_UP_LINES } from '../data';
import { useSettings } from '../SettingsContext';
import PickUpLineCard from '../components/PickUpLineCard';
import { Heart, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Favorites = () => {
  const { favorites } = useSettings();
  const [search, setSearch] = React.useState('');

  // Note: Since we simulated repeated IDs in CategoryDetail, 
  // we need to handle the fact that PICK_UP_LINES only has the base ones.
  // In a real app, IDs would be unique and persistent.
  const favoriteLines = PICK_UP_LINES.filter(l => favorites.includes(l.id))
    .filter(l => l.text.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="pb-24 pt-6 px-6 max-w-md mx-auto">
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-lg">
            <Heart size={20} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Favoritos
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Suas frases preferidas salvas.
        </p>
      </header>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text"
          placeholder="Buscar nos favoritos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/20 outline-none shadow-sm"
        />
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {favoriteLines.map((line) => (
            <PickUpLineCard key={line.id} line={line} />
          ))}
        </AnimatePresence>

        {favoriteLines.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Você ainda não favoritou nenhuma frase.
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Toque no coração para salvar suas favoritas.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
