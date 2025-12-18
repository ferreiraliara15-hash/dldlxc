
import React from 'react';
import { PlusCircle, Clock, Video, Film, Download } from 'lucide-react';
import { Project } from '../types';

interface DashboardProps {
  projects: Project[];
  onNewProject: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, onNewProject }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#222] p-8 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Film size={120} />
          </div>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">Projetos Ativos</p>
          <h3 className="text-4xl font-cinema text-white">{projects.length}</h3>
        </div>
        <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#222] p-8 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Video size={120} />
          </div>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">Total de Cenas</p>
          <h3 className="text-4xl font-cinema text-white">{projects.reduce((acc, p) => acc + p.scenes.length, 0)}</h3>
        </div>
        <button 
          onClick={onNewProject}
          className="bg-red-600 hover:bg-red-700 transition-all p-8 rounded-2xl flex flex-col justify-center items-center text-white gap-2 shadow-xl shadow-red-900/10"
        >
          <PlusCircle size={40} />
          <span className="font-bold text-lg">Nova Produção</span>
        </button>
      </div>

      {/* Main Workspace Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-cinema text-white flex items-center gap-2">
              <Clock className="text-red-500" size={20} /> Atividade Recente
            </h3>
            <button className="text-xs text-gray-500 hover:text-white uppercase tracking-tighter">Ver Arquivo</button>
          </div>
          
          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="bg-[#111] p-20 rounded-2xl border border-dashed border-[#222] text-center">
                <p className="text-gray-600 italic">Nenhuma produção em andamento.</p>
              </div>
            ) : (
              projects.map(proj => (
                <div key={proj.id} className="bg-[#111] border border-[#222] p-6 rounded-2xl hover:border-[#333] transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-red-500 transition-colors">{proj.name}</h4>
                      <p className="text-xs text-gray-500">Atualizado em {new Date(proj.updatedAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className="bg-[#1a1a1a] text-gray-400 px-3 py-1 rounded-full text-[10px] uppercase font-bold border border-[#333]">
                        {proj.scenes.length} Cenas
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {proj.scenes.slice(0, 4).map(scene => (
                      <div key={scene.id} className="aspect-video bg-black rounded border border-[#222] overflow-hidden relative">
                        {scene.videoUrl ? (
                          <video src={scene.videoUrl} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-20">
                            <Video size={16} />
                          </div>
                        )}
                      </div>
                    ))}
                    {proj.scenes.length < 4 && Array.from({length: 4 - proj.scenes.length}).map((_, i) => (
                      <div key={i} className="aspect-video bg-[#1a1a1a] rounded border border-dashed border-[#333]" />
                    ))}
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1">
                      <Download size={14} /> Exportar Rascunho
                    </button>
                    <button className="text-xs font-bold px-4 py-2 bg-[#222] hover:bg-white hover:text-black rounded transition-all">
                      Abrir no Estúdio
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-cinema text-white">Inspiração Diária</h3>
          <div className="bg-[#111] rounded-2xl border border-[#222] p-6 space-y-4">
            <div className="aspect-[4/5] bg-black rounded-xl overflow-hidden relative group">
              <img src="https://picsum.photos/400/500?grayscale" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" alt="Inspiration" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent p-6 flex flex-col justify-end">
                <p className="text-[10px] text-red-500 font-bold uppercase mb-1">Escolha do Diretor</p>
                <h4 className="text-white font-cinema text-lg mb-2">A Iluminação de Blade Runner 2049</h4>
                <p className="text-xs text-gray-400">Estude o uso de luz volumétrica e altas taxas de contraste.</p>
              </div>
            </div>
            <div className="p-4 bg-[#1a1a1a] rounded-xl border border-[#222]">
              <p className="text-xs text-gray-400 italic">"Cinema é uma questão do que está no quadro e do que está fora."</p>
              <p className="text-[10px] text-red-900 font-bold text-right mt-2">— Martin Scorsese</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
