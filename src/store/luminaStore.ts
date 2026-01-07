import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Node, Edge } from 'reactflow';

export type Phase = 'intro' | 'calibration' | 'observatory' | 'solo' | 'debate' | 'archive';

export type AgentRole = 'strategist' | 'oracle' | 'alchemist';

export type StructuredReply = {
  omen: string;
  transit: string;
  core: string;
  reading: string;
  moves: string[];
  question: string;
};

export interface Message {
  id: string;
  role: AgentRole | 'user';
  content: string;
  structured?: StructuredReply;
  timestamp: number;
  parentId?: string;
  childrenIds: string[];
  isGlitch?: boolean;
}

export interface UserData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  sunSign?: string;
  moonSign?: string;
  risingSign?: string;
}

export interface ArchiveItem {
  id: string;
  date: number;
  outcome: 'gold' | 'blue' | 'red';
  summary: string;
  nodes: Node[];
  edges: Edge[];
}

export interface DailyLines {
  dayKey: string;
  astroProfile: string;
  lines: Record<AgentRole, { omen: string; transit: string }>;
}

interface LuminaState {
  phase: Phase;
  userData: UserData;
  messages: Message[];
  nodes: Node[];
  edges: Edge[];
  activeMessageId: string | null;
  voidEnergy: number;
  archives: ArchiveItem[];
  daily: DailyLines | null;
  credits: number;
  domain: "career" | "love" | "money" | "self" | "random";
  
  // Actions
  setPhase: (phase: Phase) => void;
  setUserData: (data: Partial<UserData>) => void;

  addMessage: (role: AgentRole | 'user', content: string, parentId?: string, structured?: StructuredReply) => string;

  updateMessage: (id: string, updates: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  setActiveMessage: (id: string | null) => void;
  addVoidEnergy: (amount: number) => void;
  addNode: (node: Node) => void;
  addEdge: (edge: Edge) => void;
  saveSession: (outcome: 'gold' | 'blue' | 'red') => void;
  reset: () => void;
  setDaily: (daily: DailyLines | null) => void;
  spendCredits: (n: number) => boolean;
  addCredits: (n: number) => void;
  setDomain: (d: "career" | "love" | "money" | "self" | "random") => void;
}

const initialUserData: UserData = {
  name: '',
  birthDate: '',
  birthTime: '',
  birthPlace: '',
  sunSign: undefined,
  moonSign: undefined,
  risingSign: undefined,
};

export const useLuminaStore = create<LuminaState>()(
  persist(
    (set, get) => ({
      phase: 'intro',
      userData: initialUserData,
      messages: [],
      nodes: [],
      edges: [],
      activeMessageId: null,
      voidEnergy: 0,
      archives: [],
      daily: null,
      credits: 100,
      domain: "random",

      setPhase: (phase) => set({ phase }),
      
      setUserData: (data) => set((state) => ({ 
        userData: { ...state.userData, ...data } 
      })),
      
      addMessage: (role, content, parentId, structured) => {
        const id = `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const newMessage: Message = {
          id,
          role,
          content,
          structured,
          timestamp: Date.now(),
          parentId,
          childrenIds: [],
          isGlitch: false,
        };
        
        set((state) => {
          const updatedMessages = [...state.messages, newMessage];
          
          // Update parent's childrenIds if parentId is provided
          if (parentId) {
            const parentIndex = updatedMessages.findIndex(msg => msg.id === parentId);
            if (parentIndex !== -1) {
              updatedMessages[parentIndex] = {
                ...updatedMessages[parentIndex],
                childrenIds: [...updatedMessages[parentIndex].childrenIds, id]
              };
            }
          }
          
          return { messages: updatedMessages };
        });
        
        return id;
      },

      updateMessage: (id, updates) => set((state) => ({
        messages: state.messages.map((msg) => 
          msg.id === id ? { ...msg, ...updates } : msg
        ),
      })),

      deleteMessage: (id) => set((state) => {
        // Recursively delete all children
        const deleteRecursive = (messageId: string): string[] => {
          const message = state.messages.find(msg => msg.id === messageId);
          if (!message) return [];
          
          const childrenToDelete = message.childrenIds.flatMap(childId => deleteRecursive(childId));
          return [messageId, ...childrenToDelete];
        };
        
        const idsToDelete = deleteRecursive(id);
        
        // Remove messages
        const filteredMessages = state.messages.filter(msg => !idsToDelete.includes(msg.id));
        
        // Remove references from parents
        const updatedMessages = filteredMessages.map(msg => ({
          ...msg,
          childrenIds: msg.childrenIds.filter(childId => !idsToDelete.includes(childId))
        }));
        
        return { messages: updatedMessages };
      }),

      setActiveMessage: (id) => set({ activeMessageId: id }),

      addVoidEnergy: (amount) => set((state) => ({
        voidEnergy: state.voidEnergy + amount,
      })),

      addNode: (node) => set((state) => ({
        nodes: [...state.nodes, node],
      })),

      addEdge: (edge) => set((state) => ({
        edges: [...state.edges, edge],
      })),

      saveSession: (outcome) => {
        const { nodes, edges, messages } = get();
        // Generate a simple summary based on message count or last message
        const summary = messages.length > 0 
          ? messages[messages.length - 1].content.substring(0, 50) + "..." 
          : "No session data";

        const newArchive: ArchiveItem = {
          id: Math.random().toString(36).substring(7),
          date: Date.now(),
          outcome,
          summary,
          nodes,
          edges,
        };

        set((state) => ({
          archives: [...state.archives, newArchive],
          // Optionally reset session data after save, but let's keep it for now
          // or we can navigate to archive page
        }));
      },

      reset: () => set({
        phase: 'intro',
        userData: initialUserData,
        messages: [],
        nodes: [],
        edges: [],
        activeMessageId: null,
        voidEnergy: 0,
        daily: null,
      }),
      
      setDaily: (daily) => set({ daily }),
      
      spendCredits: (n) => {
        const cur = get().credits;
        if (cur < n) return false;
        set({ credits: cur - n });
        return true;
      },
      
      addCredits: (n) => set((state) => ({ credits: state.credits + n })),
      setDomain: (d) => set({ domain: d }),
    }),
    {
      name: 'lumina-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ 
        userData: state.userData, 
        archives: state.archives,
        voidEnergy: state.voidEnergy,
        credits: state.credits,
        domain: state.domain
      }), // Only persist these fields
    }
  )
);
