import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Category } from '../types';
import { cn } from '../lib/utils';

interface CategoryCardProps {
  category: Category;
  index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index }) => {
  // Dynamic icon component
  const IconComponent = (Icons as any)[category.icon] || Icons.HelpCircle;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="h-full"
    >
      <Link 
        to={`/category/${category.id}`}
        className="group h-full flex flex-col items-center text-center p-5 bg-white dark:bg-slate-800 rounded-[2rem] border-2 border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-rose-400 dark:hover:border-rose-500/50 transition-all duration-300 relative overflow-hidden"
      >
        {/* Decorative background element */}
        <div className={cn(
          "absolute -top-6 -right-6 w-16 h-16 opacity-10 rounded-full transition-transform group-hover:scale-150",
          category.color
        )} />

        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4 transition-transform group-hover:rotate-6 group-hover:scale-110",
          category.color
        )}>
          <IconComponent size={28} />
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mb-1">
            {category.name}
          </h3>
          <p className="text-[10px] leading-tight font-medium text-slate-400 dark:text-slate-500 uppercase tracking-tighter line-clamp-2">
            {category.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
