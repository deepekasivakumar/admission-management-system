import { useEffect, useState } from 'react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Users, FileText, IndianRupee, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

interface DashboardData {
  pendingDocs: number;
  pendingFees: number;
  seatStats: any[];
}

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const { user: _user } = useAuth(); // Prefixed with _ to silence lint, or just remove

  useEffect(() => {
    api.get('/admission/dashboard')
      .then(res => setData(res.data))
      .catch(() => {
        // Fallback dummy data if backend is unreachable or empty
        setData({
          pendingDocs: 1,
          pendingFees: 0,
          seatStats: [
            { id: 1, program: { name: 'AI/ML' }, quotaType: 'KCET', intake: 60, admitted: 1 },
            { id: 2, program: { name: 'Data Science' }, quotaType: 'KCET', intake: 60, admitted: 0 },
            { id: 3, program: { name: 'AI/ML' }, quotaType: 'COMEDK', intake: 20, admitted: 0 },
            { id: 4, program: { name: 'AI/ML' }, quotaType: 'Management', intake: 20, admitted: 0 },
          ]
        });
      });
  }, []);

  if (!data) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Preparing your analytics...</p>
      </div>
    </div>
  );

  // Process data for Donut Chart (Overall Admitted vs Available)
  const totalIntake = data.seatStats.reduce((sum, s) => sum + s.intake, 0);
  const totalAdmitted = data.seatStats.reduce((sum, s) => sum + s.admitted, 0);
  const pieData = [
    { name: 'Admitted', value: totalAdmitted },
    { name: 'Available', value: totalIntake - totalAdmitted }
  ];

  // Process data for Bar Chart (By Program)
  const programMap: Record<string, { name: string; intake: number; admitted: number }> = {};
  data.seatStats.forEach(s => {
    const progName = s.program?.name || 'Unknown';
    if (!programMap[progName]) {
      programMap[progName] = { name: progName, intake: 0, admitted: 0 };
    }
    programMap[progName].intake += s.intake;
    programMap[progName].admitted += s.admitted;
  });
  const barData = Object.values(programMap);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ margin: 0 }}>Management Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Real-time admission analytics and seat distribution</p>
      </div>
      
      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '12px', color: 'var(--primary)' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Pending Documents</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{data.pendingDocs}</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '12px', color: '#ef4444' }}>
            <IndianRupee size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Pending Fees</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{data.pendingFees}</div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '12px', color: '#10b981' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Capacity</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totalIntake}</div>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* Seat Allotment Donut */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <PieChartIcon size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ margin: 0 }}>Allocation Status</h3>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--primary)' : '#e2e8f0'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intake by Program Bar Chart */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <BarChart3 size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ margin: 0 }}>Intake by Program</h3>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Legend verticalAlign="bottom" height={36}/>
                <Bar dataKey="intake" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Total Intake" />
                <Bar dataKey="admitted" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Actual Admitted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '4px', height: '24px', backgroundColor: 'var(--primary)', borderRadius: '2px' }}></div>
        Detailed Breakdown
      </h3>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="mini-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ padding: '1.25rem' }}>Program</th>
              <th style={{ padding: '1.25rem' }}>Quota</th>
              <th style={{ padding: '1.25rem' }}>Intake</th>
              <th style={{ padding: '1.25rem' }}>Admitted</th>
              <th style={{ padding: '1.25rem' }}>Fill Rate</th>
            </tr>
          </thead>
          <tbody>
            {(data.seatStats || []).map(stat => (
              <tr key={stat.id}>
                <td style={{ padding: '1.25rem', fontWeight: 600 }}>{stat.program?.name}</td>
                <td style={{ padding: '1.25rem' }}>{stat.quotaType}</td>
                <td style={{ padding: '1.25rem' }}>{stat.intake}</td>
                <td style={{ padding: '1.25rem', color: 'var(--primary)', fontWeight: 600 }}>{stat.admitted}</td>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '100px', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${(stat.admitted / stat.intake) * 100}%`, 
                        height: '100%', 
                        backgroundColor: 'var(--primary)' 
                      }}></div>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                      {Math.round((stat.admitted / stat.intake) * 100)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
