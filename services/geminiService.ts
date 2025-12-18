
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Nano Banana (Gemini 3 Flash) - Apoio criativo para roteiro e narrativa.
 */
export const generateScriptHelp = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Como um mestre da direção cinematográfica, ajude-me a expandir esta cena: ${prompt}. Foque em detalhes sensoriais, subtexto e ritmo. Responda em Português do Brasil.`,
    config: {
      thinkingConfig: { thinkingBudget: 0 }
    }
  });
  return response.text || "Falha ao gerar assistência.";
};

/**
 * Nano Banana (Gemini 3 Flash) - Geração e refinamento de personagens.
 */
export const generateCharacterDetails = async (name: string, concept: string): Promise<Partial<any>> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Crie um perfil cinematográfico completo para o personagem "${name}". Conceito base: ${concept}. Retorne um JSON com: physicalDescription, personality, emotions, actingStyle. Responda em Português.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          physicalDescription: { type: Type.STRING },
          personality: { type: Type.STRING },
          emotions: { type: Type.STRING },
          actingStyle: { type: Type.STRING }
        },
        required: ["physicalDescription", "personality", "emotions", "actingStyle"]
      }
    }
  });
  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return {};
  }
};

/**
 * VEO 3 - Geração de cenas ultra-realistas com vídeo + áudio.
 */
export const generateSceneVideo = async (
  scene: any, 
  characters: any[], 
  aspectRatio: '16:9' | '9:16' = '16:9'
): Promise<string> => {
  const ai = getAI();
  
  const charContext = characters.map(c => 
    `Personagem: ${c.name}. Descrição: ${c.physicalDescription}. Atuação: ${c.actingStyle}.`
  ).join(' ');

  const fullPrompt = `Cena Cinematográfica Realista: ${scene.script}. 
    Ambiente: ${scene.scenario}. Clima: ${scene.mood}. 
    Enquadramento: ${scene.framing}. 
    Personagens na cena: ${charContext}. 
    Incluir áudio ambiente e trilha sonora imersiva. Qualidade 4K.`;

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: fullPrompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  return `${downloadLink}&key=${process.env.API_KEY}`;
};

export function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
