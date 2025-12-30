import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Briefcase,
  DollarSign,
  Target,
  Users,
  Home,
  Brain,
  Palette,
  Activity,
  BookOpen,
  MessageSquare,
  MapPin,
  Star,
  Lock,
  Flame,
  Shield,
  Scale,
  Key
} from 'lucide-react';

// --- Types ---
export type TopicId = 
  | "love"
  | "dating"
  | "commitment"
  | "breakups"
  | "sex"
  | "career"
  | "work-conflicts"
  | "money"
  | "purpose"
  | "family"
  | "friendships"
  | "self-worth"
  | "decisions"
  | "creativity"
  | "health"
  | "spiritual"
  | "communication"
  | "change";

export type AgentId = "strategist" | "oracle" | "alchemist";

export type Agent = {
  id: AgentId;
  name: string;
  title: string;
  color: string;
  icon: React.ReactNode;
};

export type TarotCard = {
  id: string;
  name: string;
  orientation: 'upright' | 'reversed';
  omen: string;
  meaning: string;
  practice: string;
};

export type Topic = {
  id: TopicId;
  label: string;
  icon: React.ReactNode;
};

interface TarotSelectorProps {
  onNavigateToCouncil?: (payload: {
    selectedTopics: TopicId[];
    intentText: string;
    tarot: TarotCard;
    selectedAgent?: AgentId;
  }) => void;
}

// --- Mock Data ---
const TOPICS: Topic[] = [
  { id: "love", label: "Love & Relationships", icon: <Heart size={16} /> },
  { id: "dating", label: "Dating & Attraction", icon: <Star size={16} /> },
  { id: "commitment", label: "Commitment / Marriage", icon: <Lock size={16} /> },
  { id: "breakups", label: "Breakups & Healing", icon: <Flame size={16} /> },
  { id: "sex", label: "Sex & Desire", icon: <Heart size={16} /> },
  { id: "career", label: "Career Direction", icon: <Briefcase size={16} /> },
  { id: "work-conflicts", label: "Work Conflicts", icon: <Scale size={16} /> },
  { id: "money", label: "Money & Resources", icon: <DollarSign size={16} /> },
  { id: "purpose", label: "Purpose / Calling", icon: <Target size={16} /> },
  { id: "family", label: "Family & Home", icon: <Home size={16} /> },
  { id: "friendships", label: "Friendships & Community", icon: <Users size={16} /> },
  { id: "self-worth", label: "Self-worth & Confidence", icon: <Shield size={16} /> },
  { id: "decisions", label: "Mental Clarity / Decisions", icon: <Brain size={16} /> },
  { id: "creativity", label: "Creativity", icon: <Palette size={16} /> },
  { id: "health", label: "Health / Energy", icon: <Activity size={16} /> },
  { id: "spiritual", label: "Spiritual Growth", icon: <BookOpen size={16} /> },
  { id: "communication", label: "Communication", icon: <MessageSquare size={16} /> },
  { id: "change", label: "Change / Travel", icon: <MapPin size={16} /> },
];

const CARD_TOPIC_HINTS: Record<string, TopicId[]> = {
  'The Lovers': ['love', 'dating', 'commitment', 'sex'],
  'The Empress': ['love', 'family', 'creativity', 'self-worth'],
  'The Emperor': ['career', 'money', 'decisions', 'work-conflicts'],
  'The Hierophant': ['spiritual', 'purpose', 'commitment', 'family'],
  'The Chariot': ['change', 'career', 'decisions', 'self-worth'],
  'Strength': ['self-worth', 'health', 'love', 'breakups'],
  'The Hermit': ['spiritual', 'purpose', 'decisions', 'self-worth'],
  'Wheel of Fortune': ['change', 'career', 'purpose', 'self-worth'],
  'Justice': ['work-conflicts', 'decisions', 'love', 'self-worth'],
  'The Hanged Man': ['spiritual', 'breakups', 'change', 'purpose'],
  'Death': ['change', 'breakups', 'spiritual', 'purpose'],
  'Temperance': ['health', 'love', 'self-worth', 'purpose'],
  'The Devil': ['sex', 'money', 'self-worth', 'love'],
  'The Tower': ['change', 'breakups', 'spiritual', 'purpose'],
  'The Star': ['spiritual', 'creativity', 'purpose', 'self-worth'],
  'The Moon': ['spiritual', 'love', 'self-worth', 'purpose'],
  'The Sun': ['health', 'creativity', 'self-worth', 'purpose'],
  'Judgement': ['spiritual', 'purpose', 'change', 'self-worth'],
  'The World': ['purpose', 'self-worth', 'change', 'creativity'],
  'The Fool': ['change', 'purpose', 'self-worth', 'creativity'],
  'The Magician': ['creativity', 'self-worth', 'career', 'communication'],
  'The High Priestess': ['spiritual', 'self-worth', 'love', 'creativity'],
};

const MOCK_TAROT_CARDS: TarotCard[] = [
  {
    id: 'the-lovers',
    name: 'The Lovers',
    orientation: 'upright',
    omen: 'Love and harmony are on the horizon.',
    meaning: 'The Lovers card represents love, harmony, and choices. It suggests a deep connection with another person or a significant decision that will affect your relationships.',
    practice: 'Reflect on what truly matters in your relationships and be open to new connections.'
  },
  {
    id: 'the-empress',
    name: 'The Empress',
    orientation: 'upright',
    omen: 'Abundance and creativity are flowing.',
    meaning: 'The Empress symbolizes fertility, creativity, and abundance. She represents the nurturing and creative aspects of femininity.',
    practice: 'Embrace your creative side and nurture the relationships and projects that matter to you.'
  },
  {
    id: 'the-emperor',
    name: 'The Emperor',
    orientation: 'upright',
    omen: 'Structure and authority are needed.',
    meaning: 'The Emperor represents leadership, structure, and authority. He symbolizes the masculine principle of control and organization.',
    practice: 'Take charge of your life and establish clear boundaries and goals.'
  }
];

// --- Agent Data ---
const AGENTS: Agent[] = [
  {
    id: 'strategist',
    name: 'Strategist',
    title: 'The Architect of Fate',
    color: '#D4AF37',
    icon: <Target size={16} />
  },
  {
    id: 'oracle',
    name: 'Oracle',
    title: 'The Seer of Stars',
    color: '#b8d7f5',
    icon: <Star size={16} />
  },
  {
    id: 'alchemist',
    name: 'Alchemist',
    title: 'The Transformer',
    color: '#f5b8d7',
    icon: <Flame size={16} />
  }
];

// --- Topic to Agent Mapping ---
const TOPIC_AGENT_MAP: Record<TopicId, AgentId[]> = {
  // Strategist topics
  career: ['strategist'],
  'work-conflicts': ['strategist'],
  money: ['strategist'],
  decisions: ['strategist'],
  change: ['strategist'],
  
  // Oracle topics
  purpose: ['oracle'],
  spiritual: ['oracle'],
  creativity: ['oracle'],
  health: ['oracle'],
  'self-worth': ['oracle'],
  
  // Alchemist topics
  love: ['alchemist'],
  dating: ['alchemist'],
  commitment: ['alchemist'],
  breakups: ['alchemist'],
  sex: ['alchemist'],
  family: ['alchemist'],
  friendships: ['alchemist'],
  communication: ['alchemist'],
};

const PLACEHOLDERS = [
  "What do I need to understand about my love life?",
  "How should I approach a career decision?",
  "Help me interpret what I'm feeling lately.",
  "What's the best path for my spiritual growth?",
  "How can I improve my relationships?",
  "What should I focus on for my health?"
];

// --- Main Component ---
export default function TarotSelector({ onNavigateToCouncil }: TarotSelectorProps) {
  const [selectedTopics, setSelectedTopics] = useState<TopicId[]>([]);
  const [intentText, setIntentText] = useState('');
  const [currentCard, setCurrentCard] = useState<TarotCard>(MOCK_TAROT_CARDS[0]);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState<AgentId | null>(null);

  // Rotate placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Get recommended topics for current card
  const recommendedTopics = useMemo(() => {
    return CARD_TOPIC_HINTS[currentCard.name] || [];
  }, [currentCard.name]);

  // Recommend agent based on selected topics
  const recommendedAgent = useMemo(() => {
    if (selectedTopics.length === 0) return null;

    // Count agent recommendations
    const agentCounts: Record<AgentId, number> = {
      strategist: 0,
      oracle: 0,
      alchemist: 0
    };

    // Count recommendations for each topic
    selectedTopics.forEach(topicId => {
      const agents = TOPIC_AGENT_MAP[topicId] || [];
      agents.forEach(agentId => {
        agentCounts[agentId]++;
      });
    });

    // Find the agent with the highest count
    let topAgent: AgentId | null = null;
    let maxCount = 0;

    Object.entries(agentCounts).forEach(([agentId, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topAgent = agentId as AgentId;
      }
    });

    return topAgent;
  }, [selectedTopics]);

  // Handle agent selection
  const handleAgentSelect = (agentId: AgentId) => {
    setSelectedAgent(agentId);
  };

  // Handle topic selection
  const toggleTopic = (topicId: TopicId) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  // Check if CTA is enabled
  const isCTAEnabled = useMemo(() => {
    return selectedTopics.length > 0 || intentText.trim().length > 0;
  }, [selectedTopics, intentText]);

  // Handle CTA click
  const handleCTAClick = () => {
    if (!isCTAEnabled) return;

    const payload = {
      selectedTopics,
      intentText: intentText.trim(),
      tarot: currentCard,
      selectedAgent: selectedAgent || undefined
    };

    if (onNavigateToCouncil) {
      onNavigateToCouncil(payload);
    } else {
      // Navigate to /council if no callback provided
      console.log('Navigating to council with payload:', payload);
      // window.location.href = `/council?topics=${selectedTopics.join(',')}&intent=${encodeURIComponent(intentText)}&card=${currentCard.id}&agent=${selectedAgent}`;
    }
  };

  // Draw a new card
  const drawNewCard = () => {
    const randomIndex = Math.floor(Math.random() * MOCK_TAROT_CARDS.length);
    setCurrentCard(MOCK_TAROT_CARDS[randomIndex]);
    // Reset selections when drawing new card
    setSelectedTopics([]);
    setIntentText('');
    setSelectedAgent(null);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Starfield Background */}
      <div className="fixed inset-0 z-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: 0,
              y: 0,
              opacity: 0.5,
              scale: 0.5
            }}
            animate={{
              x: typeof window !== 'undefined' ? i % window.innerWidth : 0,
              y: typeof window !== 'undefined' ? (i * 137.5) % window.innerHeight : 0,
              opacity: [0.3, 0.8],
              scale: [0.5, 1.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: i * 0.02
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-serif text-[#D4AF37] mb-2">
            LUMINA — Ritual Chamber
          </h1>
          <p className="text-sm text-gray-400 italic">
            Draw a card and select topics to begin your session
          </p>
        </motion.div>

        {/* Tarot Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-10"
        >
          <motion.div
            className="relative cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={drawNewCard}
          >
            {/* Card Background */}
            <div className="w-72 h-96 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-lg border-2 border-[#D4AF37]/30 shadow-[0_0_30px_rgba(212,175,55,0.15)] relative overflow-hidden">
              {/* Card Border Glow */}
              <div className="absolute inset-0 border-2 border-transparent rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#b8d7f5] opacity-50 blur-sm animate-pulse"></div>
              
              {/* Card Content */}
              <div className="relative p-6 flex flex-col items-center justify-between h-full">
                {/* Card Name */}
                <div className="text-center">
                  <h2 className="text-2xl font-serif text-[#D4AF37] mb-2">
                    {currentCard.name}
                  </h2>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">
                    {currentCard.orientation}
                  </p>
                </div>

                {/* Card Image Placeholder */}
                <div className="w-40 h-40 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                  <Key size={48} className="text-[#D4AF37]/50" />
                </div>

                {/* Card Omen */}
                <p className="text-center text-sm text-gray-300 italic mb-4">
                  &ldquo;{currentCard.omen}&rdquo;
                </p>

                {/* Draw New Card Indicator */}
                <div className="text-xs text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors">
                  Click to draw new card
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Topic Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-3xl mb-8"
        >
          <h3 className="text-center text-sm text-[#D4AF37]/80 uppercase tracking-widest mb-4">
            Select Topics to Discuss
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {TOPICS.map((topic) => {
              const isSelected = selectedTopics.includes(topic.id);
              const isRecommended = recommendedTopics.includes(topic.id);
              
              return (
                <motion.button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all duration-300 ${isSelected
                    ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                    : isRecommended
                    ? 'bg-white/5 border border-white/20 text-white/80 shadow-[0_0_10px_rgba(212,175,55,0.1)] hover:border-[#D4AF37]/30 hover:text-[#D4AF37]'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:border-white/30 hover:text-white/90'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {topic.icon}
                  <span className="font-serif">{topic.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Intent Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-2xl mb-8"
        >
          <h3 className="text-center text-sm text-[#D4AF37]/80 uppercase tracking-widest mb-4">
            Your Intention
          </h3>
          <div className="relative">
            <textarea
              value={intentText}
              onChange={(e) => setIntentText(e.target.value)}
              placeholder={PLACEHOLDERS[currentPlaceholder]}
              maxLength={200}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.2)] resize-none h-24 font-serif"
            />
            <div className="absolute bottom-2 right-3 text-xs text-white/40">
              {intentText.length}/200
            </div>
          </div>
          <p className="text-center text-xs text-white/40 mt-2">
            Write one sentence. The Council will guide the rest.
          </p>
        </motion.div>

        {/* Agent Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-2xl mb-8"
        >
          <h3 className="text-center text-sm text-[#D4AF37]/80 uppercase tracking-widest mb-4">
            Lead Agent
          </h3>
          <div className="flex justify-center gap-4">
            {AGENTS.map((agent) => {
              const isSelected = selectedAgent === agent.id;
              const isRecommended = recommendedAgent === agent.id;
              
              return (
                <motion.button
                  key={agent.id}
                  onClick={() => handleAgentSelect(agent.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all duration-300 w-32 ${isSelected
                    ? `border-2 border-${agent.color} bg-${agent.color}/10 shadow-[0_0_15px_rgba(212,175,55,0.3)]`
                    : isRecommended
                    ? `border-2 border-${agent.color}/50 bg-transparent hover:bg-${agent.color}/5 shadow-[0_0_10px_rgba(212,175,55,0.1)]`
                    : 'border-2 border-white/10 bg-transparent hover:bg-white/5'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSelected ? `bg-${agent.color}/20` : 'bg-white/10'}`}>
                    <div style={{ color: agent.color }}>
                      {agent.icon}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-serif" style={{ color: isSelected ? agent.color : 'white' }}>
                      {agent.name}
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      {agent.title}
                    </div>
                  </div>
                  {isRecommended && (
                    <div className="text-xs text-[#D4AF37] uppercase tracking-wider mt-1">
                      Recommended
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Primary CTA */}
        <motion.button
          onClick={handleCTAClick}
          disabled={!isCTAEnabled}
          className={`px-8 py-3 rounded-full text-sm uppercase tracking-widest font-serif transition-all duration-300 ${isCTAEnabled
            ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]'
            : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'}`}
          whileHover={isCTAEnabled ? { scale: 1.05 } : {}}
          whileTap={isCTAEnabled ? { scale: 0.98 } : {}}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Enter Council
        </motion.button>
      </div>
    </div>
  );
}
