import { useState, useEffect } from 'react';
import { Search, Edit, CheckCircle } from 'lucide-react';
import api from '../services/api';

type MasterType = 'Institution' | 'Campus' | 'Department' | 'Program';

interface MastersPageProps {
  type: MasterType;
}

const MastersPage: React.FC<MastersPageProps> = ({ type }) => {
  console.log('MastersPage Rendering for type:', type);
  const [data, setData] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [parents, setParents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const getEndpoint = () => {
    const lower = type.toLowerCase();
    if (lower === 'institution') return 'institutions';
    if (lower === 'campus') return 'campuses';
    return lower + 's';
  };

  useEffect(() => {
    setData([]);
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
      fetchData();
    } catch (error) {
      console.error('Error saving master:', error);
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
  };

  return (
    <div className="master-container">
      {/* Masters Sidebar Panel: Form + List */}
      <div className="master-sidebar-panel">
        <div className="panel-header">
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {selectedId ? 'Edit' : 'Add'} {type}
          </h2>
        </div>
        
        {/* Fill Form Section */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                {type} Name *
              </label>
              <input 
                placeholder={`Enter ${type.toLowerCase()} name`} 
                value={formData.name || ''} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
                style={{ fontSize: '0.875rem' }}
              />
            </div>

            {(type === 'Institution' || type === 'Campus' || type === 'Department' || type === 'Program') && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                  Code *
                </label>
                <input 
                  placeholder={`Enter ${type.toLowerCase()} code`} 
                  value={formData.code || ''} 
                  onChange={e => setFormData({...formData, code: e.target.value})} 
                  required 
                  style={{ fontSize: '0.875rem' }}
                />
              </div>
            )}

            {type !== 'Institution' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                  Parent {type === 'Campus' ? 'Institution' : type === 'Department' ? 'Campus' : 'Department'} *
                </label>
                <select 
                  value={formData[type === 'Campus' ? 'institution' : type === 'Department' ? 'campus' : 'department']?.id || ''}
                  onChange={e => setFormData({
                    ...formData, 
                    [type === 'Campus' ? 'institution' : type === 'Department' ? 'campus' : 'department']: { id: parseInt(e.target.value) }
                  })}
                  required
                  style={{ fontSize: '0.875rem' }}
                >
                  <option value="">Select Parent</option>
                  {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {selectedId && (
                <button 
                  type="button" 
                  onClick={() => { setSelectedId(null); setFormData({}); }} 
                  className="btn" 
                  style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--border)', fontSize: '0.875rem' }}
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn btn-primary" 
                style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
              >
                {isSubmitting ? 'Saving...' : (selectedId ? 'Update' : 'Save')} {type}
              </button>
            </div>
          </form>
        </div>

        {/* Mini List Section */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div className="panel-header" style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'var(--bg-card)', padding: '0.75rem 1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                placeholder="Quick search..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.25rem', height: '32px', fontSize: '0.75rem', borderRadius: '6px' }}
              />
            </div>
          </div>
          
          <table className="mini-table">
            <thead>
              <tr>
                <th>{type}</th>
                <th style={{ width: '60px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.filter(item => (item.name || '').toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                <tr key={item.id} style={selectedId === item.id ? { backgroundColor: 'rgba(99, 102, 241, 0.1)' } : {}}>
                  <td style={{ fontWeight: 500 }}>
                    {item.name}
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.code}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => handleEdit(item)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '4px' }}
                    >
                      <Edit size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Content Panel: Preview / Details */}
      <div className="master-content-panel">
        <div className="panel-header">
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{type} Overview</h1>
        </div>
        <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
          <div style={{ textAlign: 'center' }}>
            <CheckCircle size={64} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Manager View</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '300px' }}>
              Select a {type.toLowerCase()} from the side menu to view details or perform actions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MastersPage;
