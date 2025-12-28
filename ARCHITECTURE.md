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
    ├── InputSection.tsx        # File upload & text input
    ├── GenerationGallery.tsx   # Grid display with Skeleton loading state
    ├── LoadingOverlay.tsx      # Full-screen processing feedback
    ├── PreviewModal.tsx        # Video preview player & Confirmation
    └── VideoResult.tsx         # Final video player & Download
```

---

## 🧠 The AI Pipeline (Multi-Agent Flow)

AdFusion does not simply prompt a model once. It orchestrates a chain of specific models to ensure high quality. All logic resides in `services/geminiService.ts`.

### Step 1: Analysis & Creative Direction
*   **Goal:** Understand the product and generate prompt engineering strategies.
*   **Model:** `gemini-3-flash-preview`
*   **Input:** User's raw text + Base64 encoded original image.
*   **System Prompt:** Acts as a "Commercial Creative Director". It is instructed to output JSON containing strict categories (Luxury, Tech, Cinematic, etc.).
*   **Output:** A JSON object containing 6 distinct, highly detailed visual prompts.

### Step 2: Commercial Image Synthesis
*   **Goal:** Create a photorealistic "Hero Shot" of the product in a new environment.
*   **Model:** `gemini-2.5-flash-image` (Community alias: "Nano Banana")
*   **Technique:** **Identity Preservation via Multi-modal Prompting**.
    *   We pass the *original image* again along with the *new creative prompt*.
    *   Instruction: *"The product in the image MUST be the central hero. Maintain the product's core identity..."*
*   **Parallel Execution:** All 6 prompts are triggered simultaneously using `Promise.all` (or independent promises) to populate the gallery progressively.

### Step 3: Video Generation (Veo)
*   **Goal:** Animate the static image.
*   **Model:** `veo-3.1-fast-generate-preview`
*   **Workflow:**
    1.  **Key Check:** The app verifies if a paid project API key is active via `window.aistudio.hasSelectedApiKey()`.
    2.  **Request:** Sends the *Generated Image* (from Step 2) to Veo.
    3.  **Prompt:** Uses a cinematic movement prompt ("Slow dolly in", "Pan", etc.).
    4.  **Polling:** The operation is asynchronous. The app polls `ai.operations.getVideosOperation` every 5 seconds until `operation.done` is true.
    5.  **Resolution Control:**
        *   **Preview:** Requests `720p`.
        *   **Final:** Requests `1080p`.

---

## 💻 Frontend State Machine

The application state is managed in `App.tsx` using the `AppStep` enum. This ensures the UI is always in a deterministic state.

1.  **INPUT:** Form visible.
2.  **ANALYZING:** Overlay active. Agents are creating text prompts.
3.  **SELECTION:** Gallery visible.
    *   *Sub-state:* Cards show Skeleton loaders (`status: 'loading'`).
    *   *Sub-state:* Cards flip to images as requests finish (`status: 'success'`).
4.  **PREVIEWING:** Modal overlay showing the 720p video loop.
5.  **ANIMATING:** Overlay active. Veo is rendering.
6.  **COMPLETED:** Final video download screen.

---

## 🎨 Styling & Theming

*   **Framework:** Tailwind CSS (via CDN in `index.html` for simplicity in this environment, typically via PostCSS in production).
*   **Dark Mode:** Implemented via the `class` strategy.
    *   `localStorage` persists user preference ('theme' key).
    *   `useEffect` hooks apply the `.dark` class to the `<html>` tag.
    *   Components use variants like `bg-white dark:bg-slate-900`.

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
