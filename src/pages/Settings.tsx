import React, { useState, useEffect } from 'react';
import { 
  Moon, Sun, Bell, Shield, Info, Share2, Star, MessageSquare, 
  ChevronRight, ExternalLink, Palette, Globe, Database
} from 'lucide-react';
import { useSettings } from '../SettingsContext';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import Modal from '../components/Modal';

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const [activeModal, setActiveModal] = useState<'privacy' | 'about' | null>(null);
  const [aiStats, setAiStats] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setAiStats(data.count))
      .catch(err => console.error(err));
  }, []);

  const SettingItem = ({ 
    icon: Icon, 
    label, 
    value, 
    onClick, 
    type = 'link',
    color = 'text-slate-500'
  }: any) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm active:scale-[0.98] transition-all"
    >
      <div className="flex items-center gap-4">
        <div className={cn("p-2 rounded-xl bg-slate-50 dark:bg-slate-900", color)}>
          <Icon size={20} />
        </div>
        <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
      </div>
      
      <div className="flex items-center gap-2">
        {type === 'toggle' ? (
          <div className={cn(
            "w-12 h-6 rounded-full transition-colors relative",
            value ? "bg-rose-500" : "bg-slate-200 dark:bg-slate-700"
          )}>
            <div className={cn(
              "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
              value ? "left-7" : "left-1"
            )} />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {value && <span className="text-sm text-slate-400">{value}</span>}
            <ChevronRight size={18} className="text-slate-300" />
          </div>
        )}
      </div>
    </button>
  );

  const SectionHeader = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-6 mb-2 px-2">
      {children}
    </h2>
  );

  const ThemeSelector = () => (
    <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-4">
      {(['light', 'dark', 'system'] as const).map((t) => (
        <button
          key={t}
          onClick={() => updateSettings({ theme: t })}
          className={cn(
            "flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all",
            settings.theme === t 
              ? "bg-white dark:bg-slate-800 shadow-sm text-rose-500" 
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          )}
        >
          {t === 'light' && <Sun size={20} />}
          {t === 'dark' && <Moon size={20} />}
          {t === 'system' && <Globe size={20} />}
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {t === 'light' ? 'Claro' : t === 'dark' ? 'Escuro' : 'Sistema'}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="pb-32 pt-6 px-6 max-w-md mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Ajustes
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Personalize sua experiência.
        </p>
      </header>

      <SectionHeader>Aparência</SectionHeader>
      <ThemeSelector />

      <SectionHeader>Notificações & Preferências</SectionHeader>
      <div className="space-y-3">
        <SettingItem 
          icon={Bell} 
          label="Lembrete Diário" 
          value={settings.notificationsEnabled}
          type="toggle"
          color="text-amber-500"
          onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
        />
        {settings.notificationsEnabled && (
          <SettingItem 
            icon={Globe} 
            label="Horário do Lembrete" 
            value={settings.reminderTime}
            color="text-emerald-500"
            onClick={() => {}}
          />
        )}
      </div>

      <SectionHeader>Dados & Sistema</SectionHeader>
      <div className="space-y-3">
        <SettingItem 
          icon={Database} 
          label="Cantadas Geradas por IA" 
          value={aiStats !== null ? aiStats.toString() : '...'}
          color="text-indigo-500"
          onClick={() => {}}
        />
      </div>

      <SectionHeader>Sobre o App</SectionHeader>
      <div className="space-y-3">
        <SettingItem 
          icon={Info} 
          label="Sobre o App" 
          color="text-blue-500"
          onClick={() => setActiveModal('about')}
        />
        <SettingItem 
          icon={Shield} 
          label="Termos de Privacidade" 
          color="text-slate-500"
          onClick={() => setActiveModal('privacy')}
        />
        <SettingItem 
          icon={Share2} 
          label="Compartilhar App" 
          color="text-purple-500"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Cantadas para Conquista',
                text: 'Confira o melhor app de cantadas!',
                url: window.location.origin
              });
            }
          }}
        />
        <SettingItem 
          icon={Star} 
          label="Avaliar na Loja" 
          color="text-yellow-500"
          onClick={() => alert('Redirecionando para a loja...')}
        />
        <SettingItem 
          icon={MessageSquare} 
          label="Suporte & Feedback" 
          color="text-rose-500"
          onClick={() => window.location.href = 'mailto:suporte@cantadaspro.com'}
        />
      </div>

      <Modal 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal(null)}
        title="Termos de Privacidade"
      >
        <div className="space-y-4 text-sm">
          <p><strong>1. Coleta de Dados:</strong> O Cantadas para Conquista não coleta dados pessoais identificáveis. Suas frases favoritas e configurações são salvas localmente no seu dispositivo.</p>
          <p><strong>2. Uso de Informações:</strong> As informações salvas localmente servem apenas para personalizar sua experiência, como manter o tema escuro e sua lista de favoritos.</p>
          <p><strong>3. Compartilhamento:</strong> Não compartilhamos nenhuma informação com terceiros, pois não possuímos servidores de banco de dados para este app.</p>
          <p><strong>4. Alterações:</strong> Reservamo-nos o direito de atualizar estes termos a qualquer momento.</p>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'about'} 
        onClose={() => setActiveModal(null)}
        title="Sobre o App"
      >
        <div className="space-y-4 text-sm">
          <p>O <strong>Cantadas para Conquista</strong> foi criado para ajudar você a encontrar as palavras certas em qualquer situação social.</p>
          <p>Seja para quebrar o gelo com humor, ser romântico ou mostrar seu lado nerd, temos a frase perfeita catalogada em nossas diversas categorias.</p>
          <p>Nosso objetivo é proporcionar uma experiência leve, divertida e profissional.</p>
          <p className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-slate-400">
            © 2024 Cantadas para Conquista Team. Todos os direitos reservados.
          </p>
        </div>
      </Modal>

      <div className="mt-12 text-center">
        <p className="text-xs text-slate-400">Versão 1.0.0 (Build 2024)</p>
        <p className="text-xs text-slate-400 mt-1">Desenvolvido com ❤️ para você.</p>
      </div>
    </div>
  );
};

export default Settings;
