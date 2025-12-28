# AdFusion AI - Technical Architecture & Documentation

This document outlines the software architecture, the specific AI pipeline implementation, and the file structure of AdFusion AI.

## 📂 Project Structure

```
/
├── index.html              # Entry point, Tailwind CDN, Font imports
├── index.tsx               # React DOM root mounting
├── App.tsx                 # Main State Machine & Layout Controller
├── types.ts                # TypeScript Interfaces & Enums
├── metadata.json           # Application Capability Metadata
├── services/
│   └── geminiService.ts    # The Core AI Logic Layer (Google GenAI SDK)
└── components/
    ├── InputSection.tsx        # File upload, format selection, camera controls
    ├── GenerationGallery.tsx   # Grid display with Download/Copy actions
    ├── CampaignStrategy.tsx    # Marketing Copy Dashboard (Hashtags, Scripts)
    ├── LoadingOverlay.tsx      # Full-screen processing feedback
    ├── PreviewModal.tsx        # Video preview player & Confirmation
    └── VideoResult.tsx         # Final video player & Download
```

---

## 🧠 The AI Pipeline (Multi-Agent Flow)

AdFusion does not simply prompt a model once. It orchestrates a chain of specific models to ensure high quality. All logic resides in `services/geminiService.ts`.

### Step 1: Analysis, Creative Direction & Copywriting (Dynamic Agents)
*   **Goal:** Understand the product, generate prompt engineering strategies, and write social media marketing copy.
*   **Model:** `gemini-3-flash-preview`
*   **Input:** User's raw text + Base64 encoded original image + **Selected Generator Style**.
*   **Mechanism:**
    *   The `getSystemInstructionForStyle()` function injects a specific "persona" into the system prompt based on user selection.
    *   *Example:* Selecting "E-commerce Studio" activates the "Premium Photographer" persona.
    *   *Example:* Selecting "Chibi Shop" activates the "3D Miniature Architect" persona.
*   **Output:** A JSON object containing:
    1.  Target Audience & Emotion analysis.
    2.  **Marketing Copy:** Instagram Caption, LinkedIn Post, TikTok Hook, Hashtags.
    3.  **Visual Prompts:** 6 distinct, highly detailed visual prompts.
    4.  **Visual Hooks:** Specific 1-sentence captions tailored to *each* of the 6 visual concepts.

### Step 2: Commercial Image Synthesis
*   **Goal:** Create a photorealistic "Hero Shot" of the product in a new environment.
*   **Model:** `gemini-2.5-flash-image` (Internal/Community name: "Nano Banana")
*   **Technique:** **Identity Preservation via Multi-modal Prompting**.
    *   We pass the *original image* again along with the *new creative prompt*.
    *   Instruction: *"The product in the image MUST be the central hero. Maintain the product's core identity..."*
*   **Configuration:**
    *   **Aspect Ratio:** Supports `16:9` or `9:16` based on user input.

### Step 3: Video Generation (Veo)
*   **Goal:** Animate the static image.
*   **Model:** `veo-3.1-fast-generate-preview`
*   **Workflow:**
    1.  **Key Check:** The app verifies if a paid project API key is active via `window.aistudio.hasSelectedApiKey()`.
    2.  **Request:** Sends the *Generated Image* (from Step 2) to Veo.
    3.  **Prompt:** Constructed dynamically using the user's selected **Camera Movement** (e.g., "Orbit", "Pan Left").
    4.  **Config:** Uses the user's selected **Aspect Ratio** (`16:9` or `9:16`).
    5.  **Polling:** The operation is asynchronous. The app polls `ai.operations.getVideosOperation` every 5 seconds until `operation.done` is true.
    6.  **Resolution Control:**
        *   **Preview:** Requests `720p`.
        *   **Final:** Requests `1080p`.

---

## 💻 Frontend State Machine

The application state is managed in `App.tsx` using the `AppStep` enum. This ensures the UI is always in a deterministic state.

1.  **INPUT:** Form visible.
2.  **ANALYZING:** Overlay active. Agents are creating text prompts and copy.
3.  **SELECTION:** Gallery visible + Campaign Strategy Dashboard.
    *   *Sub-state:* Cards show Skeleton loaders (`status: 'loading'`).
    *   *Sub-state:* Cards flip to images as requests finish (`status: 'success'`).
    *   *Action:* User can download individual images or copy specific captions.
4.  **PREVIEWING:** Modal overlay showing the 720p video loop.
5.  **ANIMATING:** Overlay active. Veo is rendering.
6.  **COMPLETED:** Final video download screen.

---

## 🔌 API Integration Details

We use the Google GenAI SDK (`@google/genai`) version ^1.34.0.

**Client Initialization:**
```typescript
// services/geminiService.ts
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });
```

**Video Fetching Nuance:**
The Veo API returns a URI to the video resource. This resource is protected. We must append the API key to the fetch request to download the actual binary blob for the browser to display:
```typescript
const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
const blob = await response.blob();
return URL.createObjectURL(blob);
```