# API Tools & Model Configurations

This document details the specific Google Gemini API "tools" and model configurations implemented in the AdFusion AI `geminiService.ts`. It explains how we leverage specific models for text analysis, image synthesis, and video generation.

---

## 1. Dynamic Agent System: Product Interpreter & Prompt Architect
**Function:** Analyzes raw product inputs and generates structured, creative campaign data.
**Model:** `gemini-3-flash-preview`
**Method:** `ai.models.generateContent`

### Dynamic System Instructions
The System Instruction (Persona) of this agent changes dynamically based on the **Generator Style** selected by the user.

| Generator Style | Persona (System Instruction Role) | Key Task |
| :--- | :--- | :--- |
| **Cinematic Ad** (Default) | `Commercial Creative Director AI` | Generate high-end, viral global ad campaign concepts. |
| **Chibi Shop** | `3D Miniature Architect AI` | Transform product into a "Chibi Style" isometric shop/building. |
| **Knolling Layout** | `Industrial Design Layout AI` | Deconstruct product into a perfect 90-degree grid layout. |
| **Dynamic Forces** | `VFX Supervisor AI` | Place product in center of elemental forces (Fire, Water, Ice). |
| **Landmark Infographic** | `Technical Architectural AI` | Overlay blueprints and technical specs onto product/location. |
| **Glossy Glass Logo** | `3D Icon Designer AI` | Transform brand/logo into a modern 3D glass app icon. |
| **Textured Logo** | `Material Artist AI` | Apply hyper-realistic textures (Neon, Lava, Wood) to the logo. |
| **Seasonal Cycle** | `Landscape Artist AI` | Create distinct atmospheres reflecting Winter, Spring, Summer, Fall. |
| **CraveCanvas** | `World-Class Food Stylist AI` | Create Michelin-star level food photography concepts. |
| **Art Studio** | `Fine Art Curator AI` | Re-imagine product in Oil Paint, Cyberpunk, Watercolor styles. |

### Configuration (`GenerationConfig`)
We utilize **JSON Mode** with a strict schema to ensure the UI can deterministically parse the AI's creative output.

```typescript
config: {
  systemInstruction: getSystemInstructionForStyle(selectedStyle), // Dynamic based on user selection
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
            styleName: { type: Type.STRING }, // e.g., "Isometric View", "Fire Storm"
            promptText: { type: Type.STRING }, // Detailed visual description
          },
          required: ["styleName", "promptText"],
        },
      },
    },
    required: ["category", "audience", "emotion", "prompts"],
  },
}
```

---

## 2. Commercial Image Synthesis (Nano Banana)
**Function:** Generates the high-fidelity "Hero Shot" based on the architected prompts.

*   **Model:** `gemini-2.5-flash-image` (Internal/Community name: "Nano Banana")
*   **Method:** `ai.models.generateContent`
*   **Input Modality:** Text Prompt + Base64 Image (Reference).

### Technique: Identity Preservation
To ensure the generated commercial looks like the *actual* product uploaded by the user, we use a specific prompting strategy combined with image input:

1.  **Reference Image:** The user's original upload is passed in the `contents` array.
2.  **Reinforcement Prompt:**
    > "...The product in the image MUST be the central hero. Maintain the product's core identity but place it in this new environment. High fidelity, 8k, photorealistic commercial photography."

### Output Handling
Unlike text models, this model returns the image data directly in the `inlineData` part of the response candidate.

```typescript
// Extraction Logic
const part = response.candidates[0].content.parts.find(p => p.inlineData);
const base64 = part.inlineData.data;
const mime = part.inlineData.mimeType;
```

---

## 3. Cinematic Video Generation (Veo)
**Function:** Animates the generated static image into a video clip.

*   **Model:** `veo-3.1-fast-generate-preview`
*   **Method:** `ai.models.generateVideos` -> `ai.operations.getVideosOperation`

### Configuration Strategy
We support two quality tiers by adjusting the `resolution` parameter in the config.

| Tier | Resolution | Use Case | Speed |
| :--- | :--- | :--- | :--- |
| **Preview** | `720p` | Quick feedback loop | Fast |
| **Final** | `1080p` | Final broadcast download | Slower |

```typescript
// Config Object
config: {
  numberOfVideos: 1,
  resolution: quality === 'preview' ? '720p' : '1080p',
  aspectRatio: '16:9', // Landscape standard for commercials
}
```

### Video Retrieval
The Veo API returns a **URI** (e.g., `https://...`). To download the actual video binary (`.mp4`), the client must perform a `fetch` request appending the API key.

```typescript
// The secure fetch pattern
const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
```

---

## SDK Implementation Summary

We use the `@google/genai` SDK v1.34.0.

**Initialization:**
```typescript
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
```

**Key Features Used:**
1.  **`ai.models.generateContent`**: For text analysis and image generation.
2.  **`ai.models.generateVideos`**: Initiates the Veo generation job.
3.  **`ai.operations.getVideosOperation`**: Polls the long-running video generation task until completion.
4.  **`responseSchema`**: Enforces strict JSON output types.
