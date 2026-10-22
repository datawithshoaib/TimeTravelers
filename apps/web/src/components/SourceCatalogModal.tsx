import React, { useState } from 'react';
import { X, Search, BookOpen, ExternalLink, Filter } from 'lucide-react';
import type { HistoricalSource } from '../types';

interface SourceCatalogModalProps {
  sources: HistoricalSource[];
  isOpen: boolean;
  onClose: () => void;
  figureName: string;
}

export const SourceCatalogModal: React.FC<SourceCatalogModalProps> = ({
  sources,
  isOpen,
  onClose,
  figureName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = sources.filter(src => {
    const matchesSearch = src.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (src.summary && src.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (src.archive_or_publisher && src.archive_or_publisher.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || src.source_type === selectedType;
    return matchesSearch && matchesType;
  });

  const sourceTypes = Array.from(new Set(sources.map(s => s.source_type)));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '18px',
          padding: '1.75rem',
          border: '1px solid var(--border-gold)',
          background: 'var(--bg-surface)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen style={{ width: '22px', height: '22px', color: 'var(--gold-accent)' }} />
              Source Catalog: {figureName}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Browse the approved primary documents, editions, and canonical archive references.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{
            flex: 1,
            minWidth: '220px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '0.45rem 0.75rem'
          }}>
            <Search style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, archive, or contents..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#fff',
                outline: 'none',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter style={{ width: '15px', height: '15px', color: 'var(--gold-accent)' }} />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            >
              <option value="all">All Types ({sources.length})</option>
              {sourceTypes.map(t => (
                <option key={t} value={t}>{t.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Source Cards List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No sources matched your query.
            </div>
          ) : (
            filtered.map(src => (
              <div
                key={src.source_id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <h4 className="font-serif" style={{ fontSize: '1.05rem', color: '#fff' }}>
                    {src.title}
                  </h4>
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(52,211,153,0.12)',
                    border: '1px solid #10b981',
                    color: '#34d399',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    {src.source_type}
                  </span>
                </div>

                {src.summary && (
                  <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {src.summary}
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span><strong>Archive:</strong> {src.archive_or_publisher || 'Primary Collection'}</span>
                    {' • '}
                    <span><strong>Date:</strong> {src.created_date || 'Documented era'}</span>
                    {' • '}
                    <span style={{ color: '#34d399' }}>{src.rights_status}</span>
                  </div>

                  {src.canonical_url && (
                    <a
                      href={src.canonical_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--gold-accent)',
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      <span>Open Archive Document</span>
                      <ExternalLink style={{ width: '12px', height: '12px' }} />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
