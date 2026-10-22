import React from 'react';
import { X, ShieldAlert, BookOpen, Mic, AlertCircle } from 'lucide-react';
import type { HistoricalFigure } from '../types';

interface ScopeModalProps {
  figure: HistoricalFigure | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ScopeModal: React.FC<ScopeModalProps> = ({ figure, isOpen, onClose }) => {
  if (!isOpen || !figure) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '85vh',
          overflowY: 'auto',
          borderRadius: '18px',
          padding: '1.75rem',
          border: '1px solid var(--border-gold)',
          background: 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShieldAlert style={{ width: '22px', height: '22px', color: 'var(--gold-accent)' }} />
            <h3 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>
              Collection Scope & Limitations
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
          
          {/* Approved Scope */}
          <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem' }}>
              <BookOpen style={{ width: '16px', height: '16px' }} />
              <span>APPROVED SOURCE COLLECTION</span>
            </div>
            <p style={{ color: '#cbd5e1', lineHeight: 1.5 }}>
              {figure.collection_scope}
            </p>
          </div>

          {/* Known Gaps & Anachronisms */}
          <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 600, marginBottom: '0.45rem', fontSize: '0.85rem' }}>
              <AlertCircle style={{ width: '16px', height: '16px' }} />
              <span>DOCUMENTED GAPS & HISTORICAL BOUNDS</span>
            </div>
            <ul style={{ paddingLeft: '1.25rem', color: '#fef3c7', lineHeight: 1.6 }}>
              {figure.known_gaps.map((gap, i) => (
                <li key={i}>{gap}</li>
              ))}
            </ul>
          </div>

          {/* Rhetorical Voice Traits */}
          <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontWeight: 600, marginBottom: '0.45rem', fontSize: '0.85rem' }}>
              <Mic style={{ width: '16px', height: '16px' }} />
              <span>DOCUMENTED COMMUNICATION & RHETORICAL TRAITS</span>
            </div>
            <ul style={{ paddingLeft: '1.25rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              {figure.known_voice_traits.map((trait, i) => (
                <li key={i}>{trait}</li>
              ))}
            </ul>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <strong>Source Integrity Policy:</strong> TimeTravelers strictly rejects fabricated quotations and cross-figure contamination. Answers referring to events or inventions after the figure's lifetime are labeled as speculative simulations.
          </div>
        </div>
      </div>
    </div>
  );
};
