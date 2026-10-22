import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FigureBanner } from './components/FigureBanner';
import { ChatPane } from './components/ChatPane';
import { SourceInspector } from './components/SourceInspector';
import { ScopeModal } from './components/ScopeModal';
import { SourceCatalogModal } from './components/SourceCatalogModal';
import { CitationExportModal } from './components/CitationExportModal';
import { FeedbackModal } from './components/FeedbackModal';

import type {
  FigureSummary,
  HistoricalFigure,
  HistoricalSource,
  ChatMessage,
  ClaimCitation
} from './types';

import {
  getFigures,
  getFigureDetail,
  getFigureSources,
  sendChatMessage,
  checkApiHealth
} from './services/api';

export const App: React.FC = () => {
  const [figures, setFigures] = useState<FigureSummary[]>([]);
  const [selectedFigureId, setSelectedFigureId] = useState<string>('ada_lovelace');
  const [activeFigure, setActiveFigure] = useState<HistoricalFigure | null>(null);
  const [sources, setSources] = useState<HistoricalSource[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeCitation, setActiveCitation] = useState<ClaimCitation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Modals state
  const [isScopeOpen, setIsScopeOpen] = useState<boolean>(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [feedbackParams, setFeedbackParams] = useState<{ messageId?: string; sourceId?: string; chunkId?: string }>({});

  // Mobile layout tab switcher
  const [mobileTab, setMobileTab] = useState<'chat' | 'sources'>('chat');

  // Initial load
  useEffect(() => {
    const initApp = async () => {
      const isHealthy = await checkApiHealth();
      setIsBackendConnected(isHealthy);

      const figuresList = await getFigures();
      setFigures(figuresList);

      if (figuresList.length > 0) {
        const initialId = figuresList[0].figure_id;
        setSelectedFigureId(initialId);
      }
    };
    initApp();
  }, []);

  // When selected figure changes, load profile, sources, and reset/initialize chat
  useEffect(() => {
    const loadFigureContext = async () => {
      if (!selectedFigureId) return;

      try {
        const detail = await getFigureDetail(selectedFigureId);
        setActiveFigure(detail);

        const srcList = await getFigureSources(selectedFigureId);
        setSources(srcList);

        // Reset chat history with an authentic welcome message grounded in primary profile
        setMessages([
          {
            id: `msg_welcome_${selectedFigureId}`,
            role: 'assistant',
            content: `Greetings. I am a simulated conversation partner representing ${detail.display_name}. My responses are strictly constrained to my verified surviving writings, letters, and memoirs (${detail.collection_scope}). Please formulate your historical inquiry.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setActiveCitation(null);
      } catch (err) {
        console.error('Failed to load figure context:', err);
      }
    };

    loadFigureContext();
  }, [selectedFigureId]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const answer = await sendChatMessage(selectedFigureId, text);
      const assistantMessage: ChatMessage = {
        id: answer.message_id,
        role: 'assistant',
        content: answer.segments.map(s => s.text).join(' '),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        answerPayload: answer
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Automatically select the first primary citation in the response for convenience
      for (const seg of answer.segments) {
        if (seg.citations && seg.citations.length > 0) {
          setActiveCitation(seg.citations[0]);
          break;
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleSelectCitation = (cit: ClaimCitation) => {
    setActiveCitation(cit);
    setMobileTab('sources'); // On mobile switch to the source inspector
  };

  const handleOpenFeedback = (messageId?: string, _figureId?: string, sourceId?: string, chunkId?: string) => {
    setFeedbackParams({ messageId, sourceId, chunkId });
    setIsFeedbackOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Global Header */}
      <Header
        figures={figures}
        selectedFigureId={selectedFigureId}
        onSelectFigure={setSelectedFigureId}
        isBackendConnected={isBackendConnected}
        onOpenScopeModal={() => setIsScopeOpen(true)}
        onOpenCatalogModal={() => setIsCatalogOpen(true)}
        onOpenExportModal={() => setIsExportOpen(true)}
      />

      {/* Main Container */}
      <main className="app-container" style={{ flex: 1, padding: '1.5rem 1.5rem 2rem' }}>
        
        {/* Figure Profile & Starter Prompts Banner */}
        {activeFigure && (
          <FigureBanner
            figure={activeFigure}
            onSelectPrompt={handleSelectPrompt}
            onOpenScopeModal={() => setIsScopeOpen(true)}
          />
        )}

        {/* Mobile Tab Switcher */}
        <div style={{ display: 'none', marginBottom: '1rem', gap: '0.5rem' }} className="mobile-tab-bar">
          <button
            onClick={() => setMobileTab('chat')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              background: mobileTab === 'chat' ? 'var(--gold-accent)' : 'var(--bg-card)',
              color: mobileTab === 'chat' ? '#090c15' : 'var(--text-muted)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Dialogue
          </button>
          <button
            onClick={() => setMobileTab('sources')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              background: mobileTab === 'sources' ? 'var(--gold-accent)' : 'var(--bg-card)',
              color: mobileTab === 'sources' ? '#090c15' : 'var(--text-muted)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Source Inspector ({activeCitation ? '1 Active' : '0'})
          </button>
        </div>

        {/* Split View: Chat Pane (Left) + Source Inspector (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(360px, 1fr)',
          gap: '1.5rem',
          flex: 1,
          alignItems: 'stretch'
        }} className="split-view-grid">
          
          {/* Chat Pane */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <ChatPane
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onSelectCitation={handleSelectCitation}
              activeCitationId={activeCitation?.chunk_id || null}
              onOpenFeedback={(msgId, figId) => handleOpenFeedback(msgId, figId)}
              figureName={activeFigure?.display_name || 'Historical Figure'}
            />
          </div>

          {/* Sticky Source Inspector */}
          <div style={{ position: 'sticky', top: '5rem', height: 'fit-content' }}>
            <SourceInspector
              activeCitation={activeCitation}
              sources={sources}
              onOpenFeedback={(srcId, chunkId) => handleOpenFeedback(undefined, selectedFigureId, srcId, chunkId)}
              onOpenCatalog={() => setIsCatalogOpen(true)}
            />
          </div>

        </div>
      </main>

      {/* Modals */}
      <ScopeModal
        figure={activeFigure}
        isOpen={isScopeOpen}
        onClose={() => setIsScopeOpen(false)}
      />

      <SourceCatalogModal
        sources={sources}
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        figureName={activeFigure?.display_name || 'Historical Figure'}
      />

      <CitationExportModal
        messages={messages}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        figureName={activeFigure?.display_name || 'Historical Figure'}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        messageId={feedbackParams.messageId}
        sourceId={feedbackParams.sourceId}
        chunkId={feedbackParams.chunkId}
        figureId={selectedFigureId}
      />

      <style>{`
        @media (max-width: 1024px) {
          .split-view-grid {
            grid-template-columns: 1fr !important;
          }
          .mobile-tab-bar {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
