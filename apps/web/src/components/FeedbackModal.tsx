import React, { useState } from 'react';
import { X, Flag, Check } from 'lucide-react';
import { sendFeedback } from '../services/api';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageId?: string;
  sourceId?: string;
  chunkId?: string;
  figureId?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  messageId,
  sourceId,
  chunkId,
  figureId,
}) => {
  const [feedbackType, setFeedbackType] = useState<string>('inaccurate_claim');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    await sendFeedback({
      message_id: messageId || 'msg_direct',
      figure_id: figureId,
      source_id: sourceId,
      chunk_id: chunkId,
      feedback_type: feedbackType,
      comment,
    });
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComment('');
      onClose();
    }, 2200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '540px',
          borderRadius: '18px',
          padding: '1.75rem',
          border: '1px solid var(--border-gold)',
          background: 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Flag style={{ width: '20px', height: '20px', color: '#f87171' }} />
            <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
              Report Accuracy / Citation Issue
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(16,185,129,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: '#34d399'
            }}>
              <Check style={{ width: '26px', height: '26px' }} />
            </div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Report Received
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Thank you for contributing to historical accuracy. Your report has been submitted to the curation queue.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Issue Category
              </label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.55rem 0.75rem',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="inaccurate_claim">Inaccurate Historical Statement</option>
                <option value="broken_citation">Broken or Unmatched Citation Link</option>
                <option value="misattributed_quote">Misattributed Quote</option>
                <option value="anachronism">Anachronistic Modern Concept Without Speculation Label</option>
                <option value="general">General Correction or Feedback</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Explanation and Scholarly Reference
              </label>
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Explain the discrepancy or provide the accurate historical reference..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  padding: '7px 18px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: comment.trim() ? 1 : 0.6
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
