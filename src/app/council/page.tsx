'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Star, Moon, Flame } from 'lucide-react';

// Mock data
const MOCK_HISTORY = [
  {
    id: 1,
    role: 'user',
    content: "I want to quit my job and start a business, but I'm scared.",
    timestamp: '10:42 AM'
  },
  {
    id: 2,
    role: 'strategist', // The Sun
    content: "Analyzing your 2nd House (Assets): Saturn is currently retrograding. The financial risk is calculated at 85%. Logical conclusion: Retain current employment for 6 more months to accumulate capital.",
    timestamp: '10:42 AM'
  },
  {
    id: 3,
    role: 'oracle', // The Moon - Interjecting
    content: "I hear the lie in your logic. The fear isn't about money; it's about the suffocation of your soul. Waiting 6 months will only deepen the shadow. You crave the chaos.",
    timestamp: '10:43 AM'
  },
  {
    id: 4,
    role: 'alchemist', // The Rising - Synthesizing
    content: "Conflict Detected. Synthesizing solution... \n\nPROTOCOL ALPHA:\n1. Keep the day job (appease Strategist).\n2. Launch 'Night Venture' strictly between 8 PM - 12 AM (feed the Oracle).\n3. Re-evaluate in 30 days.",
    timestamp: '10:43 AM'
  }
];

const TREE_NODES = [
  { id: 1, label: 'The Spark', active: false },
  { id: 2, label: 'Rational Analysis', active: false },
  { id: 3, label: 'The Conflict', active: false },
  { id: 4, label: 'Synthesis (Current)', active: true },
];

// Main component
export default function ChronoCouncilPage() {
  const [messages, setMessages] = useState(MOCK_HISTORY);
  const [input, setInput] = useState('');

  // Handle message send
  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInput('');
  };

  // Handle node click
  const handleNodeClick = (nodeId: number) => {
    console.log('Node clicked:', nodeId);
    // Simulate time travel - in a real app, this would update the message history
  };

  return (
    <div className="h-screen w-full bg-[#050505] text-[#Eaeaea] font-sans overflow-hidden">
      <div className="flex h-full">
        {/* Left Panel: CouncilChamber (75%) */}
        <div className="w-[75%] h-full flex flex-col border-r border-[#333333]">
          {/* Header */}
          <header className="p-6 border-b border-[#333333]">
            <h1 className="text-center text-sm tracking-widest uppercase text-[#888888]">
              RITUAL IN PROGRESS
            </h1>
          </header>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {/* Role indicator */}
                  {message.role !== 'user' && (
                    <div className="flex items-center gap-2 mb-2 text-xs text-[#888888] uppercase tracking-wider">
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
                    className={`p-4 rounded-lg backdrop-blur-sm border 
                      ${message.role === 'user' 
                        ? 'bg-[#1a1a1a] border-[#333333]' 
                        : message.role === 'strategist'
                        ? 'bg-[#0a0a0a] border-[#D4AF37]' 
                        : message.role === 'oracle'
                        ? 'bg-[#0a0a0a]/80 border-[#A0ECD6] backdrop-blur-md' 
                        : 'bg-[#0a0a0a] border-[#9D4EDD] font-mono' 
                      }`}
                  >
                    <p className={message.role === 'alchemist' ? 'whitespace-pre-wrap' : ''}>
                      {message.content}
                    </p>
                    <div className="mt-2 text-xs text-[#666666]">
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-[#333333]">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Enter your query..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full p-4 bg-[#1a1a1a] border border-[#333333] rounded-lg focus:outline-none focus:border-[#D4AF37] placeholder-[#666666] text-[#Eaeaea]"
                />
              </div>
              <button 
                onClick={handleSend}
                className="px-6 py-4 bg-[#1a1a1a] border border-[#9D4EDD] rounded-lg hover:bg-[#9D4EDD]/20 transition-colors text-xs uppercase tracking-wider"
              >
                SUMMON COUNCIL
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: DestinyTree (25%) */}
        <div className="w-[25%] h-full flex flex-col">
          {/* Header */}
          <header className="p-6 border-b border-[#333333]">
            <h2 className="text-center text-sm tracking-widest uppercase text-[#888888]">
              DESTINY TREE
            </h2>
          </header>

          {/* Timeline */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-[#333333]"></div>
              
              {/* Nodes */}
              <div className="space-y-8">
                {TREE_NODES.map((node) => (
                  <div 
                    key={node.id} 
                    className="flex items-start cursor-pointer"
                    onClick={() => handleNodeClick(node.id)}
                  >
                    {/* Node */}
                    <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full 
                      ${node.active 
                        ? 'bg-[#D4AF37] ring-2 ring-[#D4AF37]/50 ring-offset-2 ring-offset-[#050505]' 
                        : 'bg-[#333333] hover:bg-[#444444]' 
                      } transition-all duration-300"
                    >
                      {node.active && (
                        <div className="absolute inset-0 rounded-full bg-[#D4AF37]/30 animate-ping"></div>
                      )}
                      <div className={`w-4 h-4 rounded-full ${node.active ? 'bg-[#D4AF37]' : 'bg-[#666666]'}`}></div>
                    </div>
                    
                    {/* Label */}
                    <div className="ml-4 flex-1">
                      <div className={`text-sm ${node.active ? 'text-[#D4AF37]' : 'text-[#888888]'} transition-colors`}>
                        {node.label}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Ghost Nodes (Visual cue for alternative paths) */}
                {[1, 2].map((i) => (
                  <div key={`ghost-${i}`} className="flex items-start opacity-50">
                    <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#333333]">
                      <div className="w-2 h-2 rounded-full bg-[#666666]"></div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-xs text-[#666666]">
                        Alternative Path {i}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}