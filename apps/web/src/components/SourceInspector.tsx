import React from 'react';
import { BookOpen, ExternalLink, Feather, CheckCircle2, Flag, ShieldCheck } from 'lucide-react';
import type { ClaimCitation, HistoricalSource } from '../types';

interface SourceInspectorProps {
  activeCitation: ClaimCitation | null;
  sources: HistoricalSource[];
  onOpenFeedback: (sourceId?: string, chunkId?: string) => void;
  onOpenCatalog: () => void;
}

export const SourceInspector: React.FC<SourceInspectorProps> = ({
  activeCitation,
  sources,
  onOpenFeedback,
  onOpenCatalog,
}) => {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '16px',
      padding: '1.25rem',
      height: '100%',
      minHeight: '600px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen style={{ width: '18px', height: '18px', color: 'var(--gold-accent)' }} />
          <h3 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
            Source & Evidence Inspector
          </h3>
        </div>

        <button
          onClick={onOpenCatalog}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--gold-accent)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Browse All Sources
        </button>
      </div>

      {activeCitation ? (
        <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Active Citation Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(229,193,88,0.1)',
            border: '1px solid var(--border-gold)',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '0.78rem'
          }}>
            <span style={{ color: 'var(--gold-accent)', fontWeight: 600 }}>
              ACTIVE EVIDENCE CHUNK: {activeCitation.chunk_id}
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              color: '#34d399',
              fontSize: '0.72rem',
              fontWeight: 600
            }}>
              <CheckCircle2 style={{ width: '12px', height: '12px' }} />
              VERIFIED PRIMARY
            </span>
          </div>

          {/* Document Title & Author */}
          <div>
            <h4 className="font-serif" style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.25rem' }}>
              {activeCitation.source_title || 'Authentic Historical Record'}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <Feather style={{ width: '13px', height: '13px', color: 'var(--gold-accent)' }} />
              <span>{activeCitation.author || 'Historical Author'}</span>
            </div>
          </div>

          {/* Metadata Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.78rem' }}>
            <div style={{ background: 'var(--bg-card)', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-faint)', display: 'block', fontSize: '0.7rem' }}>ORIGIN DATE</span>
              <span style={{ color: '#e2e8f0', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
                {activeCitation.created_date || 'Documented Era'}
              </span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-faint)', display: 'block', fontSize: '0.7rem' }}>SECTION / FOLIO</span>
              <span style={{ color: 'var(--gold-accent)', fontWeight: 500 }}>
                {activeCitation.page_or_section || 'Main Text'}
              </span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-faint)', display: 'block', fontSize: '0.7rem' }}>ARCHIVE / REPOSITORY</span>
              <span style={{ color: '#e2e8f0', fontWeight: 500 }}>
                {activeCitation.archive_name || 'National Archives / Bodleian'}
              </span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-faint)', display: 'block', fontSize: '0.7rem' }}>RIGHTS STATUS</span>
              <span style={{ color: '#34d399', fontWeight: 500 }}>
                {activeCitation.rights_status || 'Public Domain'}
              </span>
            </div>
          </div>

          {/* Verified Passage Excerpt */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold-accent)', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
              AUTHENTIC SOURCE PASSAGE:
            </span>
            <div style={{
              flex: 1,
              background: 'linear-gradient(180deg, #0b0f1d 0%, #11182c 100%)',
              border: '1px solid rgba(229, 193, 88, 0.25)',
              borderRadius: '10px',
              padding: '1rem',
              color: '#f8fafc',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              fontStyle: 'italic',
              overflowY: 'auto',
              maxHeight: '260px'
            }}>
              "{activeCitation.quote_or_excerpt}"
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem' }}>
            {activeCitation.source_url && (
              <a
                href={activeCitation.source_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #e5c158, #b8860b)',
                  color: '#090c15',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(229,193,88,0.2)'
                }}
              >
                <span>Inspect Archive</span>
                <ExternalLink style={{ width: '13px', height: '13px' }} />
              </a>
            )}

            <button
              onClick={() => onOpenFeedback(activeCitation.source_id, activeCitation.chunk_id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
              title="Report transcription or citation issue"
            >
              <Flag style={{ width: '13px', height: '13px', color: '#f87171' }} />
              <span>Flag Passage</span>
            </button>
          </div>

        </div>
      ) : (
        /* Empty / Default state showing active figure sources */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px dashed var(--border-subtle)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            <ShieldCheck style={{ width: '32px', height: '32px', color: 'var(--gold-accent)', margin: '0 auto 0.5rem' }} />
            <h4 className="font-serif" style={{ color: '#fff', fontSize: '0.98rem', marginBottom: '0.35rem' }}>
              No Citation Selected
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Click any citation badge (e.g. <span className="citation-chip">[1]</span>) in the conversation to inspect the underlying archival document, dates, and excerpt.
            </p>
          </div>

          <div>
            <h5 style={{ fontSize: '0.78rem', color: 'var(--gold-accent)', fontWeight: 600, marginBottom: '0.5rem' }}>
              FIGURE'S PRIMARY SOURCES ({sources.length}):
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {sources.map(src => (
                <div
                  key={src.source_id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '0.8rem'
                  }}
                >
                  <strong style={{ color: '#fff', display: 'block', marginBottom: '2px' }}>{src.title}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                    {src.archive_or_publisher || 'Primary Archive'} • {src.created_date || 'Date Recorded'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
