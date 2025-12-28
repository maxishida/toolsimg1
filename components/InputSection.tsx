import React, { useRef, useState } from 'react';
import { Upload, Sparkles, Image as ImageIcon, Palette, Smartphone, Monitor, Video } from 'lucide-react';
import { GeneratorStyleId, AspectRatio, CameraMovement } from '../types';

interface InputSectionProps {
  onStart: (description: string, file: File, filter: string, aspectRatio: AspectRatio, cameraMovement: CameraMovement) => void;
  isProcessing: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onStart, isProcessing }) => {
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  // New State for Advanced Controls
  const [generatorStyle, setGeneratorStyle] = useState<GeneratorStyleId>('ecommerce_studio');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [cameraMovement, setCameraMovement] = useState<CameraMovement>('Dolly In');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description && selectedFile) {
      onStart(description, selectedFile, generatorStyle, aspectRatio, cameraMovement);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl backdrop-blur-sm transition-colors duration-300">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-amber-500 dark:from-purple-400 dark:to-amber-300">
          AdFusion AI Studio
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Design your campaign with specialized AI Agents.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Upload (Takes 4 columns on large screens) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`flex-grow relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group min-h-[300px]
                ${preview 
                  ? 'border-amber-500/50 bg-slate-50 dark:bg-slate-900/50' 
                  : 'border-slate-300 dark:border-slate-600 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/png, image/jpeg, image/webp" 
                className="hidden" 
              />
              
              {preview ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img src={preview} alt="Preview" className="max-h-full max-w-full rounded-lg shadow-lg object-contain" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <p className="text-white font-medium flex items-center gap-2"><Upload size={20}/> Replace</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon className="text-slate-400 dark:text-slate-400 group-hover:text-purple-500 dark:group-hover:text-purple-400" size={28} />
                  </div>
                  <p className="text-base font-medium text-slate-700 dark:text-slate-200">Upload Product</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Controls (Takes 8 columns) */}
          <div className="lg:col-span-8 space-y-5">
             
             {/* Row 1: Generator & Format */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Generator Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Palette size={16} className="text-purple-500" />
                    Creative Generator
                  </label>
                  <select 
                      value={generatorStyle}
                      onChange={(e) => setGeneratorStyle(e.target.value as GeneratorStyleId)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium"
                    >
                      <optgroup label="Best for E-commerce">
                        <option value="ecommerce_studio">E-commerce Studio (Bags/Watches)</option>
                        <option value="cinematic_ad">Cinematic Ad Studio (Lifestyle)</option>
                      </optgroup>
                      <optgroup label="Core Commercials">
                        <option value="dynamic_forces">Dynamic Forces (Elemental)</option>
                      </optgroup>
                      <optgroup label="Creative Layouts">
                        <option value="chibi_shop">Chibi Shop (Miniature World)</option>
                        <option value="knolling_layout">AI Knolling Layout</option>
                        <option value="landmark_infographic">Landmark/Technical Infographic</option>
                      </optgroup>
                      <optgroup label="Branding & Logos">
                        <option value="glossy_logo">Glossy Glass App Icon</option>
                        <option value="textured_logo">Realistic Texture 3D Logo</option>
                      </optgroup>
                      <optgroup label="Specialized">
                        <option value="crave_canvas">CraveCanvas (Food)</option>
                        <option value="seasonal_cycle">Seasonal Cycle Panorama</option>
                        <option value="art_studio">AI Art Studio (Abstract)</option>
                      </optgroup>
                  </select>
                </div>

                {/* Aspect Ratio Selector */}
                <div className="space-y-2">
                   <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    {aspectRatio === '16:9' ? <Monitor size={16} className="text-blue-500"/> : <Smartphone size={16} className="text-pink-500"/>}
                    Output Format
                  </label>
                  <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setAspectRatio('16:9')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all
                        ${aspectRatio === '16:9' 
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      <Monitor size={14} /> Landscape (TV/YT)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAspectRatio('9:16')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all
                        ${aspectRatio === '9:16' 
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      <Smartphone size={14} /> Vertical (TikTok)
                    </button>
                  </div>
                </div>
             </div>

             {/* Row 2: Camera Movement (Director Mode) */}
             <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Video size={16} className="text-green-500"/>
                    Director Mode (Camera)
                  </label>
                 <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {['Dolly In', 'Dolly Out', 'Pan Left', 'Pan Right', 'Orbit', 'Crane Up'].map((move) => (
                      <button
                        key={move}
                        type="button"
                        onClick={() => setCameraMovement(move as CameraMovement)}
                        className={`py-2 px-1 text-xs font-medium rounded-lg border transition-all truncate
                          ${cameraMovement === move
                            ? 'bg-green-500/10 border-green-500 text-green-700 dark:text-green-400'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-400'
                          }`}
                      >
                        {move}
                      </button>
                    ))}
                 </div>
             </div>

             {/* Description */}
             <div className="space-y-2">
               <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                 Brief / Prompt
               </label>
               <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product. For best results, mention the material, mood, and lighting you want..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl p-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 outline-none transition-all h-24 resize-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={!description || !selectedFile || isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all
                ${(!description || !selectedFile || isProcessing)
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:shadow-purple-500/25'
                }`}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Campaign Assets
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputSection;