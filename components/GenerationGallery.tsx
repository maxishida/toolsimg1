import React from 'react';
import { GeneratedImage } from '../types';
import { CheckCircle2, PlayCircle, ImageIcon, AlertCircle } from 'lucide-react';

interface GenerationGalleryProps {
  images: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
  selectedId: string | null;
  onGenerateVideo: () => void;
}

const GenerationGallery: React.FC<GenerationGalleryProps> = ({ images, onSelect, selectedId, onGenerateVideo }) => {
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Select Your Hero Shot</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Choose the best concept to animate into a commercial.</p>
        </div>
        <button
          onClick={onGenerateVideo}
          disabled={!selectedId}
          className={`px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all
            ${selectedId 
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/20' 
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'}`}
        >
          <PlayCircle size={20} />
          Generate Preview
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => {
          const isSelected = selectedId === img.id;
          const isLoading = img.status === 'loading';
          const isError = img.status === 'error';
          
          if (isLoading) {
            return (
              <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <ImageIcon size={64} className="text-slate-400 dark:text-slate-500" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider mb-2 block">
                    {img.styleName}
                  </span>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-300 dark:bg-slate-800 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-300 dark:bg-slate-800 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            );
          }

          if (isError) {
             return (
              <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border-2 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 flex flex-col items-center justify-center p-6 text-center">
                 <AlertCircle className="text-red-500 dark:text-red-400 mb-3" size={32} />
                 <p className="text-sm text-red-700 dark:text-red-300 font-semibold">Generation Failed</p>
                 <span className="text-xs text-red-400 dark:text-red-500 mt-1 uppercase tracking-wide">{img.styleName}</span>
              </div>
            );
          }

          return (
            <div
              key={img.id}
              onClick={() => onSelect(img)}
              className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300
                ${isSelected ? 'border-amber-500 ring-4 ring-amber-500/20 scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-xl'}`}
            >
              {img.imageUrl && (
                <img 
                  src={img.imageUrl} 
                  alt={img.styleName} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 transition-opacity" />
              
              <div className="absolute top-4 right-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                  ${isSelected ? 'bg-amber-500 text-slate-900' : 'bg-black/50 text-slate-500'}`}>
                  {isSelected ? <CheckCircle2 size={20} /> : <div className="w-4 h-4 rounded-full border-2 border-slate-500" />}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 block">
                  {img.styleName}
                </span>
                <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">
                  {img.prompt}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GenerationGallery;