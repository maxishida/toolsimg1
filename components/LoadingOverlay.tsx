import React, { useEffect, useState } from 'react';

interface LoadingOverlayProps {
  status: string; // 'analyzing' | 'generating_images' | 'animating'
  customMessage?: string | null;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ status, customMessage }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (status === 'analyzing') {
      const messages = [
        "Agent 1: Interpreting product features...",
        "Agent 1: Determining target audience...",
        "Agent 2: Architecting 6 visual concepts...",
        "Drafting luxury prompts..."
      ];
      let i = 0;
      setMessage(messages[0]);
      interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setMessage(messages[i]);
      }, 2000);
    } else if (status === 'generating_images') {
      const messages = [
        "Nano Banana Model: Initializing...",
        "Rendering hyper-realistic textures...",
        "Applying cinematic lighting...",
        "Finalizing 6 variations..."
      ];
      let i = 0;
      setMessage(messages[0]);
      interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setMessage(messages[i]);
      }, 2500);
    } else if (status === 'animating') {
      // Default messages if no custom message is provided
      const messages = [
        "Veo 3.1: Initializing Director Mode...",
        "Rendering High-Definition variations...",
        "This may take a few minutes...",
        "Applying final color grading..."
      ];
      let i = 0;
      setMessage(messages[0]);
      interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setMessage(messages[i]);
      }, 4000);
    }

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="fixed inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-50 flex flex-col items-center justify-center transition-colors duration-300">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
        </div>
      </div>
      <h3 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white tracking-tight animate-pulse text-center px-4">
        {customMessage || message}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Powered by Gemini & Veo</p>
    </div>
  );
};

export default LoadingOverlay;