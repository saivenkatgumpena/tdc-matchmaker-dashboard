import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Heart, ListTodo, Calendar, BarChart2, Settings, 
  LogOut, Search, Bell, Sparkles, Lock, MessageSquare, Compass, HelpCircle 
} from 'lucide-react';

// Child view imports
import DashboardView from './components/DashboardView';
import CustomersView from './components/CustomersView';
import MatchesView from './components/MatchesView';
import TasksNotesView from './components/TasksNotesView';
import CalendarView from './components/CalendarView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import AddCustomerModal from './components/AddCustomerModal';

export default function App() {
  const [currentView, setCurrentView] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [stats, setStats] = useState({
    totalCustomers: 128,
    activeJourneys: 96,
    matchesSent: 342,
    meetingsScheduled: 28,
    profilesVerified: 110
  });

  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Aarav Sharma requested a call log", time: "10m ago" },
    { id: 2, text: "Vihaan Malhotra scheduled a slot", time: "1h ago" },
    { id: 3, text: "System generated 4 new recommendations", time: "3h ago" }
  ]);

  // Load customers and stats on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    // Fetch stats
    fetch('/api/dashboard-stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching dashboard stats:', err));

    // Fetch customers
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        // Default select the first customer in list (Aarav Sharma) if none selected
        if (data.length > 0 && !selectedCustomer) {
          const aarav = data.find(c => c.name.includes("Aarav")) || data[0];
          setSelectedCustomer(aarav);
        } else if (selectedCustomer) {
          // Sync selected customer state with re-fetched list
          const synced = data.find(c => c.id === selectedCustomer.id);
          if (synced) setSelectedCustomer(synced);
        }
      })
      .catch(err => console.error('Error fetching customers:', err));
  };

  const handleAddCustomer = (newCustomerData) => {
    fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomerData)
    })
    .then(res => res.json())
    .then(newCust => {
      setIsAddingCustomer(false);
      fetchData(); // reload
      setSelectedCustomer(newCust); // auto-select new customer
      setCurrentView('Dashboard');
    })
    .catch(err => console.error('Error adding customer:', err));
  };

  // Search filter
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter list of customers by global search query
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">❤️</div>
          <div className="logo-text">
            TDC
            <span className="logo-subtext">THE DATE CREW</span>
          </div>
        </div>

        {/* Matchmaker Profile Header */}
        <div className="profile-container">
          <img 
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150" 
            alt="Matchmaker" 
            className="profile-avatar" 
          />
          <div className="profile-info">
            <span className="profile-name">Sai Venkat</span>
            <span className="profile-role">Matchmaker</span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="sidebar-nav">
          <div 
            className={`nav-item ${currentView === 'Dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('Dashboard')}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </div>

          <div 
            className={`nav-item ${currentView === 'Customers' ? 'active' : ''}`}
            onClick={() => setCurrentView('Customers')}
          >
            <Users size={16} />
            <span>Customers</span>
          </div>

          <div 
            className={`nav-item ${currentView === 'Matches' ? 'active' : ''}`}
            onClick={() => setCurrentView('Matches')}
          >
            <Heart size={16} />
            <span>Matches</span>
          </div>

          <div 
            className={`nav-item ${currentView === 'Tasks & Notes' ? 'active' : ''}`}
            onClick={() => setCurrentView('Tasks & Notes')}
          >
            <ListTodo size={16} />
            <span>Tasks & Notes</span>
          </div>

          <div 
            className={`nav-item ${currentView === 'Calendar' ? 'active' : ''}`}
            onClick={() => setCurrentView('Calendar')}
          >
            <Calendar size={16} />
            <span>Calendar</span>
          </div>

          <div 
            className={`nav-item ${currentView === 'Reports' ? 'active' : ''}`}
            onClick={() => setCurrentView('Reports')}
          >
            <BarChart2 size={16} />
            <span>Reports</span>
          </div>

          <div 
            className={`nav-item ${currentView === 'Settings' ? 'active' : ''}`}
            onClick={() => setCurrentView('Settings')}
          >
            <Settings size={16} />
            <span>Settings</span>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="ai-matchmaker-card">
            <span className="ai-card-title">
              <Sparkles size={12} />
              AI Matchmaker
            </span>
            <span className="ai-card-desc">
              Smart matches. Better connections.
            </span>
            <button className="ai-card-btn" onClick={() => setCurrentView('Reports')}>
              View Insights
            </button>
          </div>

          <button className="logout-btn" onClick={() => alert('Logged out')}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="main-content">
        <header className="header">
          <div className="welcome-section">
            <h1>Welcome back, Sai! 👋</h1>
            <p>Here's what's happening with your matches today.</p>
          </div>

          <div className="header-actions">
            {/* Search Input */}
            <div className="search-bar">
              <Search size={16} style={{ color: '#7A7585' }} />
              <input 
                type="text" 
                placeholder="Search by name, ID or phone..." 
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {/* Notification Bell */}
            <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={18} />
              <span className="notification-badge">{notifications.length}</span>
              
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '44px',
                  right: '0',
                  width: '280px',
                  background: '#FFFFFF',
                  border: '1px solid #ECEBF0',
                  boxShadow: 'var(--shadow-lg)',
                  borderRadius: '12px',
                  padding: '16px',
                  zIndex: '99',
                  color: '#1F1A28'
                }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', borderBottom: '1px solid #ECEBF0', paddingBottom: '8px', display: 'block', marginBottom: '8px' }}>
                    Notifications Logs
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notifications.map(n => (
                      <div key={n.id} style={{ fontSize: '11px', display: 'flex', flexDirection: 'column' }}>
                        <span>{n.text}</span>
                        <span style={{ color: '#7A7585', fontSize: '9px', marginTop: '1px' }}>{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <div className="content-workspace">
          {currentView === 'Dashboard' && (
            <DashboardView 
              stats={stats}
              customers={filteredCustomers}
              selectedCustomer={selectedCustomer}
              onCustomerSelect={setSelectedCustomer}
              onAddCustomerClick={() => setIsAddingCustomer(true)}
              onNavigateToView={(view) => {
                setCurrentView(view);
                // Trigger refresh to load data if navigating to matches or analytics
                fetchData();
              }}
            />
          )}

          {currentView === 'Customers' && (
            <CustomersView 
              customers={filteredCustomers}
              onCustomerSelect={(c) => {
                setSelectedCustomer(c);
                setCurrentView('Dashboard');
              }}
              onAddCustomerClick={() => setIsAddingCustomer(true)}
              onNavigateToView={setCurrentView}
            />
          )}

          {currentView === 'Matches' && (
            <MatchesView customers={customers} />
          )}

          {currentView === 'Tasks & Notes' && (
            <TasksNotesView customers={customers} />
          )}

          {currentView === 'Calendar' && (
            <CalendarView customers={customers} />
          )}

          {currentView === 'Reports' && (
            <ReportsView stats={stats} customers={customers} />
          )}

          {currentView === 'Settings' && (
            <SettingsView />
          )}

          {/* Bottom Information Cards */}
          <div className="bottom-info-section">
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-card-icon-wrapper smart">✨</div>
                <h4 className="info-card-title">Smart Matching</h4>
              </div>
              <p className="info-card-body">
                AI-powered compatibility calculations that examine life goals, location, and lifestyle habits.
              </p>
            </div>

            <div className="info-card">
              <div className="info-card-header">
                <div className="info-card-icon-wrapper privacy">🔒</div>
                <h4 className="info-card-title">Privacy First</h4>
              </div>
              <p className="info-card-body">
                Highly secure client profiles. Client contact data is hidden until verified introductions.
              </p>
            </div>

            <div className="info-card">
              <div className="info-card-header">
                <div className="info-card-icon-wrapper connections">❤️</div>
                <h4 className="info-card-title">Meaningful Connections</h4>
              </div>
              <p className="info-card-body">
                Focusing on psychology-driven values, relational aspirations, and healthy communications.
              </p>
            </div>

            <div className="info-card">
              <div className="info-card-header">
                <div className="info-card-icon-wrapper expert">📈</div>
                <h4 className="info-card-title">Journey Tracking</h4>
              </div>
              <p className="info-card-body">
                Comprehensive status funnels supporting verified matchmakers at each stage.
              </p>
            </div>

            <div className="quote-card">
              <span className="quote-icon" style={{ fontSize: '28px', lineHeight: '1' }}>“</span>
              <div className="quote-body">
                <p className="quote-text">
                  We don't just find matches, we build relationships that last.
                </p>
                <span className="quote-author">- The Date Crew</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Add Customer Modal */}
      {isAddingCustomer && (
        <AddCustomerModal 
          isOpen={isAddingCustomer}
          onClose={() => setIsAddingCustomer(false)}
          onSave={handleAddCustomer}
        />
      )}
    </div>
  );
}
