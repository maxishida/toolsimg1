import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { CheckCircle2, PlayCircle, ImageIcon, AlertCircle, Copy, Download, Check } from 'lucide-react';

interface GenerationGalleryProps {
  images: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
  selectedId: string | null;
  onGenerateVideo: () => void;
}

const GenerationGallery: React.FC<GenerationGalleryProps> = ({ images, onSelect, selectedId, onGenerateVideo }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, id: string, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (e: React.MouseEvent, imageUrl: string, filename: string) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `adfusion-${filename.toLowerCase().replace(/\s/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((img) => {
          const isSelected = selectedId === img.id;
          const isLoading = img.status === 'loading';
          const isError = img.status === 'error';
          
          if (isLoading) {
            return (
              <div key={img.id} className="relative aspect-[3/4] md:aspect-square rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 animate-pulse flex flex-col">
                <div className="flex-grow flex items-center justify-center opacity-10">
                  <ImageIcon size={64} className="text-slate-400 dark:text-slate-500" />
                </div>
                <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider mb-2 block">
                    {img.styleName}
                  </span>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-300 dark:bg-slate-800 rounded w-3/4"></div>
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
              className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 flex flex-col bg-white dark:bg-slate-800 shadow-sm
                ${isSelected ? 'border-amber-500 ring-4 ring-amber-500/20 scale-[1.02] shadow-xl' : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-lg'}`}
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-slate-900">
                 {img.imageUrl && (
                  <img 
                    src={img.imageUrl} 
                    alt={img.styleName} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                 {/* Selection Indicator overlay */}
                <div className={`absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center
                    ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 transform transition-transform
                        ${isSelected ? 'bg-amber-500 text-slate-900 scale-110' : 'bg-white/20 backdrop-blur-md text-white scale-90 group-hover:scale-100'}`}>
                        {isSelected ? <><CheckCircle2 size={18}/> Selected</> : "Select for Animation"}
                    </div>
                </div>
              </div>

              {/* Card Footer: Copy & Text */}
              <div className="p-4 flex flex-col gap-3 h-full">
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                    {img.styleName}
                  </span>
                  <div className="flex gap-1">
                      {img.imageUrl && (
                        <button 
                            onClick={(e) => handleDownload(e, img.imageUrl!, img.styleName)}
                            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Download Image"
                        >
                            <Download size={16} />
                        </button>
                      )}
                      {img.caption && (
                          <button 
                              onClick={(e) => handleCopy(e, img.id, img.caption!)}
                              className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative"
                              title="Copy Caption"
                          >
                              {copiedId === img.id ? <Check size={16} className="text-green-500"/> : <Copy size={16} />}
                          </button>
                      )}
                  </div>
                </div>
                
                {img.caption && (
                     <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-snug">
                            "{img.caption}"
                        </p>
                     </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GenerationGallery;