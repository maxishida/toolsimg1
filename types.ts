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

// Global type for the AI Studio key selection
// We augment the AIStudio interface because window.aistudio is already declared as type AIStudio in the environment.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}