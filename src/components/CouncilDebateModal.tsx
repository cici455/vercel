'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { X, RefreshCw, ArrowDownCircle } from 'lucide-react';
import { useLuminaStore, AgentRole } from '@/store/luminaStore';

type Speaker = 'strategist' | 'oracle' | 'alchemist';

interface CouncilDebateModalProps {
  open: boolean;
  onClose: () => void;
  seedMessageId: string;
  dayKey: string | null;
}

interface DebateMessage {
  speaker: Speaker;
  text: string;
}

interface DebateState {
  conflict: string;
  options: string[];
  nextQuestion: string;
}

interface DebateResponse {
  messages: DebateMessage[];
  state: DebateState;
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
  const { messages, userData } = useLuminaStore();
  const [debateMessages, setDebateMessages] = useState<DebateMessage[]>([]);
  const [round, setRound] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [debateState, setDebateState] = useState<DebateState | null>(null);

  // Get the seed message content
  const seedMessage = messages.find(msg => msg.id === seedMessageId);
  const seedText =
    (() => {
      const s = seedMessage?.structured;
      if (s?.decrees?.length) {
        // 用三句断语当作辩论种子（最符合你的“武断占星师”）
        return s.decrees.map((d) => d.text).join(" ");
      }
      if (typeof s?.angle === "string" && s.angle.trim()) return s.angle;
      if (typeof s?.script === "string" && s.script.trim()) return s.script;
      if (typeof s?.question === "string" && s.question.trim()) return s.question;
      return seedMessage?.content ?? "";
    })();

  // Build history from the seed message and previous messages
  const buildHistory = () => {
    const seedIndex = messages.findIndex(msg => msg.id === seedMessageId);
    if (seedIndex === -1) return [];
    
    // Include the seed message and a few previous messages for context
    return messages.slice(Math.max(0, seedIndex - 3), seedIndex + 1);
  };

  const history = buildHistory();

  // Run one round of debate
  const runRound = async () => {
    const { spendCredits } = useLuminaStore.getState();
    if (!spendCredits(3)) {
      alert('Not enough credits');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seedText,
          history,
          roundIndex: round,
          astroProfile: `Sun=${userData?.sunSign || 'Leo'}, Moon=${userData?.moonSign || 'Virgo'}, Rising=${userData?.risingSign || 'Libra'}`,
          dayKey
        })
      });
      const data: DebateResponse = await res.json();
      
      setDebateMessages(prev => [...prev, ...data.messages]);
      setDebateState(data.state);
      setRound(prev => prev + 1);
    } catch (error) {
      console.error("Error running debate round:", error);
      alert('Failed to run debate round. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Deepen the debate (additional round)
  const deepenDebate = async () => {
    if (round >= 2) {
      alert('Maximum debate rounds reached');
      return;
    }

    const { spendCredits } = useLuminaStore.getState();
    if (!spendCredits(3)) {
      alert('Not enough credits');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seedText,
          history: [...history, ...debateMessages.map(msg => ({ 
            role: msg.speaker, 
            content: msg.text 
          }))],
          roundIndex: round,
          astroProfile: `Sun=${userData?.sunSign || 'Leo'}, Moon=${userData?.moonSign || 'Virgo'}, Rising=${userData?.risingSign || 'Libra'}`,
          dayKey
        })
      });
      const data: DebateResponse = await res.json();
      
      setDebateMessages(prev => [...prev, ...data.messages]);
      setDebateState(data.state);
      setRound(prev => prev + 1);
    } catch (error) {
      console.error("Error deepening debate:", error);
      alert('Failed to deepen debate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setDebateMessages([]);
      setRound(0);
      setDebateState(null);
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
            className="w-full max-w-2xl max-h-[90vh] bg-black/90 border border-starlight/30 rounded-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-starlight/20">
              <h3 className="text-lg font-cinzel text-starlight tracking-wider">COUNCIL DEBATE</h3>
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
              <div className="p-3 bg-starlight/10 border border-starlight/30 rounded-sm">
                <p className="text-xs text-starlight uppercase tracking-wider mb-1">SEED MESSAGE</p>
                <p className="text-sm text-white/90">{seedText}</p>
              </div>

              {/* Debate Messages */}
              {debateMessages.map((msg, index) => (
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
                      {msg.speaker.toUpperCase()}
                    </p>
                    <p className="text-sm text-white/90">{msg.text}</p>
                  </div>
                </div>
              ))}

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center gap-2 text-white/60">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Debate in progress...</span>
                </div>
              )}

              {/* Debate State */}
              {debateState && (
                <div className="mt-4 p-3 bg-starlight/10 border border-starlight/30 rounded-sm">
                  <p className="text-xs text-starlight uppercase tracking-wider mb-1">DEBATE STATE</p>
                  <p className="text-sm text-white/90 mb-2">Conflict: {debateState.conflict}</p>
                  <p className="text-sm text-white/90 mb-2">Options: {debateState.options.join(', ')}</p>
                  <p className="text-sm text-white/90">Next Question: {debateState.nextQuestion}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-starlight/20 flex flex-col gap-3">
              <div className="flex gap-2">
                <button
                  onClick={runRound}
                  disabled={isLoading || round >= 2}
                  className="flex-1 py-2 bg-starlight/20 hover:bg-starlight/40 text-starlight text-xs uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Run 1 Round (Cost: 3 Credits)
                </button>
                <button
                  onClick={deepenDebate}
                  disabled={isLoading || round >= 2}
                  className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-xs uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Deepen (Cost: 3 Credits)
                </button>
              </div>
              <div className="text-xs text-white/40 text-center">
                Maximum 2 rounds of debate allowed
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
