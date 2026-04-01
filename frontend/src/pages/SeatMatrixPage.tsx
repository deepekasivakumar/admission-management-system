import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import api from '../services/api';
import Drawer from '../components/Drawer';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    selectedProgramId: '',
    quotaType: 'KCET',
    intake: 0
  });

  useEffect(() => {
    fetchPrograms();
    fetchMatrix();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await api.get('/master/programs');
      setPrograms(res.data);
    } catch (err) {
      console.error('Error fetching programs:', err);
    }
  };

  const fetchMatrix = async () => {
    try {
      const res = await api.get('/seat-matrix');
      setMatrix(res.data);
    } catch (err) {
      console.error('Error fetching matrix:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/seat-matrix', {
        program: { id: parseInt(formData.selectedProgramId) },
        quotaType: formData.quotaType,
        intake: parseInt(formData.intake.toString())
      });
      setIsDrawerOpen(false);
      setFormData({ selectedProgramId: '', quotaType: 'KCET', intake: 0 });
      fetchMatrix();
    } catch (err) {
      console.error('Error creating seat matrix:', err);
      alert('Failed to save quota configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Seat Matrix & Quotas</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Configure student intake capacity for each program</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              placeholder="Search matrix..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.75rem', height: '45px', width: '300px', borderRadius: '12px' }}
            />
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)} 
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
          >
            <Plus size={20} /> Add New Quota
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="mini-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ padding: '1.25rem', width: '35%' }}>Program</th>
              <th style={{ padding: '1.25rem', width: '20%' }}>Quota</th>
              <th style={{ padding: '1.25rem', width: '15%' }}>Intake</th>
              <th style={{ padding: '1.25rem', width: '15%' }}>Admitted</th>
              <th style={{ padding: '1.25rem', width: '15%' }}>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {(matrix || []).filter(m => m.program?.name.toLowerCase().includes(searchTerm.toLowerCase())).map(m => (
              <tr key={m.id}>
                <td style={{ padding: '1.25rem', fontWeight: 600 }}>{m.program?.name}</td>
                <td style={{ padding: '1.25rem' }}>{m.quotaType}</td>
                <td style={{ padding: '1.25rem' }}>
                  <span style={{ fontWeight: 600 }}>{m.intake}</span>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{m.admitted}</span>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '99px', 
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    backgroundColor: (m.intake - m.admitted) > 0 ? '#eff6ff' : '#fef2f2',
                    color: (m.intake - m.admitted) > 0 ? '#2563eb' : '#dc2626'
                  }}>
                    {m.intake - m.admitted} Available
                  </span>
                </td>
              </tr>
            ))}
            {matrix.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                  No quotas configured yet. Click "Add New Quota" to start.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Configure Seat Capacity"
        footer={
          <>
            <button className="btn" onClick={() => setIsDrawerOpen(false)} style={{ background: '#f1f5f9' }}>Cancel</button>
            <button className="btn btn-primary" onClick={(e) => handleSubmit(e as any)} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Configuration'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Target Program *</label>
              <select 
                value={formData.selectedProgramId} 
                onChange={e => setFormData({...formData, selectedProgramId: e.target.value})} 
                required
              >
                <option value="">Select Program</option>
                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Admission Quota *</label>
              <select 
                value={formData.quotaType} 
                onChange={e => setFormData({...formData, quotaType: e.target.value})} 
                required
              >
                <option value="KCET">KCET</option>
                <option value="COMEDK">COMEDK</option>
                <option value="Management">Management</option>
                <option value="NRI">NRI</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Total Intake Capacity *</label>
              <input 
                type="number" 
                placeholder="Enter number of seats"
                value={formData.intake} 
                onChange={e => setFormData({...formData, intake: parseInt(e.target.value) || 0})} 
                required 
                min="1"
              />
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                <strong>Tip:</strong> This will set the total number of seats available for the selected program under this specific quota category.
              </p>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default SeatMatrixPage;
