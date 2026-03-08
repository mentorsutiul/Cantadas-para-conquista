import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Copy, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES } from '../data';
import { cn } from '../lib/utils';

const AIGenerator = () => {
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [context, setContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLines, setGeneratedLines] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setGeneratedLines([]);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          category: CATEGORIES.find(c => c.id === category)?.name || category,
          context 
        }),
      });
      
      const data = await response.json();
      if (data.lines) {
        setGeneratedLines(data.lines);
      } else {
        alert(data.error || 'Erro ao gerar cantadas');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão com o servidor');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="pb-32 pt-6 px-6 max-w-md mx-auto min-h-screen">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-lg">
            <Sparkles size={20} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Gerador IA
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Crie cantadas personalizadas com inteligência artificial.
        </p>
      </header>

      <div className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-2 block">
            Categoria
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                  category === cat.id
                    ? "bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Context Input */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-2 block">
            Contexto (Opcional)
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Ex: Ela gosta de Harry Potter, ele é médico, estamos num café..."
            className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm transition-all min-h-[100px] resize-none"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {isGenerating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Gerar Cantadas
            </>
          )}
        </button>

        {/* Results */}
        <AnimatePresence>
          {generatedLines.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 mt-8"
            >
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
                Resultados da IA
              </h2>
              {generatedLines.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative group"
                >
                  <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed pr-8">
                    {line}
                  </p>
                  <button
                    onClick={() => copyToClipboard(line, idx)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-indigo-500 transition-colors"
                  >
                    {copiedIndex === idx ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </motion.div>
              ))}
              
              <button 
                onClick={handleGenerate}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
              >
                <RefreshCw size={16} />
                Tentar novamente
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIGenerator;
