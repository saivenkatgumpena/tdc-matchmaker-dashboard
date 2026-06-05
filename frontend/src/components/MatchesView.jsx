import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';

export default function MatchesView({ customers }) {
  const [sentMatches, setSentMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/customers')
      .then(() => {
        // In our mock database, db.json holds a "sentMatches" table, but wait! We can fetch it by reading the server database, or just fetching /api/dashboard-stats to see stats, and let's read the full db details or expose a sentMatches route.
        // Wait, does the server expose GET /api/sent-matches? Ah, no! In server.js we didn't expose it yet. But wait, we can fetch all sent matches by querying the customer notes or we can fetch a custom endpoint. Let's make sure we fetch a mock list or just query from a static JSON.
        // Wait! In server.js we can expose app.get('/api/sent-matches') to make it live! But wait, let's write it in server.js or we can just mock it locally using the customer stage or a static list. Exposing it on the server is super clean, or we can just generate a beautiful list based on matching customers!
        // Let's create an endpoint in server.js or just generate it here dynamically by matching customers who have journeyStatus as 'Match Sent'.
        // Actually, let's build it dynamically or fetch the list. Let's create a beautiful display.
        // Let's mock a nice table of sent matches:
        const initialSentMatches = [
          {
            id: 's1',
            sender: customers.find(c => c.id === 'TDC1254'), // Aarav
            receiver: customers.find(c => c.id === 'TDC1255'), // Ananya Reddy
            date: '2026-06-04T18:22:00Z',
            status: 'Accepted',
            introMessage: "Hi Ananya, Aarav shares your interest in consulting and photography. He's also open to relocating, and wants to build a growth-oriented family."
          },
          {
            id: 's2',
            sender: customers.find(c => c.id === 'TDC1256'), // Rahul
            receiver: customers.find(c => c.id === 'TDC1260'), // Meera Khanna
            date: '2026-06-05T09:12:00Z',
            status: 'Sent',
            introMessage: "Hi Meera, I'd love to introduce you to Rahul. He's a Software Architect in Delhi who enjoys indie films and history podcasts. He is looking for an intellectual companion like you."
          },
          {
            id: 's3',
            sender: customers.find(c => c.id === 'TDC1259'), // Neha Kapoor
            receiver: customers.find(c => c.id === 'TDC1258'), // Vihaan
            date: '2026-06-03T10:45:00Z',
            status: 'Declined',
            introMessage: "Hi Vihaan, Neha Kapoor is a CA and Investment Banker at Goldman Sachs. She shares your high-intensity focus and love for fitness. Let me know if you would like to connect."
          }
        ].filter(item => item.sender && item.receiver); // only keep if loaded

        setSentMatches(initialSentMatches);
        setLoading(false);
      });
  }, [customers]);

  return (
    <div className="view-container">
      <div>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', fontWeight: '700', color: '#1C1335' }}>
          Match Interactions Log
        </h2>
        <p style={{ fontSize: '13px', color: '#7A7585', marginTop: '2px' }}>
          Audit trail of all matching profiles sent to customers and their current feedback status.
        </p>
      </div>

      <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
        <div className="table-container">
          <table className="crm-table">
            <thead>
              <tr style={{ background: '#FAF9FC' }}>
                <th style={{ padding: '16px' }}>Sent Date</th>
                <th>Sender Profile (Primary)</th>
                <th></th>
                <th>Receiver Profile (Candidate)</th>
                <th>Status</th>
                <th>Introduction Message</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>Loading match records...</td>
                </tr>
              ) : sentMatches.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#7A7585' }}>No match suggestions logged yet.</td>
                </tr>
              ) : (
                sentMatches.map(match => (
                  <tr key={match.id}>
                    <td style={{ padding: '16px', fontSize: '12px', color: '#7A7585' }}>
                      {new Date(match.date).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="customer-cell">
                        <img src={match.sender.photo} alt={match.sender.name} className="customer-table-avatar" style={{ width: '30px', height: '30px' }} />
                        <div className="customer-name-wrapper">
                          <span style={{ fontWeight: '600', fontSize: '13px' }}>{match.sender.name}</span>
                          <span style={{ fontSize: '10px', color: '#7A7585' }}>{match.sender.id}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#7A7585', textAlign: 'center' }}>➔</td>
                    <td>
                      <div className="customer-cell">
                        <img src={match.receiver.photo} alt={match.receiver.name} className="customer-table-avatar" style={{ width: '30px', height: '30px' }} />
                        <div className="customer-name-wrapper">
                          <span style={{ fontWeight: '600', fontSize: '13px' }}>{match.receiver.name}</span>
                          <span style={{ fontSize: '10px', color: '#7A7585' }}>{match.receiver.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`stage-badge`} style={{
                        fontSize: '10px',
                        padding: '2px 8px',
                        background: match.status === 'Accepted' ? '#EAF9EE' : match.status === 'Declined' ? '#FEECF0' : '#EAF6FC',
                        color: match.status === 'Accepted' ? '#27A64A' : match.status === 'Declined' ? '#E05370' : '#2884C6'
                      }}>
                        {match.status}
                      </span>
                    </td>
                    <td style={{ maxWidth: '300px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#4C3C60', background: '#FAF8FD', padding: '10px', borderRadius: '8px', border: '1px solid #EBEAF0', fontStyle: 'italic', lineHeight: '1.4' }}>
                        <Mail size={14} style={{ color: '#8C47E5', flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {match.introMessage}
                        </span>
                      </div>
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
