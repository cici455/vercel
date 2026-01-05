'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Star, Moon, Flame } from 'lucide-react';
import { Cinzel } from 'next/font/google';

// Google Font for headers
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cinzel',
});

// Intro state with agent introductions
const INTRO_STATE = [
  {
    id: 1,
    role: 'strategist',
    content: "I am your Rationality. I guard your assets and define your reality.",
    timestamp: '10:42 AM'
  },
  {
    id: 2,
    role: 'oracle',
    content: "I am your Intuition. I keep the secrets you are afraid to whisper.",
    timestamp: '10:43 AM'
  },
  {
    id: 3,
    role: 'alchemist',
    content: "I am your Action. I turn your chaos into concrete protocols.",
    timestamp: '10:44 AM'
  }
];

// Define types for tree nodes
interface TreeNode {
  id: number;
  label: string;
  messageId: number;
  type: 'strategist' | 'council';
  active: boolean;
}

// Main component
export default function ChronoCouncilPage() {
  const [messages, setMessages] = useState(INTRO_STATE);
  const [input, setInput] = useState('');
  const [activeAgent, setActiveAgent] = useState<'strategist' | 'oracle' | 'alchemist'>('strategist');
  const [isCouncilMode, setIsCouncilMode] = useState(false);
  const [isSummonActive, setIsSummonActive] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  const [activeTreeNode, setActiveTreeNode] = useState<number | null>(null);
  
  // Handle agent selection from header icons
  const handleAgentSelect = (agent: 'strategist' | 'oracle' | 'alchemist') => {
    setActiveAgent(agent);
    setIsCouncilMode(false);
  };

  // Handle message send
  const handleSend = async (mode: 'solo' | 'council' = 'solo') => {
    const messageContent = mode === 'council' ? lastUserMessage : input;
    
    if (!messageContent.trim()) return;
    
    let newMessage;
    let formattedHistory;
    
    // For solo mode, add user message to chat
    if (mode === 'solo') {
      newMessage = {
        id: messages.length + 1,
        role: 'user',
        content: messageContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      // Update UI with user message immediately
      setMessages([...messages, newMessage]);
      setInput('');
      setLastUserMessage(messageContent);
      
      formattedHistory = [...messages, newMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));
    } else {
      // For council mode, re-use existing history
      formattedHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
    }

    try {
      // Call council API with appropriate mode
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
          history: formattedHistory,
          mode,
          activeAgent: activeAgent // Use currently selected active agent
        })
      });

      const data = await response.json();
      
      // Generate timestamps for all responses
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Check if API returned an error or if responses are missing
      if (data.error || !data.responses) {
        // Add error message to chat
        const errorMessage = {
          id: messages.length + 1,
          role: 'strategist', // Use strategist role for error messages
          content: "The stars are silent right now... Please try again later.",
          timestamp
        };
        setMessages(prev => [...prev, errorMessage]);
        return; // Exit early, don't update DestinyTree
      }
      
      // Add AI responses to chat only for non-null responses
      const nextId = messages.length + 1;
      const aiResponses: typeof messages = [];
      let responseId = nextId;
      let responseType: 'strategist' | 'council' = 'strategist';
      
      if (data.responses.strategist !== null) {
        aiResponses.push({
          id: responseId++,
          role: 'strategist',
          content: data.responses.strategist,
          timestamp
        });
      }
      
      if (data.responses.oracle !== null || data.responses.alchemist !== null) {
        responseType = 'council';
      }
      
      if (data.responses.oracle !== null) {
        aiResponses.push({
          id: responseId++,
          role: 'oracle',
          content: data.responses.oracle,
          timestamp
        });
      }
      
      if (data.responses.alchemist !== null) {
        aiResponses.push({
          id: responseId++,
          role: 'alchemist',
          content: data.responses.alchemist,
          timestamp
        });
      }
      
      // Update chat with AI responses
      setMessages(prev => [...prev, ...aiResponses]);
      
      // Update summon button state
      if (mode === 'solo' && data.responses.strategist !== null) {
        // Activate summon button after strategist replies
        setIsSummonActive(true);
      } else if (mode === 'council') {
        // Deactivate summon button after council response
        setIsSummonActive(false);
      }
    } catch (error) {
      console.error('Error calling council API:', error);
      // Add error message to chat if the fetch itself failed
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const errorMessage = {
        id: messages.length + 1,
        role: 'strategist',
        content: "The stars are silent right now... Please try again later.",
        timestamp
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // No need for separate handleNodeClick function - navigation is handled directly in the destiny tree component

  return (
    <div className={`h-screen w-full bg-[#080808] text-[#E0E0E0] font-sans overflow-hidden ${cinzel.variable}`}>
      <div className="flex h-full">
        {/* Left Panel: CouncilChamber (75%) */}
        <div className="w-[75%] h-full flex flex-col relative z-10">
          {/* Header */}
          <header className="p-6 flex justify-between items-center backdrop-blur-[20px] bg-[#080808]/50 border-b border-white/[0.05]">
            <div className="flex flex-col items-start gap-1">
              <h1 className={`text-sm tracking-widest uppercase text-[#888888] font-serif`}>
                RITUAL IN PROGRESS
              </h1>
            </div>
            
            {/* Agent Icons (Clickable Buttons) */}
            <div className="flex gap-4">
                {/* Strategist Button */}
                <button 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer border ${activeAgent === 'strategist' ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]' : 'bg-white/[0.02] border-white/[0.05] text-[#666666] hover:bg-white/[0.05]'}`}
                  onClick={() => handleAgentSelect('strategist')}
                >
                  <Star size={14} className={activeAgent === 'strategist' ? "text-[#D4AF37]" : "text-[#666666]"} />
                  <span className="text-[10px] uppercase tracking-wider font-serif">STRATEGIST</span>
                </button>
                
                {/* Oracle Button */}
                <button 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer border ${activeAgent === 'oracle' ? 'bg-[#A0ECD6]/10 border-[#A0ECD6]/30 text-[#A0ECD6]' : 'bg-white/[0.02] border-white/[0.05] text-[#666666] hover:bg-white/[0.05]'}`}
                  onClick={() => handleAgentSelect('oracle')}
                >
                  <Moon size={14} className={activeAgent === 'oracle' ? "text-[#A0ECD6]" : "text-[#666666]"} />
                  <span className="text-[10px] uppercase tracking-wider font-serif">ORACLE</span>
                </button>
                
                {/* Alchemist Button */}
                <button 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer border ${activeAgent === 'alchemist' ? 'bg-[#9D4EDD]/10 border-[#9D4EDD]/30 text-[#9D4EDD]' : 'bg-white/[0.02] border-white/[0.05] text-[#666666] hover:bg-white/[0.05]'}`}
                  onClick={() => handleAgentSelect('alchemist')}
                >
                  <Flame size={14} className={activeAgent === 'alchemist' ? "text-[#9D4EDD]" : "text-[#666666]"} />
                  <span className="text-[10px] uppercase tracking-wider font-serif">ALCHEMIST</span>
                </button>
            </div>
          </header>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 [&::-webkit-scrollbar]:hidden scrollbar-hide">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                id={`message-${message.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {/* Role indicator */}
                  {message.role !== 'user' && (
                    <div className="flex items-center gap-2 mb-2 text-[10px] text-[#666666] uppercase tracking-wider font-serif">
                      {message.role === 'strategist' && <span className="text-[#D4AF37]">The Strategist</span>}
                      {message.role === 'oracle' && <span className="text-[#A0ECD6]">The Oracle</span>}
                      {message.role === 'alchemist' && <span className="text-[#9D4EDD]">The Alchemist</span>}
                      <span className="opacity-50">| {message.timestamp}</span>
                    </div>
                  )}

                  {/* Message content */}
                  <div 
                    className={`text-base leading-[1.6] font-light
                      ${message.role === 'user' 
                        ? 'text-[#E0E0E0]' 
                        : 'text-[#CCCCCC]' 
                      }`}
                  >
                    <p className={message.role === 'alchemist' ? 'whitespace-pre-wrap' : ''}>
                      {message.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area - Floating Bar */}
          <div className="p-8 relative z-20">
            <div className="max-w-4xl mx-auto">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D4AF37]/20 via-[#A0ECD6]/20 to-[#9D4EDD]/20 rounded-full opacity-0 group-focus-within:opacity-100 transition duration-500 blur-md"></div>
                
                <div className="relative flex items-center bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-full p-2 shadow-2xl transition-all duration-300 group-focus-within:border-white/[0.15] group-focus-within:bg-[#151515]/90">
                    <input
                      type="text"
                      placeholder="Type your query..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend('solo')}
                      className="flex-1 bg-transparent border-none text-[#E0E0E0] placeholder-[#555555] px-6 py-3 focus:outline-none text-sm font-light tracking-wide"
                    />
                    
                    <button 
                      onClick={() => handleSend('solo')}
                      className="p-3 bg-white/[0.05] hover:bg-white/[0.1] rounded-full text-[#E0E0E0] transition-colors mr-1"
                    >
                      <Send size={16} />
                    </button>
                </div>
              </div>
              
              <div className="flex justify-center mt-4 gap-4">
                  {/* Summon Council Button */}
                  <button 
                    onClick={() => handleSend('council')}
                    disabled={!isSummonActive}
                    className={`text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${isSummonActive 
                      ? 'text-[#E0E0E0] hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]' 
                      : 'text-[#444444] cursor-not-allowed'}`}
                  >
                    Summon Council
                  </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: DestinyTree (25%) */}
        <div className="w-[25%] h-full flex flex-col border-l border-white/[0.05] bg-[#0A0A0A]/50 backdrop-blur-md">
          {/* Header */}
          <header className="p-6 border-b border-white/[0.05]">
            <h2 className={`text-center text-[10px] tracking-[0.2em] uppercase text-[#666666] font-serif`}>
              Destiny Tree
            </h2>
          </header>

          {/* Timeline */}
          <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden scrollbar-hide">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/[0.1] via-white/[0.05] to-transparent"></div>
              
              {/* Dynamic Nodes from Messages */}
              <div className="space-y-8">
                {/* Iterate through messages to create tree nodes */}
                {messages.map((message, index) => {
                  // Skip user messages or show small dot
                  if (message.role === 'user') {
                    return (
                      <div key={`user-${message.id}`} className="flex items-start">
                        <div className="relative z-10 flex items-center justify-center">
                          <div className="w-[3px] h-[3px] rounded-full bg-[#444444]"></div>
                        </div>
                      </div>
                    );
                  }
                  
                  // For agent messages, show appropriate icon
                  return (
                    <div 
                      key={`agent-${message.id}`} 
                      className="flex items-start cursor-pointer group"
                      onClick={() => {
                        // Scroll to message
                        const messageElement = document.getElementById(`message-${message.id}`);
                        if (messageElement) {
                          messageElement.scrollIntoView({ behavior: 'smooth' });
                          setActiveTreeNode(message.id);
                        }
                      }}
                    >
                      {/* Node with icon based on role */}
                      <div className="relative z-10 flex items-center justify-center">
                        {/* Active node with ping animation */}
                        {activeTreeNode === message.id && (
                          <motion.div
                            className={`absolute inset-0 rounded-full ${message.role === 'strategist' ? 'bg-[#D4AF37]/30' : 
                                      message.role === 'oracle' ? 'bg-[#A0ECD6]/30' : 'bg-[#9D4EDD]/30'}`}
                            animate={{ 
                              scale: [1, 2.5, 1],
                              opacity: [0.5, 0, 0]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeOut"
                            }}
                          />
                        )}
                        
                        {/* Role-specific icon */}
                        <div className={`p-1.5 rounded-full border border-[#333333] bg-[#0A0A0A] ${activeTreeNode === message.id ? 'shadow-[0_0_10px_rgba(255,255,255,0.1)] border-white/20' : ''}`}>
                          {message.role === 'strategist' && (
                            <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                          )}
                          {message.role === 'oracle' && (
                            <div className="w-2 h-2 rounded-full bg-[#A0ECD6]"></div>
                          )}
                          {message.role === 'alchemist' && (
                            <div className="w-2 h-2 rounded-full bg-[#9D4EDD]"></div>
                          )}
                        </div>
                      </div>
                      
                      {/* Connection line for council clusters */}
                      {/* Check if this is part of a council cluster */}
                      {index < messages.length - 1 && 
                       messages[index + 1].role !== 'user' && 
                       messages[index + 1].role !== message.role && (
                        <div className="absolute left-[11px] top-4 bottom-12 w-[1px] bg-gradient-to-b from-white/10 to-transparent"></div>
                      )}
                    </div>
                  );
                })}
                
                {/* Empty state if no messages */}
                {messages.length === 0 && (
                  <div className="text-center text-[#888888] text-sm italic py-12">
                    The journey has just begun...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}