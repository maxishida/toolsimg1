import { GoogleGenAI, Type } from "@google/genai";
import { AgentAnalysis, GeneratedImage } from "../types";

// Initialize the API client
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * HELPER: Get System Instruction based on Generator Style
 */
const getSystemInstructionForStyle = (filter: string): string => {
  switch (filter) {
    case 'chibi_shop':
      return `
        You are a 3D Miniature Architect AI.
        Task: Transform the user's input product into a "Chibi Style" 3D isometric shop or building.
        Example: If the product is a donut, create a "Donut Shop" shaped like the donut. If it's a shoe, a "Sneaker Store" inside the shoe.
        Requirement: Generate 6 variations of this miniature world concept. 
        Focus on: Cute lighting, isometric view, miniature characters, cozy atmosphere, high detail 3D render.
      `;
    case 'knolling_layout':
      return `
        You are an Industrial Design Layout AI.
        Task: Create a "Knolling" style layout for the product.
        Concept: Deconstruct the product (or show related items) arranged in a perfect grid/90-degree alignment.
        Requirement: Generate 6 variations of layout (different background colors, different spacing, different lighting).
        Focus on: Clean lines, top-down view (flat lay), organized chaos, museum quality lighting.
      `;
    case 'dynamic_forces':
      return `
        You are a VFX Supervisor AI.
        Task: Place the product in the center of dynamic elemental forces (Fire, Water, Ice, Wind).
        Requirement: Generate 6 high-impact action shots. 
        Focus on: Particle effects, motion blur, dramatic contrast, elemental energy swirling around the static product.
      `;
    case 'landmark_infographic':
      return `
        You are a Technical Architectural AI.
        Task: Overlay technical blueprints, chalk sketches, and measurement lines onto the image or create a poster style.
        Requirement: Generate 6 infographic styles (Blueprint, Chalkboard, Holographic Overlay, Museum Placard).
        Focus on: White lines, technical data, precision, educational aesthetic.
      `;
    case 'glossy_logo':
      return `
        You are a 3D Icon Designer AI.
        Task: Transform the input (brand/logo) into a "Glossy Glass" 3D App Icon.
        Requirement: Generate 6 variations of glass refraction, edge bevels, and inner glow.
        Focus on: Apple design aesthetic, translucent glass, soft shadows, vibrant gradients.
      `;
    case 'textured_logo':
      return `
        You are a Material Artist AI.
        Task: Apply hyper-realistic textures to the logo/object.
        Requirement: Generate 6 variations: Neon, Wood, Chrome, Lava, Liquid, Stone.
        Focus on: Surface detail, bump maps, realistic lighting reflection.
      `;
    case 'seasonal_cycle':
      return `
        You are a Landscape Artist AI.
        Task: Create a panoramic concept showing the transition of seasons (Winter to Spring to Summer to Fall).
        Requirement: Since we generate single images, generate 6 distinct "Time of Year" distinct atmospheres for the product setting.
        Focus on: Environmental storytelling, color palette shifts (Cool blues to Warm oranges).
      `;
    case 'crave_canvas':
      return `
        You are a World-Class Food Stylist AI.
        Task: Create 6 Michelin-star food photography concepts.
        Focus on: Steam, water droplets, macro details, depth of field, appetizing color grading.
      `;
    case 'art_studio':
      return `
        You are a Fine Art Curator AI.
        Task: Re-imagine the product in 6 distinct art styles (Oil Painting, Cyberpunk, Watercolor, Pop Art, Marble Sculpture, Origami).
      `;
    case 'cinematic_ad':
    default:
      return `
        You are an expert Commercial Creative Director AI. 
        Task: Generate 6 distinct, high-end visual prompts for a global ad campaign.
        Styles to include: Luxury Metaphor, Futuristic Tech, Emotional Cinematic, Clean Premium, Abstract Art, Symbolic Narrative.
        Focus on visual details, lighting, texture, and composition.
      `;
  }
};

/**
 * AGENT 1 & 2: Product Interpreter & Prompt Architect
 */
export const analyzeAndArchitectPrompts = async (
  description: string,
  imageBase64: string,
  mimeType: string,
  filter: string = "cinematic_ad"
): Promise<AgentAnalysis> => {
  const ai = getAiClient();

  const systemInstruction = getSystemInstructionForStyle(filter);

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: `Analyze this product: "${description}". The selected Generator Style is: "${filter}". Generate 6 distinct visual prompts strictly following this style's rules.` },
        {
          inlineData: {
            mimeType: mimeType,
            data: imageBase64,
          },
        },
      ],
    },
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          audience: { type: Type.STRING },
          emotion: { type: Type.STRING },
          prompts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                styleName: { type: Type.STRING },
                promptText: { type: Type.STRING },
              },
              required: ["styleName", "promptText"],
            },
          },
        },
        required: ["category", "audience", "emotion", "prompts"],
      },
    },
  });

  if (!response.text) throw new Error("Failed to analyze product.");
  return JSON.parse(response.text) as AgentAnalysis;
};

/**
 * NANO BANANA (Gemini Flash Image)
 * Generates an image based on one of the architected prompts.
 */
export const generateCommercialImage = async (
  prompt: string,
  styleName: string,
  originalImageBase64: string,
  mimeType: string
): Promise<GeneratedImage> => {
  const ai = getAiClient();

  // Using 'gemini-2.5-flash-image' (Nano Banana)
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [
        {
          text: `${prompt}. The product in the image MUST be the central hero. Maintain the product's core identity but place it in this new environment. High fidelity, 8k, photorealistic commercial photography.`,
        },
        {
          inlineData: {
            mimeType: mimeType,
            data: originalImageBase64,
          },
        },
      ],
    },
    config: {
        // Nano Banana doesn't support responseMimeType/Schema
    }
  });

  // Extract image
  let finalImageUrl = "";
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        finalImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }
  }

  if (!finalImageUrl) throw new Error("No image generated.");

  return {
    id: crypto.randomUUID(),
    imageUrl: finalImageUrl,
    prompt,
    styleName,
    status: 'success'
  };
};

/**
 * VEO 3 (Video Generation)
 * Animates the selected static image.
 */
export const generateCommercialVideo = async (
  imageBase64: string,
  mimeType: string,
  quality: 'preview' | 'final' = 'preview'
): Promise<string> => {
  // IMPORTANT: Re-instantiate client here to pick up the API Key from the selection dialog if it happened
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const animationPrompt = "Cinematic camera movement, slow dolly in towards the product. Subtle dynamic lighting changes. High-end commercial look. 4k resolution.";
  
  const resolution = quality === 'preview' ? '720p' : '1080p';

  let operation = await ai.models.generateVideos({
    model: "veo-3.1-fast-generate-preview",
    prompt: animationPrompt,
    image: {
      imageBytes: imageBase64,
      mimeType: mimeType,
    },
    config: {
      numberOfVideos: 1,
      resolution: resolution,
      aspectRatio: "16:9",
    },
  });

  // Poll for completion
  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("Video generation failed or returned no URI.");

  // Fetch the actual video bytes using the key
  const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
  if (!response.ok) throw new Error("Failed to download generated video.");
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};