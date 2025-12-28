export enum AppStep {
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING', // Agent 1 & 2
  GENERATING_IMAGES = 'GENERATING_IMAGES', // Nano Banana - Legacy/Internal
  SELECTION = 'SELECTION',
  WAITING_FOR_KEY = 'WAITING_FOR_KEY', // Veo Requirement
  PREVIEWING = 'PREVIEWING', // Showing low-res preview
  ANIMATING = 'ANIMATING', // Generating Final Veo 3
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface ProductInfo {
  description: string;
  imageBase64: string;
  mimeType: string;
}

export interface GeneratedImage {
  id: string;
  imageUrl?: string; // Base64 or URL, optional while loading
  prompt: string;
  styleName: string;
  status: 'loading' | 'success' | 'error';
}

export interface AgentAnalysis {
  category: string;
  audience: string;
  emotion: string;
  prompts: {
    styleName: string;
    promptText: string;
  }[];
}

// The specific generators requested by the user
export type GeneratorStyleId = 
  | 'cinematic_ad' 
  | 'chibi_shop' 
  | 'knolling_layout' 
  | 'dynamic_forces' 
  | 'glossy_logo' 
  | 'textured_logo' 
  | 'landmark_infographic' 
  | 'seasonal_cycle' 
  | 'crave_canvas' 
  | 'art_studio';

// Global type for the AI Studio key selection
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}