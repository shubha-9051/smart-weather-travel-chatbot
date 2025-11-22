import React from 'react';
import { MessageSquarePlus, History, Settings, Trash2 } from 'lucide-react';
import LanguageToggle from '../UI/LanguageToggle';
import { useChatStore } from '@/lib/store';

export default function Sidebar() {
    const { language, sessions, currentSessionId, createNewSession, loadSession, deleteSession } = useChatStore();

    const labels = language === 'ja' ? {
        newChat: '新しいチャット',
        recent: '最近',
        settings: '設定',
        noHistory: '履歴なし'
    } : {
        newChat: 'New Chat',
        recent: 'Recent',
        settings: 'Settings',
        noHistory: 'No history yet'
    };

    const handleNewChat = () => {
        createNewSession();
    };

    const handleLoadSession = (sessionId: string) => {
        loadSession(sessionId);
    };

    const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        deleteSession(sessionId);
    };

    return (
        <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col hidden md:flex">
            <div className="p-4">
                <button
                    onClick={handleNewChat}
                    className="w-full flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white p-3 rounded-lg transition-colors"
                >
                    <MessageSquarePlus size={20} />
                    <span>{labels.newChat}</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2">
                <div className="text-xs font-semibold text-neutral-500 px-2 py-2">{labels.recent}</div>
                {sessions.length === 0 ? (
                    <div className="text-xs text-neutral-600 px-2 py-4 text-center">
                        {labels.noHistory}
                    </div>
                ) : (
                    sessions.map((session) => (
                        <div
                            key={session.id}
                            onClick={() => handleLoadSession(session.id)}
                            className={`group flex items-center gap-2 p-2 text-sm rounded cursor-pointer transition-colors ${currentSessionId === session.id
                                    ? 'bg-neutral-800 text-white'
                                    : 'text-neutral-300 hover:bg-neutral-800'
                                }`}
                        >
                            <History size={16} className="flex-shrink-0" />
                            <span className="truncate flex-1">{session.title}</span>
                            <button
                                onClick={(e) => handleDeleteSession(e, session.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-neutral-700 rounded transition-opacity"
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t border-neutral-800 space-y-3">
                <LanguageToggle />
                <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                    <Settings size={20} />
                    <span>{labels.settings}</span>
                </button>
            </div>
        </aside>
    );
}
