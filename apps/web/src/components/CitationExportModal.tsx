import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import type { ChatMessage, ClaimCitation } from '../types';

interface CitationExportModalProps {
  messages: ChatMessage[];
  isOpen: boolean;
  onClose: () => void;
  figureName: string;
}

export const CitationExportModal: React.FC<CitationExportModalProps> = ({
  messages,
  isOpen,
  onClose,
  figureName,
}) => {
  const [format, setFormat] = useState<'apa' | 'chicago' | 'bibtex' | 'markdown'>('apa');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Gather unique citations
  const citationsMap = new Map<string, ClaimCitation>();
  for (const m of messages) {
    if (m.answerPayload) {
      for (const seg of m.answerPayload.segments) {
        for (const c of seg.citations) {
          if (!citationsMap.has(c.source_id)) {
            citationsMap.set(c.source_id, c);
          }
        }
      }
    }
  }

  const uniqueCitations = Array.from(citationsMap.values());

  const generateExportText = (): string => {
    if (uniqueCitations.length === 0) {
      return `No primary citations cited in current dialogue with ${figureName}.`;
    }

    switch (format) {
      case 'apa':
        return uniqueCitations.map((c, i) => {
          const author = c.author || figureName;
          const year = c.created_date ? c.created_date.split('-')[0] : 'n.d.';
          const title = c.source_title || 'Historical Document';
          const pub = c.archive_name ? `${c.archive_name}.` : '';
          const url = c.source_url ? ` ${c.source_url}` : '';
          return `[${i + 1}] ${author} (${year}). ${title}. ${pub}${url}`;
        }).join('\n\n');

      case 'chicago':
        return uniqueCitations.map((c, i) => {
          const author = c.author || figureName;
          const year = c.created_date ? c.created_date.split('-')[0] : 'n.d.';
          const title = c.source_title || 'Historical Document';
          const pub = c.archive_name ? `${c.archive_name}, ` : '';
          const url = c.source_url ? ` ${c.source_url}.` : '';
          return `${i + 1}. ${author}, "${title}" (${pub}${year}).${url}`;
        }).join('\n\n');

      case 'bibtex':
        return uniqueCitations.map((c, i) => {
          const key = (c.author ? c.author.split(' ')[0].toLowerCase() : 'hist') + (c.created_date ? c.created_date.split('-')[0] : `${i}`);
          return `@misc{${key},\n  author = {${c.author || figureName}},\n  title = {${c.source_title}},\n  year = {${c.created_date ? c.created_date.split('-')[0] : '1800'}},\n  publisher = {${c.archive_name || 'Historical Archive'}},\n  url = {${c.source_url || ''}}\n}`;
        }).join('\n\n');

      case 'markdown':
        return `### Citations: ${figureName} Dialogue\n\n` +
          uniqueCitations.map((c, i) => {
            return `${i + 1}. **${c.source_title}** (${c.created_date || 'Undated'})\n   - Author: ${c.author || figureName}\n   - Archive: ${c.archive_name || 'Primary Archive'}\n   - URL: [${c.source_url || 'Archive'}](${c.source_url || '#'})\n   - Verified Excerpt: _"${c.quote_or_excerpt}"_`;
          }).join('\n\n');
    }
  };

  const textToCopy = generateExportText();

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '18px',
          padding: '1.75rem',
          border: '1px solid var(--border-gold)',
          background: 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Share2 style={{ width: '22px', height: '22px', color: 'var(--gold-accent)' }} />
            <h3 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>
              Export Scholarly Citations
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Format Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {(['apa', 'chicago', 'bibtex', 'markdown'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                background: format === f ? 'var(--gold-accent)' : 'var(--bg-card)',
                color: format === f ? '#090c15' : 'var(--text-muted)',
                border: format === f ? '1px solid var(--gold-accent)' : '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Text Area Display */}
        <textarea
          readOnly
          value={textToCopy}
          style={{
            flex: 1,
            minHeight: '260px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '1rem',
            color: '#f8fafc',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            resize: 'none',
            outline: 'none',
            marginBottom: '1.25rem'
          }}
        />

        {/* Copy Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={handleCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: copied ? '#10b981' : 'linear-gradient(135deg, #e5c158, #b8860b)',
              color: '#090c15',
              padding: '8px 18px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {copied ? (
              <>
                <Check style={{ width: '16px', height: '16px' }} />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy style={{ width: '16px', height: '16px' }} />
                <span>Copy Citations</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
