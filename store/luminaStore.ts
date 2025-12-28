import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Node, Edge } from 'reactflow';

export type Phase = 'intro' | 'calibration' | 'observatory' | 'solo' | 'debate' | 'archive';

export type AgentRole = 'strategist' | 'oracle' | 'alchemist';

export interface Message {
  id: string;
  role: AgentRole | 'user';
  content: string;
  timestamp: number;
  isGlitch?: boolean;
}

export interface UserData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

export interface ArchiveItem {
  id: string;
  date: number;
  outcome: 'gold' | 'blue' | 'red';
  summary: string;
  nodes: Node[];
  edges: Edge[];
}

interface LuminaState {
  phase: Phase;
  userData: UserData;
  messages: Message[];
  nodes: Node[];
  edges: Edge[];
  voidEnergy: number;
  archives: ArchiveItem[];
  
  // Actions
  setPhase: (phase: Phase) => void;
  setUserData: (data: Partial<UserData>) => void;
  addMessage: (role: AgentRole | 'user', content: string) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  addVoidEnergy: (amount: number) => void;
  addNode: (node: Node) => void;
  addEdge: (edge: Edge) => void;
  saveSession: (outcome: 'gold' | 'blue' | 'red') => void;
  reset: () => void;
}

const initialUserData: UserData = {
  name: '',
  birthDate: '',
  birthTime: '',
  birthPlace: '',
};

export const useLuminaStore = create<LuminaState>()(
  persist(
    (set, get) => ({
      phase: 'intro',
      userData: initialUserData,
      messages: [],
      nodes: [],
      edges: [],
      voidEnergy: 0,
      archives: [],

      setPhase: (phase) => set({ phase }),
      
      setUserData: (data) => set((state) => ({ 
        userData: { ...state.userData, ...data } 
      })),
      
      addMessage: (role, content) => set((state) => ({
        messages: [
          ...state.messages,
          {
            id: Math.random().toString(36).substring(7),
            role,
            content,
            timestamp: Date.now(),
            isGlitch: false,
          },
        ],
      })),

      updateMessage: (id, updates) => set((state) => ({
        messages: state.messages.map((msg) => 
          msg.id === id ? { ...msg, ...updates } : msg
        ),
      })),

      deleteMessage: (id) => set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== id),
      })),

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
        voidEnergy: 0,
      }),
    }),
    {
      name: 'lumina-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ 
        userData: state.userData, 
        archives: state.archives,
        voidEnergy: state.voidEnergy 
      }), // Only persist these fields
    }
  )
);
