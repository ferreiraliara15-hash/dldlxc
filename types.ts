
export enum VoiceType {
  MASCULINE = 'Masculina',
  FEMININE = 'Feminina',
  SOFT = 'Suave',
  INTENSE = 'Intensa',
  ROBOTIC = 'Robótica'
}

export enum FramingType {
  CLOSE = 'Close-up',
  WIDE = 'Plano Aberto',
  DRONE = 'Drone/Aéreo',
  HANDHELD = 'Câmera na Mão'
}

export interface Character {
  id: string;
  name: string;
  age: string;
  visualStyle: string;
  physicalDescription: string;
  personality: string;
  emotions: string;
  actingStyle: string;
  voiceType: VoiceType;
  isOrganized?: boolean;
}

export interface Scene {
  id: string;
  title: string;
  script: string;
  scenario: string;
  mood: string;
  framing: FramingType;
  duration: number;
  videoUrl?: string;
  isGenerating?: boolean;
  characterIds: string[];
  filter?: string;
  audioLevel?: number;
}

export interface Project {
  id: string;
  name: string;
  characters: Character[];
  scenes: Scene[];
  updatedAt: number;
}
