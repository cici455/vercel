"use client";

import React, { useState } from 'react';
import TarotSelector from '@/components/tarot/TarotSelector';
import { TopicId, TarotCard } from '@/components/tarot/TarotSelector';

interface CouncilPageProps {
  searchParams: {
    topics?: string;
    intent?: string;
    card?: string;
    agent?: string;
  };
}

export default function CouncilPage({ searchParams }: CouncilPageProps) {
  const [sessionData, setSessionData] = useState({
    selectedTopics: searchParams.topics?.split(',') || [],
    userIntent: searchParams.intent || '',
    drawnCard: null as TarotCard | null,
    selectedAgent: searchParams.agent || null
  });

  const handleEnterCouncil = (payload: {
    selectedTopics: TopicId[];
    intentText: string;
    tarot: TarotCard;
    selectedAgent?: string;
  }) => {
    setSessionData({
      selectedTopics: payload.selectedTopics,
      userIntent: payload.intentText,
      drawnCard: payload.tarot,
      selectedAgent: payload.selectedAgent || null
    });

    // For now, just log the data. In a real app, this would navigate to the chat interface.
    console.log('Session started:', payload);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <TarotSelector onNavigateToCouncil={handleEnterCouncil} />
    </div>
  );
}