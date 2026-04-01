import { useState, useEffect } from 'react';
import { Search, Edit, CheckCircle } from 'lucide-react';
import api from '../services/api';
import Drawer from '../components/Drawer';

type MasterType = 'Institution' | 'Campus' | 'Department' | 'Program';

interface MastersPageProps {
  type: MasterType;
}

const MastersPage: React.FC<MastersPageProps> = ({ type }) => {
  const [data, setData] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [parents, setParents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getEndpoint = () => {
    const lower = type.toLowerCase();
    if (lower === 'institution') return 'institutions';
    if (lower === 'campus') return 'campuses';
    return lower + 's';
  };

  const getPluralTitle = () => {
    if (type === 'Campus') return 'Campuses';
    return `${type}s`;
  };

  useEffect(() => {
    setData([]);
    setIsDrawerOpen(false);
    fetchData();
    fetchParents();
    setFormData({});
    setSelectedId(null);
  }, [type]);

  const fetchData = async () => {
    try {
      const res = await api.get(`/master/${getEndpoint()}`);
      setData(res.data);
    } catch (error) {
      console.error('Error fetching master data:', error);
      setData([]);
    }
  };

  const fetchParents = async () => {
    let parentEndpoint = '';
    if (type === 'Campus') parentEndpoint = 'institutions';
    else if (type === 'Department') parentEndpoint = 'campuses';
    else if (type === 'Program') parentEndpoint = 'departments';

    if (parentEndpoint) {
      try {
        const res = await api.get(`/master/${parentEndpoint}`);
        setParents(res.data);
      } catch (error) {
        console.error('Error fetching parent data:', error);
        setParents([]);
      }
    } else {
      setParents([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const endpoint = getEndpoint();
      if (selectedId) {
        await api.put(`/master/${endpoint}/${selectedId}`, formData);
      } else {
        await api.post(`/master/${endpoint}`, formData);
      }
      setFormData({});
      setSelectedId(null);
      setIsDrawerOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving master:', error);
      alert('Error saving data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: any) => {
    setSelectedId(item.id);
    const updatedForm = { ...item };
    if (item.institution) updatedForm.institution = { id: item.institution.id };
    if (item.campus) updatedForm.campus = { id: item.campus.id };
    if (item.department) updatedForm.department = { id: item.department.id };
    setFormData(updatedForm);
    setIsDrawerOpen(true);
  };

  const getParentName = (item: any) => {
    if (type === 'Campus') return item.institution?.name || 'N/A';
    if (type === 'Department') return item.campus?.name || 'N/A';
    if (type === 'Program') return item.department?.name || 'N/A';
    return '';
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>{getPluralTitle()}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Manage your organizational hierarchy and master data</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              placeholder={`Search ${getPluralTitle().toLowerCase()}...`} 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.75rem', height: '45px', width: '350px', borderRadius: '12px' }}
            />
          </div>
          <button 
            onClick={() => { setFormData({}); setSelectedId(null); setIsDrawerOpen(true); }} 
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <CheckCircle size={20} /> Add New {type}
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="mini-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ padding: '1.25rem', width: '15%' }}>Code</th>
              <th style={{ padding: '1.25rem', width: '45%' }}>{type} Name</th>
              {type !== 'Institution' && <th style={{ padding: '1.25rem', width: '25%' }}>Parent</th>}
              <th style={{ padding: '1.25rem', textAlign: 'center', width: '15%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.filter(item => (item.name || '').toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
              <tr key={item.id}>
                <td style={{ padding: '1.25rem', fontWeight: 600, color: 'var(--primary)' }}>{item.code}</td>
                <td style={{ padding: '1.25rem' }}>{item.name}</td>
                {type !== 'Institution' && (
                  <td style={{ padding: '1.25rem', color: 'var(--text-muted)' }}>{getParentName(item)}</td>
                )}
                <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <button 
                    onClick={() => handleEdit(item)}
                    className="btn"
                    style={{ background: '#f1f5f9', color: 'var(--primary)', padding: '0.5rem' }}
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={type === 'Institution' ? 3 : 4} style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                  <div style={{ opacity: 0.5 }}>
                    <Search size={48} style={{ marginBottom: '1rem' }} />
                    <p>No {type.toLowerCase()} records found yet.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title={`${selectedId ? 'Edit' : 'Add New'} ${type}`}
        footer={
          <>
            <button className="btn" onClick={() => setIsDrawerOpen(false)} style={{ background: '#f1f5f9' }}>Cancel</button>
            <button className="btn btn-primary" onClick={(e) => handleSubmit(e as any)} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{type} Name *</label>
            <input 
              placeholder={`Enter ${type.toLowerCase()} name`} 
              value={formData.name || ''} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>

          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Code / Identifier *</label>
            <input 
              placeholder={`Enter ${type.toLowerCase()} code`} 
              value={formData.code || ''} 
              onChange={e => setFormData({...formData, code: e.target.value})} 
              required 
            />
          </div>

          {type !== 'Institution' && (
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                Parent {type === 'Campus' ? 'Institution' : type === 'Department' ? 'Campus' : 'Department'} *
              </label>
              <select 
                value={formData[type === 'Campus' ? 'institution' : type === 'Department' ? 'campus' : 'department']?.id || ''}
                onChange={e => setFormData({
                  ...formData, 
                  [type === 'Campus' ? 'institution' : type === 'Department' ? 'campus' : 'department']: { id: parseInt(e.target.value) }
                })}
                required
              >
                <option value="">-- Select Parent --</option>
                {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}
        </form>
      </Drawer>
    </div>
  );
};

export default MastersPage;
