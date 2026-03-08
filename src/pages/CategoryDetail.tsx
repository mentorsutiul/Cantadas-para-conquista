import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CATEGORIES, PICK_UP_LINES } from '../data';
import PickUpLineCard from '../components/PickUpLineCard';
import { ArrowLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');

  const category = CATEGORIES.find(c => c.id === id);
  
  const lines = useMemo(() => {
    // In a real app, we'd have 150+ lines. Here we filter from our mock data.
    // To simulate 150+, we could repeat the existing ones or generate more.
    const baseLines = PICK_UP_LINES.filter(l => l.category === id);
    
    // Simulating a large list without mangling IDs for favorites to work
    // In a real app, these would be unique database IDs.
    // For this demo, we'll just use the base lines to ensure favorites work correctly.
    return baseLines.filter(l => 
      l.text.toLowerCase().includes(search.toLowerCase())
    );
  }, [id, search]);

  if (!category) return <div>Categoria não encontrada</div>;

  return (
    <div className="pb-24 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className={`${category.color} text-white px-6 pt-6 pb-6 shadow-lg`}>
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-black truncate">{category.name}</h1>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={16} />
          <input 
            type="text"
            placeholder="Buscar cantada..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/20 border-none rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/40 outline-none backdrop-blur-md"
          />
        </div>
      </div>

      <div className="px-6 py-6 space-y-4 max-w-md mx-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {lines.length} Frases encontradas
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          {lines.map((line) => (
            <PickUpLineCard key={line.id} line={line} />
          ))}
        </AnimatePresence>

        {lines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">Nenhuma cantada encontrada para sua busca.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
