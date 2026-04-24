import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Save, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, editUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: user.password || ''
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send the updated data, preserving the uneditable email
      await editUser(user.id, {
        ...user,
        name: formData.name.trim(),
        password: formData.password
      });
      toast.success("Profile updated successfully!", { id: 'profile-success' });
      navigate('/');
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <button className="btn glass-panel btn-hover-anim" style={{ padding: '8px 16px', marginBottom: 'var(--space-xl)' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="glass-panel" style={{ padding: 'var(--space-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: 'var(--primary)', color: 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto var(--space-md)' 
          }}>
            <User size={40} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', margin: 0 }}>My Profile</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your personal details</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          
          {/* Email - Read Only */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Email Address (Cannot be changed)</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                name="email"
                className="glass-input" 
                style={{ paddingLeft: '44px', width: '100%', backgroundColor: 'rgba(0,0,0,0.03)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
                value={formData.email} 
                readOnly
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                name="name"
                className="glass-input" 
                style={{ paddingLeft: '44px', width: '100%' }}
                value={formData.name} 
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                className="glass-input" 
                style={{ paddingLeft: '44px', paddingRight: '44px', width: '100%' }}
                value={formData.password} 
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                className="btn-icon" 
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer' }} 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} color="var(--text-muted)" /> : <Eye size={18} color="var(--text-muted)" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-hover-anim" 
            style={{ width: '100%', padding: '12px', marginTop: 'var(--space-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            disabled={isSubmitting}
          >
            <Save size={18} />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
