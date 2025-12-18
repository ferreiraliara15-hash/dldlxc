
import React, { useState } from 'react';
import { UserPlus, Trash2, Save, Sparkles, Fingerprint, Palette } from 'lucide-react';
import { Character, VoiceType } from '../types';
import { generateCharacterDetails } from '../services/geminiService';

interface CharacterStudioProps {
  characters: Character[];
  onAdd: (char: Character) => void;
  onRemove: (id: string) => void;
  onUpdate: (char: Character) => void;
}

const CharacterStudio: React.FC<CharacterStudioProps> = ({ characters, onAdd, onRemove, onUpdate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [newChar, setNewChar] = useState<Partial<Character>>({
    name: '',
    age: '',
    visualStyle: '',
    physicalDescription: '',
    personality: '',
    emotions: '',
    actingStyle: '',
    voiceType: VoiceType.MASCULINE,
    isOrganized: false
  });

  const handleOrganize = async () => {
    if (!newChar.name) return alert("Dê um nome ao personagem primeiro.");
    setIsGenerating(true);
    try {
      const concept = `${newChar.physicalDescription} | Estilo: ${newChar.visualStyle} | Idade: ${newChar.age}`;
      const details = await generateCharacterDetails(newChar.name, concept);
      setNewChar(prev => ({ ...prev, ...details, isOrganized: true }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChar.name) return;
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      ...newChar as Character
    });
    setNewChar({ name: '', age: '', visualStyle: '', physicalDescription: '', isOrganized: false });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário de Criação */}
        <div className="lg:col-span-1 bg-[#111] p-6 rounded-2xl border border-[#222] shadow-2xl">
          <h3 className="text-xl font-cinema text-white mb-6 flex items-center gap-2">
            <UserPlus size={24} className="text-red-600" />
            Casting Digital
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Nome do Ator/Atriz</label>
                <input
                  type="text"
                  value={newChar.name}
                  onChange={e => setNewChar({...newChar, name: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg p-3 text-white focus:border-red-600 outline-none transition-all"
                  placeholder="ex: Helena Voss"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Idade</label>
                <input
                  type="text"
                  value={newChar.age}
                  onChange={e => setNewChar({...newChar, age: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg p-3 text-white focus:border-red-600 outline-none"
                  placeholder="ex: 30"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Estilo Visual</label>
                <input
                  type="text"
                  value={newChar.visualStyle}
                  onChange={e => setNewChar({...newChar, visualStyle: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg p-3 text-white focus:border-red-600 outline-none"
                  placeholder="ex: Cyberpunk"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Conceito e Aparência</label>
              <textarea
                value={newChar.physicalDescription}
                onChange={e => setNewChar({...newChar, physicalDescription: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg p-3 text-white h-24 resize-none text-sm"
                placeholder="Descreva detalhes físicos..."
              />
            </div>

            <div className="flex gap-2">
              <button 
                type="button"
                onClick={handleOrganize}
                disabled={isGenerating}
                className="flex-1 py-3 bg-amber-600/10 border border-amber-600/30 text-amber-500 font-bold rounded-lg hover:bg-amber-600/20 transition-all flex items-center justify-center gap-2 text-xs"
              >
                <Sparkles size={16} className={isGenerating ? 'animate-spin' : ''} />
                {newChar.isOrganized ? 'REORGANIZAR' : 'NANO BANANA: PREPARAR'}
              </button>
            </div>

            {newChar.isOrganized && (
              <div className="p-3 bg-green-600/5 border border-green-900/20 rounded-lg animate-in zoom-in-95">
                <p className="text-[10px] text-green-500 font-bold uppercase mb-1">✓ Personagem Organizado</p>
                <p className="text-[11px] text-gray-400">Atuação: {newChar.actingStyle}</p>
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
            >
              <Fingerprint size={20} />
              FINALIZAR CONTRATAÇÃO
            </button>
          </form>
        </div>

        {/* Lista de Personagens */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-cinema text-white mb-6 flex items-center gap-2">
            <Palette size={24} className="text-gray-500" />
            Galeria de Personagens
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {characters.length === 0 ? (
              <div className="col-span-2 py-20 bg-[#111] border border-dashed border-[#222] rounded-2xl text-center text-gray-600">
                O estúdio está vazio. Crie seu primeiro ator.
              </div>
            ) : (
              characters.map(char => (
                <div key={char.id} className="bg-[#111] border border-[#222] p-5 rounded-2xl hover:border-red-600/40 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onRemove(char.id)} className="text-gray-600 hover:text-red-500"><Trash2 size={18}/></button>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {char.name[0]}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{char.name}</h4>
                      <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{char.age} ANOS • {char.visualStyle}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 italic mb-4 line-clamp-2">"{char.physicalDescription}"</p>
                  <div className="flex gap-2">
                    <span className="text-[9px] bg-[#1a1a1a] px-2 py-1 rounded text-gray-500 uppercase">{char.voiceType}</span>
                    <span className="text-[9px] bg-[#1a1a1a] px-2 py-1 rounded text-gray-500 uppercase">{char.actingStyle}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterStudio;
