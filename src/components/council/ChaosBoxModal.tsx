'use client';

import React from 'react';
import { useLuminaStore } from '@/store/luminaStore';
import { Target, MoonStar, FlaskConical } from 'lucide-react';

export function ChaosBoxModal() {
  const { clips, updateClip, removeClip } = useLuminaStore();

  const getAgentIcon = (agent: string) => {
    switch (agent) {
      case 'strategist':
        return <Target size={16} className="text-[#D4AF37]" />;
      case 'oracle':
        return <MoonStar size={16} className="text-[#A0ECD6]" />;
      case 'alchemist':
        return <FlaskConical size={16} className="text-[#9D4EDD]" />;
      default:
        return null;
    }
  };

  const getDecreeTypeColor = (type: string) => {
    switch (type) {
      case 'pierce':
        return 'text-red-400';
      case 'cost':
        return 'text-amber-400';
      case 'direction':
        return 'text-green-400';
      default:
        return 'text-white/70';
    }
  };

  const handleReaction = (clipId: string, reaction: string) => {
    updateClip(clipId, { reaction: reaction as any });
  };

  const handleDeconstruct = (clip: any) => {
    // This would open a deconstruct modal or navigate to deconstruct view
    console.log('Deconstruct clip:', clip);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Chaos Box</h2>
        
        {clips.length === 0 ? (
          <div className="text-center text-white/50 py-10">
            No clips yet. Use ✂ to clip decrees.
          </div>
        ) : (
          <div className="space-y-4">
            {clips.map((clip) => (
              <div key={clip.id} className="border border-white/10 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {/* Agent Icon */}
                  <div className="flex-shrink-0">
                    {getAgentIcon(clip.agent)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs ${getDecreeTypeColor(clip.decreeType)}`}>
                        {clip.decreeType}
                      </span>
                      <span className="text-xs text-white/50">
                        {new Date(clip.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <p className="text-white/90 mb-3">
                      {clip.text}
                    </p>
                    
                    {/* Reaction Buttons */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {['not_true', 'too_harsh', 'scared', 'angry', 'unclear'].map((reaction) => (
                        <button
                          key={reaction}
                          onClick={() => handleReaction(clip.id, reaction)}
                          className={`px-2 py-1 text-xs rounded-sm ${
                            clip.reaction === reaction 
                              ? 'bg-white/20 text-white' 
                              : 'bg-white/10 text-white/70 hover:bg-white/15'
                          }`}
                        >
                          {reaction.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeconstruct(clip)}
                        className="text-xs px-3 py-1 bg-white/10 text-white/80 hover:bg-white/15 rounded-sm"
                      >
                        Deconstruct
                      </button>
                      <button
                        onClick={() => removeClip(clip.id)}
                        className="text-xs px-3 py-1 bg-white/5 text-white/60 hover:bg-white/10 rounded-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              // Close modal logic
              // This would typically be handled by a modal manager
            }}
            className="text-sm text-white/60 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
