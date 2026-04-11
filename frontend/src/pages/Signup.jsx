import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, UserPlus, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    register({ name: name || email.split('@')[0], email, role: 'USER' });
    toast.success("Account created successfully!");
    navigate('/');
  };

  return (
    <div className="auth-layout">
      <div className="auth-card glass-panel hover-card glow-effect">
        <h2>Create Account</h2>
        <p style={{ textAlign: 'center', marginTop: '-16px' }}>Join Aura today!</p>
        
        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input 
              type="text" 
              placeholder="Full Name" 
              className="glass-input" 
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
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
              placeholder="Create Password" 
              className="glass-input" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-hover-anim" style={{ marginTop: 'var(--space-sm)', width: '100%' }}>
            <UserPlus size={20} /> Sign Up
          </button>
        </form>
        
        <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
