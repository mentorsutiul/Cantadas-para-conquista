import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Home, Settings, Shuffle } from 'lucide-react';
import { cn } from '../lib/utils';

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink 
          to="/" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-colors",
            isActive ? "text-rose-500" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          )}
        >
          <Home size={24} />
          <span className="text-[10px] font-medium uppercase tracking-wider">Início</span>
        </NavLink>
        
        <NavLink 
          to="/favorites" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-colors",
            isActive ? "text-rose-500" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          )}
        >
          <Heart size={24} />
          <span className="text-[10px] font-medium uppercase tracking-wider">Favoritos</span>
        </NavLink>

        <NavLink 
          to="/daily" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-colors",
            isActive ? "text-rose-500" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          )}
        >
          <Heart size={24} />
          <span className="text-[10px] font-medium uppercase tracking-wider">Diária</span>
        </NavLink>

        <NavLink 
          to="/settings" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-colors",
            isActive ? "text-rose-500" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          )}
        >
          <Settings size={24} />
          <span className="text-[10px] font-medium uppercase tracking-wider">Ajustes</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
