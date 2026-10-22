import React from 'react';
import type { HistoricalFigure } from '../types';
import { Sparkles, Compass, Library, AlertTriangle, BookCheck } from 'lucide-react';

interface FigureBannerProps {
  figure: HistoricalFigure;
  onSelectPrompt: (prompt: string) => void;
  onOpenScopeModal: () => void;
}

export const FigureBanner: React.FC<FigureBannerProps> = ({
  figure,
  onSelectPrompt,
  onOpenScopeModal,
}) => {
  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(21, 29, 50, 0.95) 0%, rgba(16, 22, 38, 0.95) 100%)',
      borderRadius: '16px',
      border: '1px solid var(--border-gold)',
      padding: '1.5rem',
      marginBottom: '1.25rem',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background watermark */}
      <div style={{
        position: 'absolute',
        right: '-20px',
        bottom: '-20px',
        opacity: 0.05,
        pointerEvents: 'none'
      }}>
        <Library style={{ width: '220px', height: '220px', color: 'var(--gold-accent)' }} />
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Avatar */}
        {figure.avatar_url && (
          <div style={{ position: 'relative' }}>
            <img
              src={figure.avatar_url}
              alt={figure.display_name}
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--gold-accent)',
                boxShadow: '0 0 16px rgba(229, 193, 88, 0.3)'
              }}
            />
            <span style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: '#10b981',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              border: '2px solid var(--bg-surface)'
            }} title="Primary Archive Active" />
          </div>
        )}

        {/* Figure Info */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <h2 className="font-serif" style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>
              {figure.display_name}
            </h2>
            <span style={{
              fontSize: '0.85rem',
              color: 'var(--gold-accent)',
              fontFamily: 'var(--font-mono)',
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(229,193,88,0.12)',
              border: '1px solid rgba(229,193,88,0.3)'
            }}>
              {figure.birth_year ? `${figure.birth_year} – ${figure.death_year || 'CE'}` : 'Classical Antiquity'}
            </span>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '0.6rem', lineHeight: 1.5 }}>
            {figure.short_biography}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Compass style={{ width: '14px', height: '14px', color: 'var(--gold-accent)' }} />
              <span>{figure.region_or_context}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BookCheck style={{ width: '14px', height: '14px', color: '#34d399' }} />
              <span>Grounded in: {figure.collection_scope}</span>
            </div>
            <button
              onClick={onOpenScopeModal}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold-accent)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '0.78rem',
                textDecoration: 'underline'
              }}
            >
              <AlertTriangle style={{ width: '13px', height: '13px' }} />
              <span>View Known Gaps & Limitations</span>
            </button>
          </div>
        </div>
      </div>

      {/* Starter Prompts */}
      {figure.starter_prompts && figure.starter_prompts.length > 0 && (
        <div style={{ marginTop: '1.1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.78rem', color: 'var(--gold-accent)', fontWeight: 600 }}>
            <Sparkles style={{ width: '14px', height: '14px' }} />
            <span>PRIMARY INQUIRIES & STARTER PROMPTS</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {figure.starter_prompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => onSelectPrompt(prompt)}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '20px',
                  padding: '5px 12px',
                  color: '#e2e8f0',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold-accent)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-hover)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-surface)';
                }}
              >
                <span>"{prompt}"</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
