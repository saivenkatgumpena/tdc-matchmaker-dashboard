import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, Plus, Search, CheckCircle } from 'lucide-react';

export default function CalendarView({ customers }) {
  const [meetings, setMeetings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/meetings')
      .then(res => res.json())
      .then(data => {
        // Enforce full customer details linking
        const enriched = data.map(meet => {
          const cust = customers.find(c => c.id === meet.customerId);
          return {
            ...meet,
            customer: cust
          };
        });
        setMeetings(enriched);
      })
      .catch(err => console.error(err));
  }, [customers]);

  const filteredMeetings = meetings.filter(m => {
    const custName = m.customer?.name || '';
    return m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           custName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="view-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', fontWeight: '700', color: '#1C1335' }}>
            Matchmaker Calendar
          </h2>
          <p style={{ fontSize: '13px', color: '#7A7585', marginTop: '2px' }}>
            Review, organize, and manage upcoming virtual meetings and introductions.
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="filter-row">
        <div className="filter-item-wrapper" style={{ flex: 1 }}>
          <Search size={16} style={{ color: '#7A7585' }} />
          <input 
            type="text" 
            placeholder="Search meetings by title or customer name..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ fontSize: '13px', width: '100%' }}
          />
        </div>
      </div>

      {/* Calendar Grid list */}
      <div className="meetings-grid">
        {filteredMeetings.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#7A7585' }}>
            No upcoming meetings matched your query.
          </div>
        ) : (
          filteredMeetings.map(meet => (
            <div key={meet.id} className="meeting-item-card" style={{ borderLeft: meet.status === 'Completed' ? '4px solid #27A64A' : '4px solid #2884C6' }}>
              <div className="meeting-header-row">
                <span className="meeting-title">{meet.title}</span>
                <span className={`stage-badge`} style={{
                  fontSize: '9px',
                  padding: '2px 6px',
                  background: meet.status === 'Completed' ? '#EAF9EE' : '#EAF6FC',
                  color: meet.status === 'Completed' ? '#27A64A' : '#2884C6'
                }}>
                  {meet.status}
                </span>
              </div>

              <div className="meeting-time-row">
                <Clock size={12} />
                <span>{new Date(meet.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>

              {meet.notes && (
                <p style={{ fontSize: '12px', color: '#4C3C60', background: '#F8F9FC', padding: '10px', borderRadius: '6px', margin: '4px 0', border: '1px solid #ECEBF0', fontStyle: 'italic' }}>
                  "{meet.notes}"
                </p>
              )}

              {meet.customer && (
                <div className="meeting-customer-details">
                  <img src={meet.customer.photo} alt={meet.customer.name} className="meeting-avatar" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="meeting-customer-name">{meet.customer.name}</span>
                    <span style={{ fontSize: '9px', color: '#7A7585' }}>{meet.customer.id} • {meet.customer.city}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
