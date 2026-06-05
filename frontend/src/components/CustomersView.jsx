import { useState } from 'react';
import { Search, Filter, ArrowRight, UserPlus, SlidersHorizontal } from 'lucide-react';

export default function CustomersView({ 
  customers, 
  onCustomerSelect, 
  onAddCustomerClick,
  onNavigateToView
}) {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [maritalFilter, setMaritalFilter] = useState('All');

  // Derive filter options
  const cities = ['All', ...Array.from(new Set(customers.map(c => c.city)))];
  const statuses = ['All', 'Profile Verification', 'Actively Matching', 'Shortlisted', 'Match Sent', 'Meeting Scheduled', 'Meeting Completed', 'Relationship Building'];
  const maritalStatuses = ['All', 'Never Married', 'Divorced'];

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.id.toLowerCase().includes(search.toLowerCase()) ||
                          c.city.toLowerCase().includes(search.toLowerCase());
    const matchesCity = cityFilter === 'All' || c.city === cityFilter;
    const matchesStatus = statusFilter === 'All' || c.journeyStatus === statusFilter;
    const matchesMarital = maritalFilter === 'All' || c.maritalStatus === maritalFilter;
    return matchesSearch && matchesCity && matchesStatus && matchesMarital;
  });

  const getStageClassName = (status) => {
    return status.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div className="view-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', fontWeight: '700', color: '#1C1335' }}>
            Customers Directory
          </h2>
          <p style={{ fontSize: '13px', color: '#7A7585', marginTop: '2px' }}>
            Search, filter, and manage all registered customer accounts.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onAddCustomerClick} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <UserPlus size={16} />
          Register New Profile
        </button>
      </div>

      {/* Filter Row */}
      <div className="filter-row">
        <div className="filter-item-wrapper" style={{ flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ color: '#7A7585' }} />
          <input 
            type="text" 
            placeholder="Search by name, ID, or city..." 
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', fontSize: '13px' }}
          />
        </div>

        <div className="filter-item-wrapper">
          <Filter size={14} style={{ color: '#7A7585' }} />
          <span className="filter-label">City:</span>
          <select 
            className="filter-select"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            {cities.map((city, idx) => (
              <option key={idx} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="filter-item-wrapper">
          <SlidersHorizontal size={14} style={{ color: '#7A7585' }} />
          <span className="filter-label">Stage:</span>
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map((status, idx) => (
              <option key={idx} value={status}>
                {status === 'Profile Verification' ? 'Profile Complete' : 
                 status === 'Actively Matching' ? 'In Matching' : status}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item-wrapper">
          <span className="filter-label">Marital:</span>
          <select 
            className="filter-select"
            value={maritalFilter}
            onChange={(e) => setMaritalFilter(e.target.value)}
          >
            {maritalStatuses.map((marital, idx) => (
              <option key={idx} value={marital}>{marital}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Customers Table List */}
      <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
        <div className="table-container">
          <table className="crm-table">
            <thead>
              <tr style={{ background: '#FAF9FC' }}>
                <th style={{ padding: '16px' }}>Profile Details</th>
                <th>Age / Gender</th>
                <th>City</th>
                <th>Education & Career</th>
                <th>Journey Stage</th>
                <th>Marital Status</th>
                <th>Last Activity</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#7A7585' }}>
                    No profiles matched your current search filters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(c => (
                  <tr 
                    key={c.id} 
                    onClick={() => {
                      onCustomerSelect(c);
                      onNavigateToView('Dashboard'); // Go back to dashboard to see full details + AI recommendations
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      <div className="customer-cell">
                        <img src={c.photo} alt={c.name} className="customer-table-avatar" />
                        <div className="customer-name-wrapper">
                          <span className="customer-table-name" style={{ fontSize: '14px' }}>{c.name}</span>
                          <span className="customer-table-id">{c.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '500' }}>{c.age}</span> • <span style={{ color: '#7A7585' }}>{c.gender}</span>
                    </td>
                    <td>{c.city}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '500', fontSize: '13px' }}>{c.occupation}</span>
                        <span style={{ fontSize: '11px', color: '#7A7585' }}>{c.education}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`stage-badge ${getStageClassName(c.journeyStatus)}`}>
                        {c.journeyStatus === 'Profile Verification' ? 'Profile Complete' : 
                         c.journeyStatus === 'Actively Matching' ? 'In Matching' : c.journeyStatus}
                      </span>
                    </td>
                    <td>{c.maritalStatus}</td>
                    <td style={{ color: '#7A7585' }}>{c.lastActivity}</td>
                    <td style={{ color: '#B4B0BE', textAlign: 'right', paddingRight: '20px' }}>
                      <ArrowRight size={16} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
