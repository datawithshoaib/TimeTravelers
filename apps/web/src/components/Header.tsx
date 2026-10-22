import React from 'react';
import { Scroll, BookOpen, Share2, ShieldCheck, Activity } from 'lucide-react';
import type { FigureSummary } from '../types';

interface HeaderProps {
  figures: FigureSummary[];
  selectedFigureId: string;
  onSelectFigure: (id: string) => void;
  isBackendConnected: boolean;
  onOpenScopeModal: () => void;
  onOpenCatalogModal: () => void;
  onOpenExportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  figures,
  selectedFigureId,
  onSelectFigure,
  isBackendConnected,
  onOpenScopeModal,
  onOpenCatalogModal,
  onOpenExportModal,
}) => {
  return (
    <header className="glass-panel" style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: 0, zIndex: 40 }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #e5c158, #b8860b)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(229, 193, 88, 0.35)' 
          }}>
            <Scroll style={{ width: '24px', height: '24px', color: '#090c15' }} />
          </div>
          <div>
            <h1 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.04em', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              TimeTravelers
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(229,193,88,0.15)', color: 'var(--gold-accent)', border: '1px solid var(--border-gold)', fontWeight: 600 }}>
                GROUNDED v1.0
              </span>
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Primary-Source Authenticated Historical Conversations
            </p>
          </div>
        </div>

        {/* Figure Quick Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', padding: '4px 0' }}>
          {figures.map(fig => {
            const isSelected = fig.figure_id === selectedFigureId;
            return (
              <button
                key={fig.figure_id}
                onClick={() => onSelectFigure(fig.figure_id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '6px 14px',
                  borderRadius: '24px',
                  background: isSelected ? 'var(--bg-card)' : 'transparent',
                  border: isSelected ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                  color: isSelected ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? 600 : 400,
                  whiteSpace: 'nowrap'
                }}
              >
                {fig.avatar_url && (
                  <img
                    src={fig.avatar_url}
                    alt={fig.display_name}
                    style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                )}
                <span>{fig.display_name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Global Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Health indicator */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px', 
            fontSize: '0.75rem', 
            padding: '4px 10px', 
            borderRadius: '20px', 
            background: isBackendConnected ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
            color: isBackendConnected ? '#34d399' : '#fbbf24',
            border: `1px solid ${isBackendConnected ? '#10b981' : '#f59e0b'}` 
          }}>
            <Activity style={{ width: '13px', height: '13px' }} />
            <span>{isBackendConnected ? 'API Connected' : 'Demo Mode'}</span>
          </div>

          <button
            onClick={onOpenScopeModal}
            title="Inspect Source Scope & Known Gaps"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              fontSize: '0.82rem'
            }}
          >
            <ShieldCheck style={{ width: '15px', height: '15px', color: 'var(--gold-accent)' }} />
            <span>Scope & Limitations</span>
          </button>

          <button
            onClick={onOpenCatalogModal}
            title="Browse Source Catalog"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              fontSize: '0.82rem'
            }}
          >
            <BookOpen style={{ width: '15px', height: '15px', color: '#818cf8' }} />
            <span>Source Catalog</span>
          </button>

          <button
            onClick={onOpenExportModal}
            title="Export Citations (APA, BibTeX, Markdown)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              fontSize: '0.82rem'
            }}
          >
            <Share2 style={{ width: '15px', height: '15px', color: '#38bdf8' }} />
            <span>Export Citations</span>
          </button>
        </div>
      </div>
    </header>
  );
};
