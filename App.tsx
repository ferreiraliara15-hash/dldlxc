
import React, { useState, useEffect } from 'react';
import { Video, Film, Scissors, Palette, Volume2, Download, Play } from 'lucide-react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CharacterStudio from './components/CharacterStudio';
import ScriptEditor from './components/ScriptEditor';
import DirectorLive from './components/DirectorLive';
import { Project, Character, Scene, FramingType, VoiceType } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (projects.length === 0) {
      const initialProject: Project = {
        id: 'p1',
        name: 'O Assalto da Meia-Noite',
        updatedAt: Date.now(),
        characters: [
          {
            id: 'c1',
            name: 'Julian Thorne',
            age: '35',
            visualStyle: 'Noir Moderno',
            physicalDescription: 'Traços marcantes, terno grafite sob medida.',
            personality: 'Calculista e estóico.',
            emotions: 'Intensidade reservada',
            actingStyle: 'Minimalista',
            voiceType: VoiceType.INTENSE,
            isOrganized: true
          }
        ],
        scenes: [
          {
            id: 's1',
            title: 'Plano de Abertura',
            script: 'INT. COFRE - NOITE. Julian para diante da grade de laser, seu reflexo capturado no aço polido.',
            scenario: 'Cofre tecnológico, feixes vermelhos.',
            mood: 'Tenso',
            framing: FramingType.CLOSE,
            duration: 8,
            characterIds: ['c1'],
            filter: 'none'
          }
        ]
      };
      setProjects([initialProject]);
      setActiveProjectId(initialProject.id);
    }
  }, [projects.length]);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const updateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const renderContent = () => {
    if (!activeProject) return <div className="text-white p-10">Carregando Estúdio...</div>;

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard projects={projects} onNewProject={() => {}} />;
      case 'characters':
        return (
          <CharacterStudio 
            characters={activeProject.characters}
            onAdd={(char) => updateProject({ ...activeProject, characters: [...activeProject.characters, char] })}
            onRemove={(id) => updateProject({ ...activeProject, characters: activeProject.characters.filter(c => c.id !== id) })}
            onUpdate={(char) => updateProject({...activeProject, characters: activeProject.characters.map(c => c.id === char.id ? char : c)})}
          />
        );
      case 'script':
        return (
          <ScriptEditor 
            scenes={activeProject.scenes}
            characters={activeProject.characters}
            onAdd={(s) => updateProject({ ...activeProject, scenes: [...activeProject.scenes, s] })}
            onUpdate={(updatedScene) => updateProject({ 
              ...activeProject, 
              scenes: activeProject.scenes.map(s => s.id === updatedScene.id ? updatedScene : s) 
            })}
          />
        );
      case 'director':
        return <DirectorLive />;
      case 'timeline':
        return (
          <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-cinema text-white">Suíte de Edição</h3>
              <div className="flex gap-2">
                <button className="px-6 py-2 bg-white text-black rounded-lg font-bold text-xs hover:bg-red-600 hover:text-white transition-all">UNIR TUDO & PREVIEW</button>
                <button className="px-6 py-2 bg-[#222] text-white rounded-lg font-bold text-xs flex items-center gap-2"><Download size={14}/> EXPORTAR 4K</button>
              </div>
            </div>

            <div className="bg-[#111] p-8 rounded-3xl border border-[#222] shadow-2xl space-y-8">
              {/* Timeline Tracks */}
              <div className="space-y-2">
                 <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase"><Film size={12}/> Vídeo</div>
                 <div className="w-full bg-[#0a0a0a] h-24 rounded-xl border border-[#222] flex items-center p-3 gap-3 overflow-x-auto shadow-inner">
                    {activeProject.scenes.map((s, i) => (
                      <div key={s.id} className="min-w-[180px] h-full bg-[#151515] rounded-lg border border-red-900/20 p-3 flex flex-col justify-between group relative overflow-hidden">
                        <span className="text-[9px] text-gray-600">CLIP {i+1}</span>
                        <p className="text-[11px] text-white truncate font-medium">{s.title}</p>
                        <div className="flex justify-between items-center"><span className="text-[9px] text-red-500">{s.duration}s</span><Scissors size={10} className="text-gray-700"/></div>
                      </div>
                    ))}
                 </div>
                 <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase mt-4"><Volume2 size={12}/> Áudio AI</div>
                 <div className="w-full bg-[#0a0a0a] h-12 rounded-xl border border-[#222] flex items-center p-2 gap-1 opacity-50">
                    {Array.from({length: 20}).map((_, i) => <div key={i} className="h-4 w-1 bg-amber-600/40 rounded-full" style={{height: `${Math.random()*100}%`}}></div>)}
                 </div>
              </div>

              {/* Editing Tools */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#222]">
                <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-[#222]">
                   <h4 className="text-[10px] text-gray-500 font-bold uppercase mb-4 flex items-center gap-2"><Palette size={14}/> Color Grading</h4>
                   <div className="grid grid-cols-4 gap-2">
                     {['Original', 'Noir', 'Vivid', 'Vintage'].map(f => (
                       <button key={f} className="text-[9px] p-2 bg-[#111] border border-[#333] rounded text-gray-400 hover:border-red-600 hover:text-white">{f}</button>
                     ))}
                   </div>
                </div>
                <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-[#222]">
                   <h4 className="text-[10px] text-gray-500 font-bold uppercase mb-4 flex items-center gap-2"><Volume2 size={14}/> Sound Design</h4>
                   <input type="range" className="w-full h-1 bg-red-900 rounded-lg appearance-none cursor-pointer accent-red-600" />
                   <div className="flex justify-between text-[9px] text-gray-600 mt-2"><span>Ambient</span><span>Music</span></div>
                </div>
                <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-[#222]">
                   <h4 className="text-[10px] text-gray-500 font-bold uppercase mb-4 flex items-center gap-2"><Play size={14}/> Transições</h4>
                   <div className="grid grid-cols-2 gap-2">
                     <button className="text-[10px] py-2 bg-[#111] border border-[#333] rounded text-gray-400">Corte Seco</button>
                     <button className="text-[10px] py-2 bg-[#111] border border-[#333] rounded text-gray-400">Dissolver</button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard projects={projects} onNewProject={() => {}} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
