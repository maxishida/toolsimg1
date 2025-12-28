# AdFusion AI 🎥✨

**Transform static product photos into premium 3D commercial video advertisements using Multi-Agent AI.**

AdFusion AI is a React-based web application that acts as an automated creative agency. It takes a simple product photo and a description, uses AI agents to conceptualize campaign angles, writes marketing copy, generates high-fidelity commercial imagery, and finally animates them into broadcast-ready video clips.

---

## 🚀 Key Features

*   **Multi-Agent Workflow:**
    *   **Dynamic Interpreter Agent:** Adapts its persona based on the chosen style (e.g., Premium E-commerce Photographer, Miniature Architect, VFX Supervisor).
    *   **Creative Director Agent:** Generates 6 distinct visual campaign concepts tailored to the selected genre.
    *   **Viral Copywriter Agent:** Generates tailored Instagram captions, LinkedIn posts, and TikTok hooks for the campaign.
*   **Specialized AI Generators:**
    *   **E-commerce Studio:** **(NEW)** Specialized lighting and staging for bags, watches, jewelry, and tech.
    *   **Cinematic Ad Studio:** High-impact viral commercial aesthetics.
    *   **Chibi Shop:** Turns products into cute 3D isometric miniature stores.
    *   **Knolling Layout:** Deconstructs objects into organized, museum-quality grids.
    *   **Dynamic Forces:** Surrounds products with elemental fire, water, ice, or wind.
    *   **Glossy Glass Icons:** Converts logos into modern Apple-style 3D glass icons.
    *   **Landmark Infographics:** Overlays technical blueprints on architectural images.
*   **Generative Imagery (Nano Banana):** Uses `gemini-2.5-flash-image` to render photorealistic "Hero Shots" while preserving product identity.
*   **Cinematic Video (Veo 3):** Uses `veo-3.1` to turn the static image into a moving video.
    *   **Aspect Ratio Support:** Generate in **16:9 (Landscape)** for YouTube/TV or **9:16 (Vertical)** for TikTok/Reels.
    *   **Director Mode:** Control camera movement (Dolly In, Pan, Orbit, Crane Up).
*   **Campaign Strategy Dashboard:** View and copy generated hashtags, slogans, and scripts.
*   **Preview Mode:** Generate quick 720p previews before committing to full 1080p rendering.

---

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript, Vite (assumed build tool).
*   **Styling:** Tailwind CSS (with Dark Mode class strategy).
*   **Icons:** Lucide React.
*   **AI Integration:** Google GenAI SDK (`@google/genai`).

### AI Models Used
1.  **Analysis & Copywriting:** `gemini-3-flash-preview` (Text & Vision analysis).
2.  **Image Generation:** `gemini-2.5-flash-image` (Also known as "Nano Banana").
3.  **Video Generation:** `veo-3.1-fast-generate-preview`.

---

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/adfusion-ai.git
    cd adfusion-ai
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory. You must have a Google Cloud Project with the Gemini API enabled.
    ```env
    # Your Google GenAI API Key
    API_KEY=your_api_key_here
    ```

4.  **Run the Application**
    ```bash
    npm start
    # or
    npm run dev
    ```

5.  **Open in Browser**
    Visit `http://localhost:3000` (or the port shown in your terminal).

---

## 📖 How to Use

1.  **Upload:** Click the upload box to select a product image (PNG/JPG).
2.  **Config:**
    *   **Generator:** Choose a style (e.g., "E-commerce Studio", "Cinematic Ad").
    *   **Format:** Select 16:9 (Landscape) or 9:16 (Vertical).
    *   **Director Mode:** Choose camera movement (e.g., "Orbit", "Dolly In").
3.  **Describe:** Enter a brief description or prompt.
4.  **Analyze:** Click "Generate Campaign Assets". The AI agents will analyze the product, write copy, and create 6 visual concepts.
5.  **Select & Download:** 
    *   Browse the gallery of generated images.
    *   Use the **Download** button to save images.
    *   Use the **Copy** button to copy the specific caption for that image.
6.  **Preview Video:** Select an image and click "Generate Preview" to create a short 720p video.
7.  **Finalize:** If you like the preview, confirm to generate the high-quality 1080p commercial.

---

## ⚠️ Important Note on Billing

The **Veo (Video Generation)** model requires a paid Google Cloud Project.
When you attempt to generate a video, the app will check if you have selected a valid API Key project via the `window.aistudio` interface (if running in AI Studio) or rely on your `.env` key. Ensure your project has billing enabled for the Gemini API.

---

## 📄 License

MIT License.