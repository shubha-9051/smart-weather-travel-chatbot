import React, { useState } from 'react';
import { Send } from 'lucide-react';
import VoiceRecorder from '../Audio/VoiceRecorder';
import { useChatStore } from '@/lib/store';

interface InputAreaProps {
    onSendMessage: (text: string) => void;
    onSendAudio: (audio: Blob) => void;
    isLoading: boolean;
}

export default function InputArea({ onSendMessage, onSendAudio, isLoading }: InputAreaProps) {
    const [input, setInput] = useState("");
    const { language } = useChatStore();

    const placeholder = language === 'ja'
        ? '日本旅行について質問してください...'
        : 'Ask about travel in Japan...';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input);
            setInput("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="p-4 bg-neutral-900 border-t border-neutral-800">
            <div className="max-w-3xl mx-auto flex items-end gap-2">
                <VoiceRecorder
                    onRecordingComplete={onSendAudio}
                    isProcessing={isLoading}
                />

                <form onSubmit={handleSubmit} className="flex-1 relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="w-full bg-neutral-800 text-white rounded-xl p-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32 min-h-[48px]"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 bottom-2 p-1.5 text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
