import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as authService from '../services/authService';
import { User, Lock, ArrowRight, ShieldCheck, Mail, GraduationCap } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('mail2deepeka@gmail.com');
  const [password, setPassword] = useState('mail@123');
  const [activeTab, setActiveTab] = useState('Admin'); // Role display name
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    { name: 'Admin', role: 'ADMIN', icon: <ShieldCheck size={18} /> },
    { name: 'Officer', role: 'ADMISSION_OFFICER', icon: <Mail size={18} /> },
    { name: 'Management', role: 'MANAGEMENT', icon: <GraduationCap size={18} /> }
  ];

  const handleTabChange = (option: typeof roleOptions[0]) => {
    setActiveTab(option.name);
    // Auto-fill credentials for demo purposes
    if (option.name === 'Admin') {
      setUsername('mail2deepeka@gmail.com');
      setPassword('mail@123');
    } else if (option.name === 'Officer') {
      setUsername('officer');
      setPassword('officer123');
    } else {
      setUsername('management@example.com');
      setPassword('mgmt123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await authService.login(username, password);
      login(data.user as any, data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="glass-card">
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="login-title">Admission CRM</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Secure Portal Access
          </p>
        </div>
        
        <div className="role-tab-group">
          {roleOptions.map((opt) => (
            <button
              key={opt.name}
              type="button"
              className={`role-tab-btn ${activeTab === opt.name ? 'active' : ''}`}
              onClick={() => handleTabChange(opt)}
            >
              {opt.name}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ 
            color: '#f87171', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            padding: '1rem', 
            borderRadius: '12px', 
            marginBottom: '1.5rem', 
            fontSize: '0.875rem',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '0.625rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', paddingLeft: '0.25rem' }}>
              Username
            </label>
            <div className="input-container">
              <input 
                className="premium-input"
                type="text"
                placeholder="Enter your email"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
              <User className="input-icon" size={20} />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.625rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', paddingLeft: '0.25rem' }}>
              Password
            </label>
            <div className="input-container">
              <input 
                className="premium-input"
                type="password" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <Lock className="input-icon" size={20} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <button type="button" style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
              Forgot password?
            </button>
          </div>

          <button 
            type="submit" 
            className="btn-login" 
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : (
              <>
                Sign In as {activeTab}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Don't have an account? <span style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Request Access</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
