import { X, AlertTriangle, Sparkles, Target, Compass, Heart, MapPin, Briefcase, Smile } from 'lucide-react';

export default function CompatibilityDrawer({ isOpen, onClose, customer, candidate, compatibility }) {
  if (!isOpen || !compatibility) return null;

  const { overallScore, breakdown, concerns, aiExplanation } = compatibility;

  // Helpers for category visual indicators
  const categories = [
    { name: 'Life Goals (30%)', value: breakdown.lifeGoals, color: '#E05370', icon: Target },
    { name: 'Lifestyle (20%)', value: breakdown.lifestyle, color: '#D54F91', icon: Heart },
    { name: 'Location (15%)', value: breakdown.location, color: '#2884C6', icon: MapPin },
    { name: 'Personality & Values (15%)', value: breakdown.personality, color: '#6159E5', icon: Smile },
    { name: 'Career & Education (10%)', value: breakdown.career, color: '#E57D39', icon: Briefcase },
    { name: 'Shared Interests (10%)', value: breakdown.interests, color: '#27A64A', icon: Compass },
  ];

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-wrapper">
            <h2 className="drawer-title">Compatibility Analysis</h2>
            <p className="drawer-subtitle">Between {customer.name} and {candidate.name}</p>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close drawer">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {/* Overall Compatibility Circular Display */}
          <div className="score-circle-wrapper">
            <div 
              className="score-circle" 
              style={{ 
                background: `conic-gradient(#27A64A ${overallScore * 3.6}deg, #EEECF1 ${overallScore * 3.6}deg)`
              }}
            >
              <div style={{
                width: '66px',
                height: '66px',
                borderRadius: '50%',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifycontent: 'center',
                fontFamily: 'var(--font-title)',
                fontSize: '22px',
                fontWeight: '800',
                color: '#1C1335'
              }}>
                {overallScore}%
              </div>
            </div>
            <div className="score-circle-info">
              <span className="score-circle-title">Overall Score</span>
              <span className="score-circle-desc">
                Calculated using weighted psychology-driven criteria
              </span>
            </div>
          </div>

          {/* AI Match Explanation */}
          <div className="ai-insights-banner" style={{ background: '#FAF8FD', borderStyle: 'solid' }}>
            <div className="ai-banner-header" style={{ color: '#8C47E5' }}>
              <Sparkles size={16} />
              <span>AI Matchmaker Insight</span>
            </div>
            <p className="ai-banner-content" style={{ fontStyle: 'normal', fontSize: '13px' }}>
              {aiExplanation || "Evaluating compatibility parameters..."}
            </p>
          </div>

          {/* Deal Breaker Detection Warnings */}
          {concerns && concerns.length > 0 && (
            <div className="warning-block">
              <AlertTriangle className="warning-icon" size={18} />
              <div className="warning-body">
                <span className="warning-title">Potential Concerns</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                  {concerns.map((concern, idx) => (
                    <span key={idx} className="warning-text">• {concern}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Factor Breakdown List */}
          <div className="factors-breakdown">
            <h3 className="section-title">Breakdown Breakdown</h3>
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className="factor-item">
                  <div className="factor-header">
                    <span className="factor-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon size={14} style={{ color: cat.color }} />
                      {cat.name}
                    </span>
                    <span className="factor-value" style={{ fontWeight: '700', color: '#1C1335' }}>
                      {cat.value}%
                    </span>
                  </div>
                  <div className="factor-bar-track">
                    <div 
                      className="factor-bar-fill" 
                      style={{ 
                        width: `${cat.value}%`, 
                        backgroundColor: cat.color 
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
