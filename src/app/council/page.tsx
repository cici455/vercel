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
    <div className={`h-screen w-full bg-[#050505] text-[#Eaeaea] font-sans overflow-hidden ${cinzel.variable}`} style={{ 
      backgroundImage: 'radial-gradient(circle at center, rgba(212,175,55,0.03) 0%, transparent 70%), radial-gradient(circle at 80% 20%, rgba(160,236,214,0.02) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(157,78,221,0.02) 0%, transparent 50%)',
      backgroundAttachment: 'fixed'
    }}>
      <div className="flex h-full">
        {/* Left Panel: CouncilChamber (75%) */}
        <div className="w-[75%] h-full flex flex-col border-r border-[#333333]/50">
          {/* Header */}
          <header className="p-6 border-b border-[#333333]/50">
            <div className="flex flex-col items-center gap-4">
              <h1 className={`text-center text-sm tracking-widest uppercase text-[#888888] font-serif`}>
                RITUAL IN PROGRESS
              </h1>
              
              {/* Agent Icons (Clickable Buttons) */}
              <div className="flex gap-6">
                {/* Strategist Button */}
                <button 
                  className={`flex flex-col items-center transition-all duration-300 cursor-pointer ${activeAgent === 'strategist' ? 'opacity-100 scale-110' : 'opacity-50 scale-95 hover:opacity-75'}`}
                  onClick={() => handleAgentSelect('strategist')}
                  aria-label="Select Strategist mode"
                >
                  <div className={`p-3 rounded-full mb-2 ${activeAgent === 'strategist' ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.5)]' : 'bg-black/40 border border-[#333333]/80'}`}>
                    <Star size={20} className="text-[#D4AF37]" />
                  </div>
                  <div className={`text-xs uppercase tracking-wider font-serif ${activeAgent === 'strategist' ? 'text-[#D4AF37]' : 'text-[#888888]'}`}>
                    STRATEGIST
                  </div>
                </button>
                
                {/* Oracle Button */}
                <button 
                  className={`flex flex-col items-center transition-all duration-300 cursor-pointer ${activeAgent === 'oracle' ? 'opacity-100 scale-110' : 'opacity-50 scale-95 hover:opacity-75'}`}
                  onClick={() => handleAgentSelect('oracle')}
                  aria-label="Select Oracle mode"
                >
                  <div className={`p-3 rounded-full mb-2 ${activeAgent === 'oracle' ? 'bg-[#A0ECD6]/20 border border-[#A0ECD6]/50 shadow-[0_0_15px_rgba(160,236,214,0.5)]' : 'bg-black/40 border border-[#333333]/80'}`}>
                    <Moon size={20} className="text-[#A0ECD6]" />
                  </div>
                  <div className={`text-xs uppercase tracking-wider font-serif ${activeAgent === 'oracle' ? 'text-[#A0ECD6]' : 'text-[#888888]'}`}>
                    ORACLE
                  </div>
                </button>
                
                {/* Alchemist Button */}
                <button 
                  className={`flex flex-col items-center transition-all duration-300 cursor-pointer ${activeAgent === 'alchemist' ? 'opacity-100 scale-110' : 'opacity-50 scale-95 hover:opacity-75'}`}
                  onClick={() => handleAgentSelect('alchemist')}
                  aria-label="Select Alchemist mode"
                >
                  <div className={`p-3 rounded-full mb-2 ${activeAgent === 'alchemist' ? 'bg-[#9D4EDD]/20 border border-[#9D4EDD]/50 shadow-[0_0_15px_rgba(157,78,221,0.5)]' : 'bg-black/40 border border-[#333333]/80'}`}>
                    <Flame size={20} className="text-[#9D4EDD]" />
                  </div>
                  <div className={`text-xs uppercase tracking-wider font-serif ${activeAgent === 'alchemist' ? 'text-[#9D4EDD]' : 'text-[#888888]'}`}>
                    ALCHEMIST
                  </div>
                </button>
              </div>
            </div>
          </header>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:hidden scrollbar-hide">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                id={`message-${message.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {/* Role indicator */}
                  {message.role !== 'user' && (
                    <div className="flex items-center gap-2 mb-2 text-xs text-[#888888] uppercase tracking-wider font-serif">
                      {message.role === 'strategist' && (
                        <>
                          <Star size={14} className="text-[#D4AF37]" />
                          <span>THE STRATEGIST</span>
                        </>
                      )}
                      {message.role === 'oracle' && (
                        <>
                          <Moon size={14} className="text-[#A0ECD6]" />
                          <span>THE ORACLE</span>
                        </>
                      )}
                      {message.role === 'alchemist' && (
                        <>
                          <Flame size={14} className="text-[#9D4EDD]" />
                          <span>THE ALCHEMIST</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Message content */}
                  <div 
                    className={`p-5 rounded-lg backdrop-blur-md border 
                      ${message.role === 'user' 
                        ? 'bg-black/40 border-[#333333]/80' 
                        : message.role === 'strategist'
                        ? 'bg-black/40 border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                        : message.role === 'oracle'
                        ? 'bg-black/30 border-[#A0ECD6]/50 backdrop-blur-lg shadow-[0_0_15px_rgba(160,236,214,0.3)]' 
                        : 'bg-black/40 border-[#9D4EDD]/50 font-mono shadow-[0_0_15px_rgba(157,78,221,0.3)]' 
                      }`}
                  >
                    <p className={message.role === 'alchemist' ? 'whitespace-pre-wrap' : ''}>
                      {message.content}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-xs text-[#666666]">
                        {message.timestamp}
                      </div>
                      {message.role !== 'user' && (message.role === 'oracle' || message.role === 'alchemist') && (
                        <button
                          onClick={() => {
                            setActiveAgent(message.role as 'oracle' | 'alchemist');
                            setIsCouncilMode(false);
                          }}
                          className="text-xs text-[#888888] hover:text-[#D4AF37] transition-colors flex items-center gap-1"
                        >
                          <span className="uppercase tracking-wider">Focus on this Path</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-[#333333]/50">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Enter your query..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend('solo')}
                    className="w-full p-4 bg-black/40 border border-[#333333]/80 backdrop-blur-sm rounded-lg focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.3)] placeholder-[#666666] text-[#Eaeaea]"
                  />
                </div>
                
                {/* Send Button (Solo Mode) */}
                <button 
                  onClick={() => handleSend('solo')}
                  className="px-6 py-4 bg-black/40 border border-[#D4AF37]/50 backdrop-blur-sm rounded-lg hover:bg-[#D4AF37]/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all text-xs uppercase tracking-wider font-serif"
                >
                  SEND
                </button>
                
                {/* Summon Council Button - Active only after Strategist replies */}
                <button 
                  onClick={() => handleSend('council')}
                  disabled={!isSummonActive}
                  className={`px-6 py-4 backdrop-blur-sm rounded-lg transition-all text-xs uppercase tracking-wider font-serif ${isSummonActive 
                    ? 'bg-[#9D4EDD]/20 border border-[#9D4EDD]/70 shadow-[0_0_15px_rgba(157,78,221,0.3)] hover:bg-[#9D4EDD]/30' 
                    : 'bg-black/20 border border-[#333333]/50 text-[#666666] cursor-not-allowed'}`}
                >
                  SUMMON COUNCIL
                </button>
              </div>
              
              {/* Mode Indicator */}
              <div className="flex items-center gap-2">
                <div className="text-xs text-[#888888] uppercase tracking-wider font-serif">
                  CURRENT MODE:
                </div>
                {/* Dynamic Mode Badge */}
                <div className={`px-3 py-1 rounded-full text-xs backdrop-blur-sm font-mono uppercase tracking-wider ${isCouncilMode 
                  ? 'bg-white/10 border border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                  : activeAgent === 'strategist' 
                    ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.3)]' 
                    : activeAgent === 'oracle' 
                    ? 'bg-[#A0ECD6]/20 border border-[#A0ECD6]/50 text-[#A0ECD6] shadow-[0_0_10px_rgba(160,236,214,0.3)]' 
                    : 'bg-[#9D4EDD]/20 border border-[#9D4EDD]/50 text-[#9D4EDD] shadow-[0_0_10px_rgba(157,78,221,0.3)]' 
                }`}>
                  {isCouncilMode 
                    ? 'COUNCIL SESSION' 
                    : activeAgent === 'strategist' 
                    ? 'STRATEGIST MODE' 
                    : activeAgent === 'oracle' 
                    ? 'ORACLE MODE' 
                    : 'ALCHEMIST MODE'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: DestinyTree (25%) */}
        <div className="w-[25%] h-full flex flex-col">
          {/* Header */}
          <header className="p-6 border-b border-[#333333]/50">
            <h2 className={`text-center text-sm tracking-widest uppercase text-[#888888] font-serif`}>
              DESTINY TREE
            </h2>
          </header>

          {/* Timeline */}
          <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden scrollbar-hide">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#D4AF37]/30 via-[#D4AF37]/10 to-transparent"></div>
              
              {/* Dynamic Nodes from Messages */}
              <div className="space-y-8">
                {/* Iterate through messages to create tree nodes */}
                {messages.map((message, index) => {
                  // Skip user messages or show small dot
                  if (message.role === 'user') {
                    return (
                      <div key={`user-${message.id}`} className="flex items-start">
                        <div className="relative z-10 flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-[#666666]/50"></div>
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
                        <div className={`p-1.5 rounded-full ${activeTreeNode === message.id ? 'shadow-[0_0_10px_rgba(255,255,255,0.5)]' : ''}`}>
                          {message.role === 'strategist' && (
                            <Star size={12} className="text-[#D4AF37]" />
                          )}
                          {message.role === 'oracle' && (
                            <Moon size={12} className="text-[#A0ECD6]" />
                          )}
                          {message.role === 'alchemist' && (
                            <Flame size={12} className="text-[#9D4EDD]" />
                          )}
                        </div>
                      </div>
                      
                      {/* Connection line for council clusters */}
                      {/* Check if this is part of a council cluster */}
                      {index < messages.length - 1 && 
                       messages[index + 1].role !== 'user' && 
                       messages[index + 1].role !== message.role && (
                        <div className="absolute left-1.5 top-4 bottom-12 w-0.5 bg-gradient-to-b from-white/30 to-white/10"></div>
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