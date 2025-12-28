import React from 'react';
import { Download, RefreshCw, X, ArrowLeft } from 'lucide-react';

interface VideoResultProps {
  videoUrl: string;
  onReset: () => void;
  onBack: () => void;
}

const VideoResult: React.FC<VideoResultProps> = ({ videoUrl, onReset, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto text-center w-full">
      <div className="mb-8 relative">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-300 dark:to-orange-500 mb-4">
          Campaign Ready
        </h2>
        <p className="text-slate-600 dark:text-slate-300">Your high-definition commercial is ready for broadcast.</p>
        
        {/* Floating Close Button for Mobile Accessibility */}
        <button 
          onClick={onBack}
          className="absolute -top-6 right-0 md:top-0 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      {/* Dynamic Container: Fits both Landscape and Portrait better */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-black mx-auto flex items-center justify-center max-h-[70vh] bg-slate-900/50">
        <video 
          src={videoUrl} 
          controls 
          autoPlay 
          loop 
          className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
        <a 
          href={videoUrl} 
          download="ad_campaign.mp4"
          className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-500/25"
        >
          <Download size={20} />
          Download Video
        </a>
        
        <button 
          onClick={onBack}
          className="px-8 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-slate-200 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
        >
           <ArrowLeft size={20} />
           Back to Gallery
        </button>

        <button 
          onClick={onReset}
          className="px-8 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <RefreshCw size={20} />
          Start New
        </button>
      </div>
    </div>
  );
};

export default VideoResult;