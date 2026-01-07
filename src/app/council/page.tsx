'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Target, MoonStar, FlaskConical, ArrowLeft } from 'lucide-react';
import { Cinzel } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useLuminaStore } from '@/store/luminaStore';
import { FateTree } from '@/components/visualization/FateTree';

// Utility function to convert any value to string
const toText = (v: unknown) => {
  if (typeof v === "string") return v;
  if (v == null) return "";
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  // Common case: { content: "..." }
  if (typeof (v as any).content === "string") return (v as any).content;

  // Common case: { analysis: "...", advice: "..." }
  const maybe = v as any;
  if (typeof maybe.analysis === "string" || typeof maybe.advice === "string") {
    return [maybe.analysis, maybe.advice].filter(Boolean).join("\n\n");
  }

  // Fallback
  try { return JSON.stringify(v); } catch { return String(v); }
};

// Google Font for headers
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cinzel',
});

// Define Archetype type
type Archetype = "strategist" | "oracle" | "alchemist";

// Main component
export default function ChronoCouncilPage() {
  const router = useRouter();
  const { 
    messages, 
    activeMessageId, 
    addMessage, 
    setActiveMessage 
  } = useLuminaStore();
  const [input, setInput] = useState('');
  const [activeAgent, setActiveAgent] = useState<'strategist' | 'oracle' | 'alchemist'>('strategist');
  const [isSummonActive, setIsSummonActive] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  const [openInfo, setOpenInfo] = useState<Archetype | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [councilUnlocked, setCouncilUnlocked] = useState(false);
  
  // Council modal state
  const [isCouncilOpen, setIsCouncilOpen] = useState(false);
  const [councilAnchorMessageId, setCouncilAnchorMessageId] = useState<string | null>(null);
  const [councilReplies, setCouncilReplies] = useState<Partial<Record<'strategist' | 'oracle' | 'alchemist', string | any>>>({});
  const [councilLoading, setCouncilLoading] = useState<Partial<Record<'strategist' | 'oracle' | 'alchemist', boolean>>>({});
  
  // Click outside to close info popover
  useEffect(() => {
    const onDown = () => setOpenInfo(null);
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  // Find nearest user message content
  const findNearestUserText = (startId: string) => { 
    const map = new Map(messages.map(m => [m.id, m])); 
    let cur = map.get(startId); 
    while (cur) { 
      if (cur.role === "user") return cur.content; 
      cur = cur.parentId ? map.get(cur.parentId) : undefined; 
    } 
    return ""; 
  }; 

  // Get debate seed from anchor message
  const getDebateSeed = (anchorMessageId: string) => {
    const anchorMessage = messages.find(msg => msg.id === anchorMessageId);
    if (!anchorMessage) return "";
    
    try {
      const structuredContent = JSON.parse(anchorMessage.content);
      if (structuredContent.interpretation) {
        // Take first sentence of interpretation
        return structuredContent.interpretation.split('.')[0].slice(0, 200);
      }
    } catch (e) {
      // Fallback to plain text
      return anchorMessage.content.slice(0, 200);
    }
    return anchorMessage.content.slice(0, 200);
  };

  // Activate agent in council modal
  const activateAgentInCouncil = async (agent: 'strategist' | 'oracle' | 'alchemist') => {
    if (!councilAnchorMessageId) return;
    
    setCouncilLoading(prev => ({ ...prev, [agent]: true }));
    
    try {
      const debateSeed = getDebateSeed(councilAnchorMessageId);
      const history = buildHistory(councilAnchorMessageId);
      
      const response = await fetch('/api/council', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: debateSeed,
          astroData: {
            sunSign: 'Leo',
            moonSign: 'Virgo',
            risingSign: 'Libra'
          },
          history: history,
          mode: 'solo',
          activeAgent: agent
        })
      });
      
      if (!response.ok) {
        const errText = await response.text();
        setCouncilReplies(prev => ({ ...prev, [agent]: `Error: ${errText}` }));
        return;
      }
      
      const data = await response.json();
      const agentResponse = data?.responses?.[agent];
      
      setCouncilReplies(prev => ({ ...prev, [agent]: agentResponse }));
    } catch (error) {
      console.error('Error activating agent:', error);
      setCouncilReplies(prev => ({ ...prev, [agent]: `Error: ${String(error)}` }));
    } finally {
      setCouncilLoading(prev => ({ ...prev, [agent]: false }));
    }
  };

  // Open council modal from a specific assistant message
  const openCouncilModal = (parentAssistantId: string) => {
    setCouncilAnchorMessageId(parentAssistantId);
    setCouncilReplies({});
    setCouncilLoading({});
    setIsCouncilOpen(true);
  };

  // Build history from activeMessageId
  const buildHistory = (fromId: string | null) => {
    if (!fromId) return [];
    const map = new Map(messages.map(m => [m.id, m]));
    const chain: { role: string; content: string }[] = [];
    let cur = map.get(fromId);
    while (cur) {
      chain.push({ role: cur.role, content: cur.content });
      cur = cur.parentId ? map.get(cur.parentId) : undefined;
    }
    return chain.reverse();
  };

  // Handle message send
  const handleSend = async () => {
    const messageContent = input;
    
    if (!messageContent.trim()) return;
    
    // Add user message to chat
    const userMessageId = addMessage('user', messageContent, activeMessageId || undefined);
    setInput('');
    setLastUserMessage(messageContent);
    
    // Build history for API
    const history = buildHistory(activeMessageId);
    
    try {
      // Call council API with solo mode
      const response = await fetch('/api/council', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          astroData: {
            sunSign: 'Leo', // This would come from user's actual astro data
            moonSign: 'Virgo',
            risingSign: 'Libra'
          },
          history: history,
          mode: 'solo',
          activeAgent: activeAgent // Use currently selected active agent
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        addMessage('alchemist', `Request failed: ${errText}`, userMessageId);
        return;
      }

      const data = await response.json();
      
      if (!data?.responses) {
        addMessage('alchemist', `No responses returned`, userMessageId);
        return;
      }
      
      // Check if API returned an error
      if (data.error) {
        // Add error message to chat
        addMessage('alchemist', `Error: ${data.error}`, userMessageId);
        return; // Exit early
      }
      
      // Add only the current active agent's response
      const aiRaw = data?.responses?.[activeAgent];
      const aiText = toText(aiRaw);
      if (aiText) {
        const aiId = addMessage(activeAgent, aiText, userMessageId);
        // Set active message to the AI response
        setActiveMessage(aiId);
      } else {
        addMessage(activeAgent, "No response", userMessageId);
      }
      
      // Activate summon button after AI replies
      setIsSummonActive(true);
    } catch (error) {
      console.error('Error calling council API:', error);
      // Add error message to chat if the fetch itself failed
      addMessage('strategist', "The stars are silent right now... Please try again later.", userMessageId);
    }
  };

  // No need for separate handleNodeClick function - navigation is handled directly in the destiny tree component

  return (
    <div className={`h-screen w-full bg-transparent text-[#E0E0E0] font-sans overflow-hidden ${cinzel.variable}`}>
        <div className="flex h-full">
          {/* Left Panel: CouncilChamber (75%) */}
          <div className="w-[75%] h-full flex flex-col relative z-10">
            {/* Header */}
            <header className="p-6 flex justify-between items-center backdrop-blur-[20px] bg-[#080808]/50 border-b border-white/[0.05]">
              <div className="flex items-center gap-6">
                {/* Back Button */}
                <button 
                  onClick={() => router.back()}
                  className="flex items-center gap-2 
                            rounded-full border border-white/15 bg-black/40 px-3 py-2 
                            text-white/80 hover:text-white hover:border-white/25 hover:bg-black/55 
                            backdrop-blur-md"
                  aria-label="Back"
                >
                  <span className="text-lg">←</span>
                  <span className="text-sm tracking-widest">BACK</span>
                </button>
                
                <div className="flex flex-col items-start gap-1">
                  <h1 className={`text-sm tracking-widest uppercase text-[#888888] font-serif`}>
                    RITUAL IN PROGRESS
                  </h1>
                </div>
              </div>
              
              {/* Agent Icons (Clickable Buttons with Popover Info) */}
              <div className="flex gap-4">
                  {/* Strategist Button */}
                  <button 
                    className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer border ${activeAgent === 'strategist' ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]' : 'bg-white/[0.02] border-white/[0.05] text-[#666666] hover:bg-white/[0.05]'}`}
                    onClick={() => {
                      setActiveAgent('strategist');
                      setOpenInfo(openInfo === "strategist" ? null : "strategist");
                    }}
                  >
                    <Target size={16} className={activeAgent === 'strategist' ? "text-[#D4AF37]" : "text-white/70 group-hover:text-white"} />
                    <span className="text-[10px] uppercase tracking-wider font-serif">STRATEGIST</span>
                    
                    {openInfo === "strategist" && (
                      <div 
                        className="absolute left-0 top-full mt-2 w-72 
                                   rounded-2xl border border-white/15 bg-black/70 p-4 
                                   text-white/80 shadow-xl backdrop-blur-md"
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <div className="text-xs tracking-widest text-[#D6B25E]">SUN · RATIONAL</div>
                        <div className="mt-2 text-sm leading-relaxed">
                          Focuses on long-term outcomes, trade-offs, and winning conditions.
                        </div>
                      </div>
                    )}
                  </button>
                  
                  {/* Oracle Button */}
                  <button 
                    className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer border ${activeAgent === 'oracle' ? 'bg-[#A0ECD6]/10 border-[#A0ECD6]/30 text-[#A0ECD6]' : 'bg-white/[0.02] border-white/[0.05] text-[#666666] hover:bg-white/[0.05]'}`}
                    onClick={() => {
                      setActiveAgent('oracle');
                      setOpenInfo(openInfo === "oracle" ? null : "oracle");
                    }}
                  >
                    <MoonStar size={16} className={activeAgent === 'oracle' ? "text-[#A0ECD6]" : "text-white/70 group-hover:text-white"} />
                    <span className="text-[10px] uppercase tracking-wider font-serif">ORACLE</span>
                    
                    {openInfo === "oracle" && (
                      <div 
                        className="absolute left-0 top-full mt-2 w-72 
                                   rounded-2xl border border-white/15 bg-black/70 p-4 
                                   text-white/80 shadow-xl backdrop-blur-md"
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <div className="text-xs tracking-widest text-[#A0ECD6]">MOON · INTUITIVE</div>
                        <div className="mt-2 text-sm leading-relaxed">
                          Taps into intuition, emotional intelligence, and hidden patterns.
                        </div>
                      </div>
                    )}
                  </button>
                  
                  {/* Alchemist Button */}
                  <button 
                    className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer border ${activeAgent === 'alchemist' ? 'bg-[#9D4EDD]/10 border-[#9D4EDD]/30 text-[#9D4EDD]' : 'bg-white/[0.02] border-white/[0.05] text-[#666666] hover:bg-white/[0.05]'}`}
                    onClick={() => {
                      setActiveAgent('alchemist');
                      setOpenInfo(openInfo === "alchemist" ? null : "alchemist");
                    }}
                  >
                    <FlaskConical size={16} className={activeAgent === 'alchemist' ? "text-[#9D4EDD]" : "text-white/70 group-hover:text-white"} />
                    <span className="text-[10px] uppercase tracking-wider font-serif">ALCHEMIST</span>
                    
                    {openInfo === "alchemist" && (
                      <div 
                        className="absolute left-0 top-full mt-2 w-72 
                                   rounded-2xl border border-white/15 bg-black/70 p-4 
                                   text-white/80 shadow-xl backdrop-blur-md"
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <div className="text-xs tracking-widest text-[#9D4EDD]">FIRE · ACTION</div>
                        <div className="mt-2 text-sm leading-relaxed">
                          Turns chaos into concrete protocols and transforms ideas into action.
                        </div>
                      </div>
                    )}
                  </button>
              </div>
            </header>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 [&::-webkit-scrollbar]:hidden scrollbar-hide">
            {messages.length === 0 ? (
              <div className="text-center text-white/50 text-sm py-20">
                Ask what you're facing right now...
              </div>
            ) : (
              <>
                {/* Render messages in a tree structure */}
                {(() => {
                  // Find root messages (no parent)
                  const rootMessages = messages.filter(msg => !msg.parentId);
                  
                  // Recursive render function
                  const renderMessage = (messageId: string, level = 0) => {
                    const message = messages.find(msg => msg.id === messageId);
                    if (!message) return null;
                    
                    // Format timestamp
                    const timestamp = new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    });
                    
                    return (
                      <div key={message.id} className="space-y-4">
                        <motion.div
                          id={`message-${message.id}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          style={{ marginLeft: level * 20 }}
                        >
                          <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                            {/* Role indicator */}
                            {message.role !== 'user' && (
                              <div className="flex items-center gap-2 mb-2 text-[10px] text-[#666666] uppercase tracking-wider font-serif">
                                {message.role === 'strategist' && <span className="text-[#D4AF37]">The Strategist</span>}
                                {message.role === 'oracle' && <span className="text-[#A0ECD6]">The Oracle</span>}
                                {message.role === 'alchemist' && <span className="text-[#9D4EDD]">The Alchemist</span>}
                                <span className="opacity-50">| {timestamp}</span>
                              </div>
                            )}

                            {/* Role-specific styles */}
                            <div className={`
                              ${message.role === 'strategist' ? 'border-amber-500/20 bg-black/35 font-mono tracking-wide' : ''}
                              ${message.role === 'oracle' ? 'border-blue-400/20 bg-black/25 font-serif italic leading-relaxed' : ''}
                              ${message.role === 'alchemist' ? 'border-fuchsia-400/20 bg-black/30 font-sans' : ''}
                              ${message.role === 'user' ? 'text-[#E0E0E0]' : 'text-[#CCCCCC]'}
                              text-base leading-[1.6] font-light p-5 rounded-lg relative overflow-hidden
                            `}>
                              {/* Role-specific background effects */}
                              {message.role === 'strategist' && (
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                              )}
                              {message.role === 'oracle' && (
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent pointer-events-none" />
                              )}
                              {message.role === 'alchemist' && (
                                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-400/5 to-transparent pointer-events-none" />
                              )}
                              {/* Try to parse as structured content */}
                              {(() => {
                                try {
                                  const structuredContent = JSON.parse(message.content);
                                  if (structuredContent.omen || structuredContent.interpretation) {
                                    return (
                                      <div className="space-y-3">
                                        {/* Omen */}
                                        {structuredContent.omen && (
                                          <div className={`
                                            text-sm italic text-amber-400/80 
                                            ${message.role === 'strategist' ? 'font-mono' : ''}
                                            ${message.role === 'oracle' ? 'font-serif italic' : ''}
                                            ${message.role === 'alchemist' ? 'font-sans' : ''}
                                          `}>
                                            "{structuredContent.omen}"
                                          </div>
                                        )}
                                        {/* Transit */}
                                        {structuredContent.transit && (
                                          <div className={`
                                            text-sm text-blue-400/60 
                                            ${message.role === 'strategist' ? 'font-mono' : ''}
                                            ${message.role === 'oracle' ? 'font-serif italic' : ''}
                                            ${message.role === 'alchemist' ? 'font-sans' : ''}
                                          `}>
                                            "{structuredContent.transit}"
                                          </div>
                                        )}
                                        {/* Interpretation */}
                                        {structuredContent.interpretation && (
                                          <div className={`
                                            ${message.role === 'strategist' ? 'font-mono text-sm tracking-wide' : ''}
                                            ${message.role === 'oracle' ? 'font-serif italic leading-relaxed text-gray-300' : ''}
                                            ${message.role === 'alchemist' ? 'font-sans' : ''}
                                          `}>
                                            {structuredContent.interpretation}
                                          </div>
                                        )}
                                        {/* Next actions */}
                                        {structuredContent.next && Array.isArray(structuredContent.next) && structuredContent.next.length > 0 && (
                                          <div className="mt-4 space-y-2">
                                            <div className={`
                                              ${message.role === 'strategist' ? 'text-xs uppercase tracking-wider text-amber-500/80' : ''}
                                              ${message.role === 'oracle' ? 'text-xs italic text-blue-400/80' : ''}
                                              ${message.role === 'alchemist' ? 'text-xs uppercase tracking-wider text-fuchsia-400/80' : ''}
                                            `}>
                                              {message.role === 'strategist' ? 'TACTICAL ACTIONS' : 
                                               message.role === 'oracle' ? 'INTUITIVE STEPS' : 
                                               'ALCHEMICAL HACKS'}
                                            </div>
                                            <div className={`
                                              ${message.role === 'strategist' ? 'space-y-1' : ''}
                                              ${message.role === 'oracle' ? 'space-y-1' : ''}
                                              ${message.role === 'alchemist' ? 'flex flex-wrap gap-2' : ''}
                                            `}>
                                              {structuredContent.next.map((action: string, index: number) => (
                                                <div key={index} className={`
                                                  ${message.role === 'strategist' ? 'text-sm font-mono tracking-wide' : ''}
                                                  ${message.role === 'oracle' ? 'text-sm font-serif italic text-gray-400' : ''}
                                                  ${message.role === 'alchemist' ? 'bg-fuchsia-900/20 text-fuchsia-300/90 px-3 py-1 rounded-full text-xs font-sans' : ''}
                                                `}>
                                                  {message.role === 'strategist' && (
                                                    <span className="text-amber-500/60 mr-2">{index + 1}.</span>
                                                  )}
                                                  {message.role === 'oracle' && (
                                                    <span className="text-blue-400/60 mr-2">•</span>
                                                  )}
                                                  {action}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                } catch (e) {
                                  // Fallback to plain text
                                }
                                // Plain text fallback
                                return (
                                  <p className={message.role === 'alchemist' ? 'whitespace-pre-wrap' : ''}>
                                    {message.content}
                                  </p>
                                );
                              })()}
                            </div>
                            
                            {/* Summon Council button for assistant messages */}
                            {message.role !== "user" && ( 
                              <button 
                                onClick={() => openCouncilModal(message.id)} 
                                className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-white" 
                              > 
                                SUMMON COUNCIL 
                              </button> 
                            )}
                          </div>
                        </motion.div>
                        
                        {/* Render children */}
                        {message.childrenIds.map(childId => renderMessage(childId, level + 1))}
                      </div>
                    );
                  };
                  
                  // Render root messages
                  return rootMessages.map(msg => renderMessage(msg.id));
                })()}
              </>
            )}
          </div>

          {/* Input Area - Floating Bar */}
          <div className="p-8 relative z-20">
            <div className="max-w-4xl mx-auto">
              {/* Council Unlocked Message */}
              {councilUnlocked && (
                <div className="text-center mb-4 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                  Council is awake. Choose who speaks next.
                </div>
              )}
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D4AF37]/20 via-[#A0ECD6]/20 to-[#9D4EDD]/20 rounded-full opacity-0 group-focus-within:opacity-100 transition duration-500 blur-md"></div>
                
                <div className="relative flex items-center bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-full p-2 shadow-2xl transition-all duration-300 group-focus-within:border-white/[0.15] group-focus-within:bg-[#151515]/90">
                    <input
                      type="text"
                      placeholder="Type your query..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1 bg-transparent border-none text-[#E0E0E0] placeholder-[#555555] px-6 py-3 focus:outline-none text-sm font-light tracking-wide"
                    />
                    
                    <button 
                      onClick={() => handleSend()}
                      className="p-3 bg-white/[0.05] hover:bg-white/[0.1] rounded-full text-[#E0E0E0] transition-colors mr-1"
                    >
                      <Send size={16} />
                    </button>
                </div>
              </div>
              
              <div className="flex justify-center mt-4 gap-4">
                  {/* Summon Council Button */}
                  {!councilUnlocked ? (
                      <button 
                        onClick={() => setCouncilUnlocked(true)}
                        disabled={!isSummonActive}
                        className={`text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${isSummonActive 
                          ? 'text-[#E0E0E0] hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]' 
                          : 'text-[#444444] cursor-not-allowed'}`}
                      >
                        Summon Council
                      </button>
                    ) : (
                      <div className="text-center text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                        Council is awake
                      </div>
                    )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: FateTree (25%) */}
        <div className="w-[25%] h-full flex flex-col border-l border-white/[0.05] bg-[#0A0A0A]/50 backdrop-blur-md">
          <FateTree />
        </div>
      </div>
      
      {/* Council Modal */}
      {isCouncilOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsCouncilOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-[#121212] border border-white/10 rounded-xl p-6 max-w-6xl w-full max-h-[80vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => setIsCouncilOpen(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white/80 hover:text-white"
              aria-label="Close"
            >
              <span className="text-xl">×</span>
            </button>
            
            {/* Modal Header */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-serif text-[#D4AF37] mb-2">COUNCIL DEBATE</h2>
              <p className="text-sm text-white/60">
                Three perspectives on your situation
              </p>
            </div>
            
            {/* Agent Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Strategist */}
              <div className="border border-amber-500/20 bg-black/35 p-5 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="text-amber-500" size={20} />
                  <h3 className="text-lg font-mono tracking-wide text-amber-500">STRATEGIST</h3>
                </div>
                <button
                  onClick={() => activateAgentInCouncil('strategist')}
                  disabled={councilLoading.strategist}
                  className={`
                    w-full mb-4 py-2 rounded-lg text-sm uppercase tracking-wider
                    ${councilLoading.strategist 
                      ? 'bg-amber-500/20 text-amber-500/60 cursor-not-allowed' 
                      : 'bg-amber-500/30 text-amber-500 hover:bg-amber-500/40'
                    }
                  `}
                >
                  {councilLoading.strategist ? 'ACTIVATING...' : 'ACTIVATE'}
                </button>
                <div className="text-sm text-white/80 font-mono">
                  {councilReplies.strategist ? (
                    <div className="whitespace-pre-wrap">
                      {typeof councilReplies.strategist === 'string' 
                        ? councilReplies.strategist 
                        : JSON.stringify(councilReplies.strategist, null, 2)
                      }
                    </div>
                  ) : (
                    <div className="text-white/40 italic">
                      Click ACTIVATE to summon the Strategist's insight
                    </div>
                  )}
                </div>
              </div>
              
              {/* Oracle */}
              <div className="border border-blue-400/20 bg-black/25 p-5 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <MoonStar className="text-blue-400" size={20} />
                  <h3 className="text-lg font-serif italic text-blue-400">ORACLE</h3>
                </div>
                <button
                  onClick={() => activateAgentInCouncil('oracle')}
                  disabled={councilLoading.oracle}
                  className={`
                    w-full mb-4 py-2 rounded-lg text-sm uppercase tracking-wider
                    ${councilLoading.oracle 
                      ? 'bg-blue-400/20 text-blue-400/60 cursor-not-allowed' 
                      : 'bg-blue-400/30 text-blue-400 hover:bg-blue-400/40'
                    }
                  `}
                >
                  {councilLoading.oracle ? 'ACTIVATING...' : 'ACTIVATE'}
                </button>
                <div className="text-sm text-white/80 font-serif italic leading-relaxed">
                  {councilReplies.oracle ? (
                    <div className="whitespace-pre-wrap">
                      {typeof councilReplies.oracle === 'string' 
                        ? councilReplies.oracle 
                        : JSON.stringify(councilReplies.oracle, null, 2)
                      }
                    </div>
                  ) : (
                    <div className="text-white/40 italic">
                      Click ACTIVATE to summon the Oracle's vision
                    </div>
                  )}
                </div>
              </div>
              
              {/* Alchemist */}
              <div className="border border-fuchsia-400/20 bg-black/30 p-5 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <FlaskConical className="text-fuchsia-400" size={20} />
                  <h3 className="text-lg font-sans text-fuchsia-400">ALCHEMIST</h3>
                </div>
                <button
                  onClick={() => activateAgentInCouncil('alchemist')}
                  disabled={councilLoading.alchemist}
                  className={`
                    w-full mb-4 py-2 rounded-lg text-sm uppercase tracking-wider
                    ${councilLoading.alchemist 
                      ? 'bg-fuchsia-400/20 text-fuchsia-400/60 cursor-not-allowed' 
                      : 'bg-fuchsia-400/30 text-fuchsia-400 hover:bg-fuchsia-400/40'
                    }
                  `}
                >
                  {councilLoading.alchemist ? 'ACTIVATING...' : 'ACTIVATE'}
                </button>
                <div className="text-sm text-white/80 font-sans">
                  {councilReplies.alchemist ? (
                    <div className="whitespace-pre-wrap">
                      {typeof councilReplies.alchemist === 'string' 
                        ? councilReplies.alchemist 
                        : JSON.stringify(councilReplies.alchemist, null, 2)
                      }
                    </div>
                  ) : (
                    <div className="text-white/40 italic">
                      Click ACTIVATE to summon the Alchemist's transformation
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}