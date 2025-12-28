import React, { useRef, useState } from 'react';
import { Upload, Sparkles, Image as ImageIcon } from 'lucide-react';

interface InputSectionProps {
  onStart: (description: string, file: File) => void;
  isProcessing: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onStart, isProcessing }) => {
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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
      onStart(description, selectedFile);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl backdrop-blur-sm transition-colors duration-300">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-amber-500 dark:from-purple-400 dark:to-amber-300">
          Create Your Commercial
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Upload your product and let AI agents design the campaign.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group
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
            <div className="relative w-full h-64 flex items-center justify-center">
              <img src={preview} alt="Preview" className="max-h-full max-w-full rounded-lg shadow-lg object-contain" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <p className="text-white font-medium flex items-center gap-2"><Upload size={20}/> Change Image</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="text-slate-400 dark:text-slate-400 group-hover:text-purple-500 dark:group-hover:text-purple-400" size={32} />
              </div>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-200">Click to upload product image</p>
              <p className="text-sm text-slate-500 mt-1">Supports PNG, JPG, WEBP</p>
            </div>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Product Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., A luxury golden watch with sapphire glass, water resistant..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all h-32 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!description || !selectedFile || isProcessing}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all
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
              Generate Concepts
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputSection;