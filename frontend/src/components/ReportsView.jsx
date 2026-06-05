import { Users, CheckCircle, Send, Award, PieChart, BarChart } from 'lucide-react';

export default function ReportsView({ stats, customers }) {
  // Compute counts per journey stage
  const stages = [
    'Profile Verification',
    'Actively Matching',
    'Shortlisted',
    'Match Sent',
    'Meeting Scheduled',
    'Meeting Completed',
    'Relationship Building'
  ];

  const counts = stages.reduce((acc, stage) => {
    acc[stage] = customers.filter(c => c.journeyStatus === stage).length;
    return acc;
  }, {});

  const total = customers.length || 1;

  // Let's compute some additional mock metrics
  const completionRate = "85%";
  const matchSuccessRate = "72%";

  return (
    <div className="view-container">
      <div>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', fontWeight: '700', color: '#1C1335' }}>
          TDC Performance Analytics
        </h2>
        <p style={{ fontSize: '13px', color: '#7A7585', marginTop: '2px' }}>
          Real-time metrics indicating customer matching rates, verified stages, and CRM activity.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon-wrapper customers">
            <Users size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Registered</span>
            <h3 className="stat-value">{stats.totalCustomers}</h3>
            <span style={{ fontSize: '10px', color: '#7A7585' }}>Active CRM database</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper journeys">
            <CheckCircle size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Verified Profiles</span>
            <h3 className="stat-value">{stats.profilesVerified}</h3>
            <span style={{ fontSize: '10px', color: '#27A64A', fontWeight: '600' }}>
              {Math.round((stats.profilesVerified / stats.totalCustomers) * 100)}% Verification rate
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper sent">
            <Send size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Intro Suggestions</span>
            <h3 className="stat-value">{stats.matchesSent}</h3>
            <span style={{ fontSize: '10px', color: '#7A7585' }}>Sent matches total</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper meetings">
            <Award size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Meeting Success</span>
            <h3 className="stat-value">{completionRate}</h3>
            <span style={{ fontSize: '10px', color: '#2884C6', fontWeight: '600' }}>Completion index</span>
          </div>
        </div>
      </div>

      {/* Graphical Chart layout */}
      <div className="reports-charts-row">
        {/* Journey Funnel */}
        <div className="chart-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BarChart size={18} style={{ color: '#E05370' }} />
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '15px', fontWeight: '700' }}>
              Customer Distribution Funnel
            </h3>
          </div>
          <p style={{ fontSize: '11px', color: '#7A7585', marginBottom: '16px' }}>
            The stages of customer matchmaking lifecycle from registration to relationship building.
          </p>

          <div className="funnel-container">
            {stages.map((stage, idx) => {
              const count = counts[stage] || 0;
              const percentage = Math.round((count / total) * 100);
              
              return (
                <div key={idx} className="funnel-bar-row">
                  <span className="funnel-label">
                    {stage === 'Profile Verification' ? 'Profile Complete' : 
                     stage === 'Actively Matching' ? 'In Matching' : stage}
                  </span>
                  <div className="funnel-bar-track">
                    <div 
                      className="funnel-bar-fill" 
                      style={{ 
                        width: `${Math.max(percentage, 5)}%`, // min width to show label if 0
                        background: `linear-gradient(90deg, #E05370 0%, #8C47E5 100%)`
                      }}
                    >
                      <span className="funnel-value">{count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quality metrics */}
        <div className="chart-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <PieChart size={18} style={{ color: '#8C47E5' }} />
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '15px', fontWeight: '700' }}>
              CRM Matchmaker Efficiency Index
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ECEBF0', paddingBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#1C1335', fontWeight: '600' }}>Average Matching Window</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#8C47E5' }}>14 Days</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ECEBF0', paddingBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#1C1335', fontWeight: '600' }}>Match Intro Accept Rate</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#27A64A' }}>{matchSuccessRate}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ECEBF0', paddingBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#1C1335', fontWeight: '600' }}>AI Recommendation Override Rate</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#E05370' }}>18%</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '4px' }}>
              <span style={{ fontSize: '13px', color: '#1C1335', fontWeight: '600' }}>Monthly Retention Rate</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#2884C6' }}>98.4%</span>
            </div>
          </div>

          <div style={{ background: '#FAF8FD', padding: '16px', borderRadius: '12px', marginTop: '20px', border: '1px dashed #8C47E5' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#8C47E5', display: 'block', marginBottom: '4px' }}>
              ✨ Smart CRM Analytics Advice
            </span>
            <span style={{ fontSize: '11.5px', color: '#4C3C60', lineHeight: '1.4', display: 'block' }}>
              Our AI compatibility threshold of 85% yields a 72% introduction success rate. Advise matchmakers to prioritize "High Potential" labels in the Suggestions module to boost schedule numbers.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
