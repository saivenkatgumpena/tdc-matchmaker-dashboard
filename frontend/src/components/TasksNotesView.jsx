import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Trash2, FileText, User } from 'lucide-react';

export default function TasksNotesView() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Verify Vihaan Malhotra's medical license ID", completed: false },
    { id: 2, text: "Schedule matching session for Rahul Verma", completed: true },
    { id: 3, text: "Call Aarav Sharma to review Ananya's feedback", completed: false },
    { id: 4, text: "Examine drinking habits compatibility for Meera Nair", completed: false },
    { id: 5, text: "Follow up on Neha Kapoor's completed meeting feedback", completed: false }
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    // Collect all notes from the backend database or simulate
    // We can fetch notes from the database. Let's do it by loading from the backend for all customers, or fetch Aarav's notes and make up a few general logs.
    // Let's call /api/customers/TDC1254/notes to fetch Aarav's and combine with some general mock logs.
    fetch('/api/customers/TDC1254/notes')
      .then(res => res.json())
      .then(aaravNotes => {
        const mockGeneralLogs = [
          {
            id: 'g1',
            customerName: 'Aarav Sharma',
            customerId: 'TDC1254',
            date: '2026-06-04T10:00:00Z',
            content: aaravNotes[0]?.content || "Aarav called. He mentioned he is very interested in Ananya Iyer. He likes that they both share a background in consulting/tech."
          },
          {
            id: 'g2',
            customerName: 'Neha Kapoor',
            customerId: 'TDC1259',
            date: '2026-06-05T09:30:00Z',
            content: "Call completed. Neha is excited for the meeting scheduled with Vihaan. She requested if we can verify his weekend shift schedules before setting up the location."
          },
          {
            id: 'g3',
            customerName: 'Meera Nair',
            customerId: 'TDC1257',
            date: '2026-06-03T14:15:00Z',
            content: "Profile interview logged. Meera highlighted she wants to proceed slowly given her divorce history. Prefers partners based in Pune or Mumbai."
          },
          {
            id: 'g4',
            customerName: 'Rahul Verma',
            customerId: 'TDC1256',
            date: '2026-06-02T16:00:00Z',
            content: "Match suggestion shortlisted: Meera Khanna. Compatibility computed at 89%. AI explanation indicates strong cultural alignment."
          }
        ];
        setActivityLogs(mockGeneralLogs);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks(prev => [
      ...prev,
      { id: Date.now(), text: newTaskText, completed: false }
    ]);
    setNewTaskText('');
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="view-container">
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Left Column: Task board */}
        <div style={{ flex: 1 }}>
          <div className="card" style={{ height: '100%' }}>
            <div className="card-header">
              <div className="card-title-section">
                <ClipboardList size={18} style={{ color: '#E05370' }} />
                <h2 className="card-title">Matchmaker Tasks</h2>
              </div>
              <span className="card-badge">{tasks.filter(t => !t.completed).length} Pending</span>
            </div>

            {/* Task Form */}
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Add daily task (e.g. call profile, check file)..." 
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                style={{ flex: 1, fontSize: '13px' }}
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center' }}>
                <Plus size={16} />
                Add
              </button>
            </form>

            {/* Tasks list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    background: task.completed ? '#F8F9FC' : '#FFFFFF', 
                    padding: '12px 16px', 
                    borderRadius: '8px', 
                    border: '1px solid #ECEBF0',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => toggleTask(task.id)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#E05370' }}
                    />
                    <span style={{ 
                      fontSize: '13px', 
                      color: task.completed ? '#7A7585' : '#1C1335',
                      textDecoration: task.completed ? 'line-through' : 'none'
                    }}>
                      {task.text}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)} 
                    style={{ background: 'transparent', border: 'none', color: '#B4B0BE', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} className="hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Global Notes feed */}
        <div style={{ flex: 1.2 }}>
          <div className="card" style={{ height: '100%' }}>
            <div className="card-header">
              <div className="card-title-section">
                <FileText size={18} style={{ color: '#8C47E5' }} />
                <h2 className="card-title">Recent Activity Logs</h2>
              </div>
            </div>

            <div className="notes-list" style={{ gap: '14px' }}>
              {activityLogs.map(log => (
                <div key={log.id} className="note-item" style={{ borderLeft: '3px solid #8C47E5', background: '#FAF9FC' }}>
                  <div className="note-header">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: '#1C1335' }}>
                      <User size={12} style={{ color: '#7A7585' }} />
                      {log.customerName} ({log.customerId})
                    </span>
                    <span>{new Date(log.date).toLocaleString()}</span>
                  </div>
                  <p className="note-content" style={{ fontSize: '12.5px', marginTop: '6px' }}>{log.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
