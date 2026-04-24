import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, users, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Forgot password states
  const [isForgotView, setIsForgotView] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = enter email, 2 = enter code + new pass
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
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

  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      toast.success("Reset code sent to your email!");
      setForgotStep(2);
    } catch (err) {
      toast.error(err.message || "Failed to send reset code");
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email, resetCode, newPassword);
      toast.success("Password updated successfully!");
      setIsForgotView(false);
      setForgotStep(1);
      setPassword('');
    } catch (err) {
      toast.error(err.message || "Failed to reset password");
    }
  };

  if (isForgotView) {
    return (
      <div className="auth-layout">
        <div className="auth-card glass-panel hover-card glow-effect">
          <h2>Reset Password</h2>
          <p style={{ textAlign: 'center', marginTop: '-16px' }}>
            {forgotStep === 1 ? "Enter your email to receive a code" : "Enter the code and your new password"}
          </p>
          
          {forgotStep === 1 ? (
            <form onSubmit={handleForgotPasswordRequest} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="input-group">
                <Mail className="input-icon" size={20} />
                <input type="email" placeholder="Email" className="glass-input" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary btn-hover-anim" style={{ marginTop: 'var(--space-sm)', width: '100%' }}>Send Code</button>
            </form>
          ) : (
            <form onSubmit={handlePasswordResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <input type="text" placeholder="6-digit Code" className="glass-input" style={{ paddingLeft: '16px' }} value={resetCode} onChange={e => setResetCode(e.target.value)} required />
              <div className="input-group">
                <Lock className="input-icon" size={20} />
                <input type={showPassword ? "text" : "password"} placeholder="New Password" className="glass-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                <button type="button" className="btn-icon" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button type="submit" className="btn btn-primary btn-hover-anim" style={{ marginTop: 'var(--space-sm)', width: '100%' }}>Reset Password</button>
            </form>
          )}
          
          <div style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: 'var(--space-md)' }}>
            <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setIsForgotView(false)}>Back to Login</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <div className="auth-card glass-panel hover-card glow-effect">
        <h2>Welcome Back</h2>
        <p style={{ textAlign: 'center', marginTop: '-16px' }}>Sign in to continue to Aura</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input type="email" placeholder="admin@aura.com for Admin Auth" className="glass-input" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input type={showPassword ? "text" : "password"} placeholder="Password" className="glass-input" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="button" className="btn-icon" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div style={{ textAlign: 'right', marginTop: '-8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setIsForgotView(true)}>Forgot password ?</span>
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
