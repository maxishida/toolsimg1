import { GoogleGenAI, Type } from "@google/genai";
import { AgentAnalysis, GeneratedImage } from "../types";

// Initialize the API client
// Note: For Veo, we re-initialize with the selected key in the component logic if needed,
// but for standard generation we use the env key.
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * AGENT 1 & 2: Product Interpreter & Prompt Architect
 * Takes user input and generates 6 structural prompts based on the predefined styles.
 */
export const analyzeAndArchitectPrompts = async (
  description: string,
  imageBase64: string,
  mimeType: string,
  filter: string = "General Audience"
): Promise<AgentAnalysis> => {
  const ai = getAiClient();

  const systemInstruction = `
    You are an expert Commercial Creative Director AI. 
    Your goal is to analyze a product description and image, then generate 6 distinct, high-end visual prompts for an image generation model.
    
    CRITICAL INSTRUCTION: The user has specified a specific target audience or style filter: "${filter}".
    You MUST tailor ALL 6 prompts to appeal specifically to this filter. 
    If the filter is "Men", focus on masculine aesthetics, bold lighting, or relevant contexts.
    If the filter is "Cartoon Character", the product should interact with animated characters or exist in a stylized world.
    If the filter is "Artists", focus on creative, abstract, or studio settings.
    
    The 6 required styles (adapted for the "${filter}" filter) are:
    1. Metáfora Surreal de Luxo (Surreal Luxury Metaphor)
    2. Conceito Tecnológico Futurista (Futuristic Tech Concept)
    3. Impacto Emocional Cinematográfico (Cinematic Emotional Impact)
    4. Estética Clean Comercial Premium (Clean Premium Commercial)
    5. Conceito Artístico Abstrato (Abstract Artistic Concept)
    6. Narrativa Simbólica de Marca (Symbolic Brand Narrative)
    
    For each style, write a detailed, descriptive prompt (in English) that incorporates the user's product description but elevates it to a global ad campaign level targeting "${filter}".
    Keep the prompt focused on visual details, lighting, texture, and composition.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: `Analyze this product: "${description}". The target filter is: "${filter}". Generate the 6 prompts.` },
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
  // We provide the original image to guide the generation (Identity preservation)
  // plus the creative prompt.
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
        // We parse manually
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
  imageBase64: string, // The GENERATED image, not the original
  mimeType: string,
  quality: 'preview' | 'final' = 'preview'
): Promise<string> => {
  // IMPORTANT: Re-instantiate client here to pick up the API Key from the selection dialog if it happened
  // However, since process.env.API_KEY is injected, we assume it's correct context. 
  // We will perform the key check in the React component before calling this.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const animationPrompt = "Cinematic camera movement, slow dolly in towards the product. Subtle dynamic lighting changes. High-end commercial look. 4k resolution.";
  
  // Use 'veo-3.1-fast-generate-preview' for both, differentiating by resolution.
  // Preview = 720p, Final = 1080p.
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
      aspectRatio: "16:9", // Landscape for commercial
    },
  });

  // Poll for completion
  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5s
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