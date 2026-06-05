import { Search, MapPin, Briefcase } from 'lucide-react';
import { useState } from 'react';

export default function JourneyBoardView({ customers, onCustomerSelect, onNavigateToView }) {
  const [searchQuery, setSearchQuery] = useState('');

  const stages = [
    { key: 'Profile Verification', label: 'Profile Verification', color: '#605C71', bg: '#F4F3F8' },
    { key: 'Actively Matching', label: 'Actively Matching', color: '#6159E5', bg: '#EEECFC' },
    { key: 'Shortlisted', label: 'Shortlisted', color: '#E57D39', bg: '#FEF3EB' },
    { key: 'Match Sent', label: 'Match Sent', color: '#27A64A', bg: '#EAF9EE' },
    { key: 'Meeting Scheduled', label: 'Meeting Scheduled', color: '#2884C6', bg: '#EAF6FC' },
    { key: 'Meeting Completed', label: 'Meeting Completed', color: '#8C47E5', bg: '#F4EEFB' },
    { key: 'Relationship Building', label: 'Relationship Building', color: '#D54F91', bg: '#FDF0F6' }
  ];

  // Filter customers by search query
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (customer) => {
    onCustomerSelect(customer);
    onNavigateToView('Dashboard');
  };

  return (
    <div className="view-container journey-board-view" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      <div className="board-header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', fontWeight: '700', color: '#1C1335' }}>
            Customer Journey Board
          </h2>
          <p style={{ fontSize: '13px', color: '#7A7585', marginTop: '2px' }}>
            Track and visualize where each customer stands in their matchmaking lifecycle. Click any card to load their CRM dashboard.
          </p>
        </div>

        <div className="filter-item-wrapper" style={{ width: '280px', margin: '0' }}>
          <Search size={16} style={{ color: '#7A7585' }} />
          <input 
            type="text" 
            placeholder="Search board by name or city..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ fontSize: '13px' }}
          />
        </div>
      </div>

      <div className="kanban-board-container">
        {stages.map(stage => {
          const stageCustomers = filteredCustomers.filter(c => c.journeyStatus === stage.key);
          return (
            <div key={stage.key} className="kanban-column">
              <div 
                className="kanban-column-header" 
                style={{ 
                  borderBottomColor: stage.color,
                  background: stage.bg,
                  color: stage.color
                }}
              >
                <span className="kanban-column-title">
                  {stage.key === 'Profile Verification' ? 'Profile Complete' : 
                   stage.key === 'Actively Matching' ? 'In Matching' : stage.label}
                </span>
                <span className="kanban-column-badge" style={{ backgroundColor: stage.color }}>
                  {stageCustomers.length}
                </span>
              </div>

              <div className="kanban-column-cards">
                {stageCustomers.length === 0 ? (
                  <div className="kanban-empty-state">
                    No customers
                  </div>
                ) : (
                  stageCustomers.map(c => (
                    <div 
                      key={c.id} 
                      className="kanban-card"
                      onClick={() => handleCardClick(c)}
                    >
                      <div className="kanban-card-top">
                        <img src={c.photo} alt={c.name} className="kanban-card-avatar" />
                        <div className="kanban-card-info">
                          <span className="kanban-card-name">{c.name}</span>
                          <span className="kanban-card-id">{c.id}</span>
                        </div>
                      </div>

                      <p className="kanban-card-bio" title={c.bio}>
                        {c.bio.length > 80 ? `${c.bio.slice(0, 80)}...` : c.bio}
                      </p>

                      <div className="kanban-card-meta">
                        <span className="kanban-card-meta-item">
                          <MapPin size={10} />
                          {c.city}
                        </span>
                        <span className="kanban-card-meta-item">
                          <Briefcase size={10} />
                          {c.occupation.split(' at ')[0]}
                        </span>
                      </div>

                      <div className="kanban-card-footer">
                        <span className="kanban-card-activity">
                          🕒 {c.lastActivity}
                        </span>
                        <span className="kanban-card-gender" style={{
                          color: c.gender === 'Male' ? '#2884C6' : '#D54F91',
                          background: c.gender === 'Male' ? '#EAF6FC' : '#FDF0F6',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontSize: '9px',
                          fontWeight: '700'
                        }}>
                          {c.gender}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
