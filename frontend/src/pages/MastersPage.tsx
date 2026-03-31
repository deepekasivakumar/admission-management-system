import { useState, useEffect } from 'react';
import api from '../services/api';

interface Institution {
  id: number;
  name: string;
  code: string;
}

const MastersPage = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    const res = await api.get('/master/institutions');
    setInstitutions(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/master/institutions', { name, code });
    setName('');
    setCode('');
    fetchInstitutions();
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Master Setup</h1>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Create Institution</h2>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Code</label>
            <input value={code} onChange={e => setCode(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.625rem 1.5rem' }}>Add</button>
        </form>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Institutions</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Code</th>
            </tr>
          </thead>
          <tbody>
            {institutions.map(inst => (
              <tr key={inst.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '0.5rem' }}>{inst.id}</td>
                <td style={{ padding: '0.5rem' }}>{inst.name}</td>
                <td style={{ padding: '0.5rem' }}>{inst.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MastersPage;
