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
  const [messages, setMessages] = useState(MOCK_HISTORY);
  const [input, setInput] = useState('');
  const [activeAgent, setActiveAgent] = useState<'strategist' | 'oracle' | 'alchemist'>('strategist');
  const [isCouncilMode, setIsCouncilMode] = useState(false);
  const [isSummonActive, setIsSummonActive] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([
    { id: 1, label: 'The Spark', messageId: 1, type: 'strategist', active: false },
    { id: 2, label: 'Rational Analysis', messageId: 2, type: 'strategist', active: false },
    { id: 3, label: 'The Conflict', messageId: 3, type: 'council', active: false },
    { id: 4, label: 'Synthesis', messageId: 4, type: 'council', active: true },
  ]);
  const [activeTreeNode, setActiveTreeNode] = useState<number>(4);

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
          activeAgent: 'strategist' // Always use strategist as base
        })
      });

      const data = await response.json();
      
      // Generate timestamps for all responses
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
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
      
      // Update Destiny Tree with new turn label
      if (data.turnLabel) {
        // Find the latest strategist message to link with tree node
        const strategistMessageId = aiResponses.find(r => r.role === 'strategist')?.id || nextId;
        
        // Add new tree node
        const newTreeNode: TreeNode = {
          id: treeNodes.length + 1,
          label: data.turnLabel,
          messageId: strategistMessageId,
          type: responseType,
          active: true
        };
        
        // Update tree nodes - deactivate all others
        setTreeNodes(prev => [
          ...prev.map(node => ({ ...node, active: false })),
          newTreeNode
        ]);
        
        setActiveTreeNode(newTreeNode.id);
      }
    } catch (error) {
      console.error('Error calling council API:', error);
    }
  };

  // Handle node click - scroll to corresponding message
  const handleNodeClick = (nodeId: number) => {
    // Find the corresponding node
    const clickedNode = treeNodes.find(node => node.id === nodeId);
    if (!clickedNode) return;
    
    // Update active node state
    setTreeNodes(prev => prev.map(node => ({
      ...node,
      active: node.id === nodeId
    })));
    setActiveTreeNode(nodeId);
    
    // Scroll to the corresponding message
    const messageElement = document.getElementById(`message-${clickedNode.messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
              
              {/* Agent Avatars */}
              <div className="flex gap-6">
                {/* Strategist */}
                <div 
                  className={`flex flex-col items-center transition-all duration-300 cursor-pointer ${activeAgent === 'strategist' ? 'opacity-100 scale-110' : 'opacity-50 scale-95 hover:opacity-75'}`}
                  onClick={() => setActiveAgent('strategist')}
                >
                  <div className={`p-3 rounded-full mb-2 ${activeAgent === 'strategist' ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'bg-black/40 border border-[#333333]/80'}`}>
                    <Star size={20} className="text-[#D4AF37]" />
                  </div>
                  <div className="text-xs uppercase tracking-wider font-serif">
                    STRATEGIST
                  </div>
                </div>
                
                {/* Oracle */}
                <div 
                  className={`flex flex-col items-center transition-all duration-300 cursor-pointer ${activeAgent === 'oracle' ? 'opacity-100 scale-110' : 'opacity-50 scale-95 hover:opacity-75'}`}
                  onClick={() => setActiveAgent('oracle')}
                >
                  <div className={`p-3 rounded-full mb-2 ${activeAgent === 'oracle' ? 'bg-[#A0ECD6]/20 border border-[#A0ECD6]/50 shadow-[0_0_15px_rgba(160,236,214,0.3)]' : 'bg-black/40 border border-[#333333]/80'}`}>
                    <Moon size={20} className="text-[#A0ECD6]" />
                  </div>
                  <div className="text-xs uppercase tracking-wider font-serif">
                    ORACLE
                  </div>
                </div>
                
                {/* Alchemist */}
                <div 
                  className={`flex flex-col items-center transition-all duration-300 cursor-pointer ${activeAgent === 'alchemist' ? 'opacity-100 scale-110' : 'opacity-50 scale-95 hover:opacity-75'}`}
                  onClick={() => setActiveAgent('alchemist')}
                >
                  <div className={`p-3 rounded-full mb-2 ${activeAgent === 'alchemist' ? 'bg-[#9D4EDD]/20 border border-[#9D4EDD]/50 shadow-[0_0_15px_rgba(157,78,221,0.3)]' : 'bg-black/40 border border-[#333333]/80'}`}>
                    <Flame size={20} className="text-[#9D4EDD]" />
                  </div>
                  <div className="text-xs uppercase tracking-wider font-serif">
                    ALCHEMIST
                  </div>
                </div>
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
                <div className="px-3 py-1 rounded-full text-xs bg-[#D4AF37]/20 border border-[#D4AF37]/50">
                  {isSummonActive ? 'STRATEGIST REPLIED - SUMMON AVAILABLE' : 'STRATEGIST MODE'}
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
              
              {/* Dynamic Nodes from API responses */}
              <div className="space-y-8">
                {treeNodes.map((node) => (
                  <div 
                    key={node.id} 
                    className="flex items-start cursor-pointer"
                    onClick={() => handleNodeClick(node.id)}
                  >
                    {/* Node */}
                    <div className="relative z-10 flex items-center justify-center">
                      {/* Active node with ping animation */}
                      {node.active && (
                        <motion.div
                          className={`absolute inset-0 rounded-full ${node.type === 'strategist' ? 'bg-[#D4AF37]/30' : 'bg-white/20'}`}
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
                      {/* Node dot with type-specific styling */}
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 
                        ${node.active 
                          ? node.type === 'strategist' 
                            ? 'bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]' 
                            : 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                          : node.type === 'strategist' 
                            ? 'bg-[#D4AF37]/60 hover:bg-[#D4AF37]' 
                            : 'bg-white/60 hover:bg-white' 
                        }`}
                      ></div>
                    </div>
                    
                    {/* Label */}
                    <div className="ml-4 flex-1">
                      <div className={`text-sm transition-colors font-serif ${node.active ? 'text-white' : 'text-[#888888]'}`}>
                        {node.label}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Visual cue for future nodes */}
                <div className="flex items-start opacity-30">
                  <div className="relative z-10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#666666]"></div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-xs text-[#666666] italic">
                      More paths will appear as you continue...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}