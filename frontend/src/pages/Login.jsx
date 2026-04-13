import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, users } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success("Successfully logged in");
      const loggedInUser = users.find(u => u.email === email);
      if (loggedInUser?.role === 'SUPER_ADMIN' || loggedInUser?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card glass-panel hover-card glow-effect">
        <h2>Welcome Back</h2>
        <p style={{ textAlign: 'center', marginTop: '-16px' }}>Sign in to continue to Aura</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              placeholder="admin@aura.com for Admin Auth" 
              className="glass-input" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              className="glass-input" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-hover-anim" style={{ marginTop: 'var(--space-sm)', width: '100%' }}>
            <LogIn size={20} /> Login
          </button>
        </form>
        
        <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
