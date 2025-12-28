import React from 'react';
import { Film, Check, X } from 'lucide-react';

interface PreviewModalProps {
  videoUrl: string;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ videoUrl, onConfirm, onCancel, isProcessing }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Film size={20} className="text-amber-500"/> Preview Animation
          </h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors" disabled={isProcessing}>
            <X size={24} />
          </button>
        </div>
        
        <div className="relative aspect-video bg-black">
             <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
        </div>

        <div className="p-6 bg-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="text-sm text-slate-400">
             <p className="font-semibold text-slate-300">Preview Quality (720p)</p>
             <p>Generate final campaign to get full 1080p high-definition video.</p>
           </div>
           <div className="flex gap-3 w-full md:w-auto">
             <button 
               onClick={onCancel}
               disabled={isProcessing}
               className="px-6 py-3 rounded-xl font-semibold border border-slate-600 text-slate-300 hover:bg-slate-700 transition-all flex-1 md:flex-none disabled:opacity-50"
             >
               Discard
             </button>
             <button 
               onClick={onConfirm}
               disabled={isProcessing}
               className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/20 transition-all flex-1 md:flex-none flex items-center justify-center gap-2 disabled:opacity-50"
             >
               {isProcessing ? 'Generating Final...' : (
                 <>
                   <Check size={20} /> Generate Final (1080p)
                 </>
               )}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
export default PreviewModal;