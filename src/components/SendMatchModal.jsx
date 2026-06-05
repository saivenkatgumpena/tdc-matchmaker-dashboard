import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';

export default function SendMatchModal({ isOpen, onClose, customer, candidate, onConfirm }) {
  const [introText, setIntroText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && customer && candidate) {
      setLoading(true);
      // Fetch AI Intro message
      fetch('/api/send-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: customer.id, receiverId: candidate.id }),
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to generate intro');
        return res.json();
      })
      .then(data => {
        if (data.sentMatch?.introMessage) {
          setIntroText(data.sentMatch.introMessage);
        }
      })
      .catch(err => {
        console.error(err);
        // Fallback
        setIntroText(`Hi ${candidate.name},\n\nI have a wonderful profile that I think you would connect with beautifully. Meet ${customer.name}, a ${customer.age}-year-old ${customer.occupation} based in ${customer.city}.\n\nWhat stood out to me was your shared interest in travel and matching values. Let me know if you would like me to share his full profile and schedule a brief introduction call!`);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [isOpen, customer, candidate]);

  if (!isOpen) return null;

  const handleSend = () => {
    onConfirm(introText);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Send Match Draft</h2>
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: '#F8F9FC', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={customer.photo} alt={customer.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{customer.name}</span>
            </div>
            <span style={{ fontSize: '12px', color: '#7A7585' }}>➔ Matching with ➔</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={candidate.photo} alt={candidate.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{candidate.name}</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} style={{ color: '#8C47E5' }} />
              AI-Generated Personal Introduction Draft
            </label>
            {loading ? (
              <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifycontent: 'center', background: '#F8F9FC', borderRadius: '8px', border: '1px solid #ECEBF0' }}>
                <span style={{ fontSize: '13px', color: '#7A7585' }}>Writing personalized introduction draft...</span>
              </div>
            ) : (
              <textarea 
                className="form-textarea"
                value={introText}
                onChange={(e) => setIntroText(e.target.value)}
                style={{ fontSize: '13px', lineHeight: '1.5', minHeight: '180px' }}
              />
            )}
          </div>
          <p style={{ fontSize: '11px', color: '#7A7585', lineHeight: '1.4' }}>
            ✨ This draft will be logged as the official introduction sent to the candidate. Confirming will also automatically update {customer.name}'s journey stage to <strong>Match Sent</strong>.
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSend} disabled={loading} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Send size={14} />
            Send Match Suggestion
          </button>
        </div>
      </div>
    </div>
  );
}
