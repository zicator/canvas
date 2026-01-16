import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LAYOUT } from './utils/layoutConstants'

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content?: string;
  imageUrl?: string;
  imageUrls?: string[];
  timestamp: number;
  status?: 'generating' | 'success' | 'failed';
}

export interface GenerationSettings {
  aspectRatio: '1:1' | '16:9' | '4:3';
  resolution: '2k' | '4k';
  count: 1 | 4;
}

interface AppState {
  // UI State
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;

  // Agent State
  prompt: string;
  setPrompt: (text: string) => void;

  settings: GenerationSettings;
  setSettings: (settings: Partial<GenerationSettings>) => void;

  chatHistory: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;

  // Debug State
  isDebugDrawerOpen: boolean;
  setDebugDrawerOpen: (isOpen: boolean) => void;
  showSafeViewport: boolean;
  setShowSafeViewport: (show: boolean) => void;
  debugRowMaxWidth: number;
  setDebugRowMaxWidth: (width: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // UI State
      isSidebarOpen: false,
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      // Debug State
      isDebugDrawerOpen: false,
      setDebugDrawerOpen: (isOpen) => set({ isDebugDrawerOpen: isOpen }),
      showSafeViewport: false,
      setShowSafeViewport: (show) => set({ showSafeViewport: show }),
      debugRowMaxWidth: LAYOUT.ROW_MAX_WIDTH,
      setDebugRowMaxWidth: (width) => set({ debugRowMaxWidth: width }),

      // Agent State
      prompt: '',
      setPrompt: (text) => set({ prompt: text }),

      settings: {
        aspectRatio: '1:1',
        resolution: '2k',
        count: 1
      },
      setSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),

      chatHistory: [],
      addMessage: (msg) => set((state) => ({
        chatHistory: [...state.chatHistory, msg]
      })),
      updateMessage: (id, updates) => set((state) => ({
        chatHistory: state.chatHistory.map(msg =>
          msg.id === id ? { ...msg, ...updates } : msg
        )
      }))
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        showSafeViewport: state.showSafeViewport,
        debugRowMaxWidth: state.debugRowMaxWidth
      })
    }
  )
)
