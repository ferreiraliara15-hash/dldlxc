
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Mic, MicOff, Volume2, MessageSquare } from 'lucide-react';
import { decode, decodeAudioData, encode } from '../services/geminiService';

const DirectorLive: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 50));

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            addLog("A diretora está ouvindo...");
            const source = inputContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputContextRef.current!.destination);
          },
          onmessage: async (message) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => addLog("Erro na direção: " + e.message),
          onclose: () => addLog("A diretora saiu do estúdio."),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "Você é 'Lia', uma diretora de cinema brilhante, levemente temperamental, mas com uma visão artística elevadíssima. Você está aqui para guiar o usuário na criação de sua próxima obra-prima. Dê conselhos técnicos sobre iluminação, composição e ressonância emocional. Seja profissional, criativa e firme quanto à qualidade. Responda sempre em Português do Brasil.",
        }
      });

      sessionRef.current = await sessionPromise;
      setIsActive(true);
    } catch (err) {
      console.error(err);
      addLog("Falha ao iniciar sessão.");
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[#111] p-8 rounded-3xl border border-[#222] shadow-[0_0_50px_rgba(220,38,38,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${isActive ? 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-pulse' : 'bg-[#1a1a1a] border border-[#333]'}`}>
            <Mic size={40} className={isActive ? 'text-white' : 'text-gray-600'} />
          </div>
          <h2 className="text-3xl font-cinema text-white mb-2">Sala de Direção ao Vivo</h2>
          <p className="text-gray-500 max-w-md mb-8 italic">
            "Fale com a Lia AI sobre sua visão. Ela ajudará a refinar roteiros, enquadramentos e o clima em tempo real."
          </p>
          
          <button
            onClick={isActive ? stopSession : startSession}
            className={`px-10 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-3 ${isActive ? 'bg-white text-black hover:bg-gray-200' : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            {isActive ? <><MicOff size={20} /> Sair do Estúdio</> : <><Mic size={20} /> Entrar no Estúdio</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-[#222] rounded-xl p-5 h-64 flex flex-col">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Volume2 size={14} /> Registros do Estúdio
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs text-gray-400">
            {logs.length === 0 ? <p className="opacity-30 italic">Sem atividade...</p> : logs.map((log, i) => (
              <div key={i} className="border-b border-[#1a1a1a] pb-1">
                <span className="text-red-900 mr-2">[{new Date().toLocaleTimeString()}]</span>
                {log}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-xl p-5 h-64 flex flex-col">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <MessageSquare size={14} /> Sugestões Rápidas
          </h3>
          <div className="space-y-3">
            {[
              '"Lia, como devo iluminar uma cena neo-noir?"', 
              '"Qual a melhor lente para um close-up emocional?"', 
              '"Dê uma ideia de cena para uma perseguição intensa."'
            ].map((q, i) => (
              <button key={i} className="w-full text-left p-3 rounded bg-[#1a1a1a] border border-[#222] text-xs text-gray-400 hover:text-white hover:border-red-600/50 transition-all">
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorLive;
