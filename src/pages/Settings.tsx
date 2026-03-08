import React, { useState } from 'react';
import { 
  Moon, Sun, Bell, Shield, Info, Share2, Star, MessageSquare, 
  ChevronRight, ExternalLink, Palette, Globe, Database
} from 'lucide-react';
import { useSettings } from '../SettingsContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import Modal from '../components/Modal';

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const [activeDetail, setActiveDetail] = useState<'privacy' | 'about' | 'terms' | null>(null);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [ratingStatus, setRatingStatus] = useState<'idle' | 'redirecting'>('idle');

  const handleRating = () => {
    setRatingStatus('redirecting');
    setTimeout(() => setRatingStatus('idle'), 2000);
    // In a real app, you would redirect here:
    // window.open('https://play.google.com/store/apps/details?id=com.cantadas.app', '_blank');
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'Cantadas para Conquista',
      text: 'Confira o melhor app de cantadas!',
      url: 'https://cantadas-para-conquista.vercel.app/'
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText('https://cantadas-para-conquista.vercel.app/');
    setShareStatus('copied');
    setTimeout(() => setShareStatus('idle'), 2000);
  };

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
      </div>

      <SectionHeader>Sobre o App</SectionHeader>
      <div className="space-y-3">
        <SettingItem 
          icon={Info} 
          label="Sobre o App" 
          color="text-blue-500"
          onClick={() => setActiveDetail('about')}
        />
        <SettingItem 
          icon={Shield} 
          label="Política de Privacidade" 
          color="text-slate-500"
          onClick={() => setActiveDetail('privacy')}
        />
        <SettingItem 
          icon={Database} 
          label="Termos de Uso" 
          color="text-slate-400"
          onClick={() => setActiveDetail('terms')}
        />
        <SettingItem 
          icon={Share2} 
          label="Compartilhar App" 
          value={shareStatus === 'copied' ? 'Copiado!' : undefined}
          color="text-purple-500"
          onClick={handleShareApp}
        />
        <SettingItem 
          icon={Star} 
          label="Avaliar na Loja" 
          value={ratingStatus === 'redirecting' ? 'Abrindo...' : undefined}
          color="text-yellow-500"
          onClick={handleRating}
        />
        <SettingItem 
          icon={MessageSquare} 
          label="Suporte & Feedback" 
          color="text-rose-500"
          onClick={() => window.location.href = 'mailto:suporte@cantadaspro.com'}
        />
      </div>

      {/* Full Screen Detail View */}
      <AnimatePresence>
        {activeDetail && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-slate-50 dark:bg-slate-950 z-[100] overflow-y-auto"
          >
            <div className="max-w-md mx-auto min-h-screen flex flex-col">
              <header className="sticky top-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md p-6 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 z-10">
                <button 
                  onClick={() => setActiveDetail(null)}
                  className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <ChevronRight size={24} className="rotate-180" />
                </button>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {activeDetail === 'about' ? 'Sobre o App' : activeDetail === 'privacy' ? 'Política de Privacidade' : 'Termos de Uso'}
                </h2>
              </header>

              <div className="p-8 pb-20">
                {activeDetail === 'privacy' ? (
                  <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                    <p className="text-sm">Esta Política de Privacidade descreve como o aplicativo Cantadas para Conquista lida com as informações dos usuários.</p>
                    
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Coleta de Dados</h3>
                      <p>O aplicativo Cantadas para Conquista não coleta informações pessoais identificáveis. As frases favoritas e configurações do aplicativo são armazenadas apenas localmente no dispositivo do usuário.</p>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Uso das Informações</h3>
                      <p>As informações armazenadas localmente são utilizadas apenas para melhorar a experiência do usuário, como salvar frases favoritas e manter preferências de tema.</p>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Anúncios</h3>
                      <p>Este aplicativo pode exibir anúncios através do serviço Google AdMob. O Google pode coletar informações anônimas para fornecer anúncios personalizados ou relevantes. Para mais informações, consulte a política de privacidade do Google.</p>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Compartilhamento de Dados</h3>
                      <p>O aplicativo não compartilha informações pessoais com terceiros.</p>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">5. Segurança</h3>
                      <p>Como os dados são armazenados apenas localmente no dispositivo do usuário, não existe armazenamento de dados em servidores externos.</p>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">6. Alterações nesta Política</h3>
                      <p>Esta política de privacidade pode ser atualizada periodicamente para refletir melhorias ou mudanças no aplicativo.</p>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">7. Contato</h3>
                      <p>Caso tenha dúvidas sobre esta Política de Privacidade, entre em contato através do suporte do aplicativo.</p>
                    </section>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-400 italic">Última atualização: 8 de março de 2026</p>
                    </div>
                  </div>
                ) : activeDetail === 'terms' ? (
                  <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                    <p className="text-sm">Ao utilizar o aplicativo Cantadas para Conquista, você concorda com os seguintes termos:</p>
                    
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Uso do Aplicativo</h3>
                      <p>O aplicativo foi desenvolvido para fins de entretenimento, oferecendo frases e cantadas para os usuários.</p>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Responsabilidade do Usuário</h3>
                      <p>O usuário é responsável pelo uso adequado das frases compartilhadas através do aplicativo.</p>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Conteúdo</h3>
                      <p>As frases disponíveis no aplicativo são fornecidas apenas para entretenimento. O desenvolvedor não se responsabiliza pela forma como o conteúdo é utilizado pelos usuários.</p>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Atualizações</h3>
                      <p>O aplicativo pode receber atualizações periódicas para melhorias de desempenho, novas funcionalidades ou correções.</p>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">5. Modificações nos Termos</h3>
                      <p>Estes termos podem ser atualizados a qualquer momento para refletir mudanças no aplicativo.</p>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">6. Aceitação</h3>
                      <p>Ao utilizar o aplicativo, o usuário declara que leu e concorda com estes Termos de Uso.</p>
                    </section>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-400 italic">Última atualização: 8 de março de 2026</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                    <p>O <strong>Cantadas para Conquista</strong> foi criado para ajudar você a encontrar as palavras certas em qualquer situação social.</p>
                    <p>Seja para quebrar o gelo com humor, ser romântico ou mostrar seu lado nerd, temos a frase perfeita catalogada em nossas diversas categorias.</p>
                    <p>Nosso objetivo é proporcionar uma experiência leve, divertida e profissional, garantindo que você tenha sempre uma boa conversa na ponta da língua.</p>
                    
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Site Oficial</h3>
                      <a 
                        href="https://cantadas-para-conquista.vercel.app/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-rose-500 font-medium flex items-center gap-2 mb-4"
                      >
                        cantadas-para-conquista.vercel.app
                        <ExternalLink size={14} />
                      </a>
                      
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Desenvolvedores</h3>
                      <p className="text-sm">Equipe Cantadas para Conquista</p>
                      <p className="text-sm mt-1">Contato: suporte@cantadaspro.com</p>
                    </div>

                    <div className="pt-8 text-center space-y-1">
                      <p className="text-xs text-slate-400">Versão 1.0.0</p>
                      <p className="text-xs text-slate-400">
                        © 2024 Cantadas para Conquista Team.<br />Todos os direitos reservados.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 text-center">
        <p className="text-xs text-slate-400">Versão 1.0.0 (Build 2024)</p>
        <p className="text-xs text-slate-400 mt-1">Desenvolvido com ❤️ para você.</p>
      </div>
    </div>
  );
};

export default Settings;
