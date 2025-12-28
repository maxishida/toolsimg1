import React from 'react';
import { Download, RefreshCw } from 'lucide-react';

interface VideoResultProps {
  videoUrl: string;
  onReset: () => void;
}

const VideoResult: React.FC<VideoResultProps> = ({ videoUrl, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-300 dark:to-orange-500 mb-4">
          Campaign Ready
        </h2>
        <p className="text-slate-600 dark:text-slate-300">Your high-definition commercial is ready for broadcast.</p>
      </div>

      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-black aspect-video mx-auto">
        <video 
          src={videoUrl} 
          controls 
          autoPlay 
          loop 
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex gap-4 justify-center mt-8">
        <a 
          href={videoUrl} 
          download="ad_campaign.mp4"
          className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <Download size={20} />
          Download Video
        </a>
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <RefreshCw size={20} />
          Create New Campaign
        </button>
      </div>
    </div>
  );
};

export default VideoResult;