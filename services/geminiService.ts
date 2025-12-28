import { GoogleGenAI, Type } from "@google/genai";
import { AgentAnalysis, GeneratedImage, AspectRatio, CameraMovement } from "../types";

// Initialize the API client
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * HELPER: Get System Instruction based on Generator Style
 */
const getSystemInstructionForStyle = (filter: string): string => {
  switch (filter) {
    case 'ecommerce_studio':
      return `
        You are a Premium E-commerce Photographer AI.
        Task: Create high-end, clean, and luxurious product photography for bags, watches, jewelry, or tech.
        Requirement: Generate 6 variations focusing on:
        1. Minimalist Podium (Clean luxury)
        2. Lifestyle Hand-held (In context)
        3. Hard Lighting (Sharp shadows, high contrast)
        4. Soft Silk/Fabric Background (Texture play)
        5. Nature/Sunlight (Golden hour glow)
        6. Dark Mode (Moody, rim lighting)
        Focus on: Texture detail (leather grain, metal shine), depth of field, and commercially viable composition.
      `;
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
 * AGENT 1 & 2: Product Interpreter & Prompt Architect & COPYWRITER
 */
export const analyzeAndArchitectPrompts = async (
  description: string,
  imageBase64: string,
  mimeType: string,
  filter: string = "cinematic_ad"
): Promise<AgentAnalysis> => {
  const ai = getAiClient();

  const systemInstruction = getSystemInstructionForStyle(filter) + 
    "\n\n ADDITIONALLY: You are a Viral Marketing Copywriter. Generate engaging social media copy tailored to the product. CRITICAL: For each visual prompt, provide a specific 'marketingHook' tailored to that specific visual style.";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: `Analyze this product: "${description}". The selected Generator Style is: "${filter}". Generate 6 distinct visual prompts strictly following this style's rules. ALSO generate the marketing copy.` },
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
          marketingCopy: {
            type: Type.OBJECT,
            properties: {
              instagramCaption: { type: Type.STRING, description: "Engaging caption with emojis" },
              linkedinPost: { type: Type.STRING, description: "Professional yet catchy post text" },
              tiktokHook: { type: Type.STRING, description: "First 3 seconds spoken hook script" },
              oneLiner: { type: Type.STRING, description: "Punchy slogan" },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["instagramCaption", "linkedinPost", "tiktokHook", "hashtags", "oneLiner"]
          },
          prompts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                styleName: { type: Type.STRING },
                promptText: { type: Type.STRING },
                marketingHook: { type: Type.STRING, description: "A short, punchy 1-sentence caption specific to this visual style." }
              },
              required: ["styleName", "promptText", "marketingHook"],
            },
          },
        },
        required: ["category", "audience", "emotion", "prompts", "marketingCopy"],
      },
    },
  });

  if (!response.text) throw new Error("Failed to analyze product.");
  return JSON.parse(response.text) as AgentAnalysis;
};

/**
 * NANO BANANA (Gemini Flash Image)
 * Generates an image based on one of the architected prompts.
 * UPDATED: Supports Aspect Ratio
 */
export const generateCommercialImage = async (
  prompt: string,
  styleName: string,
  originalImageBase64: string,
  mimeType: string,
  aspectRatio: AspectRatio = '16:9'
): Promise<GeneratedImage> => {
  const ai = getAiClient();

  // 'gemini-2.5-flash-image' supports aspect ratio config
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
        // Nano Banana specific config
        imageConfig: {
           aspectRatio: aspectRatio, // '16:9' or '9:16'
        }
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
 * UPDATED: Supports Aspect Ratio & Camera Movement
 */
export const generateCommercialVideo = async (
  imageBase64: string,
  mimeType: string,
  aspectRatio: AspectRatio,
  cameraMovement: CameraMovement,
  quality: 'preview' | 'final' = 'preview'
): Promise<string> => {
  // IMPORTANT: Re-instantiate client here to pick up the API Key from the selection dialog if it happened
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Incorporate specific camera movement into the prompt
  const animationPrompt = `Cinematic camera movement, ${cameraMovement} focused on the product. Subtle dynamic lighting changes. High-end commercial look. 4k resolution.`;
  
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
      aspectRatio: aspectRatio, // Veo supports '16:9' and '9:16'
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