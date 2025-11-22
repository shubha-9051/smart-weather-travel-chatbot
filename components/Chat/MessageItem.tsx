import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot, Sparkles, Lightbulb, CloudRain, Shirt } from 'lucide-react';
import { Message } from '@/lib/types';
import WeatherCard from '../Widgets/WeatherCard';
import MapPreview from '../Widgets/MapPreview';
import PlaceCard from '../Widgets/PlaceCard';
import SummaryCard from '../Widgets/SummaryCard';
import { useChatStore } from '@/lib/store';
import clsx from 'clsx';

interface MessageItemProps {
    message: Message;
}

export default function MessageItem({ message, onSuggestionClick }: { message: Message, onSuggestionClick?: (text: string) => void }) {
    const isUser = message.role === 'user';
    const { language } = useChatStore();

    // UI Labels based on language
    const labels = language === 'ja' ? {
        you: 'あなた',
        assistant: '旅行アシスタント',
        overview: '概要',
        bestFeatures: 'おすすめポイント',
        insiderTips: 'インサイダーのヒント',
        weatherReasoning: '天気に基づく理由',
        whatToWear: '服装のアドバイス'
    } : {
        you: 'You',
        assistant: 'Travel Assistant',
        overview: 'Overview',
        bestFeatures: 'Best Features',
        insiderTips: 'Insider Tips',
        weatherReasoning: 'Why Perfect for Today\'s Weather',
        whatToWear: 'What to Wear'
    };

    return (
        <div className={clsx(
            "flex gap-4 p-4 md:p-6 max-w-3xl mx-auto",
            isUser ? "bg-transparent" : "bg-neutral-900/50"
        )}>
            <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                isUser ? "bg-neutral-700" : "bg-blue-600"
            )}>
                {isUser ? <User size={18} /> : <Bot size={18} />}
            </div>

            <div className="flex-1 overflow-hidden">
                <div className="font-semibold mb-1 text-sm text-neutral-300">
                    {isUser ? labels.you : labels.assistant}
                </div>

                <div className="prose prose-invert max-w-none text-neutral-200 leading-relaxed">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>

                {/* Recommendations List */}
                {message.recommendations && message.recommendations.length > 0 && (
                    <div className="mt-4 flex flex-col gap-6">
                        {message.recommendations.map((rec, idx) => (
                            <div key={idx} className="flex flex-col gap-3">
                                <PlaceCard query={`${rec.name} ${rec.location}`} />

                                {/* Expanded Info Section */}
                                <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700/50 space-y-4">
                                    <div>
                                        <div className="font-bold text-lg text-blue-400">{rec.name}</div>
                                        <div className="text-sm text-neutral-400">{rec.location}</div>
                                    </div>

                                    {/* Overview */}
                                    {rec.overview && (
                                        <div>
                                            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-300 mb-2">
                                                <Sparkles size={16} className="text-blue-400" />
                                                {labels.overview}
                                            </div>
                                            <p className="text-sm text-neutral-200 leading-relaxed">{rec.overview}</p>
                                        </div>
                                    )}

                                    {/* Best Features */}
                                    {rec.best_features && rec.best_features.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-300 mb-2">
                                                <Sparkles size={16} className="text-yellow-400" />
                                                {labels.bestFeatures}
                                            </div>
                                            <ul className="text-sm text-neutral-200 space-y-1 list-disc list-inside">
                                                {rec.best_features.map((feature: string, i: number) => (
                                                    <li key={i}>{feature}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Insider Tips */}
                                    {rec.insider_tips && rec.insider_tips.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-300 mb-2">
                                                <Lightbulb size={16} className="text-green-400" />
                                                {labels.insiderTips}
                                            </div>
                                            <ul className="text-sm text-neutral-200 space-y-1 list-disc list-inside">
                                                {rec.insider_tips.map((tip: string, i: number) => (
                                                    <li key={i}>{tip}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Weather Reasoning */}
                                    {rec.weather_reasoning && (
                                        <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-700/30">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-blue-300 mb-2">
                                                <CloudRain size={16} />
                                                {labels.weatherReasoning}
                                            </div>
                                            <p className="text-sm text-blue-100">{rec.weather_reasoning}</p>
                                        </div>
                                    )}

                                    {/* What to Wear */}
                                    {rec.what_to_wear && rec.what_to_wear.length > 0 && (
                                        <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-700/30">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-purple-300 mb-2">
                                                <Shirt size={16} />
                                                {labels.whatToWear}
                                            </div>
                                            <ul className="text-sm text-purple-100 space-y-1 list-disc list-inside">
                                                {rec.what_to_wear.map((item: string, i: number) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Widgets */}
                <div className="flex flex-wrap gap-4 mt-4">
                    {message.weather && <WeatherCard data={message.weather} />}
                    {message.location && <MapPreview location={message.location} />}
                </div>

                {/* Summary & Tips - MOVED TO BOTTOM */}
                {!isUser && (
                    <SummaryCard
                        summary={message.summary}
                        clothingTips={message.clothing_tips}
                        travelTips={message.travel_tips}
                    />
                )}

                {/* Follow-up Questions */}
                {message.follow_up_questions && message.follow_up_questions.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {message.follow_up_questions.map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSuggestionClick?.(q)}
                                className="text-sm bg-neutral-800 hover:bg-neutral-700 text-blue-400 px-3 py-2 rounded-full border border-neutral-700 transition-colors"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
