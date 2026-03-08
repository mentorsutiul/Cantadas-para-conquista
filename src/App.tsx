import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './SettingsContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CategoryDetail from './pages/CategoryDetail';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import Daily from './pages/Daily';
import { AnimatePresence } from 'motion/react';

export default function App() {
  return (
    <SettingsProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:id" element={<CategoryDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AnimatePresence>
          <Navbar />
        </div>
      </Router>
    </SettingsProvider>
  );
}
