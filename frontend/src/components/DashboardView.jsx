import { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, Send, Calendar, ArrowRight, Star, Edit3, MoreHorizontal, 
  CheckCircle, Sparkles, HelpCircle, Heart
} from 'lucide-react';
import CompatibilityDrawer from './CompatibilityDrawer';
import SendMatchModal from './SendMatchModal';

export default function DashboardView({ 
  stats, 
  customers, 
  onCustomerSelect, 
  selectedCustomer, 
  onAddCustomerClick,
  onNavigateToView 
}) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [suggestedMatches, setSuggestedMatches] = useState([]);
  const [compatibilityDetails, setCompatibilityDetails] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [sendMatchOpen, setSendMatchOpen] = useState(false);
  
  // Notes tab state
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  
  // Meetings tab state
  const [customerMeetings, setCustomerMeetings] = useState([]);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');

  // AI Insights text
  const [aiInsight, setAiInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);

  // Load Suggested Matches and Customer-specific details when selected customer changes
  useEffect(() => {
    if (selectedCustomer) {
      // Fetch notes
      fetch(`/api/customers/${selectedCustomer.id}/notes`)
        .then(res => res.json())
        .then(data => setNotes(data))
        .catch(err => console.error(err));

      // Fetch meetings
      fetch(`/api/meetings`)
        .then(res => res.json())
        .then(data => {
          const filtered = data.filter(m => m.customerId === selectedCustomer.id);
          setCustomerMeetings(filtered);
        })
        .catch(err => console.error(err));

      // Calculate compatibility against opposite gender profiles
      const oppositeGender = selectedCustomer.gender === 'Male' ? 'Female' : 'Male';
      const candidates = customers.filter(c => c.gender === oppositeGender);
      
      const compPromises = candidates.map(candidate => {
        return fetch('/api/compatibility', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ c1Id: selectedCustomer.id, c2Id: candidate.id })
        })
        .then(res => res.json())
        .then(compData => ({
          candidate,
          compatibility: compData
        }));
      });

      Promise.all(compPromises)
        .then(results => {
          // Sort by highest compatibility
          const sorted = results.sort((a, b) => b.compatibility.overallScore - a.compatibility.overallScore);
          setSuggestedMatches(sorted.slice(0, 3)); // show top 3
          
          // Generate an overall insight using the top match
          if (sorted.length > 0) {
            setInsightLoading(true);
            const topMatch = sorted[0];
            setAiInsight(`${selectedCustomer.name} is a High Potential Match for ${topMatch.candidate.name}. They align on lifestyle, values, and long-term goals. Both prefer a balanced career-life and are open to building a family.`);
            setInsightLoading(false);
          }
        })
        .catch(err => console.error('Error calculating suggested matches:', err));
    }
  }, [selectedCustomer, customers]);

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    fetch(`/api/customers/${selectedCustomer.id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newNote })
    })
    .then(res => res.json())
    .then(savedNote => {
      setNotes(prev => [savedNote, ...prev]);
      setNewNote('');
    })
    .catch(err => console.error(err));
  };

  const handleScheduleMeeting = (e) => {
    e.preventDefault();
    if (!meetingTitle.trim() || !meetingDate) return;

    fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: selectedCustomer.id,
        title: meetingTitle,
        date: meetingDate,
        notes: meetingNotes
      })
    })
    .then(res => res.json())
    .then(savedMeeting => {
      setCustomerMeetings(prev => [savedMeeting, ...prev]);
      setMeetingTitle('');
      setMeetingDate('');
      setMeetingNotes('');
    })
    .catch(err => console.error(err));
  };

  const handleUpdateStage = (stage) => {
    fetch(`/api/customers/${selectedCustomer.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ journeyStatus: stage })
    })
    .then(res => res.json())
    .then(updated => {
      onCustomerSelect(updated); // Update parent customer array / selected state
    })
    .catch(err => console.error(err));
  };

  const handleOpenCompatibility = (match) => {
    setActiveCandidate(match.candidate);
    setCompatibilityDetails(match.compatibility);
    setDrawerOpen(true);
  };

  const handleOpenSendMatch = (match) => {
    setActiveCandidate(match.candidate);
    setSendMatchOpen(true);
  };

  const handleConfirmSendMatch = () => {
    // Send match details to backend
    fetch('/api/send-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: selectedCustomer.id, receiverId: activeCandidate.id }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Close modal
        setSendMatchOpen(false);
        // Refresh selected customer to reflect updated journeyStatus ('Match Sent')
        fetch(`/api/customers/${selectedCustomer.id}`)
          .then(res => res.json())
          .then(updated => {
            onCustomerSelect(updated);
            // Switch to Overview or Notes to see update
            setActiveTab('Overview');
          });
      }
    })
    .catch(err => console.error(err));
  };

  // Helper for displaying status styling
  const getStageClassName = (status) => {
    return status.toLowerCase().replace(/\s+/g, '-');
  };

  // Timeline list for Journey
  const journeyStages = [
    'Profile Verification',
    'Actively Matching',
    'Shortlisted',
    'Match Sent',
    'Meeting Scheduled',
    'Meeting Completed',
    'Relationship Building'
  ];

  return (
    <div className="view-container">
      {/* 4 Stats Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon-wrapper customers">
            <Users size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Customers</span>
            <h3 className="stat-value">{stats.totalCustomers}</h3>
            <span className="stat-footer-link" onClick={() => onNavigateToView('Customers')}>View all</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper journeys">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Active Journeys</span>
            <h3 className="stat-value">{stats.activeJourneys}</h3>
            <span className="stat-footer-link" onClick={() => onNavigateToView('Reports')}>View analytics</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper sent">
            <Send size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Matches Sent</span>
            <h3 className="stat-value">{stats.matchesSent}</h3>
            <span className="stat-label" style={{ display: 'block', fontSize: '10px', marginTop: '4px' }}>This month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper meetings">
            <Calendar size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Meetings Scheduled</span>
            <h3 className="stat-value">{stats.meetingsScheduled}</h3>
            <span className="stat-label" style={{ display: 'block', fontSize: '10px', marginTop: '4px' }}>This month</span>
          </div>
        </div>
      </div>

      {/* Grid Dashboard Split */}
      <div className="dashboard-grid">
        {/* Left: My Customers Table */}
        <div className="dashboard-left">
          <div className="card" style={{ padding: '20px' }}>
            <div className="card-header">
              <div className="card-title-section">
                <h2 className="card-title">My Customers</h2>
                <span className="card-badge">{customers.length}</span>
              </div>
              <button className="btn btn-primary btn-sm" onClick={onAddCustomerClick}>
                + Add Customer
              </button>
            </div>

            <div className="table-container">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>City</th>
                    <th>Marital Status</th>
                    <th>Journey Status</th>
                    <th>Last Activity</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {customers.slice(0, 6).map((c) => (
                    <tr 
                      key={c.id} 
                      onClick={() => onCustomerSelect(c)}
                      style={{ background: selectedCustomer?.id === c.id ? '#F2EFF7' : '' }}
                    >
                      <td>
                        <div className="customer-cell">
                          <img src={c.photo} alt={c.name} className="customer-table-avatar" />
                          <div className="customer-name-wrapper">
                            <span className="customer-table-name">{c.name}</span>
                            <span className="customer-table-id">{c.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>{c.age}</td>
                      <td>{c.city}</td>
                      <td>{c.maritalStatus}</td>
                      <td>
                        <span className={`stage-badge ${getStageClassName(c.journeyStatus)}`}>
                          {c.journeyStatus === 'Profile Verification' ? 'Profile Complete' : 
                           c.journeyStatus === 'Actively Matching' ? 'In Matching' : c.journeyStatus}
                        </span>
                      </td>
                      <td style={{ color: '#7A7585', fontSize: '12px' }}>{c.lastActivity}</td>
                      <td style={{ textAlign: 'right', color: '#B4B0BE' }}>➔</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="view-all-row">
              <span className="view-all-link" onClick={() => onNavigateToView('Customers')}>
                View all customers <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>

        {/* Right: Selected Customer detail panel */}
        {selectedCustomer ? (
          <div className="detail-panel">
            <div className="detail-header-nav">
              <div className="back-btn-wrapper" onClick={() => onNavigateToView('Customers')}>
                <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} />
                <span>Back to customers</span>
              </div>
              <div className="detail-header-actions">
                <Star size={16} className="detail-header-action-icon" />
                <Edit3 size={16} className="detail-header-action-icon" />
                <MoreHorizontal size={16} className="detail-header-action-icon" />
              </div>
            </div>

            {/* Profile Hero section */}
            <div className="customer-hero">
              <div className="customer-hero-avatar-wrapper">
                <img src={selectedCustomer.photo} alt={selectedCustomer.name} className="customer-hero-avatar" />
              </div>
              <div className="customer-hero-info">
                <div className="customer-name-row">
                  <h3 className="customer-hero-name">{selectedCustomer.name}</h3>
                  <CheckCircle size={16} className="verified-icon" fill="#4A90E2" color="#FFFFFF" />
                </div>
                <div className="customer-hero-meta">
                  <span>{selectedCustomer.age} • {selectedCustomer.city}, {selectedCustomer.state}</span>
                  <span>{selectedCustomer.maritalStatus}</span>
                </div>
                <div className="customer-hero-badges">
                  <span className={`stage-badge ${getStageClassName(selectedCustomer.journeyStatus)}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                    {selectedCustomer.journeyStatus === 'Profile Verification' ? 'Profile Complete' : 
                     selectedCustomer.journeyStatus === 'Actively Matching' ? 'In Matching' : selectedCustomer.journeyStatus}
                  </span>
                  <span className="hero-profile-id-badge">{selectedCustomer.id}</span>
                </div>
              </div>
            </div>

            {/* Detail Tabs */}
            <div className="tab-navigation">
              {['Overview', 'Journey', 'Notes', 'Documents', 'Meetings'].map(tab => (
                <button 
                  key={tab} 
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="tab-content">
              {activeTab === 'Overview' && (
                <div>
                  <div className="bio-card">
                    <p className="bio-text">"{selectedCustomer.bio}"</p>
                  </div>

                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Education</span>
                      <span className="info-value" style={{ fontSize: '12px' }}>{selectedCustomer.education}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Career</span>
                      <span className="info-value" style={{ fontSize: '12px' }}>{selectedCustomer.occupation}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Income</span>
                      <span className="info-value">{selectedCustomer.income}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Personality Type</span>
                      <span className="info-value">{selectedCustomer.personality?.social || 'Ambivert'}</span>
                    </div>
                  </div>

                  <h4 className="section-title" style={{ fontSize: '11px' }}>Hobbies & Interests</h4>
                  <div className="interests-container">
                    {selectedCustomer.interests?.map((interest, idx) => (
                      <span key={idx} className="interest-tag">{interest}</span>
                    ))}
                  </div>

                  {/* AI Suggested Matches */}
                  <div className="suggested-header-row">
                    <div className="suggested-title-wrapper">
                      <span>AI Suggested Matches</span>
                      <HelpCircle size={14} style={{ color: '#B4B0BE', cursor: 'pointer' }} />
                    </div>
                    <span className="suggested-link" onClick={() => onNavigateToView('Matches')}>View all matches</span>
                  </div>

                  <div className="suggested-grid">
                    {suggestedMatches.map((match, idx) => (
                      <div key={idx} className="suggested-match-card">
                        <div className="match-image-wrapper">
                          <img src={match.candidate.photo} alt={match.candidate.name} className="match-image" />
                          <div className="match-fav-icon">
                            <Heart size={12} fill="#E05370" color="#E05370" />
                          </div>
                          <div className="match-percent-badge" onClick={() => handleOpenCompatibility(match)} style={{ cursor: 'pointer' }}>
                            <span>{match.compatibility.overallScore}% Match</span>
                            <HelpCircle size={10} style={{ color: '#27A64A' }} />
                          </div>
                        </div>
                        <div className="match-details-body">
                          <div>
                            <span className="match-name">{match.candidate.name}</span>
                            <div className="match-location">{match.candidate.age} • {match.candidate.city}</div>
                            <div className="match-career" title={match.candidate.occupation}>{match.candidate.occupation}</div>
                            <div className="match-sub-stats">
                              <span className="match-sub-stat-item">📏 {match.candidate.height || "5'5\""}</span>
                              <span className="match-sub-stat-item">💼 {match.candidate.income}</span>
                              <span className="match-sub-stat-item">🏠 {match.candidate.locationPreferences?.relocation || "Open to Relocate"}</span>
                            </div>
                          </div>
                          <button className="match-send-btn" onClick={() => handleOpenSendMatch(match)}>
                            <Send size={10} />
                            Send Match
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Insight banner */}
                  <div className="ai-insights-banner">
                    <div className="ai-banner-header">
                      <Sparkles size={14} />
                      <span>AI Insight for {selectedCustomer.name.split(' ')[0]}</span>
                    </div>
                    <p className="ai-banner-content">
                      {insightLoading ? "Analyzing compatibility parameters..." : aiInsight}
                    </p>
                    <button className="ai-banner-btn" onClick={() => suggestedMatches.length > 0 && handleOpenCompatibility(suggestedMatches[0])}>
                      View Full Analysis
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'Journey' && (
                <div>
                  <h4 className="section-title">Track Journey Stage</h4>
                  <p style={{ fontSize: '12px', color: '#7A7585', marginBottom: '16px' }}>
                    Select the active stage to update {selectedCustomer.name}'s current matching status.
                  </p>
                  <div className="journey-timeline">
                    {journeyStages.map((stage, idx) => {
                      const currentIdx = journeyStages.indexOf(selectedCustomer.journeyStatus);
                      const isCompleted = idx < currentIdx;
                      const isActive = idx === currentIdx;
                      let stepClass = '';
                      if (isCompleted) stepClass = 'completed';
                      else if (isActive) stepClass = 'active';

                      return (
                        <div 
                          key={idx} 
                          className={`timeline-step ${stepClass}`}
                          onClick={() => handleUpdateStage(stage)}
                        >
                          <div className="timeline-dot" />
                          <div className="timeline-content">
                            <span className="timeline-title">{stage}</span>
                            <span className="timeline-desc">
                              {isActive ? 'Current active stage' : isCompleted ? 'Completed stage' : 'Pending stage'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'Notes' && (
                <div>
                  <h4 className="section-title">Call Notes & Observations</h4>
                  
                  {/* Note Form */}
                  <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Add observations, phone logs, or personality preferences..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      style={{ fontSize: '13px', minHeight: '80px' }}
                    />
                    <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-end' }}>
                      Add Note
                    </button>
                  </form>

                  {/* Notes Timeline */}
                  <div className="notes-list">
                    {notes.map((note) => (
                      <div key={note.id} className="note-item">
                        <div className="note-header">
                          <span className="note-author">Matchmaker Note</span>
                          <span>{new Date(note.date).toLocaleDateString()}</span>
                        </div>
                        <p className="note-content">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Meetings' && (
                <div>
                  <h4 className="section-title">Scheduled Meetings</h4>
                  
                  {/* Meeting Form */}
                  <form onSubmit={handleScheduleMeeting} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', background: '#F8F9FC', padding: '16px', borderRadius: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#1C1335' }}>Schedule New Meeting</span>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '11px' }}>Meeting Title</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Introduction Call, Match Discussion"
                        value={meetingTitle}
                        onChange={(e) => setMeetingTitle(e.target.value)}
                        style={{ padding: '8px' }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '11px' }}>Date & Time</label>
                      <input 
                        type="datetime-local" 
                        className="form-input" 
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        style={{ padding: '8px' }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '11px' }}>Notes</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Topics to align on..."
                        value={meetingNotes}
                        onChange={(e) => setMeetingNotes(e.target.value)}
                        style={{ padding: '8px' }}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-end', marginTop: '6px' }}>
                      Schedule Meeting
                    </button>
                  </form>

                  {/* Meetings lists */}
                  <div className="notes-list">
                    {customerMeetings.length === 0 ? (
                      <span style={{ fontSize: '12px', color: '#7A7585', fontStyle: 'italic' }}>No meetings scheduled.</span>
                    ) : (
                      customerMeetings.map(meet => (
                        <div key={meet.id} className="note-item" style={{ borderLeft: '3px solid #2884C6' }}>
                          <div className="note-header">
                            <span className="note-author" style={{ color: '#2884C6' }}>{meet.title}</span>
                            <span>{new Date(meet.date).toLocaleString()}</span>
                          </div>
                          <p className="note-content" style={{ fontSize: '12px' }}>{meet.notes || 'No discussion notes logged.'}</p>
                          <span className={`stage-badge`} style={{ alignSelf: 'flex-start', fontSize: '9px', padding: '2px 6px', background: meet.status === 'Scheduled' ? '#EAF6FC' : '#EAF9EE', color: meet.status === 'Scheduled' ? '#2884C6' : '#27A64A' }}>
                            {meet.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'Documents' && (
                <div>
                  <h4 className="section-title">Customer Files</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8F9FC', padding: '12px', borderRadius: '8px', border: '1px solid #ECEBF0' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>Government Photo ID.pdf</span>
                        <span style={{ fontSize: '10px', color: '#7A7585' }}>Verified by Admin • 2.4 MB</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#27A64A', fontWeight: '700' }}>✓ Verified</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8F9FC', padding: '12px', borderRadius: '8px', border: '1px solid #ECEBF0' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>Psychometric Questionnaire.pdf</span>
                        <span style={{ fontSize: '10px', color: '#7A7585' }}>Completed on Sign Up • 1.2 MB</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#8C47E5', fontWeight: '700' }}>View PDF</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="detail-panel" style={{ padding: '40px 20px', alignItems: 'center', justifycontent: 'center' }}>
            <span style={{ fontSize: '14px', color: '#7A7585', textAlign: 'center' }}>Select a customer from the left side table to view detailed matching stats.</span>
          </div>
        )}
      </div>

      {/* Side Compatibility Details Drawer */}
      {drawerOpen && selectedCustomer && activeCandidate && compatibilityDetails && (
        <CompatibilityDrawer 
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          customer={selectedCustomer}
          candidate={activeCandidate}
          compatibility={compatibilityDetails}
        />
      )}

      {/* Send Match modal */}
      {sendMatchOpen && selectedCustomer && activeCandidate && (
        <SendMatchModal 
          isOpen={sendMatchOpen}
          onClose={() => setSendMatchOpen(false)}
          customer={selectedCustomer}
          candidate={activeCandidate}
          onConfirm={handleConfirmSendMatch}
        />
      )}
    </div>
  );
}
