import { useState, useEffect } from 'react';
import { Plus, Search, CheckCircle, CreditCard, UserCheck, Info } from 'lucide-react';
import api from '../services/api';
import Drawer from '../components/Drawer';

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

interface Admission {
  id: number;
  applicant: {
    firstName: string;
    lastName: string;
  };
  seatMatrix: {
    program: {
      name: string;
    };
  };
  feeStatus: string;
  admissionNumber?: string;
  allotmentNumber?: string;
}

const AdmissionPage = () => {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [seatMatrix, setSeatMatrix] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    selectedApplicantId: '',
    allotmentNo: ''
  });

  useEffect(() => {
    fetchAdmissions();
    fetchApplicants();
    fetchSeatMatrix();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const res = await api.get('/admission/all');
      setAdmissions(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchApplicants = async () => {
    try {
      const res = await api.get('/admission/applicants');
      setApplicants(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchSeatMatrix = async () => {
    try {
      const res = await api.get('/seat-matrix');
      setSeatMatrix(res.data);
    } catch (err) { console.error(err); }
  };

  const getRemainingSeats = (programId?: number, quotaType?: string) => {
    if (!programId || !quotaType) return null;
    const matrix = seatMatrix.find(m => m.program?.id === programId && m.quotaType === quotaType);
    return matrix ? matrix.intake - (matrix.admitted + (matrix.locked || 0)) : 0;
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    const applicant = applicants.find(a => a.id === parseInt(formData.selectedApplicantId));
    if (!applicant) return;

    setIsSubmitting(true);
    try {
      await api.post('/admission/allocate', {
        applicantId: applicant.id,
        programId: applicant.appliedProgram?.id,
        quotaType: applicant.quotaType,
        allotmentNumber: formData.allotmentNo
      });
      setIsDrawerOpen(false);
      setFormData({ selectedApplicantId: '', allotmentNo: '' });
      fetchAdmissions();
      fetchSeatMatrix();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error allocating seat');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async (id: number) => {
    try {
      await api.post(`/admission/confirm/${id}`);
      fetchAdmissions();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error confirming admission');
    }
  };

  const handlePayFee = async (id: number) => {
    try {
      await api.patch(`/admission/fee/${id}`, { status: 'Paid' });
      fetchAdmissions();
    } catch (err) { console.error(err); }
  };

  const selectedAppContext = applicants.find(a => a.id === parseInt(formData.selectedApplicantId));
  const remainingSeats = getRemainingSeats(selectedAppContext?.appliedProgram?.id, selectedAppContext?.quotaType);

  const filteredAdmissions = (admissions || []).filter(adm => 
    `${adm.applicant?.firstName} ${adm.applicant?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adm.seatMatrix?.program?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adm.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Admission & Confirmation</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Manage seat allocation and student enrollment status</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              placeholder="Search by student or program..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.75rem', height: '45px', width: '320px', borderRadius: '12px' }}
            />
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)} 
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
          >
            <Plus size={20} /> New Allocation
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="mini-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ padding: '1.25rem', width: '25%' }}>Applicant</th>
              <th style={{ padding: '1.25rem', width: '20%' }}>Program</th>
              <th style={{ padding: '1.25rem', width: '15%' }}>Fee Status</th>
              <th style={{ padding: '1.25rem', width: '20%' }}>Admission ID</th>
              <th style={{ padding: '1.25rem', width: '20%', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmissions.map(adm => (
              <tr key={adm.id}>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ fontWeight: 600 }}>{adm.applicant?.firstName} {adm.applicant?.lastName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Govt ID: {adm.allotmentNumber || 'N/A'}</div>
                </td>
                <td style={{ padding: '1.25rem' }}>{adm.seatMatrix?.program?.name}</td>
                <td style={{ padding: '1.25rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '99px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    backgroundColor: adm.feeStatus === 'Paid' ? '#f0fdf4' : '#fef2f2',
                    color: adm.feeStatus === 'Paid' ? '#10b981' : '#ef4444'
                  }}>
                    {adm.feeStatus}
                  </span>
                </td>
                <td style={{ padding: '1.25rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                  {adm.admissionNumber || 'PENDING'}
                </td>
                <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    {adm.feeStatus !== 'Paid' ? (
                      <button 
                        onClick={() => handlePayFee(adm.id)} 
                        className="btn btn-primary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <CreditCard size={14} /> Pay Fee
                      </button>
                    ) : (
                      !adm.admissionNumber && (
                        <button 
                          onClick={() => handleConfirm(adm.id)} 
                          className="btn" 
                          style={{ 
                            padding: '0.4rem 0.8rem', 
                            fontSize: '0.75rem', 
                            backgroundColor: '#10b981', 
                            color: 'white',
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.4rem' 
                          }}
                        >
                          <CheckCircle size={14} /> Confirm
                        </button>
                      )
                    )}
                    {adm.admissionNumber && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem' }}>
                        <UserCheck size={16} /> Fully Admitted
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredAdmissions.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                  No admission records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="New Seat Allocation"
        footer={
          <>
            <button className="btn" onClick={() => setIsDrawerOpen(false)} style={{ background: '#f1f5f9' }}>Cancel</button>
            <button 
              className="btn btn-primary" 
              onClick={(e) => handleAllocate(e as any)} 
              disabled={isSubmitting || !formData.selectedApplicantId || remainingSeats === 0}
            >
              {isSubmitting ? 'Allocating...' : 'Allocate Seat'}
            </button>
          </>
        }
      >
        <form onSubmit={handleAllocate}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Select Applicant *</label>
              <select 
                value={formData.selectedApplicantId} 
                onChange={e => setFormData({...formData, selectedApplicantId: e.target.value})} 
                required
              >
                <option value="">Choose an applicant...</option>
                {applicants.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.firstName} {a.lastName} ({a.quotaType}) - {a.appliedProgram?.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Govt Allotment Number</label>
              <input 
                placeholder="e.g. KCET-2026-X123"
                value={formData.allotmentNo} 
                onChange={e => setFormData({...formData, allotmentNo: e.target.value})} 
              />
            </div>

            {selectedAppContext && (
              <div style={{ 
                padding: '1.25rem', 
                backgroundColor: remainingSeats === 0 ? '#fef2f2' : '#f0fdf4', 
                borderRadius: '12px', 
                border: `1px solid ${remainingSeats === 0 ? '#fee2e2' : '#dcfce7'}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}>
                <Info size={20} style={{ color: remainingSeats === 0 ? '#ef4444' : '#10b981', marginTop: '0.1rem' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: remainingSeats === 0 ? '#991b1b' : '#166534' }}>
                    Slot Availability Check
                  </div>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    Program: <strong>{selectedAppContext.appliedProgram?.name}</strong><br/>
                    Quota: <strong>{selectedAppContext.quotaType}</strong><br/>
                    Status: <strong style={{ color: remainingSeats === 0 ? '#ef4444' : '#10b981' }}>
                      {remainingSeats !== null ? `${remainingSeats} Seats Left` : 'Checking...'}
                    </strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default AdmissionPage;
