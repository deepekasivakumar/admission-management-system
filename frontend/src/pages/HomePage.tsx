import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, Users, UserPlus, Settings, BookOpen } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
        padding: '3rem',
        textAlign: 'center',
        borderRadius: '24px',
        border: '1px solid var(--border)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>
          {getGreeting()}, <span style={{ color: 'var(--primary)' }}>{user?.username || 'User'}</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          Welcome to the **Admission CRM Portal**. You are logged in with **{user?.role}** privileges. 
          Use the side menu to navigate through your assigned modules.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          {user?.role === 'ADMIN' && (
            <>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'left' }}>
                <BookOpen size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>Setup Masters</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Configure Universities, Campuses, and Programs.</p>
              </div>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'left' }}>
                <Settings size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>Quotas</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Define seat matrix and intake for programs.</p>
              </div>
            </>
          )}
          
          {user?.role === 'ADMISSION_OFFICER' && (
            <>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'left' }}>
                <Users size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>Applicants</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Manage student applications and document verification.</p>
              </div>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'left' }}>
                <UserPlus size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>Admissions</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Allocate seats and confirm official admissions.</p>
              </div>
            </>
          )}

          {user?.role === 'MANAGEMENT' && (
            <div className="card" style={{ padding: '1.5rem', textAlign: 'left' }}>
              <LayoutDashboard size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Executive Dashboard</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>View real-time statistics and admission reports.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
