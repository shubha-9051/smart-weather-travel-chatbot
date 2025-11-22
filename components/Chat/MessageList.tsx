import React, { useEffect, useRef } from 'react';
import { Message } from '@/lib/types';
import MessageItem from './MessageItem';
import { useChatStore } from '@/lib/store';

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
    onSuggestionClick: (text: string) => void;
}

export default function MessageList({ messages, isLoading, onSuggestionClick }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const { language } = useChatStore();

    const labels = language === 'ja' ? {
        title: '日本旅行アシスタント',
        description: '日本の旅行先、天気、食べ物について質問してください。テキスト入力または音声入力（日本語対応）が使えます。'
    } : {
        title: 'Japan Travel Assistant',
        description: 'Ask me about travel destinations, weather, or food in Japan. You can type or use voice input (Japanese supported).'
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 p-4 text-center">
                    <div className="bg-neutral-800 p-4 rounded-full mb-4">
                        <span className="text-4xl">🇯🇵</span>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">{labels.title}</h2>
                    <p className="max-w-md">
                        {labels.description}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col py-4">
                    {messages.map((msg) => (
                        <MessageItem key={msg.id} message={msg} onSuggestionClick={onSuggestionClick} />
                    ))}
                    {isLoading && (
                        <div className="flex gap-4 p-4 md:p-6 max-w-3xl mx-auto w-full">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            )}
        </div>
    );
}
