import { useState, useEffect } from 'react';
import api from '../services/api';

interface Program {
  id: number;
  name: string;
}

interface Applicant {
  id: number;
  firstName: string;
  lastName: string;
  quotaType: string;
  documentStatus: string;
  appliedProgram?: {
    id: number;
    name: string;
  };
}

const ApplicantsPage = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    category: 'GM',
    entryType: 'Regular',
    quotaType: 'KCET',
    appliedProgramId: ''
  });

  useEffect(() => {
    fetchApplicants();
    fetchPrograms();
  }, []);

  const fetchApplicants = async () => {
    const res = await api.get('/admission/applicants'); // I need to add this endpoint to backend
    setApplicants(res.data);
  };

  const fetchPrograms = async () => {
    const res = await api.get('/master/programs');
    setPrograms(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/admission/applicant', {
      ...formData,
      appliedProgram: { id: parseInt(formData.appliedProgramId) }
    });
    fetchApplicants();
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Applicants</h1>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Create Applicant</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <input placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
          <input placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
          <input placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option value="GM">GM</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>
          <select value={formData.quotaType} onChange={e => setFormData({...formData, quotaType: e.target.value})}>
            <option value="KCET">KCET</option>
            <option value="COMEDK">COMEDK</option>
            <option value="Management">Management</option>
          </select>
          <select value={formData.appliedProgramId} onChange={e => setFormData({...formData, appliedProgramId: e.target.value})} required>
            <option value="">Select Program</option>
            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button type="submit" className="btn btn-primary">Create Applicant</button>
        </form>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Applicant List</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Quota</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Program</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Doc Status</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map(app => (
              <tr key={app.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '0.5rem' }}>{app.firstName} {app.lastName}</td>
                <td style={{ padding: '0.5rem' }}>{app.quotaType}</td>
                <td style={{ padding: '0.5rem' }}>{app.appliedProgram?.name}</td>
                <td style={{ padding: '0.5rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem',
                    backgroundColor: app.documentStatus === 'Verified' ? 'var(--success-bg)' : 'var(--warning-bg)',
                    color: app.documentStatus === 'Verified' ? 'var(--success)' : 'var(--warning)'
                  }}>
                    {app.documentStatus}
                  </span>
                </td>
                <td style={{ padding: '0.5rem' }}>
                  {app.documentStatus !== 'Verified' && (
                    <button 
                      onClick={async () => {
                        await api.patch(`/admission/applicant/${app.id}/status`, { status: 'Verified' });
                        fetchApplicants();
                      }}
                      className="btn btn-primary"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    >
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicantsPage;
