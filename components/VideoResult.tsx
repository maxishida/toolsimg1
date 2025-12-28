import React from 'react';
import { Download, RefreshCw, X, ArrowLeft, Video } from 'lucide-react';

interface VideoResultProps {
  videos: { url: string, movement: string }[];
  onReset: () => void;
  onBack: () => void;
}

const VideoResult: React.FC<VideoResultProps> = ({ videos, onReset, onBack }) => {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-8 relative text-center">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-300 dark:to-orange-500 mb-4">
          Campaign Suite Ready
        </h2>
        <p className="text-slate-600 dark:text-slate-300">We generated {videos.length} distinct 1080p variations for your campaign.</p>
        
        {/* Floating Close Button for Mobile Accessibility */}
        <button 
          onClick={onBack}
          className="absolute -top-6 right-0 md:top-0 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {videos.map((vid, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg flex flex-col">
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
               <video 
                 src={vid.url} 
                 controls 
                 className="w-full h-full object-contain"
               />
            </div>
            <div className="p-4 flex items-center justify-between bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
               <div className="flex items-center gap-2">
                 <Video size={16} className="text-purple-500"/>
                 <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">{vid.movement}</span>
               </div>
               <a 
                href={vid.url} 
                download={`ad_campaign_${vid.movement.replace(/\s/g, '_')}.mp4`}
                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-lg transition-colors"
                title="Download this variation"
              >
                <Download size={18} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center">
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
          Start New Campaign
        </button>
      </div>
    </div>
  );
};

export default VideoResult;