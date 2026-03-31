import { useState, useEffect } from 'react';
import api from '../services/api';

interface Program {
  id: number;
  name: string;
}

interface SeatMatrix {
  id: number;
  program: {
    name: string;
  };
  quotaType: string;
  intake: number;
  admitted: number;
}

const SeatMatrixPage = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [matrix, setMatrix] = useState<SeatMatrix[]>([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [quotaType, setQuotaType] = useState('KCET');
  const [intake, setIntake] = useState(0);

  useEffect(() => {
    fetchPrograms();
    fetchMatrix();
  }, []);

  const fetchPrograms = async () => {
    const res = await api.get('/master/programs');
    setPrograms(res.data);
  };

  const fetchMatrix = async () => {
    const res = await api.get('/seat-matrix');
    setMatrix(res.data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/seat-matrix', { 
      program: { id: parseInt(selectedProgram) }, 
      quotaType, 
      intake: parseInt(intake.toString()) 
    });
    fetchMatrix();
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Seat Matrix & Quota</h1>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Configure Quota</h2>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Program</label>
            <select value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)} required>
              <option value="">Select Program</option>
              {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Quota</label>
            <select value={quotaType} onChange={e => setQuotaType(e.target.value)} required>
              <option value="KCET">KCET</option>
              <option value="COMEDK">COMEDK</option>
              <option value="Management">Management</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Intake</label>
            <input type="number" value={intake} onChange={e => setIntake(parseInt(e.target.value))} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.625rem 1.5rem' }}>Add</button>
        </form>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Matrix Overview</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Program</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Quota</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Intake</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Admitted</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map(m => (
              <tr key={m.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '0.5rem' }}>{m.program?.name}</td>
                <td style={{ padding: '0.5rem' }}>{m.quotaType}</td>
                <td style={{ padding: '0.5rem' }}>{m.intake}</td>
                <td style={{ padding: '0.5rem' }}>{m.admitted}</td>
                <td style={{ padding: '0.5rem' }}>{m.intake - m.admitted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeatMatrixPage;
