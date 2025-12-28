# AdFusion AI 🎥✨

**Transform static product photos into premium 3D commercial video advertisements using Multi-Agent AI.**

AdFusion AI is a React-based web application that acts as an automated creative agency. It takes a simple product photo and a description, uses AI agents to conceptualize campaign angles, generates high-fidelity commercial imagery, and finally animates them into broadcast-ready video clips.

---

## 🚀 Key Features

*   **Multi-Agent Workflow:**
    *   **Interpreter Agent:** Analyzes the product image and text to understand audience and sentiment.
    *   **Creative Director Agent:** Generates 6 distinct visual campaign concepts (Luxury, Tech, Minimalist, etc.).
*   **Generative Imagery (Nano Banana):** Uses `gemini-2.5-flash-image` to render photorealistic "Hero Shots" while preserving product identity.
*   **Cinematic Video (Veo 3):** Uses `veo-3.1` to turn the static image into a moving video with camera pans, dollies, and lighting effects.
*   **Preview Mode:** Generate quick 720p previews before committing to full 1080p rendering.
*   **Responsive UI:** Fully responsive design with Dark/Light mode support.
*   **Progressive Loading:** Skeleton screens and detailed status updates keep the user informed.

---

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript, Vite (assumed build tool).
*   **Styling:** Tailwind CSS (with Dark Mode class strategy).
*   **Icons:** Lucide React.
*   **AI Integration:** Google GenAI SDK (`@google/genai`).

### AI Models Used
1.  **Analysis:** `gemini-3-flash-preview` (Text & Vision analysis).
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
2.  **Describe:** Enter a brief description (e.g., "A luxury gold watch").
3.  **Analyze:** Click "Generate Concepts". The AI agents will analyze the product and create 6 unique visual styles.
4.  **Select:** Browse the gallery of generated images. Click on the one that best fits your vision.
5.  **Preview:** Click "Generate Preview" to create a short 720p video.
6.  **Finalize:** If you like the preview, confirm to generate the high-quality 1080p commercial.
7.  **Download:** Save your video file.

---

## ⚠️ Important Note on Billing

The **Veo (Video Generation)** model requires a paid Google Cloud Project.
When you attempt to generate a video, the app will check if you have selected a valid API Key project via the `window.aistudio` interface (if running in AI Studio) or rely on your `.env` key. Ensure your project has billing enabled for the Gemini API.

---

## 📄 License

MIT License.
