import { useState, useEffect } from 'react';
import api from '../services/api';

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
}

const AdmissionPage = () => {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [seatMatrix, setSeatMatrix] = useState<any[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState('');
  const [allotmentNo, setAllotmentNo] = useState('');

  useEffect(() => {
    fetchAdmissions();
    fetchApplicants();
    fetchSeatMatrix();
  }, []);

  const fetchAdmissions = async () => {
    const res = await api.get('/admission/all');
    setAdmissions(res.data);
  };

  const fetchApplicants = async () => {
    const res = await api.get('/admission/applicants');
    setApplicants(res.data);
  };

  const fetchSeatMatrix = async () => {
    const res = await api.get('/seat-matrix');
    setSeatMatrix(res.data);
  };

  const getRemainingSeats = (programId?: number, quotaType?: string) => {
    if (!programId || !quotaType) return null;
    const matrix = seatMatrix.find(m => m.program?.id === programId && m.quotaType === quotaType);
    return matrix ? matrix.intake - (matrix.admitted + matrix.locked) : 0;
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    const applicant = applicants.find(a => a.id === parseInt(selectedApplicant));
    if (!applicant) return;

    try {
      await api.post('/admission/allocate', {
        applicantId: applicant.id,
        programId: applicant.appliedProgram?.id,
        quotaType: applicant.quotaType,
        allotmentNumber: allotmentNo
      });
      fetchAdmissions();
      fetchSeatMatrix();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error allocating seat');
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
    await api.patch(`/admission/fee/${id}`, { status: 'Paid' });
    fetchAdmissions();
  };

  const selectedAppContext = applicants.find(a => a.id === parseInt(selectedApplicant));
  const remainingSeats = getRemainingSeats(selectedAppContext?.appliedProgram?.id, selectedAppContext?.quotaType);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Admission Allocation & Confirmation</h1>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>New Allocation</h2>
        <form onSubmit={handleAllocate} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 1fr 150px auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Applicant</label>
            <select value={selectedApplicant} onChange={e => setSelectedApplicant(e.target.value)} required>
              <option value="">Select Applicant</option>
              {applicants.map(a => <option key={a.id} value={a.id}>{a.firstName} {a.lastName} ({a.quotaType}) - {a.documentStatus}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Allotment Number (Govt.)</label>
            <input value={allotmentNo} onChange={e => setAllotmentNo(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Availability</label>
            <div style={{ 
              padding: '0.625rem', 
              border: '1px solid var(--border)', 
              borderRadius: '4px', 
              backgroundColor: 'var(--bg-secondary)',
              color: remainingSeats === 0 ? 'var(--error)' : 'var(--success)',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              {remainingSeats !== null ? `${remainingSeats} Seats` : '-'}
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={remainingSeats === 0}>Allocate Seat</button>
        </form>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Admission Status</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Applicant</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Program</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Fee Status</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Adm. Number</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admissions.map(adm => (
              <tr key={adm.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '0.5rem' }}>{adm.applicant?.firstName} {adm.applicant?.lastName}</td>
                <td style={{ padding: '0.5rem' }}>{adm.seatMatrix?.program?.name}</td>
                <td style={{ padding: '0.5rem' }}>
                  <span style={{ color: adm.feeStatus === 'Paid' ? 'var(--success)' : 'var(--error)' }}>
                    {adm.feeStatus}
                  </span>
                </td>
                <td style={{ padding: '0.5rem' }}>{adm.admissionNumber || 'Not Generated'}</td>
                <td style={{ padding: '0.5rem' }}>
                  {adm.feeStatus !== 'Paid' && (
                    <button onClick={() => handlePayFee(adm.id)} className="btn btn-primary" style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Pay Fee</button>
                  )}
                  {!adm.admissionNumber && adm.feeStatus === 'Paid' && (
                    <button onClick={() => handleConfirm(adm.id)} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: 'var(--success)' }}>Confirm</button>
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

export default AdmissionPage;
