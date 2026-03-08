import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppSettings } from './types';
import { safeStorage } from './lib/storage';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  notificationsEnabled: false,
  reminderTime: '20:00',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = safeStorage.getItem('cantadas_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = safeStorage.getItem('cantadas_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    safeStorage.setItem('cantadas_settings', JSON.stringify(settings));
    
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let isDark = false;
      if (settings.theme === 'dark') {
        isDark = true;
      } else if (settings.theme === 'light') {
        isDark = false;
      } else {
        isDark = mediaQuery.matches;
      }

      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    applyTheme();

    // Listen for system theme changes if set to 'system'
    const listener = () => {
      if (settings.theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [settings]);

  useEffect(() => {
    safeStorage.setItem('cantadas_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, favorites, toggleFavorite }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
