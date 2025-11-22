import React from 'react';
import { useChatStore } from '@/lib/store';
import { Languages } from 'lucide-react';

export default function LanguageToggle() {
    const { language, setLanguage } = useChatStore();

    return (
        <div className="flex items-center gap-2 bg-neutral-800 rounded-lg p-2">
            <Languages size={16} className="text-neutral-400" />
            <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded text-sm transition-colors ${language === 'en'
                        ? 'bg-blue-600 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => setLanguage('ja')}
                className={`px-3 py-1 rounded text-sm transition-colors ${language === 'ja'
                        ? 'bg-blue-600 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
            >
                日本語
            </button>
        </div>
    );
}
