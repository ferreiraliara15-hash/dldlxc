
import React from 'react';
import { Film, User, Type, Play, Save, Settings, Video, Mic } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', icon: Film, label: 'Painel' },
    { id: 'characters', icon: User, label: 'Personagens' },
    { id: 'script', icon: Type, label: 'Editor de Roteiro' },
    { id: 'director', icon: Mic, label: 'Diretor ao Vivo' },
    { id: 'timeline', icon: Video, label: 'Linha do Tempo' },
  ];

  const labels: Record<string, string> = {
    dashboard: 'Painel Principal',
    characters: 'Estúdio de Personagens',
    script: 'Roteiro Cinematográfico',
    director: 'Estúdio da Lia AI',
    timeline: 'Edição e Linha do Tempo'
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111] border-r border-[#222] flex flex-col p-6 space-y-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center shadow-lg shadow-red-900/20">
            <Film className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-cinema text-xl text-white leading-tight">Absolute Cinema</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-red-500 font-bold">Estúdio Lia AI</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                ? 'bg-[#1a1a1a] text-red-500 border border-[#333]' 
                : 'text-gray-500 hover:text-gray-200 hover:bg-[#151515]'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-[#222]">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-white">
            <Settings size={20} />
            <span className="text-sm">Configurações do Estúdio</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(circle_at_top_right,_#1a1111,_#0a0a0a)]">
        <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#222]">
          <h2 className="text-lg font-semibold text-white">{labels[activeTab]}</h2>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-white text-black text-sm font-bold rounded hover:bg-gray-200 transition-colors flex items-center space-x-2">
              <Save size={16} />
              <span>Salvar Projeto</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 border-2 border-white/10 shadow-lg"></div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
