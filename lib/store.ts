import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatState, Message, ChatSession } from './types';

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            messages: [],
            isRecording: false,
            isLoading: false,
            language: 'en',
            sessions: [],
            currentSessionId: null,

            addMessage: (message) =>
                set((state) => {
                    const newMessages = [...state.messages, message];
                    const sessions = [...state.sessions];

                    if (state.currentSessionId) {
                        const sessionIndex = sessions.findIndex(s => s.id === state.currentSessionId);
                        if (sessionIndex !== -1) {
                            sessions[sessionIndex] = {
                                ...sessions[sessionIndex],
                                messages: newMessages,
                                updatedAt: Date.now(),
                                title: sessions[sessionIndex].title || (message.role === 'user' ? message.content.slice(0, 50) : sessions[sessionIndex].title)
                            };
                        }
                    } else {
                        const newSession: ChatSession = {
                            id: Date.now().toString(),
                            title: message.role === 'user' ? message.content.slice(0, 50) : 'New Chat',
                            messages: newMessages,
                            createdAt: Date.now(),
                            updatedAt: Date.now()
                        };
                        sessions.unshift(newSession);
                        return { messages: newMessages, sessions, currentSessionId: newSession.id };
                    }

                    return { messages: newMessages, sessions };
                }),

            setRecording: (isRecording) => set({ isRecording }),
            setLoading: (isLoading) => set({ isLoading }),
            setLanguage: (language) => set({ language }),

            createNewSession: () => set({ messages: [], currentSessionId: null }),

            loadSession: (sessionId) => {
                const session = get().sessions.find(s => s.id === sessionId);
                if (session) {
                    set({ messages: session.messages, currentSessionId: sessionId });
                }
            },

            deleteSession: (sessionId) =>
                set((state) => ({
                    sessions: state.sessions.filter(s => s.id !== sessionId),
                    ...(state.currentSessionId === sessionId ? { messages: [], currentSessionId: null } : {})
                })),

            clearMessages: () => set({ messages: [] })
        }),
        {
            name: 'travel-chat-storage',
            partialize: (state) => ({
                sessions: state.sessions,
                language: state.language
            })
        }
    )
);
