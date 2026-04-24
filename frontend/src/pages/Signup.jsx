import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, UserPlus, User, Key, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  
  const { register, verifyEmail } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await register({ name: name || email.split('@')[0], email, password, role: 'USER' });
      toast.success("Verification code sent to your email!");
      setIsVerifying(true);
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const success = await verifyEmail(email, verificationCode);
      if (success) {
        toast.success("Account verified successfully!");
        navigate('/');
      } else {
        toast.error("Invalid verification code.");
      }
    } catch (error) {
      toast.error("Verification failed.");
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card glass-panel hover-card glow-effect">
        {!isVerifying ? (
          <>
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
                  type={showPassword ? "text" : "password"} 
                  placeholder="Create Password" 
                  className="glass-input" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="btn-icon" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <button type="submit" className="btn btn-primary btn-hover-anim" style={{ marginTop: 'var(--space-sm)', width: '100%' }}>
                <UserPlus size={20} /> Sign Up
              </button>
            </form>
            
            <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Log in</Link>
            </div>
          </>
        ) : (
          <>
            <h2>Verify Email</h2>
            <p style={{ textAlign: 'center', marginTop: '-16px' }}>Enter the 6-digit code sent to {email}</p>
            
            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="input-group">
                <Key className="input-icon" size={20} />
                <input 
                  type="text" 
                  placeholder="6-digit code" 
                  className="glass-input" 
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                  required
                  maxLength={6}
                />
              </div>
              
              <button type="submit" className="btn btn-primary btn-hover-anim" style={{ marginTop: 'var(--space-sm)', width: '100%' }}>
                Verify Account
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
