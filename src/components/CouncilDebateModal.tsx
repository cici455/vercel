'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw } from 'lucide-react';
import { useLuminaStore } from '@/store/luminaStore';

type Speaker = "strategist" | "oracle" | "alchemist";
type DebateMsg = { speaker: Speaker; text: string };

interface CouncilDebateModalProps {
  open: boolean;
  onClose: () => void;
  seedMessageId: string;
  dayKey?: string | null;
}

const AGENT_CONFIG: Record<Speaker, { name: string; color: string; border: string; font: string }> = {
  strategist: { 
    name: 'STRATEGIST', 
    color: 'text-amber-400', 
    border: 'border-amber-500/40',
    font: 'font-mono' 
  },
  oracle: { 
    name: 'ORACLE', 
    color: 'text-purple-300', 
    border: 'border-purple-400/40',
    font: 'font-serif italic' 
  },
  alchemist: { 
    name: 'ALCHEMIST', 
    color: 'text-emerald-400', 
    border: 'border-emerald-500/40',
    font: 'font-mono'
  },
};

export function CouncilDebateModal({ open, onClose, seedMessageId, dayKey }: CouncilDebateModalProps) {
  const { messages, addMessage, setActiveMessage } = useLuminaStore();
  const [debateMsgs, setDebateMsgs] = useState<DebateMsg[]>([]);
  const [loading, setLoading] = useState(false);

  // Get the seed message content
  const seedMessage = messages.find(m => m.id === seedMessageId);
  const seedText = (() => { 
    const s = seedMessage?.structured; 
    if (s?.decrees?.length) return s.decrees.map(d => d.text).join(" "); 
    if (typeof s?.angle === "string" && s.angle.trim()) return s.angle; 
    if (typeof s?.question === "string" && s.question.trim()) return s.question; 
    return seedMessage?.content ?? ""; 
  })();

  // Run one round of debate
  const runOneRound = async () => { 
    if (!seedText.trim() || loading) return; 
    setLoading(true); 
 
    try { 
      const speakers: Speaker[] = ["strategist", "oracle", "alchemist"]; 
      const localHistory: { role: string; content: string }[] = []; 
 
      for (const sp of speakers) { 
        const res = await fetch("/api/council", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ 
            mode: "solo", 
            activeAgent: sp, 
            message: seedText, 
            astroData: { sunSign: "Leo", moonSign: "Virgo", risingSign: "Libra" }, 
            history: localHistory, 
            dayKey, 
          }), 
        }); 
 
        const data = await res.json(); 
        const payload = data?.responses?.[sp]; 
 
        // payload 可能是 structured 或 string 
        let text = ""; 
        if (payload && typeof payload === "object") { 
          // 只展示 angle + decrees（不要暴露结构标签） 
          const angle = String(payload.angle ?? "").trim(); 
          const decreesText = Array.isArray(payload.decrees) 
            ? payload.decrees.map((x: any) => x.text).filter(Boolean).join("\n") 
            : ""; 
          text = [angle, decreesText].filter(Boolean).join("\n\n"); 
        } else { 
          text = String(payload ?? "No response"); 
        } 
 
        setDebateMsgs((prev) => [...prev, { speaker: sp, text }]); 
        localHistory.push({ role: sp, content: text }); 
      } 
 
      // 轮结束：生成一个 council 节点，挂在 seedMessageId 下（用于命运树）
      const last3 = [...debateMsgs].slice(-3);
      const summary = last3.map(m => m.text.split("\n").slice(-1)[0]).join(" / ");

      const councilId = addMessage("council" as any, summary, seedMessageId);
      setActiveMessage(councilId); 
 
    } finally { 
      setLoading(false); 
    } 
  };

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setDebateMsgs([]);
    }
  }, [open, seedMessageId]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl max-h-[90vh] bg-black/90 border border-white/20 rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h3 className="text-lg font-serif text-white tracking-wider">COUNCIL DEBATE</h3>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Debate Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[60vh]">
              {/* Seed Message */}
              <div className="p-3 bg-white/10 border border-white/20 rounded-lg">
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1">SEED MESSAGE</p>
                <p className="text-sm text-white/90">{seedText}</p>
              </div>

              {/* Debate Messages */}
              {debateMsgs.map((msg, index) => (
                <div 
                  key={index}
                  className="flex gap-3"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    msg.speaker === 'strategist' ? 'bg-amber-400' :
                    msg.speaker === 'oracle' ? 'bg-purple-400' :
                    'bg-emerald-400'
                  }`} />
                  <div className="flex-1">
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                      msg.speaker === 'strategist' ? 'text-amber-400' :
                      msg.speaker === 'oracle' ? 'text-purple-400' :
                      'text-emerald-400'
                    }`}>
                      {AGENT_CONFIG[msg.speaker].name}
                    </p>
                    <p className="text-sm text-white/90 whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center gap-2 text-white/60">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Debate in progress...</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="p-4 border-t border-white/20">
              <button
                onClick={runOneRound}
                disabled={loading}
                className="w-full py-2 bg-gradient-to-r from-amber-500/20 to-fuchsia-500/20 hover:from-amber-500/30 hover:to-fuchsia-500/30 border border-amber-500/30 text-white/90 text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Running...' : 'Run 1 Round'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}