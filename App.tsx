import React, { useState, useEffect } from 'react';
import { AppStep, ProductInfo, GeneratedImage, AspectRatio, CameraMovement, AgentAnalysis } from './types';
import InputSection from './components/InputSection';
import GenerationGallery from './components/GenerationGallery';
import LoadingOverlay from './components/LoadingOverlay';
import VideoResult from './components/VideoResult';
import PreviewModal from './components/PreviewModal';
import CampaignStrategy from './components/CampaignStrategy'; // Import new component
import { analyzeAndArchitectPrompts, generateCommercialImage, generateCommercialVideo } from './services/geminiService';
import { AlertTriangle, Crown, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [error, setError] = useState<string | null>(null);
  
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AgentAnalysis | null>(null); // Store analysis
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Dark mode state initialized from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; 
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleStart = async (description: string, file: File, filter: string, aspectRatio: AspectRatio, cameraMovement: CameraMovement) => {
    try {
      setStep(AppStep.ANALYZING);
      setError(null);
      const base64 = await fileToBase64(file);
      const info: ProductInfo = { 
        description, 
        imageBase64: base64, 
        mimeType: file.type,
        aspectRatio,
        cameraMovement
      };
      setProductInfo(info);

      // 1. Analyze & Architect with Filter
      const analysis = await analyzeAndArchitectPrompts(description, base64, file.type, filter);
      console.log('Analysis:', analysis);
      setAnalysisResult(analysis); // Store for Strategy Display

      // 2. Initialize Placeholders and switch to Gallery View immediately
      // Update: Map marketingHook to caption
      const initialPlaceholders: GeneratedImage[] = analysis.prompts.map((p, index) => ({
        id: `loading-${index}`,
        prompt: p.promptText,
        styleName: p.styleName,
        caption: p.marketingHook, // Pass specific hook to caption
        status: 'loading'
      }));
      setGeneratedImages(initialPlaceholders);
      setStep(AppStep.SELECTION);

      // 3. Trigger Parallel Generation with individual state updates
      // Pass the selected Aspect Ratio to the Image Generator
      analysis.prompts.forEach((p) => {
        generateCommercialImage(p.promptText, p.styleName, base64, file.type, aspectRatio)
          .then((result) => {
            // Merge the result with the placeholder caption
            setGeneratedImages((prev) => 
              prev.map((item) => 
                item.styleName === p.styleName ? { ...result, caption: p.marketingHook } : item
              )
            );
          })
          .catch((err) => {
            console.error(`Failed to generate ${p.styleName}`, err);
            setGeneratedImages((prev) => 
              prev.map((item) => 
                item.styleName === p.styleName ? { ...item, status: 'error' } : item
              )
            );
          });
      });

    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unexpected error occurred.");
      setStep(AppStep.INPUT); // Go back to start
    }
  };

  // Step 1: Request Preview (720p)
  const handleGeneratePreview = async () => {
    if (!selectedImage || !productInfo) return;

    try {
      // Key Selection for Veo
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setStep(AppStep.WAITING_FOR_KEY);
        setTimeout(async () => {
            try {
                await window.aistudio.openSelectKey();
                proceedToPreview();
            } catch (err) {
                 console.error("Key selection cancelled", err);
                 setStep(AppStep.SELECTION);
            }
        }, 100);
      } else {
        proceedToPreview();
      }
    } catch (e) {
      console.warn("AI Studio key selector not found, attempting direct generation...");
      proceedToPreview();
    }
  };

  const proceedToPreview = async () => {
    if (!selectedImage || !selectedImage.imageUrl || !productInfo) return;
    setStep(AppStep.ANIMATING); // Use animating state for loader
    try {
        const parts = selectedImage.imageUrl.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
        const data = parts[1];

        // Generate Preview (720p)
        const url = await generateCommercialVideo(
            data, 
            mime, 
            productInfo.aspectRatio, 
            productInfo.cameraMovement, 
            'preview'
        );
        setPreviewUrl(url);
        setStep(AppStep.PREVIEWING);
    } catch (e: any) {
        console.error(e);
        setError("Failed to generate preview. Ensure you selected a paid API key Project.");
        setStep(AppStep.SELECTION);
    }
  };

  // Step 2: Request Final (1080p)
  const handleGenerateFinal = async () => {
    if (!selectedImage || !selectedImage.imageUrl || !productInfo) return;
    setStep(AppStep.ANIMATING); // Reuse animating screen
    try {
        const parts = selectedImage.imageUrl.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
        const data = parts[1];

        // Generate Final (1080p)
        const url = await generateCommercialVideo(
            data, 
            mime, 
            productInfo.aspectRatio, 
            productInfo.cameraMovement, 
            'final'
        );
        setVideoUrl(url);
        setStep(AppStep.COMPLETED);
    } catch (e: any) {
        console.error(e);
        setError("Failed to generate final video.");
        setStep(AppStep.PREVIEWING); // Go back to preview if final fails
    }
  };

  const handleDiscardPreview = () => {
    setPreviewUrl(null);
    setStep(AppStep.SELECTION);
  };

  const handleReset = () => {
    setStep(AppStep.INPUT);
    setProductInfo(null);
    setAnalysisResult(null);
    setGeneratedImages([]);
    setSelectedImage(null);
    setVideoUrl(null);
    setPreviewUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <Crown size={16} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">AdFusion AI</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-sm font-medium text-slate-500 dark:text-slate-400">
               {step === AppStep.INPUT && "Step 1: Brief & Config"}
               {(step === AppStep.ANALYZING) && "Step 2: Analysis"}
               {(step === AppStep.SELECTION) && "Step 3: Concept Selection"}
               {(step === AppStep.PREVIEWING) && "Step 3.5: Preview"}
               {(step === AppStep.ANIMATING) && "Step 4: Animate"}
               {step === AppStep.COMPLETED && "Done"}
            </div>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 flex flex-col items-center justify-center">
        {error && (
          <div className="w-full max-w-2xl bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/50 text-red-600 dark:text-red-400 p-4 rounded-lg mb-8 flex items-center gap-3">
            <AlertTriangle size={20} />
            <p>{error}</p>
          </div>
        )}

        {step === AppStep.INPUT && (
          <InputSection onStart={handleStart} isProcessing={false} />
        )}

        {(step === AppStep.ANALYZING) && (
           <LoadingOverlay status='analyzing' />
        )}

        {(step === AppStep.SELECTION || step === AppStep.PREVIEWING) && (
          <div className="w-full">
              <GenerationGallery 
                images={generatedImages} 
                onSelect={setSelectedImage} 
                selectedId={selectedImage?.id || null} 
                onGenerateVideo={handleGeneratePreview}
              />
              
              {/* NEW: Strategy Dashboard displays below the gallery */}
              {analysisResult && (
                 <CampaignStrategy analysis={analysisResult} />
              )}

              {/* Overlay Modal for Preview */}
              {step === AppStep.PREVIEWING && previewUrl && (
                  <PreviewModal 
                    videoUrl={previewUrl}
                    onConfirm={handleGenerateFinal}
                    onCancel={handleDiscardPreview}
                    isProcessing={false} 
                  />
              )}
          </div>
        )}

        {step === AppStep.WAITING_FOR_KEY && (
             <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl">
                 <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">API Key Required</h3>
                 <p className="text-slate-600 dark:text-slate-400 mb-6">High-end video generation (Veo) requires a paid project API key.<br/>Please select a project in the pop-up.</p>
                 <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-600 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
             </div>
        )}

        {step === AppStep.ANIMATING && (
           <LoadingOverlay status="animating" />
        )}

        {step === AppStep.COMPLETED && videoUrl && (
          <VideoResult videoUrl={videoUrl} onReset={handleReset} />
        )}
      </main>

      <footer className="py-6 text-center text-slate-500 dark:text-slate-600 text-sm border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <p>&copy; 2024 AdFusion AI. Powered by Gemini Flash 3.0 & Veo 3.1.</p>
      </footer>
    </div>
  );
};

export default App;