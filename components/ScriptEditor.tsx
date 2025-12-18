
import React, { useState } from 'react';
import { Wand2, Clapperboard, Timer, Camera, Video, Users, Check, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Scene, FramingType, Character } from '../types';
import { generateScriptHelp, generateSceneVideo } from '../services/geminiService';

interface ScriptEditorProps {
  scenes: Scene[];
  characters: Character[];
  onUpdate: (scene: Scene) => void;
  onAdd: (scene: Scene) => void;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({ scenes, characters, onUpdate, onAdd }) => {
  const [activeSceneId, setActiveSceneId] = useState<string | null>(scenes[0]?.id || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const activeScene = scenes.find(s => s.id === activeSceneId);

  const handleAnalyze = async () => {
    if (!activeScene) return;
    setIsAnalyzing(true);
    try {
      const refined = await generateScriptHelp(activeScene.script);
      onUpdate({ ...activeScene, script: refined });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!activeScene) return;
    onUpdate({ ...activeScene, isGenerating: true });
    try {
      const sceneChars = characters.filter(c => activeScene.characterIds?.includes(c.id));
      const videoUrl = await generateSceneVideo(activeScene, sceneChars);
      onUpdate({ ...activeScene, videoUrl, isGenerating: false });
    } catch (e) {
      alert("Erro na renderização VEO 3. Verifique as permissões de vídeo.");
      onUpdate({ ...activeScene, isGenerating: false });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
      {/* Sidebar de Cenas */}
      <div className="lg:col-span-1 bg-[#111] rounded-2xl border border-[#222] overflow-hidden flex flex-col">
        <div className="p-4 bg-[#151515] border-b border-[#222] flex justify-between items-center">
          <h3 className="font-cinema text-white text-sm">Roteiro</h3>
          <button onClick={() => onAdd({ 
            id: Math.random().toString(36).substr(2, 9), 
            title: 'Nova Cena', 
            script: '', scenario: '', mood: 'Cine', framing: FramingType.WIDE, duration: 5, characterIds: [] 
          })} className="p-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600/20"><Clapperboard size={18}/></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {scenes.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveSceneId(s.id)}
              className={`w-full text-left p-4 border-b border-[#1a1a1a] transition-all ${activeSceneId === s.id ? 'bg-red-600/5 border-l-4 border-l-red-600' : 'hover:bg-[#151515]'}`}
            >
              <p className="text-[10px] text-gray-500 font-bold mb-1">CENA {i + 1}</p>
              <h4 className="text-white text-sm font-medium truncate">{s.title || 'Sem Título'}</h4>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Central */}
      <div className="lg:col-span-2 bg-[#111] rounded-2xl border border-[#222] flex flex-col shadow-2xl overflow-hidden">
        {activeScene ? (
          <>
            <div className="px-6 py-4 bg-[#151515] border-b border-[#222] flex justify-between items-center">
              <input 
                value={activeScene.title}
                onChange={e => onUpdate({...activeScene, title: e.target.value})}
                className="bg-transparent text-white font-cinema text-lg focus:outline-none w-1/2"
                placeholder="Nome da Cena..."
              />
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-4 py-2 bg-amber-600/10 text-amber-500 text-[10px] font-bold rounded-full border border-amber-600/20 flex items-center gap-2 hover:bg-amber-600/20 transition-all"
              >
                <Wand2 size={14} className={isAnalyzing ? 'animate-spin' : ''} />
                ANÁLISE NANO BANANA
              </button>
            </div>
            <div className="flex-1 flex flex-col">
              <textarea
                className="flex-1 bg-transparent p-8 text-gray-300 font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-gray-800"
                placeholder="ESCREVA O ROTEIRO... Ex: INT. COZINHA - NOITE. Clara observa a chuva..."
                value={activeScene.script}
                onChange={e => onUpdate({...activeScene, script: e.target.value})}
              />
              <div className="p-4 bg-[#0d0d0d] border-t border-[#222] grid grid-cols-2 gap-4">
                <input 
                  placeholder="Local / Ambiente"
                  className="bg-[#151515] border border-[#222] p-2 rounded text-xs text-white"
                  value={activeScene.scenario}
                  onChange={e => onUpdate({...activeScene, scenario: e.target.value})}
                />
                <input 
                  placeholder="Clima Emocional"
                  className="bg-[#151515] border border-[#222] p-2 rounded text-xs text-white"
                  value={activeScene.mood}
                  onChange={e => onUpdate({...activeScene, mood: e.target.value})}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-700 italic">Selecione uma cena no menu lateral.</div>
        )}
      </div>

      {/* Controles VEO 3 */}
      <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-1">
        <div className="bg-[#111] p-5 rounded-2xl border border-[#222]">
          <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Users size={14}/> Casting da Cena</h3>
          <div className="flex flex-wrap gap-2">
            {characters.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  const ids = activeScene?.characterIds || [];
                  onUpdate({...activeScene!, characterIds: ids.includes(c.id) ? ids.filter(i => i !== c.id) : [...ids, c.id]});
                }}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${activeScene?.characterIds.includes(c.id) ? 'bg-red-600 border-red-600 text-white' : 'bg-[#1a1a1a] border-[#333] text-gray-500'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#111] p-5 rounded-2xl border border-[#222]">
          <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Camera size={14}/> Direção VEO</h3>
          <div className="space-y-4">
            <select 
              className="w-full bg-[#1a1a1a] border border-[#333] p-2 rounded text-xs text-white"
              value={activeScene?.framing}
              onChange={e => onUpdate({...activeScene!, framing: e.target.value as FramingType})}
            >
              {Object.values(FramingType).map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <div className="flex items-center gap-2 bg-[#1a1a1a] p-2 rounded border border-[#333]">
              <Timer size={14} className="text-gray-500" />
              <input 
                type="number" 
                className="bg-transparent text-xs text-white w-full outline-none"
                value={activeScene?.duration}
                onChange={e => onUpdate({...activeScene!, duration: Number(e.target.value)})}
              />
              <span className="text-[9px] text-gray-600">SEG</span>
            </div>
          </div>
        </div>

        <div className="bg-black p-4 rounded-2xl border border-red-900/10 shadow-2xl min-h-[250px] flex flex-col">
          <div className="flex-1 mb-4 rounded-xl bg-[#0a0a0a] border border-[#222] overflow-hidden flex items-center justify-center">
            {activeScene?.videoUrl ? (
              <video src={activeScene.videoUrl} controls className="w-full h-full object-cover" />
            ) : activeScene?.isGenerating ? (
              <div className="text-center animate-pulse">
                <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[10px] text-red-500 font-bold tracking-widest uppercase">LIA AI DIRIGINDO...</p>
                <p className="text-[8px] text-gray-600 mt-1">Sincronizando áudio e atuação</p>
              </div>
            ) : (
              <p className="text-[9px] text-gray-800 uppercase font-bold">Preview Pendente</p>
            )}
          </div>
          <button 
            onClick={handleGenerate}
            disabled={!activeScene || activeScene.isGenerating}
            className="w-full py-4 bg-white text-black font-bold text-xs rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-30"
          >
            <Sparkles size={16} />
            EXECUTAR DIRETOR VEO 3
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScriptEditor;
