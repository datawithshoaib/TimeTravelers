import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, AlertCircle, CheckCircle, HelpCircle, AlertTriangle, Flag, Sparkles } from 'lucide-react';
import type { ChatMessage, ClaimCitation, EvidenceStatus, OverallStatus } from '../types';

interface ChatPaneProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onSelectCitation: (cit: ClaimCitation) => void;
  activeCitationId: string | null;
  onOpenFeedback: (messageId: string, figureId?: string) => void;
  figureName: string;
}

export const ChatPane: React.FC<ChatPaneProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onSelectCitation,
  activeCitationId,
  onOpenFeedback,
  figureName,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const renderOverallStatusBadge = (status: OverallStatus) => {
    switch (status) {
      case 'grounded':
        return (
          <span className="badge-documented" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 600 }}>
            <CheckCircle style={{ width: '12px', height: '12px' }} />
            DOCUMENTED (Grounded)
          </span>
        );
      case 'mixed':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 600, background: 'rgba(56,189,248,0.12)', border: '1px solid #38bdf8', color: '#38bdf8' }}>
            <HelpCircle style={{ width: '12px', height: '12px' }} />
            MIXED (Documented + Interpretation)
          </span>
        );
      case 'speculative':
        return (
          <span className="badge-speculation" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 600 }}>
            <AlertTriangle style={{ width: '12px', height: '12px' }} />
            SPECULATIVE (Hypothetical)
          </span>
        );
      case 'insufficient_evidence':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 600, background: 'rgba(239,68,68,0.12)', border: '1px solid #ef4444', color: '#f87171' }}>
            <AlertCircle style={{ width: '12px', height: '12px' }} />
            INSUFFICIENT EVIDENCE
          </span>
        );
      default:
        return null;
    }
  };

  const getSegmentStyle = (status: EvidenceStatus): React.CSSProperties => {
    switch (status) {
      case 'documented':
        return {
          borderBottom: '2px solid rgba(16, 185, 129, 0.45)',
          paddingBottom: '2px',
        };
      case 'interpretation':
        return {
          borderBottom: '1px dashed rgba(99, 102, 241, 0.45)',
          paddingBottom: '2px',
        };
      case 'speculation':
        return {
          borderBottom: '1px dotted rgba(245, 158, 11, 0.55)',
          color: '#fde68a',
          paddingBottom: '2px',
        };
      case 'unresolved':
        return {
          borderBottom: '1px dashed rgba(168, 85, 247, 0.55)',
          paddingBottom: '2px',
        };
      default:
        return {};
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '600px' }}>
      
      {/* Messages Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px dashed var(--border-subtle)',
            color: 'var(--text-muted)'
          }}>
            <Sparkles style={{ width: '38px', height: '38px', color: 'var(--gold-accent)', margin: '0 auto 1rem', opacity: 0.8 }} />
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>
              Commence Historical Inquiry
            </h3>
            <p style={{ fontSize: '0.88rem', maxWidth: '480px', margin: '0 auto' }}>
              Select a starter prompt above or formulate your inquiry below. All responses are verified against authentic primary texts.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const answer = msg.answerPayload;

          if (isUser) {
            return (
              <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                <div style={{
                  maxWidth: '78%',
                  background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                  border: '1px solid #334155',
                  borderRadius: '16px 16px 2px 16px',
                  padding: '0.9rem 1.2rem',
                  color: '#f8fafc',
                  fontSize: '0.92rem',
                  lineHeight: 1.5,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}>
                  {msg.content}
                </div>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User style={{ width: '16px', height: '16px', color: '#94a3b8' }} />
                </div>
              </div>
            );
          }

          // Assistant Message
          let citationCounter = 1;
          const allCitationsInMessage: ClaimCitation[] = [];
          if (answer) {
            for (const seg of answer.segments) {
              for (const c of seg.citations) {
                if (!allCitationsInMessage.some(existing => existing.chunk_id === c.chunk_id)) {
                  allCitationsInMessage.push(c);
                }
              }
            }
          }

          return (
            <div key={msg.id} className="animate-fade-in" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #b8860b, #e5c158)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 0 12px rgba(229,193,88,0.35)'
              }}>
                <Bot style={{ width: '18px', height: '18px', color: '#090c15' }} />
              </div>

              <div style={{
                flex: 1,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px 18px 18px 18px',
                padding: '1.25rem',
                boxShadow: '0 6px 25px rgba(0,0,0,0.25)',
                position: 'relative'
              }}>
                {/* Header Status Line */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span className="font-serif" style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                      {figureName}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      [Simulated Persona]
                    </span>
                  </div>

                  {answer && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {renderOverallStatusBadge(answer.overall_status)}
                    </div>
                  )}
                </div>

                {/* Limitation Note Banner */}
                {answer?.limitation_note && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    marginBottom: '1rem',
                    fontSize: '0.8rem',
                    color: '#fef3c7'
                  }}>
                    <AlertTriangle style={{ width: '16px', height: '16px', color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#fbbf24' }}>Collection Limitation: </strong>
                      {answer.limitation_note}
                    </div>
                  </div>
                )}

                {/* Segmented Claims and Inline Citations */}
                <div style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#f1f5f9' }}>
                  {answer ? (
                    answer.segments.map((segment, segIdx) => (
                      <span key={segIdx} style={{ marginRight: '4px' }}>
                        <span style={getSegmentStyle(segment.evidence_status)}>
                          {segment.text}
                        </span>
                        
                        {/* Inline Citations */}
                        {segment.citations.map((cit) => {
                          const chipNum = citationCounter++;
                          const isActive = activeCitationId === cit.chunk_id;
                          return (
                            <button
                              key={cit.chunk_id}
                              onClick={() => onSelectCitation(cit)}
                              className={`citation-chip ${isActive ? 'active' : ''}`}
                              title={`Inspect evidence: ${cit.source_title} (${cit.page_or_section || 'Section'})`}
                            >
                              [{chipNum}]
                            </button>
                          );
                        })}
                        {' '}
                      </span>
                    ))
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>

                {/* Footer Controls & Citations Quick Bar */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1.2rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {allCitationsInMessage.length > 0 ? (
                      <>
                        <span style={{ color: 'var(--gold-accent)', fontWeight: 600 }}>CITED SOURCES:</span>
                        {allCitationsInMessage.map((c, i) => (
                          <button
                            key={c.chunk_id}
                            onClick={() => onSelectCitation(c)}
                            style={{
                              background: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '6px',
                              padding: '2px 8px',
                              color: 'var(--text-main)',
                              cursor: 'pointer',
                              fontSize: '0.72rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>[{i + 1}] {c.source_title?.slice(0, 28)}...</span>
                          </button>
                        ))}
                      </>
                    ) : (
                      <span>No primary citations available for this statement.</span>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenFeedback(msg.id, answer?.figure_id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-faint)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem'
                    }}
                    title="Report inaccuracy or broken citation"
                    onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
                  >
                    <Flag style={{ width: '12px', height: '12px' }} />
                    <span>Report Inaccuracy</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="animate-fade-in" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '1rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-gold)' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '2px solid var(--gold-accent)',
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite'
            }} />
            <span style={{ fontSize: '0.88rem', color: 'var(--gold-accent)' }}>
              Retrieving approved source passages and composing persona response...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        gap: '0.75rem',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-gold)',
        borderRadius: '16px',
        padding: '0.5rem 0.75rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        alignItems: 'center'
      }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Inquire of ${figureName}... (e.g. Ask for primary writings or historical views)`}
          disabled={isLoading}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '0.92rem',
            padding: '0.5rem 0.75rem',
            outline: 'none',
            fontFamily: 'var(--font-sans)'
          }}
        />

        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          style={{
            background: inputText.trim() && !isLoading ? 'linear-gradient(135deg, #e5c158, #b8860b)' : 'var(--border-subtle)',
            color: inputText.trim() && !isLoading ? '#090c15' : 'var(--text-faint)',
            border: 'none',
            borderRadius: '10px',
            padding: '0.65rem 1.1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: inputText.trim() && !isLoading ? 'pointer' : 'not-allowed',
            fontWeight: 600,
            fontSize: '0.88rem',
            transition: 'all 0.2s ease'
          }}
        >
          <span>Ask</span>
          <Send style={{ width: '15px', height: '15px' }} />
        </button>
      </form>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
