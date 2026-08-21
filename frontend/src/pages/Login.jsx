import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, User, KeyRound, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';

export default function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // If already logged in, redirect directly to admin board
  if (localStorage.getItem('adminToken')) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          localStorage.setItem('adminToken', data.token);
          setToken(data.token);
          navigate('/admin');
        }
      })
      .catch(err => {
        setLoading(false);
        setErrorMsg('Network error. Failed to log in.');
        console.error('Login Error:', err);
      });
  };

  return (
    <div className="login-container flex align-center justify-center" style={{ minHeight: '80vh', padding: '120px 24px 80px 24px' }}>
      <SEO
        title="Employee Login Portal"
        description="4C Solutions Employee & Admin Login Workspace."
        noIndex={true}
      />
      <div className="card-item" style={{ maxWidth: '420px', width: '100%', padding: '40px', borderRadius: 'var(--radius-lg)' }}>
        
        {/* Branding header */}
        <div className="text-center" style={{ marginBottom: '32px' }}>
          <div style={logoWrapperStyle}>
            <KeyRound size={28} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ fontSize: '24px', color: 'var(--text-main)', marginBottom: '8px' }}>Security Access Portal</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>4C Solutions Admin console authentication</p>
        </div>

        {errorMsg && (
          <div className="flex align-center gap-2 anim-fade-in" style={{ backgroundColor: 'rgba(231,29,54,0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius-sm)', padding: '12px', marginBottom: '20px', color: 'var(--error)', textAlign: 'left' }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '13px', fontWeight: 500 }}>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group relative" style={{ marginBottom: '20px' }}>
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={iconInputStyle} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-control"
                placeholder="Enter username"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <div className="form-group relative" style={{ marginBottom: '28px' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={iconInputStyle} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
                placeholder="Enter password"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary flex align-center justify-center" style={{ width: '100%', height: '48px', fontSize: '15px' }}>
            {loading ? 'Authenticating Security...' : 'Access Workspace'}
          </button>
        </form>

      </div>
    </div>
  );
}

const logoWrapperStyle = {
  backgroundColor: 'var(--primary-glow)',
  padding: '16px',
  borderRadius: '50%',
  width: 'fit-content',
  margin: '0 auto 16px auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const iconInputStyle = {
  position: 'absolute',
  top: '50%',
  left: '16px',
  transform: 'translateY(-50%)',
  color: 'var(--text-muted)',
  pointerEvents: 'none'
};
