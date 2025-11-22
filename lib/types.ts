export interface Recommendation {
    name: string;
    description: string;
    location: string;
    main_points?: string[];
    // Magazine-style sections
    overview?: string;
    best_features?: string[];
    insider_tips?: string[];
    weather_reasoning?: string;
    what_to_wear?: string[];
}

export interface WeatherData {
    temperature: number;
    condition: string;
    location: string;
    humidity?: number;
    windSpeed?: number;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    recommendations?: Recommendation[];
    weather?: WeatherData;
    location?: string;
    clothing_tips?: string[];
    travel_tips?: string[];
    summary?: string;
    follow_up_questions?: string[];
    timestamp: number;
}

export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
    updatedAt: number;
}

export interface ChatState {
    messages: Message[];
    isRecording: boolean;
    isLoading: boolean;
    language: 'en' | 'ja';
    sessions: ChatSession[];
    currentSessionId: string | null;
    addMessage: (message: Message) => void;
    setRecording: (isRecording: boolean) => void;
    setLoading: (isLoading: boolean) => void;
    setLanguage: (language: 'en' | 'ja') => void;
    createNewSession: () => void;
    loadSession: (sessionId: string) => void;
    deleteSession: (sessionId: string) => void;
    clearMessages: () => void;
}
