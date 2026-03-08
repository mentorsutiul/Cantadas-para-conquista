import React, { useState } from 'react';
import { Copy, Heart, Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PickUpLine } from '../types';
import { useSettings } from '../SettingsContext';
import { cn } from '../lib/utils';

interface PickUpLineCardProps {
  line: PickUpLine;
}

const PickUpLineCard: React.FC<PickUpLineCardProps> = ({ line }) => {
  const { favorites, toggleFavorite } = useSettings();
  const [copied, setCopied] = useState(false);
  const isFavorite = favorites.includes(line.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(line.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Cantadas',
      text: line.text,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing', err);
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all"
    >
      <p className="text-base font-medium text-slate-800 dark:text-slate-100 leading-relaxed mb-4">
        "{line.text}"
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopy}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors relative"
            title="Copiar"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check size={20} className="text-emerald-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          
          <button 
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
            title="Compartilhar"
          >
            <Share2 size={20} />
          </button>
        </div>

        <button 
          onClick={() => toggleFavorite(line.id)}
          className={cn(
            "p-2 rounded-full transition-all",
            isFavorite 
              ? "bg-rose-50 dark:bg-rose-900/20 text-rose-500" 
              : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-300 dark:text-slate-600"
          )}
          title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
    </motion.div>
  );
};

export default PickUpLineCard;
