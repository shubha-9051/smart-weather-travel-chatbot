"use client";

import React from 'react';
import ChatLayout from '@/components/Chat/ChatLayout';
import MessageList from '@/components/Chat/MessageList';
import InputArea from '@/components/Chat/InputArea';
import { useChatStore } from '@/lib/store';
import { Message, WeatherData } from '@/lib/types';

export default function Home() {
  const { messages, addMessage, isLoading, setLoading, language } = useChatStore();

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    addMessage(userMsg);
    setLoading(true);

    try {
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMsg).map(m => ({ role: m.role, content: m.content })),
          language: language
        }),
      });

      if (!chatRes.ok) throw new Error('Chat API failed');
      const chatData = await chatRes.json();

      let weatherData: WeatherData | undefined;

      if (chatData.location) {
        try {
          const weatherRes = await fetch(`/api/weather?location=${encodeURIComponent(chatData.location)}`);
          if (weatherRes.ok) {
            weatherData = await weatherRes.json();
          }
        } catch (e) {
          console.error("Weather fetch failed", e);
        }
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: chatData.response,
        recommendations: chatData.recommendations,
        location: chatData.location || undefined,
        weather: weatherData,
        summary: chatData.summary,
        clothing_tips: chatData.clothing_tips,
        travel_tips: chatData.travel_tips,
        follow_up_questions: chatData.follow_up_questions,
        timestamp: Date.now(),
      };

      addMessage(botMsg);
    } catch (error) {
      console.error(error);
      addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendAudio = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Transcription failed');
      const data = await res.json();

      if (data.text) {
        await handleSendMessage(data.text);
      }
    } catch (error) {
      console.error("Audio processing failed", error);
      setLoading(false);
    }
  };

  return (
    <ChatLayout>
      <MessageList
        messages={messages}
        isLoading={isLoading}
        onSuggestionClick={handleSendMessage}
      />
      <InputArea
        onSendMessage={handleSendMessage}
        onSendAudio={handleSendAudio}
        isLoading={isLoading}
      />
    </ChatLayout>
  );
}
