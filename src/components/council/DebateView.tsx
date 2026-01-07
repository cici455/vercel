'use client';

import { useEffect, useRef, useState } from 'react';
import { useLuminaStore, AgentRole } from '@/store/luminaStore';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FateTree } from '@/components/visualization/FateTree';
import { TheVoid } from '@/components/alchemy/TheVoid';
import { CouncilDebateModal } from '@/components/CouncilDebateModal';
import { STARTER_CHIPS, predictionChips } from '@/lib/suggestions';
import { Send, Terminal, AlertTriangle, RefreshCw, X, Users } from 'lucide-react';

const AGENT_CONFIG: Record<AgentRole, { name: string; color: string; border: string; font: string }> = {
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
    font: 'font-cinzel text-glow' 
  },
  alchemist: { 
    name: 'ALCHEMIST', 
    color: 'text-emerald-400', 
    border: 'border-emerald-500/40',
    font: 'font-mono'
  },
};

export function DebateView() {
  const { messages, addMessage, updateMessage, voidEnergy, userData, domain } = useLuminaStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ id: string, x: number, y: number } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<AgentRole>('strategist');
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [debateModalOpen, setDebateModalOpen] = useState(false);
  const [seedMessageId, setSeedMessageId] = useState<string | null>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate Council Debate
  const simulateCouncilDebate = async () => {
    if (messages.length > 0) return; 

    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1500));
    addMessage('strategist', "Analyzing user coordinates. The path forward requires structure. We must define the boundaries before we seek the void.");
    
    await new Promise(r => setTimeout(r, 3000));
    addMessage('oracle', "Structure... always structure. But I feel a turbulence in their chart. The Moon in Pisces suggests they are drowning in possibilities.");

    await new Promise(r => setTimeout(r, 3000));
    addMessage('alchemist', "We can use that drowning. Transform the overwhelm into fuel. Let's catalyze a new path.");
    
    setIsTyping(false);
  };

  useEffect(() => {
    simulateCouncilDebate();
  }, []);

  // Fetch daily lines for consistency with form page
  useEffect(() => {
    (async () => {
      const astroProfile = `Sun=${userData?.sunSign || 'Leo'}, Moon=${userData?.moonSign || 'Virgo'}, Rising=${userData?.risingSign || 'Libra'}`;
      const res = await fetch("/api/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ astroProfile })
      });
      const data = await res.json();
      setDayKey(data.dayKey);
    })();
  }, [userData]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const { spendCredits } = useLuminaStore.getState();
    if (!spendCredits(1)) {
      alert('Not enough credits');
      return;
    }
    
    const userMessageId = addMessage('user', input);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch("/api/council", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          mode: "solo",
          activeAgent,
          astroData: {
            sunSign: userData?.sunSign || 'Leo',
            moonSign: userData?.moonSign || 'Virgo',
            risingSign: userData?.risingSign || 'Libra'
          },
          dayKey
        })
      });
      const data = await res.json();
      const payload = data?.responses?.[activeAgent];

      if (payload && typeof payload === "object") {
        const textFallback = [payload.core, payload.reading].filter(Boolean).join("\n");
        const aiId = addMessage(activeAgent, textFallback, userMessageId, payload);
        setActiveMessage(aiId);
      } else {
        const aiId = addMessage(activeAgent, String(payload ?? "No response"), userMessageId);
        setActiveMessage(aiId);
      }
    } catch (error) {
      console.error("Error calling council API:", error);
      const aiId = addMessage(activeAgent, "Connection error. Please try again.", userMessageId);
      setActiveMessage(aiId);
    } finally {
      setIsTyping(false);
    }
  };

  const endSession = () => {
    // Save session with a random outcome for demo purposes
    // In real app, AI determines outcome
    const outcomes: ('gold' | 'blue' | 'red')[] = ['gold', 'blue', 'red'];
    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    useLuminaStore.getState().saveSession(randomOutcome);
    useLuminaStore.getState().setPhase('archive');
  };

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({ id, x: e.clientX, y: e.clientY });
  };

  const initiateGlitch = (id: string) => {
    setContextMenu(null);
    updateMessage(id, { isGlitch: true });
    setTimeout(() => {
      setEditingId(id);
      const msg = messages.find(m => m.id === id);
      if (msg) setEditContent(msg.content);
    }, 1000); // Wait for glitch animation
  };

  const submitReframing = async () => {
    if (!editingId) return;
    
    // 1. Update the original message to show it was hacked/reframed
    updateMessage(editingId, { 
      content: `[RE-FRAMED]: ${editContent}`, 
      isGlitch: false 
    });
    setEditingId(null);

    // 2. Alchemist Reacts
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1500));
    addMessage('alchemist', `Variable accepted. Recalculating trajectory based on new axiom: "${editContent}"`);
    setIsTyping(false);
  };

  return (
    <div className="w-full h-[85vh] flex flex-col md:flex-row gap-6 p-4 md:p-0 relative" onClick={() => setContextMenu(null)}>
      
      {/* Void Energy Counter */}
      <div className="absolute top-4 right-4 md:right-[62%] z-50 pointer-events-none">
        <GlassPanel className="px-4 py-2 flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-starlight animate-pulse" />
           <span className="font-mono text-xs text-starlight">VOID ENERGY: {voidEnergy}</span>
        </GlassPanel>
      </div>

      {/* LEFT: CHAT STREAM (40%) */}
      <div className="w-full md:w-[40%] flex flex-col h-full relative">
        <div className="mb-4 pl-2 border-l-2 border-starlight/30">
          <h2 className="text-xl font-cinzel text-starlight tracking-widest">COUNCIL CHAMBER</h2>
          <p className="text-[10px] text-white/40 uppercase">Session Active • Recording Fate</p>
          
          {/* Agent Selector */}
          <div className="mt-3 flex gap-2">
            {(['strategist', 'oracle', 'alchemist'] as AgentRole[]).map((agent) => (
              <button
                key={agent}
                onClick={() => setActiveAgent(agent)}
                className={cn(
                  "px-3 py-1 text-xs uppercase tracking-wider transition-all",
                  activeAgent === agent 
                    ? `bg-${AGENT_CONFIG[agent].color.replace('text-', '')}/30 text-${AGENT_CONFIG[agent].color.replace('text-', '')} border border-${AGENT_CONFIG[agent].color.replace('text-', '')}/50`
                    : "bg-white/5 hover:bg-white/10 text-white/50 border border-white/10"
                )}
              >
                {AGENT_CONFIG[agent].name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-20">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                layoutId={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, filter: 'blur(10px)' }}
                className={cn(
                  "relative pl-4 border-l-2 group transition-all duration-300",
                  msg.role === 'user' ? "border-white/20" : AGENT_CONFIG[msg.role as AgentRole].border,
                  msg.isGlitch && "animate-glitch border-red-500 text-red-400 skew-x-2"
                )}
                onContextMenu={(e) => msg.role !== 'user' && handleContextMenu(e, msg.id)}
                // draggable={true} // Framer Motion 'drag' conflict with HTML5 'draggable'
                // onDragStart={(e: React.DragEvent<HTMLDivElement>) => e.dataTransfer.setData("text/plain", msg.id)}
                
                // Use Framer Motion's drag instead if needed, or standard HTML drag
                // Since we are using motion.div, we should probably stick to standard HTML attributes carefully
                // OR just cast the event type to 'any' to bypass the strict motion type check for now
                // as motion.div's onDragStart signature is different from HTML's.
                // Let's use 'any' to fix the build quickly.
                draggable={true}
                onDragStart={(e: any) => e.dataTransfer.setData("text/plain", msg.id)}
              >
                {/* Agent Label */}
                {msg.role !== 'user' && (
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-[10px] font-bold tracking-[0.2em]", AGENT_CONFIG[msg.role as AgentRole].color)}>
                      {AGENT_CONFIG[msg.role as AgentRole].name}
                    </span>
                    <button
                      onClick={() => {
                        setSeedMessageId(msg.id);
                        setDebateModalOpen(true);
                      }}
                      className="text-xs text-starlight hover:text-starlight/80 transition-colors flex items-center gap-1"
                    >
                      <Users className="w-3 h-3" />
                      SUMMON COUNCIL
                    </button>
                  </div>
                )}
                
                {/* User Label */}
                {msg.role === 'user' && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-white/60">YOU</span>
                  </div>
                )}

                {/* Content or Edit Mode */}
                {editingId === msg.id ? (
                  <div className="mt-2 space-y-2">
                     <textarea
                       value={editContent}
                       onChange={(e) => setEditContent(e.target.value)}
                       className="w-full bg-black/50 border border-starlight/50 p-2 text-sm text-starlight font-mono focus:outline-none"
                       rows={3}
                       autoFocus
                     />
                     <div className="flex gap-2">
                       <button 
                         onClick={submitReframing}
                         className="px-3 py-1 bg-starlight/20 hover:bg-starlight/40 text-starlight text-xs uppercase tracking-wider"
                       >
                         Reframe
                       </button>
                       <button 
                         onClick={() => setEditingId(null)}
                         className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white/50 text-xs uppercase tracking-wider"
                       >
                         Cancel
                       </button>
                     </div>
                  </div>
                ) : msg.structured ? (
                  // Structured message with ceremonial card layout
                  <div className="mt-2 space-y-3">
                    {/* Omen and Transit lines */}
                    <div className="text-xs text-white/60 space-y-1">
                      <p className="font-serif italic">{msg.structured.omen}</p>
                      <p className="font-serif italic">{msg.structured.transit}</p>
                    </div>
                    
                    {/* Core (title) */}
                    <h4 className={cn(
                      "text-lg font-bold text-white",
                      msg.role === 'strategist' ? "font-mono tracking-wide" :
                      msg.role === 'oracle' ? "font-serif italic" :
                      "font-sans"
                    )}>
                      {msg.structured.core}
                    </h4>
                    
                    {/* Reading (body) */}
                    <p className={cn(
                      "text-sm leading-relaxed text-white/90",
                      msg.role === 'strategist' ? "font-mono tracking-wide" :
                      msg.role === 'oracle' ? "font-serif italic" :
                      "font-sans"
                    )}>
                      {msg.structured.reading}
                    </p>
                    
                    {/* Moves (chips) */}
                    {Array.isArray(msg.structured.moves) && msg.structured.moves.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.structured.moves.map((move: string, index: number) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-starlight/20 text-starlight text-xs rounded-sm"
                          >
                            {move}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Question (prompt) */}
                    {msg.structured.question && (
                      <p className={cn(
                        "text-sm text-starlight mt-2 italic",
                        msg.role === 'strategist' ? "font-mono tracking-wide" :
                        msg.role === 'oracle' ? "font-serif italic" :
                        "font-sans"
                      )}>
                        {msg.structured.question}
                      </p>
                    )}
                  </div>
                ) : (
                  // Regular text message
                  <p className={cn(
                    "text-sm leading-relaxed text-white/90 cursor-default",
                    msg.role === 'strategist' ? "font-mono tracking-wide" :
                    msg.role === 'oracle' ? "font-serif italic" :
                    "font-sans",
                    msg.isGlitch && "blur-[1px]"
                  )}>
                    {msg.content}
                  </p>
                )}
              </motion.div>
            ))}
            {isTyping && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pl-4 border-l-2 border-white/5">
                 <p className="text-xs text-white/30 animate-pulse">Thinking...</p>
               </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Command Line Input */}
        <div className="absolute bottom-0 left-0 w-full bg-[#050505]/90 backdrop-blur-md pt-4 pb-4 px-4">
          {/* Suggestion Chips */}
          <div className="mb-3 flex flex-wrap gap-2 relative z-50">
            {STARTER_CHIPS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setInput(t)}
                className="rounded-full border border-white/15 bg-black/45 px-3 py-1.5 
                           text-[11px] tracking-wide text-white/85 
                           hover:text-white hover:border-white/25 hover:bg-black/60 
                           backdrop-blur-md"
              >
                {t}
              </button>
            ))}
          </div>
          
          {/* Input Field */}
          <div className="flex gap-4">
            <div className="flex-1 flex items-center gap-2 border-b border-white/20 pb-2 transition-colors focus-within:border-starlight/60">
              <Terminal className="w-4 h-4 text-starlight/50" />
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Inject a variable to alter fate..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-starlight placeholder:text-white/20"
              />
              <button onClick={handleSend} className="hover:text-starlight text-white/30 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <button 
               onClick={endSession}
               className="px-4 py-2 bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/50 hover:bg-white/10 hover:text-white hover:border-white/30 transition-all"
            >
              End Ritual
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: PROBABILITY TREE (60%) */}
      <div className="hidden md:block w-[60%] h-full relative">
        <FateTree />
        <TheVoid />
      </div>

      {/* CONTEXT MENU */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="fixed z-[100] bg-black/90 border border-starlight/30 backdrop-blur-xl shadow-2xl rounded-sm overflow-hidden min-w-[180px]"
          >
            <button 
              onClick={() => initiateGlitch(contextMenu.id)}
              className="w-full px-4 py-3 text-left text-xs uppercase tracking-widest text-starlight hover:bg-starlight/10 flex items-center gap-2 group"
            >
              <AlertTriangle className="w-3 h-3 group-hover:text-red-400 transition-colors" />
              Challenge Aspect
            </button>
             <button 
              onClick={() => setContextMenu(null)}
              className="w-full px-4 py-3 text-left text-xs uppercase tracking-widest text-white/50 hover:bg-white/10 flex items-center gap-2"
            >
              <X className="w-3 h-3" />
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Council Debate Modal */}
      <CouncilDebateModal
        open={debateModalOpen}
        onClose={() => setDebateModalOpen(false)}
        seedMessageId={seedMessageId || ''}
        dayKey={dayKey}
      />

    </div>
  );
}
