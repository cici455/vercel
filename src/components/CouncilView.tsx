'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, ArrowLeft } from 'lucide-react';
import { Cinzel } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useLuminaStore, type StructuredReply } from '@/store/luminaStore';
import { FateTree } from '@/components/visualization/FateTree';
import { CouncilDebateModal } from '@/components/CouncilDebateModal';

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

// More lenient guard for structured reply
function looksLikeStructuredReply(v: any) {
  return !!v
    && typeof v === "object"
    && Array.isArray(v.decrees);
}

// Google Font for headers
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cinzel',
});

export function CouncilView() {
  const router = useRouter();
  const { 
    messages, 
    activeMessageId, 
    branchFromMessageId,
    addMessage, 
    updateMessage,
    setActiveMessage,
    setBranchFromMessageId,
    daily,
    domain,
    setDomain,
    addClip
  } = useLuminaStore();
  const [input, setInput] = useState('');
  const [isSummonActive, setIsSummonActive] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [councilUnlocked, setCouncilUnlocked] = useState(false);
  const [chips, setChips] = useState<string[]>([]);
  const [debateOpen, setDebateOpen] = useState(false);
  const [seedMessageId, setSeedMessageId] = useState<string | null>(null);

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
      // Fallback to content
      return anchorMessage.content.slice(0, 200);
    }
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
  const submitMessage = async (text: string, parentId?: string) => {
    if (!text.trim()) return;

    // Use provided parentId if available, otherwise use branchFromMessageId ?? activeMessageId
    const parent = parentId ?? branchFromMessageId ?? activeMessageId;
    const userMessageId = addMessage("user", text, parent || undefined);
    setBranchFromMessageId(null);
    setLastUserMessage(text);

    // 2) Add assistant placeholder (this is the message that will appear in the tree)
    const aiId = addMessage("strategist", "…", userMessageId);
    setActiveMessage(aiId);

    // Build history for API
    const history = buildHistory(activeMessageId);

    try {
      // 3) Call council API with solo mode
      const response = await fetch('/api/council', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          astroData: {
            sunSign: 'Leo', // This would come from user's actual astro data
            moonSign: 'Virgo',
            risingSign: 'Libra'
          },
          history: history,
          mode: 'solo',
          activeAgent: "strategist", // Fixed to strategist for unified council
          dayKey: daily?.dayKey
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        updateMessage(aiId, { content: `Request failed: ${errText}` });
        return;
      }

      const data = await response.json();

      if (!data?.responses) {
        updateMessage(aiId, { content: `No responses returned` });
        return;
      }

      // Check if API returned an error
      if (data.error) {
        updateMessage(aiId, { content: `Error: ${data.error}` });
        return; // Exit early
      }

      // 4) Store structured data (key part)
      const payload = data?.responses?.["strategist"];

      if (looksLikeStructuredReply(payload)) {
        // content is just fallback text for older UI
        const direction = payload.decrees?.find((d: any) => d.type === "direction")?.text;
        const textFallback = [direction, payload.angle, payload.script, payload.question]
          .filter(Boolean)
          .join("\n");

        updateMessage(aiId, { content: textFallback || "OK", structured: payload });

        // Update chips from suggestions
        setChips(Array.isArray(payload.suggestions) ? payload.suggestions.slice(0,3) : []);
      } else {
        // payload is string or format is incorrect
        updateMessage(aiId, { content: typeof payload === "string" ? payload : "No response" });
      }

      // Activate summon button after AI replies
      setIsSummonActive(true);
    } catch (error) {
      console.error('Error calling council API:', error);
      // Add error message to chat if the fetch itself failed
      addMessage('strategist', "The stars are silent right now... Please try again later.", userMessageId);
    }
    setInput('');
  };

  const handleSend = () => {
    submitMessage(input);
    setInput('');
  };

  return (
    <div className={`h-screen w-full bg-transparent text-[#E0E0E0] font-sans overflow-hidden ${cinzel.variable}`}>
      <div className="flex h-full">
        {/* Left Panel: CouncilChamber (75%) */}
        <div className="w-[75%] h-full flex flex-col border-r border-white/[0.05] bg-[#0A0A0A]/50 backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-serif text-white/90 tracking-wide">Council Chamber</h1>
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest">
              {messages.length} Messages
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((message, index) => {
              const level = getDepth(message.id);
              
              return (
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
                      <div className="flex items-center gap-2 mb-2 text-[10px] text-[#D4AF37] uppercase tracking-wider font-serif">
                        THE AXIS
                        <span className="opacity-50">| {new Date(message.timestamp).toLocaleTimeString()}</span>
                      </div>
                    )}

                    {/* Role-specific styles */}
                    <div className={`
                      ${message.role !== 'user' ? 'border-amber-500/20 bg-black/35 font-mono tracking-wide' : ''}
                      ${message.role === 'user' ? 'text-[#E0E0E0]' : 'text-[#CCCCCC]'}
                      text-base leading-[1.6] font-light p-5 rounded-lg relative overflow-hidden
                    `}>
                      {/* Role-specific background effects */}
                      {message.role !== 'user' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                      )}
                      {/* Message content with structured data support */}
                      {message.role !== "user" && message.structured ? (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            {!!message.structured.omen && <div className="text-amber-300/90 italic">"{message.structured.omen}"</div>}
                            {!!message.structured.transit && <div className="text-blue-200/70 italic">"{message.structured.transit}"</div>}
                          </div>

                          {!!message.structured.angle && (
                            <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{message.structured.angle}</div>
                          )}

                          {!!message.structured.decrees?.length && (
                            <div className="space-y-2">
                              {message.structured.decrees.map((d) => (
                                <div key={d.id} className="flex items-start gap-2">
                                  <div className="text-white/90 leading-relaxed">{d.text}</div>
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

                          {!!message.structured.question && <div className="text-amber-200/90 text-sm italic">{message.structured.question}</div>}

                          {/* Branches / Options */}
                          {message.structured.branches?.length && (
                            <div className="mt-6">
                              <div className="text-xs text-white/40 mb-2">DESTINY BRANCHES</div>
                              {message.structured.branches.map((b, i) => (
                                <button
                                  key={b.label}
                                  className="block w-full text-left rounded-lg border border-white/10 bg-black/30 px-4 py-3 mb-2 hover:bg-white/10 transition"
                                  onClick={() => {
                                    const parent = branchFromMessageId ?? activeMessageId;
                                    submitMessage(b.label, parent);
                                  }}
                                >
                                  <div className="font-bold text-white/90">{String.fromCharCode(65 + i)}. {b.label}</div>
                                  <div className="text-white/60 text-xs">{b.description}</div>
                                  <div className="inline-block mt-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400/30 to-amber-200/10 text-amber-300 text-[11px] font-bold tracking-wide uppercase">
                                    {b.variable}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className={message.role === 'alchemist' ? 'whitespace-pre-wrap' : ''}>
                          {message.content}
                        </p>
                      )}
                    </div>
                    
                    {/* Summon Council button for assistant messages */}
                    {message.role !== "user" && (
                      <button
                        onClick={() => {
                          // Use current activeMessageId as seed, fallback to last non-user message
                          const lastNonUser = [...messages].reverse().find(m => m.role !== "user");
                          const seed = activeMessageId ?? lastNonUser?.id ?? null;
                          setSeedMessageId(seed);
                          setDebateOpen(true);
                        }}
                        className={`mt-3 px-4 py-2 rounded-lg text-xs uppercase tracking-widest transition-all ${
                          isSummonActive
                            ? 'bg-gradient-to-r from-amber-500/20 to-fuchsia-500/20 border-amber-500/30 text-white/90'
                            : 'bg-white/[0.02] border-white/[0.05] text-white/50 hover:bg-white/[0.05]'
                        }`}
                      >
                        SUMMON COUNCIL
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="border-t border-white/[0.05] p-6">
            {/* Input field */}
            <div className="relative mt-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    handleSend();
                  }
                }}
                placeholder="Ask to Council..."
                className="w-full bg-white/[0.02] border border-white/[0.05] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/[0.1] transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-2 top-1/2 p-2 text-white/50 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: FateTree (25%) */}
        <div className="w-[25%] h-full flex flex-col border-l border-white/[0.05] bg-[#0A0A0A]/50 backdrop-blur-md">
          <FateTree />
        </div>
      </div>

      {/* Council Debate Modal */}
      {seedMessageId && (
        <CouncilDebateModal
          open={debateOpen}
          onClose={() => setDebateOpen(false)}
          seedMessageId={seedMessageId}
        />
      )}
    </div>
  );
}

// Helper function to calculate message depth for indentation
function getDepth(messageId: string, messages: any[] = []): number {
  const map = new Map(messages.map(m => [m.id, m]));
  let depth = 0;
  let current = map.get(messageId);
  while (current?.parentId) {
    depth++;
    current = map.get(current.parentId);
  }
  return depth;
}
