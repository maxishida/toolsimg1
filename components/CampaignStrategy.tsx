import React from 'react';
import { AgentAnalysis } from '../types';
import { Copy, Hash, Instagram, Linkedin, MessageCircle, Target, Zap } from 'lucide-react';

interface CampaignStrategyProps {
  analysis: AgentAnalysis;
}

const CampaignStrategy: React.FC<CampaignStrategyProps> = ({ analysis }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-7xl mx-auto mt-12 mb-8">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Target className="text-purple-500" /> 
        Strategic Insight & Copywriting
      </h2>
      
      {/* Strategy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Audience</div>
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{analysis.audience}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Core Emotion</div>
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{analysis.emotion}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Brand Slogan</div>
          <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-amber-500">
            "{analysis.marketingCopy.oneLiner}"
          </p>
        </div>
      </div>

      {/* Copywriting Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Instagram */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 font-bold"><Instagram size={18} /> Instagram</div>
            <button 
                onClick={() => copyToClipboard(analysis.marketingCopy.instagramCaption + '\n\n' + analysis.marketingCopy.hashtags.join(' '))}
                className="text-white/80 hover:text-white"
            >
                <Copy size={16} />
            </button>
          </div>
          <div className="p-6">
            <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap">{analysis.marketingCopy.instagramCaption}</p>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <p className="text-blue-500 text-sm">{analysis.marketingCopy.hashtags.map(h => `#${h}`).join(' ')}</p>
            </div>
          </div>
        </div>

        {/* LinkedIn */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="bg-[#0077b5] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 font-bold"><Linkedin size={18} /> LinkedIn</div>
             <button 
                onClick={() => copyToClipboard(analysis.marketingCopy.linkedinPost)}
                className="text-white/80 hover:text-white"
            >
                <Copy size={16} />
            </button>
          </div>
          <div className="p-6">
            <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap">{analysis.marketingCopy.linkedinPost}</p>
          </div>
        </div>

        {/* TikTok Script */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="bg-black text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold"><Zap size={18} /> TikTok Hook (Script)</div>
             <button 
                onClick={() => copyToClipboard(analysis.marketingCopy.tiktokHook)}
                className="text-white/80 hover:text-white"
            >
                <Copy size={16} />
            </button>
          </div>
          <div className="p-6">
             <div className="flex items-start gap-3 mb-2">
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 text-xs font-bold px-2 py-1 rounded">0:00-0:03</span>
             </div>
            <p className="text-slate-800 dark:text-slate-100 font-medium italic">"{analysis.marketingCopy.tiktokHook}"</p>
            <p className="text-slate-500 text-xs mt-4">Use this text as a voiceover or text-overlay in the first 3 seconds.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CampaignStrategy;