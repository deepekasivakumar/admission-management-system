import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface DashboardData {
  pendingDocs: number;
  pendingFees: number;
  seatStats: any[];
}

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/admission/dashboard')
      .then(res => setData(res.data))
      .catch(() => {
        // Fallback dummy data if backend is unreachable
        setData({
          pendingDocs: 15,
          pendingFees: 12,
          seatStats: [
            { id: 1, program: { name: 'Computer Science' }, quotaType: 'KCET', intake: 60, admitted: 45 },
            { id: 2, program: { name: 'Information Science' }, quotaType: 'COMEDK', intake: 30, admitted: 10 },
          ]
        });
      });
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Welcome, {user?.username}</h1>
      
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-label">Pending Documents</div>
          <div className="stat-value">{data.pendingDocs}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Fees</div>
          <div className="stat-value">{data.pendingFees}</div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Seat Matrix Status</h2>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Program</th>
              <th>Quota</th>
              <th>Intake</th>
              <th>Admitted</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {(data.seatStats || []).map(stat => (
              <tr key={stat.id}>
                <td>{stat.program?.name}</td>
                <td>{stat.quotaType}</td>
                <td>{stat.intake}</td>
                <td>{stat.admitted}</td>
                <td>{stat.intake - stat.admitted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
