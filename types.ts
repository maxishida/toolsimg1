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
  aspectRatio: AspectRatio;
  cameraMovement: CameraMovement;
}

export interface GeneratedImage {
  id: string;
  imageUrl?: string; // Base64 or URL, optional while loading
  prompt: string;
  styleName: string;
  caption?: string; // New: Specific copy for this image variant
  status: 'loading' | 'success' | 'error';
}

export interface MarketingCopy {
  instagramCaption: string;
  linkedinPost: string;
  tiktokHook: string;
  hashtags: string[];
  oneLiner: string;
}

export interface AgentAnalysis {
  category: string;
  audience: string;
  emotion: string;
  marketingCopy: MarketingCopy; 
  prompts: {
    styleName: string;
    promptText: string;
    marketingHook: string; // New: Specific hook for this specific visual style
  }[];
}

// 1. Aspect Ratio (Veo only supports 16:9 and 9:16)
export type AspectRatio = '16:9' | '9:16';

// 2. Camera Movement options for Veo
export type CameraMovement = 'Dolly In' | 'Dolly Out' | 'Pan Left' | 'Pan Right' | 'Orbit' | 'Crane Up';

// The specific generators requested by the user
export type GeneratorStyleId = 
  | 'ecommerce_studio' // NEW
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