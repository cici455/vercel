'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Target, MoonStar, FlaskConical, ArrowLeft } from 'lucide-react';
import { Cinzel } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useLuminaStore, type StructuredReply } from '@/store/luminaStore';
import { FateTree } from '@/components/visualization/FateTree';
import { getSuggestions } from '@/lib/suggestions';

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

// Type guard for StructuredReply
function isStructuredReply(v: any): v is StructuredReply {
  return !!v
    && typeof v === "object"
    && typeof v.omen === "string"
    && typeof v.transit === "string"
    && Array.isArray(v.decrees)
    && Array.isArray(v.why)
    && typeof v.angle === "string"
    && Array.isArray(v.move)
    && typeof v.script === "string"
    && typeof v.question === "string";
}

// Google Font for headers
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cinzel',
});

// Define Archetype type
type Archetype = "strategist" | "oracle" | "alchemist";

export function CouncilView() {
  const router = useRouter();
  const { 
    messages, 
    activeMessageId, 
    addMessage, 
    setActiveMessage,
    daily,
    domain,
    setDomain,
    addClip
  } = useLuminaStore();
  const [input, setInput] = useState('');
  const [activeAgent, setActiveAgent] = useState<'strategist' | 'oracle' | 'alchemist'>('strategist');
  const [isSummonActive, setIsSummonActive] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  const [openInfo, setOpenInfo] = useState<Archetype | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [councilUnlocked, setCouncilUnlocked] = useState(false);
  
  // Click outside to close info popover
  useEffect(() => {
    const onDown = () => setOpenInfo(null);
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  // Add clip from decree
  const addClipFromDecree = (messageId: string, agent: string, decree: any) => {
    const clip = {
      id: `clip-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      messageId,
      agent: agent as any,
      decreeId: decree.id,
      decreeType: decree.type,
      text: decree.text,
      createdAt: Date.now()
    };
    addClip(clip);
  };

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
          activeAgent: activeAgent, // Use currently selected active agent
          dayKey: daily?.dayKey
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
        let aiId;
        if (isStructuredReply(aiRaw)) {
          aiId = addMessage(activeAgent, aiText, userMessageId, aiRaw);
        } else {
          aiId = addMessage(activeAgent, aiText, userMessageId);
        }
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

  return (
    <div className={`h-screen w-full bg-transparent text-[#E0E0E0] font-sans overflow-hidden ${cinzel.variable}`}>
      {/* Watermark to confirm this is the active component */}
      <div className="fixed left-4 bottom-4 z-[9999] text-xs text-white/80 bg-black/40 px-2 py-1 rounded">
        COUNCIL_VIEW_ACTIVE
      </div>
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
                                  if (structuredContent.omen || structuredContent.core) {
                                    return (
                                      <div className="space-y-3">
                                        {/* Omen and Transit lines - small, mysterious */}
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
                                        
                                        {/* Core - title */}
                                        {structuredContent.core && (
                                          <h4 className={`
                                            text-lg font-bold text-white
                                            ${message.role === 'strategist' ? 'font-mono tracking-wide' : ''}
                                            ${message.role === 'oracle' ? 'font-serif italic' : ''}
                                            ${message.role === 'alchemist' ? 'font-sans' : ''}
                                          `}>
                                            {structuredContent.core}
                                          </h4>
                                        )}
                                        
                                        {/* Reading - body text */}
                                        {structuredContent.reading && (
                                          <p className={`
                                            text-sm leading-relaxed text-white/90
                                            ${message.role === 'strategist' ? 'font-mono tracking-wide' : ''}
                                            ${message.role === 'oracle' ? 'font-serif italic leading-relaxed' : ''}
                                            ${message.role === 'alchemist' ? 'font-sans' : ''}
                                          `}>
                                            {structuredContent.reading}
                                          </p>
                                        )}
                                        
                                        {/* Moves - list/chips */}
                                        {structuredContent.moves && Array.isArray(structuredContent.moves) && structuredContent.moves.length > 0 && (
                                          <div className="flex flex-wrap gap-2 mt-1">
                                            {structuredContent.moves.map((move: string, index: number) => (
                                              <span 
                                                key={index} 
                                                className="px-2 py-1 bg-starlight/20 text-starlight text-xs rounded-sm"
                                              >
                                                {move}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                        
                                        {/* Question - bottom line for continuing */}
                                        {structuredContent.question && (
                                          <p className={`
                                            text-sm text-starlight mt-2 italic
                                            ${message.role === 'strategist' ? 'font-mono tracking-wide' : ''}
                                            ${message.role === 'oracle' ? 'font-serif italic' : ''}
                                            ${message.role === 'alchemist' ? 'font-sans' : ''}
                                          `}>
                                            {structuredContent.question}
                                          </p>
                                        )}
                                      </div>
                                    );
                                  }
                                } catch (e) {
                                  // Fallback to plain text
                                }
                                
                                // Check if message has structured data
                                if (message.structured) {
                                  const s = message.structured;
                                  return (
                                    <div className="space-y-3">
                                      {/* omen / transit */}
                                      <div className="space-y-1">
                                        {!!s.omen && <div className="text-amber-300/90 italic">"{s.omen}"</div>}
                                        {!!s.transit && <div className="text-blue-200/70 italic">"{s.transit}"</div>}
                                      </div>

                                      {/* decrees: 三句断语（pierce/cost/direction） */}
                                      {!!s.decrees?.length && (
                                        <div className="space-y-2">
                                          {s.decrees.map((d) => (
                                            <div key={d.id} className="flex items-start gap-2">
                                              <span className="text-[10px] uppercase tracking-widest text-white/45 w-20">
                                                {d.type === "pierce" ? "PIERCE" : d.type === "cost" ? "COST" : "DIRECTION"}
                                              </span>
                                              <div className="text-white/90 leading-relaxed">
                                                {d.text}
                                              </div>
                                              <button 
                                                onClick={() => addClipFromDecree(message.id, message.role, d)} 
                                                className="text-white/50 hover:text-white"
                                              >
                                                ✂
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {/* why：可以小号显示两行翻译 */}
                                      {!!s.why?.length && (
                                        <div className="text-white/55 text-xs whitespace-pre-wrap">
                                          {s.why.join("\n")}
                                        </div>
                                      )}

                                      {/* angle：人话解释 */}
                                      {!!s.angle && (
                                        <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                                          {s.angle}
                                        </div>
                                      )}

                                      {/* move：3条行动（做成 chips） */}
                                      {!!s.move?.length && (
                                        <div className="flex flex-wrap gap-2">
                                          {s.move.map((m, i) => (
                                            <span 
                                              key={i} 
                                              className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[11px] text-white/80" 
                                            >
                                              {m}
                                            </span>
                                          ))}
                                        </div>
                                      )}

                                      {/* script：话术 */}
                                      {!!s.script && (
                                        <div className="text-white/70 text-sm italic">
                                          {s.script}
                                        </div>
                                      )}

                                      {/* question：推进问题 */}
                                      {!!s.question && (
                                        <div className="text-amber-200/90 text-sm italic">
                                          {s.question}
                                        </div>
                                      )}
                                    </div>
                                  );
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
                                onClick={() => {
                                  const councilId = addMessage('council', 'Council convened.', message.id);
                                  setActiveMessage(councilId);
                                }} 
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
              {/* Suggestion Chips */}
              <div className="mb-3 flex flex-wrap gap-2">
                {(() => {
                  const lastUser = [...messages].reverse().find(m => m.role === 'user');
                  const [s1, s2, s3] = getSuggestions(domain, lastUser?.content);
                  return [s1, s2, s3].map((t) => (
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
                  ));
                })()}
              </div>
              
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
                        onClick={() => {
                          const parent = activeMessageId || (messages.findLast?.(m => m.role !== 'user')?.id ?? null);
                          const councilId = addMessage('council', 'Council convened.', parent || undefined);
                          setActiveMessage(councilId);
                        }}
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

    </div>
  );
}