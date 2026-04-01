import { useState, useEffect } from 'react';
import { UserPlus, Search, CheckCircle } from 'lucide-react';
import api from '../services/api';
import Drawer from '../components/Drawer';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    try {
      const res = await api.get('/admission/applicants');
      setApplicants(res.data);
    } catch (err) {
      console.error('Error fetching applicants:', err);
    }
  };

  const fetchPrograms = async () => {
    try {
      const res = await api.get('/master/programs');
      setPrograms(res.data);
    } catch (err) {
      console.error('Error fetching programs:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admission/applicant', {
        ...formData,
        appliedProgram: { id: parseInt(formData.appliedProgramId) }
      });
      setIsDrawerOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        category: 'GM',
        entryType: 'Regular',
        quotaType: 'KCET',
        appliedProgramId: ''
      });
      fetchApplicants();
    } catch (err) {
      console.error('Error creating applicant:', err);
      alert('Failed to register applicant. Please check your data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (id: number) => {
    try {
      await api.patch(`/admission/verify/${id}`, { status: 'Verified' });
      fetchApplicants();
    } catch (err) {
      console.error('Error verifying applicant:', err);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Applicants</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Manage and verify student applications</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              placeholder="Search applicants..." 
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
            <UserPlus size={20} /> Register Applicant
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="mini-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ padding: '1.25rem', width: '30%' }}>Applicant Name</th>
              <th style={{ padding: '1.25rem', width: '25%' }}>Program</th>
              <th style={{ padding: '1.25rem', width: '15%' }}>Quota</th>
              <th style={{ padding: '1.25rem', width: '15%' }}>Status</th>
              <th style={{ padding: '1.25rem', textAlign: 'center', width: '15%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(applicants || []).filter(a => `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())).map(a => (
              <tr key={a.id}>
                <td style={{ padding: '1.25rem', fontWeight: 600 }}>{a.firstName} {a.lastName}</td>
                <td style={{ padding: '1.25rem' }}>{a.appliedProgram?.name || 'N/A'}</td>
                <td style={{ padding: '1.25rem' }}>{a.quotaType}</td>
                <td style={{ padding: '1.25rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '99px', 
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    backgroundColor: a.documentStatus === 'Verified' ? '#ecfdf5' : '#fff7ed',
                    color: a.documentStatus === 'Verified' ? '#059669' : '#d97706'
                  }}>
                    {a.documentStatus}
                  </span>
                </td>
                <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                  {a.documentStatus === 'Pending' ? (
                    <button onClick={() => handleVerify(a.id)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      Verify Docs
                    </button>
                  ) : (
                    <CheckCircle size={18} color="var(--success)" />
                  )}
                </td>
              </tr>
            ))}
            {applicants.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                  No applicants found. Click "Register Applicant" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Register New Applicant"
        footer={
          <>
            <button className="btn" onClick={() => setIsDrawerOpen(false)} style={{ background: '#f1f5f9' }}>Cancel</button>
            <button className="btn btn-primary" onClick={(e) => handleSubmit(e as any)} disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register Student'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>First Name *</label>
              <input 
                placeholder="Enter first name"
                value={formData.firstName} 
                onChange={e => setFormData({...formData, firstName: e.target.value})} 
                required 
              />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Last Name *</label>
              <input 
                placeholder="Enter last name"
                value={formData.lastName} 
                onChange={e => setFormData({...formData, lastName: e.target.value})} 
                required 
              />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Email Address *</label>
              <input 
                type="email" 
                placeholder="email@example.com"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Phone Number *</label>
              <input 
                placeholder="Phone number"
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
                required 
              />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Caste Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="GM">GM</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OBC">OBC</option>
              </select>
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Admission Quota</label>
              <select value={formData.quotaType} onChange={e => setFormData({...formData, quotaType: e.target.value})}>
                <option value="KCET">KCET</option>
                <option value="COMEDK">COMEDK</option>
                <option value="Management">Management</option>
                <option value="NRI">NRI</option>
              </select>
            </div>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Applied Program *</label>
              <select value={formData.appliedProgramId} onChange={e => setFormData({...formData, appliedProgramId: e.target.value})} required>
                <option value="">Select Program</option>
                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default ApplicantsPage;
