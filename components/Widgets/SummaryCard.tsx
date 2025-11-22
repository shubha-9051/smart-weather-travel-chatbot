import React from 'react';
import { Sparkles, Shirt, Lightbulb } from 'lucide-react';
import { useChatStore } from '@/lib/store';

interface SummaryCardProps {
    summary?: string;
    clothingTips?: string[];
    travelTips?: string[];
}

export default function SummaryCard({ summary, clothingTips, travelTips }: SummaryCardProps) {
    const { language } = useChatStore();

    const labels = language === 'ja' ? {
        tripSummary: '旅行の要約',
        whatToWear: '服装のアドバイス',
        travelTips: '旅行のヒント'
    } : {
        tripSummary: 'Trip Summary',
        whatToWear: 'What to Wear',
        travelTips: 'Travel Tips'
    };

    if (!summary && (!clothingTips || clothingTips.length === 0) && (!travelTips || travelTips.length === 0)) {
        return null;
    }

    return (
        <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl p-5 mt-4 border border-neutral-700 shadow-lg">
            {summary && (
                <div className="mb-4">
                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                        <Sparkles size={18} />
                        <h3 className="font-semibold">{labels.tripSummary}</h3>
                    </div>
                    <p className="text-neutral-300 text-sm leading-relaxed">{summary}</p>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                {clothingTips && clothingTips.length > 0 && (
                    <div className="bg-neutral-800/50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-400 mb-2">
                            <Shirt size={16} />
                            <h4 className="font-medium text-sm">{labels.whatToWear}</h4>
                        </div>
                        <ul className="text-xs text-neutral-400 space-y-1 list-disc list-inside">
                            {clothingTips.map((tip, idx) => (
                                <li key={idx}>{tip}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {travelTips && travelTips.length > 0 && (
                    <div className="bg-neutral-800/50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-green-400 mb-2">
                            <Lightbulb size={16} />
                            <h4 className="font-medium text-sm">{labels.travelTips}</h4>
                        </div>
                        <ul className="text-xs text-neutral-400 space-y-1 list-disc list-inside">
                            {travelTips.map((tip, idx) => (
                                <li key={idx}>{tip}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
